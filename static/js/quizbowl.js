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
  }
}

Quizbowl.prototype.randomizeChoices = function() {
  // Not implemented
}

Quizbowl.prototype.displayQuestion = function() {
  $('#questionText h3').get(0).innerText = this.currentQuestion.QuestionText;
  for (var i=0; i< 4; i++) {
    var choice = this.currentQuestion.Choices[i];
    $('#btn'+i).get(0).value = choice.Id;
    $('#btn'+i).get(0).innerText = choice.Text;
  }
}

Quizbowl.prototype.sendMessage = function(msg) {

}
