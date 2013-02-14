package main

import (
	"code.google.com/p/go.net/websocket"
	"fmt"
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

	player := &Player{conn: &connection{send: make(chan string, 256), ws: ws}}
	gamehub.register <- player
	gamehub.broadcast <- "Player entered lobby"
	defer func() {
		gamehub.unregister <- player
		fmt.Println("closed")
		gamehub.broadcast <- "Player exited."
	}()
	go player.conn.writer()
	player.conn.reader()
}

type Player struct {
	conn *connection
	name string
	id   string
}
