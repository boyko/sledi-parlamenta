# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20140621074637) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "bills", force: true do |t|
    t.text     "name"
    t.text     "content"
    t.string   "session"
    t.string   "signature"
    t.string   "file_author"
    t.string   "file_editor"
    t.string   "file_company"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "bills_members", id: false, force: true do |t|
    t.integer "bill_id",   null: false
    t.integer "member_id", null: false
  end

  create_table "members", force: true do |t|
    t.string   "first_name"
    t.string   "sir_name"
    t.string   "last_name"
    t.string   "gov_site_ids"
    t.date     "birthday"
    t.string   "hometown"
    t.string   "profession"
    t.string   "languages"
    t.string   "marital_status"
    t.string   "email"
    t.string   "website"
    t.string   "gender"
    t.text     "bio"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "participations", force: true do |t|
    t.integer  "member_id"
    t.integer  "structure_id"
    t.string   "position"
    t.string   "constituency"
    t.date     "start_date"
    t.date     "end_date"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "participations", ["member_id"], name: "index_participations_on_member_id", using: :btree
  add_index "participations", ["structure_id"], name: "index_participations_on_structure_id", using: :btree

  create_table "questions", force: true do |t|
    t.string   "signature"
    t.string   "gov_site_id"
    t.string   "status"
    t.text     "topic"
    t.text     "content"
    t.text     "answer"
    t.date     "asked"
    t.date     "replied"
    t.integer  "questioner_id"
    t.integer  "respondent_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "questions", ["questioner_id"], name: "index_questions_on_questioner_id", using: :btree
  add_index "questions", ["respondent_id"], name: "index_questions_on_respondent_id", using: :btree

  create_table "reviews", force: true do |t|
    t.integer  "bill_id"
    t.integer  "structure_id"
    t.date     "date"
    t.text     "report_content"
    t.date     "report_date"
    t.boolean  "leading"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "reviews", ["bill_id"], name: "index_reviews_on_bill_id", using: :btree
  add_index "reviews", ["structure_id"], name: "index_reviews_on_structure_id", using: :btree

  create_table "sessions", force: true do |t|
    t.integer  "structure_id"
    t.string   "url"
    t.text     "stenograph"
    t.date     "date"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "sessions", ["structure_id"], name: "index_sessions_on_structure_id", using: :btree

  create_table "statuses", force: true do |t|
    t.integer  "bill_id"
    t.integer  "value"
    t.date     "date"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "statuses", ["bill_id"], name: "index_statuses_on_bill_id", using: :btree

  create_table "structures", force: true do |t|
    t.integer  "kind"
    t.text     "name"
    t.string   "abbreviation"
    t.text     "info"
    t.date     "start_date"
    t.date     "end_date"
    t.string   "website"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "votes", force: true do |t|
    t.integer  "member_id"
    t.integer  "voting_id"
    t.integer  "value"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "votes", ["member_id"], name: "index_votes_on_member_id", using: :btree
  add_index "votes", ["voting_id"], name: "index_votes_on_voting_id", using: :btree

  create_table "votings", force: true do |t|
    t.integer  "session_id"
    t.text     "topic"
    t.datetime "voted_at"
    t.string   "result"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "votings", ["session_id"], name: "index_votings_on_session_id", using: :btree

end
