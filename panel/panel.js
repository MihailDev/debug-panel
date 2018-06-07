var tmpLogs = [];

function clear(){
    jQuery('#logs_info').html('');
    jQuery('#container').html('');
    jQuery('#search_input').html('');
}

function loadLog(url){
    jQuery('#search_input').html('');
    jQuery('#container').html('Loading ...');
    jQuery.ajax({
        url: url
    }).done(function(data ){
        jQuery('#container').html(data);
    }).fail(function() {
        jQuery('#container').html('Can not load log ' + url);
    });
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
        var el = jQuery('<option>').val(logUrl).html(prefInfo + ' ' + index + ' - ' + log.url);
        jQuery('#logs_info').append(el);
    });


    if(log.type == 'main_frame'){
        loadLog(log.log[0]);
    }
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
    jQuery("#search_input").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        jQuery("tbody tr").filter(function() {
            jQuery(this).toggle(jQuery(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

    jQuery("#logs_info").on("change", function() {
       loadLog(jQuery(this).val());
    });

    tmpLogs.forEach(function(log) {
        addLog(log);
    });
});