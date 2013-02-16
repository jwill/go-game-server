var App = function() {
  this.setupClient();
  this.roomID = 'Lobby';
  this.playerId = '';

 }

App.prototype.setupClient = function() {
  this.ws = new WebSocket("ws://localhost:8080/ws");
  this.ws.onmessage = this.receiveMessage;
   $('#sendMessage').click(this.sendChatMessage);

}

App.prototype.setName = function() {

}

App.prototype.receiveMessage = function(msg) {
  var self = this;
  try {
    var data = JSON.parse(msg.data);
    switch(data.Operation) {
      case 'ChatMessage':
        app.displayChatMessage(data.Sender, data.Message);
        break;
      case 'PlayerIdentity':
        app.playerId = data.Message;
        break;
      case 'GetGameTypes':
        break;
      case 'GetRoomList':
        break;
    }
  } catch(Exception) {

  }
    console.log(data)
}

App.prototype.sendChatMessage = function() {
  var text = $('#message').get(0).value;
  var data = {
    Operation: 'ChatMessage',
    Sender: app.playerId,
    RoomID: app.roomID,
    Message: text
  }
  $('#message').get(0).value=""
  app.ws.send(JSON.stringify(data));
}

App.prototype.getRooms = function() {
  var data = {
    Operation: 'GetRoomList',
    Sender: app.playerId
  }
  app.ws.send(JSON.stringify(data));
}

App.prototype.joinRoom = function(roomId) {
  var data = {
    Operation: 'JoinRoom',
    Sender: app.playerId,
    Message: roomId
  }
  console.log(data);
  app.ws.send(JSON.stringify(data));
}

App.prototype.getGameTypes = function() {
  var data = {
    Operation: 'GetGameTypes',
    Sender: app.playerId
  }
  app.ws.send(JSON.stringify(data));
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
