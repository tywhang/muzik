App = {};
App.cable = ActionCable.createConsumer();

App.chat = App.cable.subscriptions.create("ChatChannel", {
  connected: function() {

  },

  disconnected: function() {

  },

  received: function(data) {
    var receivedContent = data['content'];
    var contentAuthor = data['user_name'];
    $('.js-messages').append("<p>" + contentAuthor + ": " + receivedContent + "</p>");
    this.scrollMessagesToBottom();
  },

  speak: function(message) {
    this.perform('speak', {
      message: message
    });
  },

  scrollMessagesToBottom: function() {
    var messages = document.getElementsByClassName("js-messages")[0];
    messages.scrollTop = messages.scrollHeight;
  }
});

$(document).ready(function() {
  var messages = document.getElementsByClassName("js-messages")[0];
  messages.scrollTop = messages.scrollHeight;

  $('.js-new-message').on('keyup', function(e) {
    if (e.keyCode !== 13) {
      return;
    }

    var userId = Cookies.get('userId')
    var roomId = $('.main-section').data('roomId')

    if (!userId) {
      alert('Please register your name');
      return false;
    }

    var content = $('.js-new-message').val().trim();
    if (!content) {
      alert('Please fill out your message');
      return false;
    }

    $('.js-new-message').val('');
    App.chat.speak({
      content: content,
      user_id: userId,
      room_id: roomId
    });
  });
});
