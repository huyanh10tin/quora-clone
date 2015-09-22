QuoraClone.Views.AnswerShowView = Backbone.CompositeView.extend({
  template: JST['answers/answerShowView'],
  tagName: 'li',
  className: 'answer-to-question',

  initialize: function () {
    this.listenTo(this.model, 'sync', this.render);
  },

  events: {
    'click .show-comments' : 'toggleComments',
    'click .submit-comment' : 'submit'
  },

  render: function () {
    this.$el.html(this.template({
      answer: this.model,
      author: this.model.author()
    }));

    this.addUpvoteWidget();

    this.addComments();

    return this;
  },

  addUpvoteWidget: function () {
    var upvoteWidget = new QuoraClone.Views.AnswerUpvoteWidget({
      model: this.model
    });

    this.addSubview(".answer-form-footer", upvoteWidget, true);
  },

  addComments: function () {

    this.newAnswerComment();

    this.model.answerComments().each(function (answerComment) {
      var _answerCommentShowView = new QuoraClone.Views.AnswerCommentShowView({
        model: answerComment
      });

      this.addSubview(".comments-to-answer", _answerCommentShowView);
    }.bind(this));

  },

  newAnswerComment: function () {
    this.answerCommentNewView = new QuoraClone.Views.AnswerCommentNewView({
      model: new QuoraClone.Models.AnswerComment(),
      answer: this.model
    });

    this.addSubview(".new-comment-to-answer", this.answerCommentNewView);
  },

  submit: function (e) {
    e.preventDefault();
    this.answerComment = new QuoraClone.Models.AnswerComment();
    var id = $(e.currentTarget).data('id');

    this.answerComment.set({
      body: $(body).val(),
      answer_id: id
    });

    this.answerComment.save({}, {
      success: function () {
        var collection = new QuoraClone.Collections.AnswerComments();
        collection.add(this.answerComment, { merge: true });
        var _answerCommentShowView = new QuoraClone.Views.AnswerCommentShowView({
          model: this.answerComment
        });

        this.addSubview(".comments-to-answer", _answerCommentShowView);
        $(".new-comment-to-answer").empty();
      }.bind(this)

    });

    return this;
  },

  toggleComments: function () {
    if (this.$(".comments-to-answer").css("display") == ("none")) {
      this.$(".comments-to-answer").css("display", "block");
      this.$(".new-comment-to-answer").css("display", "block");
    } else {
      this.$(".comments-to-answer").css("display", "none");
      this.$(".new-comment-to-answer").css("display", "none");
    }
  }
});

//AnswerCommentShowView
//AnswerCommentNewView
