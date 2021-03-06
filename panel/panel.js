var tmpLogs = [];
var showFirstError = true;
function clear(){
    jQuery('#log_stack').html('');
    jQuery('#container').html('');
    jQuery('#search_input').html('');
    showFirstError = true;
}

function loadLog(el){
    jQuery('#search_input').html('');
    jQuery('#container').html('Loading ...');
    jQuery('#active_log').html(jQuery(el).html());

    jQuery('#log_stack button').removeClass('active');
    jQuery(el).addClass('active');

    jQuery('#active_log').removeClass('btn-danger').removeClass('btn-warning');

    if(jQuery(el).attr('data-status-code') >= 400){
        jQuery('#active_log').addClass('btn-danger');
    } else if(jQuery(el).attr('data-status-code') > 200) {
        jQuery('#active_log').addClass('btn-warning');
    }

    var logUrl = jQuery(el).attr('data-log');

    if(logUrl == 'no_logs'){
        jQuery('#container').html('<div class="alert alert-warning mt-2" role="alert">There were no logs on this request</div>');
    } else {
        jQuery.ajax({
            url: logUrl
        }).done(function (data) {
            jQuery('#container').html(data);
        }).fail(function () {
            jQuery('#container').html('<div class="alert alert-danger mt-2" role="alert">Can not load log ' + url + '</div>');
        });
    }
}

function addLog(log){
    var type = 'xhr';
    if(log.type == 'main_frame'){
        type = 'main';
    } else if(log.type == 'sub_frame'){
        type = 'frame';
    }

    log.log.forEach(function(logUrl, index){
        var prefInfo = log.statusCode + ' ' + log.method + ' - ' + type;
        if(index > 0){
            prefInfo = '&#9562;' + '&#9552;'.repeat(Math.round(prefInfo.length/2)+2);
        }

        var el = jQuery('<button class="dropdown-item" type="button">')
            .attr({'data-log': logUrl, 'data-status-code': log.statusCode, 'data-type': type})
            .on('click', function () {
                loadLog(this);
            })
            .html(prefInfo + ' ' + index + ' - ' + log.url);

        jQuery('#log_stack').append(el);

        if(log.statusCode >= 400){
            el.addClass('text-danger');
        } else if(log.statusCode > 200) {
            el.addClass('text-warning');
        }

        if((log.statusCode >= 400 || log.type == 'main_frame') && index == 0 && showFirstError){
            if(log.statusCode >= 400)
                showFirstError = false;
            loadLog(el);
        }
    });
}

function makeAction(msg) {
    if(msg.type == "main_frame"){
        if (jQuery.isReady){
            clear();
        } else {
            tmpLogs = [];
        }
    }

    if (jQuery.isReady){
        addLog(msg);
    } else {
        tmpLogs.push(msg);
    }
}

jQuery(document).ready(function(){
    function copyToClipboard(text) {
        if (window.clipboardData && window.clipboardData.setData) {
            // IE specific code path to prevent textarea being shown while dialog is visible.
            return clipboardData.setData("Text", text);

        } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
            var textarea = document.createElement("textarea");
            textarea.textContent = text;
            textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
            document.body.appendChild(textarea);
            textarea.select();
            try {
                return document.execCommand("copy");  // Security exception may be thrown by some browsers.
            } catch (ex) {
                console.warn("Copy to clipboard failed.", ex);
                return false;
            } finally {
                document.body.removeChild(textarea);
            }
        }
    }
    jQuery(document).on("click", ".copyToClipboard", function(e){
        e.preventDefault();

        var element_id = jQuery(e.currentTarget).attr('data-copy-from-id');
        var text = "";
        if(jQuery(element_id).is('input') || jQuery(element_id).is('textarea')){
            text = jQuery(element_id).val();
        } else {
            text = jQuery(element_id).text();
        }

        copyToClipboard(text);
    });

    jQuery(document).on("keyup", "input.rowFilter", function(e){

        var value = jQuery(e.currentTarget).val().toLowerCase();

        var index = jQuery(e.currentTarget).closest('tr').children().index(jQuery(e.currentTarget).closest('th'));

        jQuery(e.currentTarget).closest('table').find('tbody tr').filter(function() {
            jQuery(this).toggle(jQuery(this).children().eq(index).text().toLowerCase().indexOf(value) > -1)
        });
    });

    jQuery(document).on('click', 'a', function(e){
        jQuery(e.currentTarget).attr('target', '_blank');
    });

    jQuery(document).on('submit', 'form', function(e){
        jQuery(e.currentTarget).attr('target', '_blank');
    });

    jQuery("#search_input").on('keydown', function (e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            jQuery('#container').search(jQuery("#search_input").val());
        }
    });

    jQuery("#search_input").on('keyup', function (e) {
        if (e.keyCode != 13) {
            jQuery('#container').search(jQuery("#search_input").val());
        }
    });

    jQuery("#findPrevButton").click(function () {
        jQuery('#container').search(jQuery("#search_input").val(), 'prev');
    });

    jQuery("#findNextButton").click(function () {
        jQuery('#container').search(jQuery("#search_input").val());
    });

    tmpLogs.forEach(function(log) {
        addLog(log);
    });
});