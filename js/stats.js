
$(document).ready(function() {
    var progress_map = {
        "TV"        : "tv",
        "Movies"    : "movies",
        "NFOs"      : "nfos",
        "File Info" : "file_info" };

    var params = {
        t: 'stats',
        o: 'json' };

    var url = pynab_url() + $.param(params);

    $.getJSON(url, function (data) {
        $.each(data.stats.totals.total, function (index, element) {
            var id_success = 'progress_' + progress_map[element.label] + '_success';
            var id_failed = 'progress_' + progress_map[element.label] + '_failed';
            var id_total = 'total_' + progress_map[element.label];
            var pct_success = Math.round(100 * element.processed/element.total) + '%';
            var pct_failed = Math.round(100 * element.failed/element.total) + '%';

            $('#' + id_success).css('width', pct_success);
            $('#' + id_failed).css('width', pct_failed);
            document.getElementById(id_success).innerHTML = pct_success;
            document.getElementById(id_failed).innerHTML = pct_failed;
            document.getElementById(id_total).innerHTML = element.total;
        });
        $.each(data.stats.categories.category, function (index, element) {
            $('#stats_category_list').append(
                '<li class="list-group-item">' +
                     '<span class="badge">' + element.value + '</span>' +
                      element.label +
                '</li>');
        });
        $.each(data.stats.groups.group, function (index, element) {
            $('#stats_groups_list').append(
                '<li class="list-group-item">' +
                     '<span class="badge">' + element.value + '</span>' +
                      element.label +
                '</li>');
        });
    }).fail(function (data, status, msg) {
        pynab_alert("<strong>Error Loading Stats</strong>: " + msg);
    });
});
