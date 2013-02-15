var App = function() {
  this.setupClient();
}

App.prototype.setupClient = function() {
  this.ws = new WebSocket("ws://localhost:8080/ws");
  this.ws.onmessage = this.receiveMessage;
}

App.prototype.setName = function() {

}

App.prototype.receiveMessage = function(msg) {
  var self = this;
  try {
    var data = JSON.parse(msg.data);
    switch(data.Operation) {
      case 'chatMessage':
        app.displayChatMessage(data.Sender, data.Message);
        break;
    }
  } catch(Exception) {

  }
    console.log(data)
}

App.prototype.sendChatMessage = function() {
  var text = $('#message').get(0).value;
  var data = {
    Operation: 'chatMessage',
    Sender: 'me',
    Message: text
  }
  $('#message').get(0).value=""
  this.ws.send(JSON.stringify(data));
}

App.prototype.displayChatMessage = function(sender, messageText) {
  val = $('#chat').html();
  line = sender + ": "+ messageText + '\n';
  val += line;
  $('#chat').html(val)
}

$().ready(function() {
  window.app = new App();
});
