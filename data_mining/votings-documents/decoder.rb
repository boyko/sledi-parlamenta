source = ARGV[0]
destination = ARGV[1]

arr = Dir[source + "/**/*"].keep_if { |path| File.file?(path) }
count = arr.count

corrupted = ["GV130302new.doc", "GV290704S.doc","IV130302new.doc", "GV011102.DOC", "IV290704S.doc", "converted.txt"]

skip_convertion = ["GV011102.DOC"]

def correct date
  # swap first and third numbers
  date[0], date[2] = "20" + date[2], date[0]
  date.join("-")
end

def get_date path
  date = []
  File.open(path, "r") do |file|
    file.read.split("\r\n").each do |line|
      date = line.scan(/(\d+)\/(\d+)\/(\d+)/).flatten.compact
      break if date.count != 0
    end
  end
  correct date
end

arr.each_with_index do |file_path, index|
  filename = File.split(file_path)[1]

  p filename
  next if corrupted.include? filename

  if skip_convertion.include? filename
    final_destination = destination + get_date(file_path)
    `mkdir -p #{final_destination}`
    `mv tmp.txt #{final_destination}/#{filename}`
    p "Succesfully decoded file with name #{filename} (#{(((index+1)*100).to_f/count).round} %)"
    next
  end

  # checks whether it is group voting or not
  if filename["IV"].nil?

    `iconv -f 866 #{file_path} |
       tr "░" "р" |
       tr "▒" "с" |
       tr "▓" "т" |
       tr "│" "у" |
       tr "┤" "ф" |
       tr "╡" "х" |
       tr "╢" "ц" |
       tr "╖" "ч" |
       tr "╕" "ш" |
       tr "╣" "щ" |
       tr "║" "ъ" |
       tr "╝" "ь" |
       tr "╛" "ю" |
       tr "┐" "я" > tmp.txt`

  else
    `iconv -f 866 #{file_path} | tr '?' "Ш" > tmp.txt`
  end

  final_destination = destination + get_date(Dir.pwd + "/tmp.txt")
  `mkdir -p #{final_destination}`
  `mv tmp.txt #{final_destination}/#{filename}`

  p "Succesfully decoded file with name #{filename} (#{(((index+1)*100).to_f/count).round} %)"

end

