module VotingHelper

  def choose_icon value
    icons = {
      0 => "fa-thumbs-o-up",
      1 => "fa-thumbs-o-down",
      2 => "fa-meh-o",
      3 => "fa-suitcase",
    }

    "<i class='fa #{icons[value]}'></i>".html_safe
  end

  def choose_class value
    classes = {
      0 => "success",
      1 => "danger",
      2 => "warning",
      3 => "",
    }
    classes[value].html_safe
  end

end
