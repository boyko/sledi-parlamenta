//= require highcharts
$(document).on('ready page:load', function () {

  function session_id() {
    var url = typeof document.URL === "undefined" ? window.location.href : document.URL;
    // matches the last number in the string.
    return url.match(/\d+(?!.*\d+)/)[0];
  }

  $.ajax({
    url: "/sessions/" + session_id() + "/votings",
    context: document.body
  }).done(function(data) {
    $('#hc-votes').highcharts({
      chart: {
        type: 'column'
      },
      yAxis: {
        plotLines: [{
          color: 'gray',
          dashStyle: 'line',
          value: '120',
          width: '2'
        },
        {
          color: 'red',
          dashStyle: 'line',
          value: '240',
          width: '2'
        }
        ]
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

