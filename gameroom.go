package main

import (
	"fmt"
	"github.com/sqp/godock/libs/log"
	"launchpad.net/rjson"
)

type GameRoom struct {
	players map[string]bool
	roomId  string
}

type Game interface {
	handleGameMessage(msg string) bool
	score()
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
	room *GameRoom
}

func (quiz *QuizBowlGame) handleGameMessage(msg string, h *GameHub) bool {
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

	switch data.Operation {
	case "SendAnswer":

	case "StartGame":
		fmt.Println("StartGame")
	case "GetRoomList":
		conn.send <- h.getRoomList()
		handledMessage = true
	}

	fmt.Println(data.Message)
	return handledMessage
}
