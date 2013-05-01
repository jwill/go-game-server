package main

import (
	"fmt"
	"github.com/sqp/godock/libs/log"
	"launchpad.net/rjson"
	"strconv"
	"time"
)

type BlackJackGame struct {
	room            *GameRoom
	deck            *Deck
	positions       []map[string]string
	currentPosition int
	state           string
	evaluator       *Evaluator
	dealerHand      *Hand
	gameStarted     bool
}

type BlackJackMessage struct {
	PlayerId     string
	Chips        int
	CurrentBet   int
	IsPlayerTurn bool
	Hand         *Hand // TODO Extend to handle splits or multiple hands
}

func (g *BlackJackGame) init() {
	fmt.Println("Initing blackjack game")
	g.deck = NewDeck(3)
	g.positions = make([]map[string]string, 5)
	g.evaluator = &Evaluator{}
}

func (g *BlackJackGame) startGame(r *GameRoom, h *GameHub) {

	if g.gameStarted != true {
		g.room = r
		g.WaitForBets(h)
		g.gameStarted = true
	} else {
		log.Debug("Game already started")
	}

}

func (g *BlackJackGame) WaitForBets(h *GameHub) {
	go func() {
		var haveBets bool
		log.Debug("Waiting for bets")
		time.Sleep(10 * time.Second)
		log.Debug("")
		for _, v := range g.positions {
			for key, value := range v {
				if key == "bet" && value != "0" {
					haveBets = true
					break
				}
			}
		}
		if haveBets {
			// Deal cards
		} else {
			log.Debug("No bets, restarting counter")
			g.WaitForBets(h)
		}
	}()
}

func (g *BlackJackGame) getOpenSeats() {

}

func (g *BlackJackGame) findPlayerAtTable(playerId string) int {
	for index, v := range g.positions {
		log.Debug("", v)
		for key, value := range v {
			if key == "name" && value == playerId {
				return index
			}
		}
	}
	return -1
}

func (g *BlackJackGame) sitDown(pos int, playerId string) {
	currentSeat := g.findPlayerAtTable(playerId)
	seatEmpty := len(g.positions[pos]) == 0
	if seatEmpty == true {
		if currentSeat == -1 {
			vals := make(map[string]string, 0)
			vals["name"] = playerId
			g.positions[pos] = vals
			log.Debug("Player sat down at seat ", pos)
		} else {
			vals := g.positions[currentSeat]
			g.positions[pos] = vals
			g.positions[currentSeat] = make(map[string]string, 0)
		}

	} else {
		log.Debug("Tried to sit where other player is sitting")
	}
}

func (g *BlackJackGame) HandleGameMessage(msg string, h *GameHub) bool {
	//var conn *connection
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
		//conn = player.conn
	}

	switch data.Operation {
	case "SitDown":
		seatNum, err := strconv.Atoi(data.Message)
		if err == nil {
			g.sitDown(seatNum, sender)
		}
		handledMessage = true
	case "StandUp":
		seatNum := g.findPlayerAtTable(sender)
		log.Debug("", seatNum, "in standup")
		if seatNum != -1 {
			g.positions[seatNum] = nil
			log.Debug("Player at seat ", seatNum, " stood up.")
		}
		handledMessage = true
	case "Hit":
		msg := player.data.(BlackJackMessage)
		if msg.Hand.Result.IsBust == false {
			msg.Hand.Cards = append(msg.Hand.Cards, g.deck.DealCard())
		}
		msg.Hand.Result = g.evaluator.Evaluate(msg.Hand)
		handledMessage = true
	case "Stay":
		msg := player.data.(BlackJackMessage)
		msg.IsPlayerTurn = false
		//(player.data.(BlackJackMessage)).IsPlayerTurn = false
		if g.currentPosition+1 > len(g.positions) {
			g.currentPosition++
			nextPlayerData := g.positions[g.currentPosition]
			nextPlayerName := nextPlayerData["name"]
			nextPlayer := h.players[nextPlayerName].data.(BlackJackMessage)

			nextPlayer.IsPlayerTurn = true
		}
		handledMessage = true
	case "Bet":
		if g.state == "BET" {
			bet, err := strconv.Atoi(data.Message)
			if err == nil {
				msg := player.data.(BlackJackMessage)
				msg.CurrentBet = bet
			}
		}
		handledMessage = true
		log.Debug(player.id + " tried to bet at wrong time.")
	}
	g.sendUpdate(h)
	return handledMessage
}

func (g *BlackJackGame) sendUpdate(h *GameHub) {
	var player *Player
	updates := make([]string, 0)
	fmt.Println(g.room)
	for p := range g.room.players {
		player = h.players[p]
		if player.data != nil {
			blackjackMsg := player.data.(BlackJackMessage)
			blackjackMsg.PlayerId = player.id
			item, err2 := rjson.Marshal(blackjackMsg)
			if err2 == nil {
				updates = append(updates, string(item))
			}
		}
	}
	msg := Message{
		Operation:    "BlackJackGameState",
		Sender:       "Server",
		RoomID:       g.room.roomId,
		MessageArray: updates,
	}
	h.sendBroadcastMessage(msg, g.room.roomId)
}

func (g *BlackJackGame) playDealerHand() {

}

func (g *BlackJackGame) EvaluateHands() {
	/*for _, player := range g.room.players {

		} */
}

//BlackJackGame.prototype.evaluateHands = function (dealerHand) {
//    var updates = {};
//    this.players = this.loadPlayerData();
//    _.each(this.players, function (player) {
//        _.each(player.hands, function (hand) {
//            var playerHand = game.evaluator.evaluate(hand);
//            if (playerHand.isBust) {
//                // Lose
//                console.log('Player bust');
//            } else if (dealerHand.isBust) {
//                // Win
//                console.log('Dealer bust');
//                player.adjustFunds(2 * player.currentBet);
//            } else if (playerHand.maxTotal > dealerHand.maxTotal) {
//                // Win
//                console.log('Player win');
//                player.adjustFunds(2 * player.currentBet);
//            } else if (playerHand.maxTotal < dealerHand.maxTotal) {
//                // Lose
//                console.log('Player lost');
//            } else {
//                // Push
//                console.log('Push');
//                player.adjustFunds(player.currentBet);
//            }
//        });
//        updates[player.id] = player.toString();
//    });
//    updates['gameState'] = 'END';
//    gapi.hangout.data.submitDelta(updates);
//};

/*
type Message struct {
	Operation    string
	Sender       string
	RoomID       string
	Message      string
	MessageArray []string
	MessageMap   string
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

*/
