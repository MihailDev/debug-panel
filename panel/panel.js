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
    jQuery("#search_input").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        jQuery("tbody tr").filter(function() {
            jQuery(this).toggle(jQuery(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

    tmpLogs.forEach(function(log) {
        addLog(log);
    });
});