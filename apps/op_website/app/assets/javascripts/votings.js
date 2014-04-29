$(document).on('ready page:load', function() {

  $("svg rect").tooltip({
    'container': 'body',
  });

  function version_id() {
    var url = typeof document.URL === "undefined" ? window.location.href : document.URL;
    // matches the last number in the string.
    return url.match(/\d+(?!.*\d+)/)[0];
  }

  $.ajax({
    url: "/votings/" + version_id() + "/by_party",
    context: document.body
  }).done(function(data) {
    $('#hc-votes-by-parties').highcharts({
      chart: {
        type: 'column'
      },
      plotOptions: {
        column: {
          stacking: 'normal'
        }
      },
      series: data
    });
  });

});

