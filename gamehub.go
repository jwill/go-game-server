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
	// Might change to msgpack later
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

func (h *GameHub) handleMessage(msg string) {
	fmt.Println(msg)
	var data Message
	err := rjson.Unmarshal([]byte(msg), &data)
	if err != nil {
		fmt.Println("error:", err)
	}
	switch data.Operation {
	case "CreateRoom":
		fmt.Println("CreateRoom")
	case "JoinRoom":
		fmt.Println("JoinRoom")
	case "LeaveRoom":
		fmt.Println("LeaveRoom")
	case "StartGame":
		fmt.Println("StartGame")
	case "GetGameTypes":
		fmt.Println("GetGames")
	case "GetRoomList":
		sender := data.Sender
		conn := h.players[sender].conn
		conn.send <- h.getRoomList()
	case "ChatMessage":
		fmt.Println("ChatMessage")
	}

	fmt.Println(data.Message)

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

	r := &GameRoom{}
	r.roomId = "DemoRoom"
	h.rooms[r.roomId] = r
	fmt.Println(h.getRoomList())

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
			h.handleMessage(m)
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
