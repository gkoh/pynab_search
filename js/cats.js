
function populate_search_cats () {
    var params = {
        'o' : 'json',
        't' : 'caps'
    };

    var cats_url = pynab_url() + $.param(params);

    $.getJSON(cats_url, function (data) {
        $('#search_cat').prop('disabled', false);
        $('#search_cat').html('<option value="-1")>All</option>');

        $.each(data.caps.categories.category, function (index, cat) {
            $('#search_cat').append('<option value="' + cat.id + '">' + cat.name + '</option>');

            $.each(cat.subcat, function (index, subcat) {
                $('#search_cat').append('<option value="' + subcat.id + '">' + cat.name + ' > ' + subcat.name + '</option>');
            });
        });
    }).fail(function (data, status, msg) {
        pynab_alert("<strong>Error Loading Categories</strong>: " + msg);
    });
}

$(document).ready(function() {
    populate_search_cats();
});

