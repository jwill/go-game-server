package main

// Connection code: http://gary.beagledreams.com/page/go-websocket-chat.html

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
	c := &connection{send: make(chan string, 256), ws: ws}
	gamehub.register <- c
	defer func() { gamehub.unregister <- c }()
	go c.writer()
	c.reader()
}

type Player struct {
	conn *connection
}
