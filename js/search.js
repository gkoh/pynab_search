var last_search;

function result_table_init () {
    $('#results_table').html('');
    $('#results_table').children('table').remove();
    $('#results_table').append('<table class="table table-striped table-bordered text-center">');
    var results_table = $('#results_table').children();

    var header = $('<thead>').appendTo(results_table);
    var header_row = $('<tr>').appendTo(header);
    header_row.append($('<th>').text('Age'),
            $('<th>').text('Title'),
            $('<th>').text('Category'),
            $('<th>').text('Size'),
            $('<th>').text('Download'));
}

function result_table_append (list, offset) {
    var results_table = $('#results_table').children();

    if (!jQuery.isArray(list))
        list = [list];

    $.each(list, function (index, element) {
        var links = '<a href="' + element.link + '"><span class="glyphicon glyphicon-download"></span></a>';
        links += sab_link_get_html(index + offset);

        $('<tr>').append(
                $('<td>').text(jQuery.timeago(Date.parse(element.posted))),
                $('<td>').text(element.title),
                $('<td>').text(element.category),
                $('<td>').text(element.size ? filesize(element.size) : 'Unknown'),
                $('<td>').html(links)
                ).appendTo(results_table);

        sab_link_init(index + offset, element.link, element.title);
    });
}

function result_table_populate(search_type, search_string, search_cat, search_offset) {
    // Stop another infinite scroll load happening at the same time.
    last_search = null;

    $('#results_spinner').html('<div class="text-center"><span class="glyphicon glyphicon-refresh glyphicon-spin"></span></div>');
    // If it's a new table populate the table headers.
    if (search_offset == 0) {
        $('#results_table').html('');
    }

    var params = {
        t      : search_type,
        o      : 'json',
        limit  : 20,
        offset : search_offset,
        apikey : $.cookie('apikey'),
        q      : search_string,
    };

    if (search_cat > 0) {
        params['cat'] = search_cat;
    }

    if (!params.apikey) {
        pynab_alert("No API Key Specified");
        return;
    }

    var url = pynab_url() + $.param(params);

    $.getJSON(url, function (data) {
        $('#results_spinner').html('');

        // Check for an error from pynab.
        if (data.error) {
            if (search_offset == 0) {
                $('#results_table').html('');
            }
            pynab_alert("<strong>Error Loading Results</strong>: " + data.error.description);
            return;
        }

        // If it's a new table populate the table headers.
        if (search_offset == 0) {
            result_table_init();
        }

        // If we have data, add it to the table and set last_search so infinite
        // scroll works again.
        if (data.rss.channel.item) {
            result_table_append(data.rss.channel.item, search_offset);
            last_search = params;
         }
    }).fail(function (data, status, msg) {
        $('#results_spinner').html('');

        if (search_offset == 0) {
            $('#results_table').html('');
        }
        pynab_alert("<strong>Error Loading Results</strong>: " + msg);
    });
}

function do_search (search_type, search_string, search_cat) {
    result_table_populate(search_type, search_string, search_cat, 0);
}

function do_scroll () {
    if (last_search) {
        last_search['offset'] += last_search['limit'];
        result_table_populate(last_search['t'], last_search['q'], last_search['cat'], last_search['offset']);
    }
}

function search_enable() {
  $('#search_string').prop('disabled', false);
  $('#search_all_default').prop('disabled', false);
  $('#search_cat').prop('disabled', false);
}

function search_disable() {
  $('#search_string').prop('disabled', true);
  $('#search_all_default').prop('disabled', true);
  $('#search_cat').prop('disabled', true);
}

$(document).ready(function() {

    /* Handle 'enter' in the search bar. */
    $('#search_string').keypress(function(e) {
        if (e.which == 13) {
            do_search('search', $('#search_string').val(), $('#search_cat').val());
        }
    });

    /* Search button clicked. */
    $('#search_all_default').on('click', function(e) {
        do_search('search', $('#search_string').val(), $('#search_cat').val());
    });

    $('#search_string').focus();

    // Infinite script for when the document is smaller than the window.
    $(document).keydown(function(e) {
        if ($(document).height() <= $(window).height()) {
            if (e.which == 34 || // PgDown
                e.which == 40 || // Down
                e.which == 35) { // End
                do_scroll();
            }
        }
    });

    // Infinite script for when the document is smaller than the window.
    $(window).bind('mousewheel DOMMouseScroll', function(event){
        if ($(document).height() <= $(window).height()) {
            do_scroll();
        }
    });

    // Infinite scroll.when the document is bigger than the window.
    $(window).scroll(function(){
        var scrolltrigger = 0.95;
        if (($(window).scrollTop() / ($(document).height() - $(window).height())) > scrolltrigger) {
            do_scroll();
        }
    });
});

