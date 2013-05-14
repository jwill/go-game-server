package main

import (
	"fmt"
	"github.com/sqp/godock/libs/log"
	"io/ioutil"
	"launchpad.net/rjson"
	"strconv"
	"time"
)

type QuizBowlGame struct {
	questions   []Question
	gameStarted bool
}

// Quizbowl Structs

type Question struct {
	Lang          string
	Points        int
	QuestionId    string
	QuestionText  string
	Choices       []Choice
	CorrectAnswer string
}

type Choice struct {
	Id   string
	Text string
}

type QuizBowlAnswer struct {
	RoomId     string
	QuestionId string
	AnswerId   string
}

func (quiz *QuizBowlGame) init() {
	quiz.loadQuestions()
}

func (quiz *QuizBowlGame) startGame(room *GameRoom, h *GameHub) {
	if quiz.gameStarted == false {
		quiz.gameStarted = true
		go func() {
			for _, q := range quiz.questions {
				time.Sleep(10 * time.Second)
				quiz.SendQuestion(room.roomId, q.QuestionId, h)
			}
			quiz.gameStarted = false
		}()
	}
}

func (quiz *QuizBowlGame) loadQuestions() {
	bs, err := ioutil.ReadFile("json/sample-questions.json")
	if err != nil {
		return
	}

	questions := make([]Question, 0)

	err = rjson.Unmarshal(bs, &questions)
	if err != nil {
		fmt.Println("Error Loading Questions:", err)
	}
	log.Debug("Loaded questions")

	quiz.questions = questions
}

func (quiz *QuizBowlGame) HandleGameMessage(msg string, h *GameHub) bool {
	var conn *connection
	var player *Player
	var handledMessage bool

	var data Message
	err := rjson.Unmarshal([]byte(msg), &data)
	if err != nil {
		fmt.Println("error:", err)
	}

	// Get sender's connection
	sender := data.Sender
	if sender != "" && sender != "Server" {
		player = h.players[sender]
		conn = player.conn
	}
	fmt.Println(conn)

	switch data.Operation {
	case "SendAnswer":
		quiz.Score(data.MessageMap, player)
		handledMessage = true
	}

	return handledMessage
}

func (quiz *QuizBowlGame) Score(msg string, player *Player) {
	if player.data == nil {
		player.data = 0
	}

	var answer QuizBowlAnswer
	err := rjson.Unmarshal([]byte(msg), &answer)
	if err != nil {
		fmt.Println(err)
		log.Debug("Could not score answer")
	}

	var m string
	question := quiz.findQuestionById(answer.QuestionId)
	correctAnswer := question.CorrectAnswer
	answerText := quiz.findAnswerText(question, correctAnswer)
	fmt.Println(answerText)
	fmt.Println(correctAnswer, answer.AnswerId)
	if answer.AnswerId == correctAnswer {
		player.data = player.data.(int) + 200
		fmt.Println("Score:", player.data)
		m = "Correct Answer! \nCurrent Score: " + strconv.Itoa(player.data.(int))
	} else {
		m = "Wrong! The correct answer is " + answerText + "\n Current score: " + strconv.Itoa(player.data.(int))
	}

	msg2 := Message{
		Operation: "SendResult",
		Sender:    "Server",
		RoomID:    "",
		Message:   m,
	}

	b, err2 := rjson.Marshal(msg2)
	if err2 != nil {
		log.Debug("There was a marshalling error.")
		return
	}
	//Send message back to player
	player.conn.send <- string(b)
}

func (quiz *QuizBowlGame) findQuestionById(questionId string) Question {
	var q Question
	for _, qq := range quiz.questions {
		if questionId == qq.QuestionId {
			q = qq
		}
	}
	return q
}

func (quiz *QuizBowlGame) findAnswerText(q Question, answerId string) string {
	var answerText string
	for _, v := range q.Choices {
		if answerId == v.Id {
			answerText = v.Text
		}
	}
	return answerText
}

func (quiz *QuizBowlGame) SendQuestion(roomId string, questionId string, h *GameHub) {
	q := quiz.findQuestionById(questionId)
	fmt.Println(q)
	q.CorrectAnswer = "-1"
	b, err := rjson.Marshal(q)
	if err != nil {
		fmt.Println("Dfdfs", err)
	}

	msg := Message{
		Operation:  "SendQuestion",
		Sender:     "Server",
		RoomID:     "",
		MessageMap: string(b),
	}

	h.sendBroadcastMessage(msg, roomId)
}
