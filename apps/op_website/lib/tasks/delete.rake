namespace :delete do

  # Persist members, question, speeches
  task :msqs => :environment do
    Member.delete_all
    Structure.delete_all
    Question.delete_all
    Speech.delete_all
    p "Members, structures, questions and speeches deleted successfully."
  end
end

