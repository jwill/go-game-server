package main

import (
	//"code.google.com/p/go.net/websocket"
	"github.com/sqp/godock/libs/log"
	//"github.com/vmihailenco/msgpack"
	"fmt"
	"github.com/dchest/uniuri"
	"launchpad.net/rjson"
)

type Message struct {
	Operation    string
	Sender       string
	RoomID       string
	Message      string
	MessageArray []string
}

type GameHub struct {
	// Registered players
	players map[string]*Player

	// Registered connections
	connections map[*connection]bool

	// Inbound messages from the connections
	broadcast chan string

	// Register requests from the connections
	register chan *Player

	// Unregister requests from the connections
	unregister chan *Player

	// Rooms
	rooms map[string]*GameRoom
}

// singleton

var gamehub = GameHub{
	players:     make(map[string]*Player),
	broadcast:   make(chan string),
	register:    make(chan *Player),
	unregister:  make(chan *Player),
	connections: make(map[*connection]bool),
	rooms:       make(map[string]*GameRoom),
}

func (h *GameHub) findConnectionForPlayer(playerId string) *connection {
	p := h.players[playerId]
	if p != nil {
		return p.conn
	}
	return nil
}

func (h *GameHub) handleMessage(msg string) bool {
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
	case "CreateRoom":
		fmt.Println("CreateRoom")
		r := &GameRoom{players: make(map[string]bool)}
		r.roomId = uniuri.New()
		h.rooms[r.roomId] = r
		fmt.Println(h.getRoomList())

		// message to say room was created
		// move player to room
	case "JoinRoom":
		fmt.Println("JoinRoom")
		// TODO: Check if player is already in game room
		// Store gameroom data also in player object?
		roomId := data.Message
		room, err := h.rooms[roomId]
		if err != false {
			room.addPlayer(player)
			log.Debug("Player " + player.id + " added to room " + roomId)
			fmt.Println(room.players)
		}
	case "LeaveRoom":
		fmt.Println("LeaveRoom")
		// TODO: Verify player is already in game room
		roomId := data.Message
		room, err := h.rooms[roomId]
		if err != false {
			room.removePlayer(player)
			log.Debug("Player " + player.id + " left room " + roomId)
			fmt.Println(room.players)
		}

	case "StartGame":
		fmt.Println("StartGame")
	case "GetGameTypes":
		conn.send <- h.getGameTypes()
		handledMessage = true
	case "GetRoomList":
		conn.send <- h.getRoomList()
		handledMessage = true
	}

	fmt.Println(data.Message)
	return handledMessage
}

func (h *GameHub) getRoomList() string {
	rooms := h.rooms
	roomList := make([]string, len(rooms))

	i := 0
	for k, _ := range rooms {
		roomList[i] = k
		i++
	}

	msg := Message{
		Operation:    "GetRoomList",
		Sender:       "Server",
		RoomID:       "",
		MessageArray: roomList,
	}
	b, err := rjson.Marshal(msg)
	if err != nil {
	}
	return string(b)
}

func (h *GameHub) getGameTypes() string {
	gameTypes := []string{"BlackJack", "TicTacToe", "QuizBowl"}

	msg := Message{
		Operation:    "GetGameTypes",
		Sender:       "Server",
		RoomID:       "",
		MessageArray: gameTypes,
	}
	b, err := rjson.Marshal(msg)
	if err != nil {
	}
	return string(b)

}

func (h *GameHub) createRoom(gameType string, playerId string) {
	r := &GameRoom{roomId: uniuri.New()}
	// Add room to game hub
	h.rooms[r.roomId] = r
	// Move calling player to that room
	r.players[playerId] = true
}

func (h *GameHub) Run() {
	log.SetPrefix("GameHub")
	log.SetDebug(true)
	log.Info("Started GameHub")

	r := &GameRoom{players: make(map[string]bool)}
	r.roomId = "DemoRoom"
	h.rooms[r.roomId] = r
	fmt.Println(h.getRoomList())

	InitTest()

	for {
		select {

		// Player entered lobby.
		case p := <-h.register:
			h.players[p.id] = p
			h.connections[p.conn] = true
			log.Debug("Added Player " + p.id)

		// Player exited website.
		case p := <-h.unregister:
			delete(h.players, p.id)
			delete(h.connections, p.conn)
			close(p.conn.send)
			log.Debug("Player " + p.id + " exited")

		// Distribute broadcast messages to all connections.
		case m := <-h.broadcast:
			if h.handleMessage(m) != true {
				for c := range h.connections {
					select {
					case c.send <- m:
					default:
						delete(h.connections, c)
						close(c.send)
						go c.ws.Close()
					}
				}
			}
		}
	}
}

func InitTest() {
	ai := &TicTacToeAI{depthLimit: 300}
	ai.board = [3][3]string{{"-", "-", "O"}, {"-", "-", "O"}, {"-", "-", "-"}}
	ai.PrintBoard()

	//ai.completeMove("X", []int{0,0})
	ai.PrintBoard()
	ai.miniMax(ai.board, "X")
	defer ai.completeMove("X", ai.bestMove)
	ai.PrintBoard()

	//moves := ai.generateMovesFromBoard("O")
	//fmt.Println(moves)
	//	x := ai.pickRandomMove("O")
	//ai.completeMove("O", x)
	//ai.PrintBoard()
	//fmt.Println(ai.checkForWin())
}
