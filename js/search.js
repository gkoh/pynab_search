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

function result_table_append (list) {
    var results_table = $('#results_table').children();

    $.each(list, function (index, element) {
        var links = '<a href="' + element.link + '"><span class="glyphicon glyphicon-download"></span></a>';
        links += sab_link_get_html(index);

        $('<tr>').append(
                $('<td>').text(jQuery.timeago(Date.parse(element.pubDate))),
                $('<td>').text(element.title),
                $('<td>').text(element.category),
                $('<td>').text(filesize(element.size)),
                $('<td>').html(links)
                ).appendTo(results_table);

        sab_link_init(index, element.link, element.title);
    });
}

function result_table_populate(search_type, search_string, search_cat, search_offset) {
    var params = {
        t      : search_type,
        o      : 'json',
        limit  : 100,
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
        // Check for an error from pynab.
        if (data.error) {
            if (search_offset == 0) {
                $('#results_table').html('');
            }
            pynab_alert("<strong>Error Loading Results</strong>: " + data.error.description);
            return;
        }

        if (search_offset == 0) {
            result_table_init();
        }
        result_table_append(data.rss.channel.item);

    }).fail(function (data, status, msg) {
        if (search_offset == 0) {
            $('#results_table').html('');
        }
        pynab_alert("<strong>Error Loading Results</strong>: " + msg);
    });
}

function do_search (search_type, search_string, search_cat) {
    $('#results_table').html('<div class="text-center"><span class="glyphicon glyphicon-refresh glyphicon-spin"></span></div>');
    result_table_populate(search_type, search_string, search_cat, 0);
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
});

