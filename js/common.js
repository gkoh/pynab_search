function pynab_url() {
  return '../api?';
}


function pynab_alert (message) {
    $('#alert-wrapper').append(
        '<div class="alert alert-danger" data-dismiss="alert">'+
            '<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'+
            message+
        '</div>');
}

$(document).ready(function() {
    /* navbar handling. */
    $('.navbar-nav a').on('click', function(e) {
        e.preventDefault();
        /* Disable active on all menu items. */
        $(this).parent().parent().find('.active').removeClass('active');
        $('.nav').find('.active').removeClass('active');
        /* Enable active on the current menu. */
        $(this).parent().addClass('active');
        /* Hide the previous content. */
        $('.content').hide();
        /* Show the current active content. */
        $($(this).attr('href')).show();

        if ($(this).attr('href') == '#search') {
            $('#search_string').focus();
        }
    });

});
