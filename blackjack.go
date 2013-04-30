package main

import (
	"fmt"
	"github.com/sqp/godock/libs/log"
	"launchpad.net/rjson"
)

type BlackJackGame struct {
	room *GameRoom
	deck *Deck
	positions []string
}

type BlackJackMessage struct {
   PlayerId string
}

func (g *BlackJackGame) init() {
	fmt.Println("Initing blackjack game")
	g.deck = NewDeck(3)
	g.positions = make([]string,5)
}

func (g *BlackJackGame) startGame(r *GameRoom, h *GameHub) {
	g.room = r
}

func (g *BlackJackGame) HandleGameMessage(msg string, h *GameHub) bool {
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

	var raceMsg BlackJackMessage
	err2 := rjson.Unmarshal([]byte(data.MessageMap), &raceMsg)
	if err2 != nil {
	}
	switch data.Operation {
	case "SitDown":
		// Expects a position
	case "StandUp":

	case "Hit":
	case "Stay":
	case "Bet":
	// Double Down and Split Not implemented
	case "StateUpdate":
		fmt.Println("received update from", raceMsg.PlayerId)
		player.data = raceMsg
		fmt.Println(player)
		//fmt.Println(race.room)
		//race.sendUpdate(h)
		handledMessage = true
	}

	return handledMessage
}

func (g *BlackJackGame) sendUpdate(h *GameHub) {
	var player *Player
	updates := make([]string, 0)
	fmt.Println(g.room)
	for p := range g.room.players {
		player = h.players[p]
		if player.data != nil {
			raceMsg := player.data.(BlackJackMessage)
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

/*
type Message struct {
	Operation    string
	Sender       string
	RoomID       string
	Message      string
	MessageArray []string
	MessageMap   string
}
 */
