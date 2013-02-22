var Quizbowl = function(ws) {
  this.ws = ws;
  this.setupDisplay();
  this.currentQuestion = null;
}

Quizbowl.prototype.setupDisplay = function() {

}

Quizbowl.prototype.handleMessage = function(msg) {
  switch(msg.Operation) {
    case 'SendQuestion':
      this.currentQuestion = JSON.parse(msg.MessageMap);
      this.displayQuestion();
      break;
    case 'ReceiveAnswer':
      this.parseAnswer(msg);
  }
}

Quizbowl.prototype.clearAnswers = function () {
  
}

Quizbowl.prototype.randomizeChoices = function() {
  // Not implemented
}

Quizbowl.prototype.parseAnswer = function(msg) {

}

Quizbowl.prototype.displayQuestion = function() {

  $('#questionText h3').get(0).innerText = this.currentQuestion.QuestionText;
  var questionId = this.currentQuestion.QuestionId;
  for (var i=0; i< 4; i++) {
    var choice = this.currentQuestion.Choices[i];
    $('#btn'+i).get(0).value = choice.Id;
    $('#btn'+i).get(0).innerText = choice.Text;
    $('#btn'+i).unbind('click');
    $('#btn'+i).click(function(evt) {
      var target = evt.target.value;
      app.currentGame.sendAnswer(questionId, target);
    });
  }
  app.createTimer(10);
}

Quizbowl.prototype.sendAnswer = function(questionId, answerId) {
  var answer = {
    RoomId: app.roomId,
    QuestionId:questionId,
    AnswerId:answerId
  }
  
  var data = {
    Operation: 'SendAnswer',
    RoomId: "QuizBowl",
    Sender: app.playerId,
    MessageMap:JSON.stringify(answer)
  }
  app.ws.send(JSON.stringify(data));

}

Quizbowl.prototype.sendMessage = function(msg) {

}
