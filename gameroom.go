package main

import (
	"fmt"
	"github.com/sqp/godock/libs/log"
	"io/ioutil"
	"launchpad.net/rjson"
)

type GameRoom struct {
	players map[string]bool
	roomId  string
	game    Game
}

type Game interface {
	init()
	HandleGameMessage(string, *GameHub) bool
}

func (room *GameRoom) addPlayer(player *Player) {
	room.players[player.id] = true
	// Send message saying player was added.
}

func (room *GameRoom) removePlayer(player *Player) {
	delete(room.players, player.id)
	// Send message saying player was removed
}

type QuizBowlGame struct {
	questions []Question
}

// Quizbowl Structs

type Question struct {
	Lang          string
	Points        int
	QuestionId    int
	QuestionText  string
	Choices       []Choice
	CorrectAnswer int
}

type Choice struct {
	Id   int
	Text string
}

type QuizBowlAnswer struct {
	RoomId     string
	QuestionId int
	AnswerId   int
}

func (quiz *QuizBowlGame) init() {
	quiz.loadQuestions()
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
	fmt.Println("in quiz handle message")
	var conn *connection
	var player *Player
	var handledMessage bool

	var data Message
	err := rjson.Unmarshal([]byte(msg), &data)
	if err != nil {
		fmt.Println("error:", err)
	}

	log.Debug(msg)

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
		quiz.Score(data.MessageMap)
		handledMessage = true
	}

	return handledMessage
}

func (quiz *QuizBowlGame) Score(msg string) {

	var answer QuizBowlAnswer
	err := rjson.Unmarshal([]byte(msg), &answer)
	if err != nil {
		log.Debug("Could not score answer")
	}

	question := quiz.questions[0]
	// question := quiz.findQuestionById(answer.QuestionId)
	correctAnswer := question.CorrectAnswer
	if answer.AnswerId == correctAnswer {
		fmt.Println("Correct Answer!")
	}
}
