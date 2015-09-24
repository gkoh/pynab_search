function pynab_test() {
    if (!$.cookie('apikey')) {
        $('#pynabstatus').replaceWith('<span id="pynabstatus" class="glyphicon glyphicon-remove text-danger"></span>');
        return;
    }

    $('#pynabstatus').replaceWith('<span id="pynabstatusspinner" class="glyphicon glyphicon-refresh glyphicon-spin"></span>');

    $.getJSON(pynab_url(), {
        'o'      : 'json',
        't'      : 'search',
        'apikey' : $.cookie('apikey'),
        'limit'  : 0,
    }).done(function (r) {
        if (r.rss) {
            $('#pynabstatusspinner').replaceWith('<span id="pynabstatus" class="glyphicon glyphicon-ok text-success"></span>');
            search_enable();
        }
        else {
            $('#pynabstatusspinner').replaceWith('<span id="pynabstatus" class="glyphicon glyphicon-remove text-danger"></span>');
            search_disable();
        }
    }).fail(function (data, status, msg) {
        $('#pynabstatusspinner').replaceWith('<span id="pynabstatus" class="glyphicon glyphicon-remove text-danger"></span>');
        search_disable();
    });
}

$(document).ready(function() {
    pynab_test()
});
