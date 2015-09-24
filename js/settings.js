function save_setting (input) {
    $.cookie(input.attr('id'), input.val(), { expires: 180 });
    if (input.attr('data-setting-cb')) {
      var cb_func = new Function(input.attr('data-setting-cb')+'();');
      cb_func(input);
    }
}

$(document).ready(function() {
    // Get all the settings fields.
    $('#settings input').each(function (index) {
        // Populate the field from the cookie.
        var value = $.cookie($(this).attr('id'));
        if (value) {
            $(this).val(value);
        }

        // Set a handler so the cookie is updated when the field is.
        $(this).change(function () {
            save_setting($(this));
        })

        $(this).keydown(function(e) {
            // Enter Key to save.
            if (e.which == 13) {
                save_setting($(this));
            }
            // Escape Key to undo.
            if (e.which == 27) {
                $(this).val($.cookie($(this).attr('id')));
            }
        });
    });
});
