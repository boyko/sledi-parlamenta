path = ARGV[0]

(11..2312).each do |idx|
  url = "www.parliament.bg/images/Assembly/" + idx.to_s + ".png"
  puts `cd #{path}; curl -O #{url}`
  sleep rand(1..5)
end

