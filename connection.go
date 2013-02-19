package main

import (
	"code.google.com/p/go.net/websocket"
	"github.com/dchest/uniuri"
	"launchpad.net/rjson"
)

type connection struct {
	// Websocket connection
	ws *websocket.Conn

	// Buffered channel for outbound messages
	send chan string
}

func (c *connection) reader() {
	for {
		var message string
		err := websocket.Message.Receive(c.ws, &message)
		if err != nil {
			break
		}
		// TODO Add logic to determine if broadcast message or game state/etc
		gamehub.broadcast <- message
	}
	c.ws.Close()
}

func (c *connection) writer() {
	for message := range c.send {
		err := websocket.Message.Send(c.ws, message)
		if err != nil {
			break
		}
	}
	c.ws.Close()
}

func wsHandler(ws *websocket.Conn) {
	player := &Player{id: uniuri.New(), conn: &connection{send: make(chan string, 256), ws: ws}}
	gamehub.register <- player
	gamehub.broadcast <- player.AnnouncePlayer("Lobby", false)
	player.SendPlayerIdentity()
	defer func() {
		gamehub.unregister <- player
		gamehub.broadcast <- player.AnnouncePlayer("", true)
	}()
	go player.conn.writer()
	player.conn.reader()
}

type Player struct {
	conn *connection
	name string
	id   string
}

func (p *Player) ChangeNick(newNick string) Message {
	p.name = newNick

	msg := Message{
		Operation: "ChangeNick",
		Sender:    "Server",
		RoomID:    "Lobby", // TODO: set room
		Message:   newNick,
	}
	return msg
}

func (p *Player) AnnouncePlayer(roomId string, isExiting bool) string {
	msg := Message{
		Operation: "ChatMessage",
		Sender:    "Server",
		RoomID:    roomId,
		Message:   "",
	}
	if isExiting == false {
		msg.Message = "Player " + p.id + " entered " + roomId + "."
	} else {
		msg.Message = "Player " + p.id + " exited " + roomId + "."
	}
	b, err := rjson.Marshal(msg)
	if err != nil {
	}
	return string(b)
}

// Send Initial information back to Player
func (p *Player) SendPlayerIdentity() {
	msg := Message{
		Operation: "PlayerIdentity",
		Sender:    "Server",
		RoomID:    "Lobby",
		Message:   p.id,
	}
	b, err := rjson.Marshal(msg)
	if err != nil {
	}
	p.conn.send <- string(b)
}
