package main

import (
	"fmt"
	"github.com/sqp/godock/libs/log"
	"launchpad.net/rjson"
)

type RacingGame struct {
}

type RacingMessage struct {
	PlayerId string
	CarId    string
	Pos      [3]float32
	Vel      [3]float32
}

func (race *RacingGame) init() {

}

func (race *RacingGame) startGame(r *GameRoom, h *GameHub) {

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

	return handledMessage
}
