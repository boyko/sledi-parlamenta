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

    var remapped = [];
    for (var i = 0, l = data.data.length; i < l; i ++) {
      var v = data.data[i];
      v.color = v.name === "yes" ? "green" :
                v.name === "no"  ? "red"   :
                v.name === "abstain" ? "gray" :
                v.name === "absent"  ? "blue" : "yellow"

      remapped.push(v)
    }

    $('#hc-votes-by-parties').highcharts({
      chart: {
        type: 'column'
      },
      xAxis: {
        categories: data.categories
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

