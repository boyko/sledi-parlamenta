module ApplicationHelper

  def paginate_always items
    if items.count >= Member.per_page
      will_paginate(items, :renderer => PaginationListLinkRenderer, :class => "pagination pagination-sm pull-right")
    else
      html = '<ul class="pagination pagination-sm pull-right"><li class="previous_page disabled"><span class="translation_missing" title="translation missing: bg.will_paginate.previous_label">Previous Label</span></li><li class="active"><a rel="start" href="">1</a></li><li class="next_page disabled"><span class="translation_missing" title="translation missing: bg.will_paginate.next_label">Next Label</span></li></ul>'
      html.html_safe
    end

  end

end
