$(document).ready(function () {

  $('#votings-list a').each(function(idx, el) {
    voting_ids.push(el.href.match(/\d+$/)[0])
  })

  function session_id() {
    var url = typeof document.URL === "undefined" ? window.location.href : document.URL;
    // matches the last number in the string.
    return url.match(/sessions\/(\d+)/)[1];
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
          stacking: 'normal',
          animation: false,
          shadow: false,
          enableMouseTracking: false
        }
      },
      series: remapped
    });
  });

  $('.show-voting').on('click', function(event) {
    var $el = $(this);
    var target = $('#content-' + $el.attr('data-voting'));
    $el.attr("disabled", "disabled");

    target.html("loading...");

    $.ajax({
      url: "/votings/" + $el.attr("id").match(/\d+/)[0] + "/by_name",
      context: document.body
    }).done(function(data) {
      target.html(data)
      .find("svg rect")
      .tooltip({ 'container': 'body', });
    });

  });

});



