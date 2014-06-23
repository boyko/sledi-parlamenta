require File.expand_path('../../../website/config/environment',  __FILE__)
require 'json'
require 'logger'

logger = Logger.new('../log/bills/persister.log')

$stdin.each_line do |bill_str|
  bill = JSON.parse bill_str

  b = Bill.find_or_create_by(signature: bill['signature'].delete(' ')) do |bill_inner|
    bill_inner.session = bill['session']
    bill_inner.name = bill['name']
    bill_inner.gov_id = bill['gov_id'].to_i
  end

  bill['committees'].each do |committee|
    committee_name = committee['name']
    c = Structure.find_or_create_by(name: committee_name)
    Review.create(bill: b, structure: c)
  end

  bill['importers'].each do |member|

    if member['name'] == "Министерски съвет"
      m = Member.find_by(first_name: "Министерски съвет")
    else
      names = member['name'].mb_chars.titleize.to_s
      m = Member.find_by_three_names(names)
    end

    b.members << m
  end

  Status.create(bill: b, value: "внесен", date: bill['date'])
  bill['history'].each do |status|
    date = status['date']
    value = status['status']

    Status.create(bill: b, value: value, date: date)
  end

  puts "Bill with gov_id: #{b.gov_id} and signature: #{b.signature} persisted."
  logger.info "Bill with gov_id: #{b.gov_id} and signature: #{b.signature} persisted."

end
