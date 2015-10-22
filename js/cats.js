
function populate_search_cats () {
    var params = {
        'o' : 'json',
        't' : 'caps'
    };

    var cats_url = pynab_url() + $.param(params);

    $.getJSON(cats_url, function (data) {
        $('#search_cat').prop('disabled', false);
        $('#search_cat').html('<option value="-1")>All</option>');

        // Check the query string for a category.
        var category = $.parseParams(window.location.search).c || -1;

        $.each(data.caps.categories.category, function (index, cat) {
            if (category == cat.id) {
              $('#search_cat').append('<option selected value="' + cat.id + '">' + cat.name + '</option>');
            }
            else {
              $('#search_cat').append('<option value="' + cat.id + '">' + cat.name + '</option>');
            }

            $.each(cat.subcat, function (index, subcat) {
                if (category == subcat.id) {
                    $('#search_cat').append('<option selected value="' + subcat.id + '">' + cat.name + ' > ' + subcat.name + '</option>');
                }
                else {
                    $('#search_cat').append('<option value="' + subcat.id + '">' + cat.name + ' > ' + subcat.name + '</option>');
                }
            });
        });
    }).fail(function (data, status, msg) {
        pynab_alert("<strong>Error Loading Categories</strong>: " + msg);
    });
}

$(document).ready(function() {
    populate_search_cats();
});

