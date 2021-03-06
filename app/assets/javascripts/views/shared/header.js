QuoraClone.Views.Header = Backbone.CompositeView.extend({

  initialize: function(options){
    this.listenTo(QuoraClone.currentUser, "signIn signOut", this.render);
    this.render();
  },

  events: {
    "click #sign-out-link": "signOut",
    "click button" : "newQuestion",
    "submit .search" : "commenceSearch",
    "click .menu-opener" : "toggleMenu",
    "click .header-menu-item" : "closeMenu"
  },

  template: JST['shared/header'],

  render: function(){

    var html = this.template({ currentUser: QuoraClone.currentUser });
    this.$el.html(html);

    return this;
  },

  signOut: function(event){
    event.preventDefault();

    if (QuoraClone.currentUser.get('first_name') === 'Demo User') {

      $.ajax({
        url: "/api/users/" + QuoraClone.currentUser.get('id'),
        type: "PATCH",
        data: {
          "user[avatar]" : "http://www.sinaiem.org/people/files/2013/03/missing.png",
          "user[bio]" : "",
          "user[subscribed_topic_ids]" : [""],
          "user[has_ever_logged_in]" : false
        },
        dataType: "json",
        success: function(data) {
          QuoraClone.currentUser.set(data);
        }

      });
    }

    QuoraClone.currentUser.signOut({
      success: function(){
        Backbone.history.navigate("session/new", { trigger: true });
      }
    });
  },

  newQuestion: function () {
    Backbone.history.navigate("#questions/new", {trigger: true});
  },

  toggleMenu: function () {
    if (this.$(".header-menu").css("display") === "none") {
      this.$(".header-menu").css("display", "block");
    } else {
      this.$(".header-menu").css("display", "none");
    }
  },

  closeMenu: function () {
    this.$(".header-menu").css("display", "none");
  },

  commenceSearch: function (e) {
    e.preventDefault();

    Backbone.history.navigate("#search/" + $("input").val(), {trigger: true});
    $("input").val("");
  }
});
