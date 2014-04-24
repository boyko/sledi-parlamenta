namespace :delete do

  # Persist members, question, speeches
  task :msqs => :environment do
    Member.delete_all
    Structure.delete_all
    Question.delete_all
    Speech.delete_all
    p "Members, structures, questions and speeches deleted successfully."
  end

  task :svv => :environment do
    Session.delete_all
    Voting.delete_all
    Vote.delete_all
    p "Sessions, votings, and votes deleted successfully."
  end
end

