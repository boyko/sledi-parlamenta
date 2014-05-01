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

    var remapped = [];
    for (var i = 0, l = data.data.length; i < l; i ++) {
      var v = data.data[i];
      v.color = v.name === "yes" ? "green" :
                v.name === "no"  ? "red"   :
                v.name === "abstain" ? "gray" :
                v.name === "absent"  ? "blue" : "yellow"

      remapped.push(v)
    }

    $('#hc-votes').highcharts({
      chart: {
        type: 'column'
      },
      xAxis: {
        categories: data.categories
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
        }]
      },
      plotOptions: {
        column: {
          stacking: 'normal'
        }
      },
      series: remapped
    });
  });

});

