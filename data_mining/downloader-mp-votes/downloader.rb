require "json"

path = ARGV[0]

$stdin.each_line do |line|
  ob = JSON.parse line
  date = ob["date"]
  session_path = path + "/" + date
  `mkdir -p #{session_path}`
  names = []
  ob["xls"].each do |url|
    names << session_path + "/" + url.split('/')[-1]
    `cd #{session_path}; curl -sO #{url}`
    sleep rand(1..5)
  end
  p names
end

