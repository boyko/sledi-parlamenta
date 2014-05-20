require "json"

path = ARGV[0]

STDIN.read.split("\n").each do |line|
  ob = JSON.parse line
  date = ob["date"]
  session_path = path + "/" + date
  `mkdir -p #{session_path}`
  names = []
  ob["xls"].each do |url|
    names << session_path + "/" + url.split('/')[-1]
    `cd #{session_path}; curl -sO #{url}`
    sleep (rand()*4).round+1
  end
  p names
end

