module VotingHelper
  def create_rect height, width, cols, margin, index, names, value
    x = (index % cols) * (width + margin)
    y = (index / cols) * (width + margin)

    "<rect height='#{height}' width='#{width}' x='#{x}' y='#{y}' class='#{value}' data-toggle='tooltip' data-placement='top' title='#{names}'>"
  end

end
