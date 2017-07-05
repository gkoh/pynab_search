var sab_ok = false;

$(document).ready(function() {
    sab_test();
});


function sab_link_get_html(index) {
    if (sab_ok) {
        return '&nbsp;&nbsp;<a id="sab' + index + '" href="#"><img src="/pynab/search/icon/sab2_16.png"></img></a>';
    }
    return '';
}

function sab_link_init(index, url, name) {
    if (sab_ok) {
        $('#sab' + index).click(function(evt){
            sab_add(index, url, name);
            evt.preventDefault();
        })
    }
}

function sab_add (index, url, name) {
    if (!sab_ok) {
        return;
    }

    var orig = $('#sab' + index).clone();

    $('#sab' + index).replaceWith('<span id="sabspinner' + index + '" class="glyphicon glyphicon-refresh glyphicon-spin"></span>');

    $.ajax({
        'url'    : $.cookie('saburl'),
        'method' : 'GET',
        'data'   : {
            'mode'    : 'addurl',
            'apikey'  : $.cookie('sabapikey'),
            'name'    : url,
            'nzbname' : name,
            'output'  : 'json'
        },
        'username' : $.cookie('sabuser'),
        'password' : $.cookie('sabpass'),
        'dataType' : 'jsonp', // Use jsonp to get around cors issues.
        'timeout'  : 5000,  // Give the jsonp 5 seconds to return (only way to do jsonp error handling)
    }).done(function (r) {
        if (r.status) {
            // If the queue add worked, replace the link with a green sab logo.
            $('#sabspinner' + index).replaceWith('<img src="/pynab/search/icon/nzb-16-green.png"></img>');
        }
        else {
            $('#sabspinner' + index).replaceWith(orig);
            sab_link_init(index, url, name);
            pynab_alert('<strong>Sabnzbd Error : </strong>'+r.error+"<br>"+
                        '<strong>Error queuing : </strong>'+name);
        }
    }).fail(function (data, status, msg) {
        $('#sabspinner' + index).replaceWith(orig);
        sab_link_init(index, url, name);
        pynab_alert('<strong>Unknown Error : </strong> Check sabnzbd configuration<br>'+
                    '<strong>Error queuing : </strong>'+name);
    });
}

function sab_test() {
    if (!$.cookie('saburl') || !$.cookie('sabapikey')) {
        $('#sabstatus').replaceWith('<span id="sabstatus" class="glyphicon glyphicon-remove text-danger"></span>');
        return;
    }

    $('#sabstatus').replaceWith('<span id="sabstatusspinner" class="glyphicon glyphicon-refresh glyphicon-spin"></span>');

    $.ajax({
        'url'    : $.cookie('saburl'),
        'method' : 'GET',
        'data'   : {
            'mode'    : 'get_config',
            'section' : 'servers',
            'apikey'  : $.cookie('sabapikey'),
            'output'  : 'json'
        },
        'username' : $.cookie('sabuser'),
        'password' : $.cookie('sabpass'),
        'dataType' : 'jsonp', // Use jsonp to get around cors issues.
        'timeout'  : 5000,  // Give the jsonp 5 seconds to return (only way to do jsonp error handling)
    }).done(function (r) {
        if (r.config) {
            $('#sabstatusspinner').replaceWith('<span id="sabstatus" class="glyphicon glyphicon-ok text-success"></span>');
            sab_ok = true;
        }
        else {
            $('#sabstatusspinner').replaceWith('<span id="sabstatus" class="glyphicon glyphicon-remove text-danger"></span>');
            sab_ok = false;
        }
    }).fail(function (data, status, msg) {
        $('#sabstatusspinner').replaceWith('<span id="sabstatus" class="glyphicon glyphicon-remove text-danger"></span>');
        sab_ok = false;
    });
}
