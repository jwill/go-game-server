package main

import (
	"fmt"
	"github.com/sqp/godock/libs/log"
	"io/ioutil"
	"launchpad.net/rjson"
	"time"
)

type QuizBowlGame struct {
	questions []Question
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
	go func() {
		for _, q := range quiz.questions {
			time.Sleep(15 * time.Second)
			quiz.SendQuestion(room.roomId, q.QuestionId, h)
		}
	}()
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
	case "StartGame":
		fmt.Println("StartGame")
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

	question := quiz.findQuestionById(answer.QuestionId)
	fmt.Println("Q:", question)
	correctAnswer := question.CorrectAnswer
	fmt.Println(correctAnswer, answer.AnswerId)
	if answer.AnswerId == correctAnswer {
		fmt.Println("Correct Answer!")
		player.data = player.data.(int) + 200
		fmt.Println("Score:", player.data)
	} else {
		fmt.Println("Wrong Answer!")
	}

	//Send message back to player
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
