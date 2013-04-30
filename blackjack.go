package main

import (
	"fmt"
	"launchpad.net/rjson"
	"github.com/sqp/godock/libs/log"
	"strconv"
)

type BlackJackGame struct {
	room *GameRoom
	deck *Deck
	positions       []string
	currentPosition int
	state           string
	evaluator *Evaluator
	dealerHand *Hand
}

type BlackJackMessage struct {
	PlayerId     string
	Chips        int
	CurrentBet   int
	IsPlayerTurn bool
	Hand *Hand // TODO Extend to handle splits or multiple hands
}

func (g *BlackJackGame) init() {
	fmt.Println("Initing blackjack game")
	g.deck = NewDeck(3)
	g.positions = make([]string, 5)
	g.evaluator = &Evaluator{}
}

func (g *BlackJackGame) startGame(r *GameRoom, h *GameHub) {
	g.room = r
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
		// Expects a position
		// If seat not occupied
		seatNum, err := strconv.Atoi(data.Message)
		if err == nil {
			g.positions[seatNum] = player.id
		}
		handledMessage = true
	case "StandUp":
		seatNum, err := strconv.Atoi(data.Message)
		if err == nil {
			g.positions[seatNum] = ""
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
		if (g.currentPosition + 1 > len(g.positions)) {
			g.currentPosition++
			nextPlayerName := g.positions[g.currentPosition]
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

func (g *BlackJackGame) sendUpdate(h*GameHub) {
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

func (g *BlackJackGame) EvaluateHands () {
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
