$(document).ready(function () {

  $('#votings-list a').each(function(idx, el) {
    voting_ids.push(el.href.match(/\d+$/)[0])
  })

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

