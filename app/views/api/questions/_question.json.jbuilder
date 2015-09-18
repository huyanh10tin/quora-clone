json.extract! question, :id, :title, :body, :author_id

json.answers do
  json.array! question.answers do |answer|
    json.partial! 'api/answers/answer', answer: answer
  end
end
