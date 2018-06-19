var searchOject = {
    elements: [],
    query: '',
    options: {
        paddingTop: 30,
        paddingBottom: 30
    },
    init: function (elements, query) {

        if(this.query == query.toUpperCase()){
            return;
        }

        this.query = query.toUpperCase();
        this.elements = elements;
        this.clear();

        if(this.elements.length && this.query && this.query.length){
            this.elements.each(function(){
                searchOject.find(this);
            });
        }
    },
    clear: function () {
        jQuery('span.search-match').each(function(){
            var parent = this.parentNode;
            parent.replaceChild(this.firstChild, this);
            parent.normalize();
        })
    },
    find: function (node) {
        if (node.nodeType == 3) {
            this.findInTextNode(node);
        } else if(node.nodeType == 1 && node.childNodes && !/(script|style|textarea)/i.test(node.tagName)){
            for (var i = 0; i < node.childNodes.length; ++i) {
                if(node.childNodes[i].nodeType == 3)
                    i += this.findInTextNode(node.childNodes[i]);
                else
                    this.find(node.childNodes[i]);
            }
        }
    },

    findInTextNode: function (node) {
        var pos = node.data.toUpperCase().indexOf(this.query);
        pos -= (node.data.substr(0, pos).toUpperCase().length - node.data.substr(0, pos).length);
        if (pos >= 0) {
            var span = document.createElement('span');
            span.className = 'search-match';
            var middle = node.splitText(pos);
            var middlend = middle.splitText(this.query.length);
            span.appendChild(middle.cloneNode(true));
            middle.parentNode.replaceChild(span, middle);
            return 1;
        }

        return 0;
    },
    scrollIntoViewIfNeeded: function(target) {

        var top = jQuery(target).offset().top;
        var veiwHeight = window.innerHeight || document.documentElement.clientHeight;
        var padding = 30;
        var veiwZone = {
            from: jQuery(window).scrollTop() + this.options.paddingTop,
            till: jQuery(window).scrollTop() + veiwHeight - this.options.paddingBottom - jQuery(target).height()
        };
        var change = 0;
        if(top < veiwZone.from){
            change =  0 - veiwZone.from - top;
        } else if(top > veiwZone.till){
            change = top - veiwZone.till;
        }

        if(change !== 0)
            jQuery('html,body').scrollTop(jQuery(window).scrollTop() + change);
    },
    show: function (element) {
        if(element.length == 0)
            return;
        jQuery('span.search-match-active').removeClass('search-match-active');
        jQuery(element).addClass('search-match-active');
        searchOject.scrollIntoViewIfNeeded(element);
    },
    showNext: function () {
        var foundActive = false;
        var show = false;
        jQuery('span.search-match:visible').each(function () {
            if(foundActive){
                show = true;
                searchOject.show(this);
                return false;
            } else if(jQuery(this).hasClass('search-match-active')){
                foundActive = true;
            }
        });

        if(!show)
            this.show(jQuery('span.search-match:visible:first'));
    },
    showPrev: function () {
        var show = false;
        var prev = false;
        jQuery('span.search-match:visible').each(function () {
            if(jQuery(this).hasClass('search-match-active') && prev !== false){
                show = true;
                searchOject.show(prev);
                return false;
            }

            prev = this;
        });

        if(!show)
            this.show(jQuery('span.search-match:visible:last'));
    }


};


jQuery.fn.search = function (query, action) {
    searchOject.init(this, query);

    if(action === 'prev'){
        searchOject.showPrev();
    } else {
        searchOject.showNext();
    }
};

jQuery.fn.searchSetup = function (options) {
    jQuery.extend(searchOject.options, options);
};
