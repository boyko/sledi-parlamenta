class VotingsController < ApplicationController
  def index
    @votings = Voting.all
  end

  def show
    @voting = Voting.find(params[:id])
  end

  def by_party
    data = Voting.find(params[:voting_id]).by_party
    render :json => prepare_data(data)
  end

  def by_name
    data = Voting.find(params[:voting_id]).by_name
    render :text => create_svg_diagram(data)
  end

  private

  def create_svg_diagram data

    data = data.keys.group_by { |r| r[0] }.map { |k, v|
      {
        party: k,
        members: v.map { |i|
          {
            id: i[1],
            name: i[2] + " " + i[3],
            vote: i[4]
          }
        }
      }
    }
    cols = 8
    width = 15
    height = 15
    margin = 1
    gr_margin = 20

    html = "<br><svg width='1000' height='220'>"
    data.each_with_index do |p, outer_idx|
      offset = outer_idx * (cols * (width + margin) + gr_margin)
      p[:members].each_with_index do |el, idx|
        x = (idx % cols) * (width + margin) + offset
        y = (idx / cols) * (width + margin)
        html += "<a xlink:href='/members/#{el[:id]}'><g><rect width='#{width}' height='#{height}' x='#{x}' y='#{y}' class='#{el[:vote]}' data-toggle='tooltip' data-placement='top' title='#{el[:name]}'></g></a>"
      end
      html += "<text x='#{offset+(outer_idx*10)}' y='210' font-family='Verdana' font-size='10'>#{p[:party]}</text>"
    end

    html += "</svg>"
    html.html_safe
  end

end

