module VotingHelper
  def create_rect height, width, cols, margin, index, names, value
    x = (index % cols) * (width + margin)
    y = (index / cols) * (width + margin)

    color = case value
      when "yes" then "green"
      when "no" then "red"
      when "abstain" then "gray"
      when "absent" then "white"
      else "Unknown type"
    end

    "<rect height='#{height}' width='#{width}' x='#{x}' y='#{y}' style='fill: #{color}' data-toggle='tooltip' data-placement='top' title='#{names}'>"
  end
end
