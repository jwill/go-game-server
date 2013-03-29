package main

import (
	"fmt"
	"github.com/sqp/godock/libs/log"
	"launchpad.net/rjson"
)

type RacingGame struct {
	room *GameRoom
}

type RacingMessage struct {
	PlayerId string
	CarId    string
	Pos      [3]float32
	Vel      float32
	Rot      float32
}

func (race *RacingGame) init() {
	fmt.Println("Initing racing game")
}

func (race *RacingGame) startGame(r *GameRoom, h *GameHub) {
	race.room = r
}

func (race *RacingGame) HandleGameMessage(msg string, h *GameHub) bool {
	var conn *connection
	var player *Player
	var handledMessage bool

	var data Message
	err := rjson.Unmarshal([]byte(msg), &data)
	if err != nil {
		fmt.Println("error:", err)
	}

	fmt.Println(player, conn)
	log.Debug("here")
	//switch data.{}

	// Get sender's connection
	sender := data.Sender
	if sender != "" && sender != "Server" {
		player = h.players[sender]
		conn = player.conn
	}
	fmt.Println(conn)

	var raceMsg RacingMessage
	err2 := rjson.Unmarshal([]byte(data.MessageMap), &raceMsg)
	if err2 != nil {
	}
	switch data.Operation {
	case "StateUpdate":
		fmt.Println("received update from", raceMsg.PlayerId)
		player.data = raceMsg
		fmt.Println(player)
		fmt.Println(race.room)
		race.sendUpdate(h)
		handledMessage = true
	}

	return handledMessage
}

func (race *RacingGame) sendUpdate(h *GameHub) {
	var player *Player
	updates := make([]string, 0)
	fmt.Println(race.room)
	for p := range race.room.players {
		player = h.players[p]
		if player.data != nil {
			raceMsg := player.data.(RacingMessage)
			raceMsg.PlayerId = player.id
			item, err2 := rjson.Marshal(raceMsg)
			if err2 == nil {
				updates = append(updates, string(item))
			}
		}
	}
	msg := Message{
		Operation:    "RaceGameState",
		Sender:       "Server",
		RoomID:       "Lobby",
		MessageArray: updates,
	}
	h.sendBroadcastMessage(msg, "Lobby")
}
