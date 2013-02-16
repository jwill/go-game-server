var App = function() {
  this.setupClient();
  this.roomID = 'Lobby';
  this.playerId = '';
  
  this.setupModals();
 }

App.prototype.setupClient = function() {
  this.ws = new WebSocket("ws://localhost:8080/ws");
  this.ws.onmessage = this.receiveMessage;
   $('#sendMessage').click(this.sendChatMessage);

}

App.prototype.setupModals = function() {
  $('#btnCreateRoom').click(this.createRoom);
  $('#btnSaveName').click(function(){});
  $('#btnJoinRoom').click(this.joinRoom);
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
        app.roomList = data.MessageArray;
        app.toggleJoinRoomModal(app.roomList);
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

App.prototype.joinRoom = function() {
  var roomId = $('#roomSelect').get(0).value; 
  var data = {
    Operation: 'JoinRoom',
    Sender: app.playerId,
    Message: roomId
  }
  console.log(data);
  app.ws.send(JSON.stringify(data));
}

App.prototype.leaveRoom = function(roomId) {
  var data = {
    Operation: 'LeaveRoom',
    Sender: app.playerId,
    Message: roomId
  }
  console.log(data);
  app.ws.send(JSON.stringify(data));
}

App.prototype.toggleCreateRoomModal = function() {
  $('#create-game-modal').modal('toggle');
}

App.prototype.toggleSetNameModal = function() {
  $('#name-modal').modal('toggle');
}

App.prototype.toggleJoinRoomModal = function(roomList) {
  $('#roomSelect').empty();
  for (var i = 0; i<roomList.length; i++) {
    var v = roomList[i];
    $('#roomSelect').append('<option value='+v+'>'+v+'</option>')
  }
  $('#join-room-modal').modal('toggle');
}

App.prototype.createRoom = function(roomId) {
  var data = {
    Operation: 'CreateRoom',
    Sender: app.playerId,
    Message: ""
  }
  console.log(data);
  app.ws.send(JSON.stringify(data));
  app.toggleCreateRoomModal();
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
