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
  console.log(msg);
}

App.prototype.sendChatMessage = function() {
  var data = {
    'operation': 'chatMessage',
    'sender': 'me',
    'message': 'hi'
  }
  this.ws.send(JSON.stringify(data));
}

App.prototype.displayChatMessage = function(sender, messageText) {
  val = $('#chat').html();
  line = sender + ": "+ message + '\n';
  val += line;
  $('#chat').html(val)
}

$().ready(function() {
  window.app = new App();
});
