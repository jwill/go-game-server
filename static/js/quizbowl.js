var Quizbowl = function(ws) {
  this.ws = ws;
  this.setupDisplay();
  this.currentQuestion = null;
}

Quizbowl.prototype.setupDisplay = function() {
  $('#quizbowlArea').get(0).style.display = 'block';
  $('#playingArea').get(0).style.display = 'none';
}

Quizbowl.prototype.handleMessage = function(msg) {
  switch(msg.Operation) {
    case 'SendQuestion':
      this.currentQuestion = JSON.parse(msg.MessageMap);
      this.displayQuestion();
      break;
    case 'SendResult':
      this.parseAnswer(msg);
      break;
  }
}

Quizbowl.prototype.clearAnswers = function () {
  for (var i=0; i< 4; i++) {
    var choice = this.currentQuestion.Choices[i];
    $('#btn'+i).get(0).value = "";
    $('#btn'+i).get(0).innerText = "";
    $('#btn'+i).unbind('click');
  }
}

Quizbowl.prototype.randomizeChoices = function() {
  // Not implemented
}

Quizbowl.prototype.parseAnswer = function(msg) {
  alert(msg.Message);
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
  app.currentGame.clearAnswers();
}
