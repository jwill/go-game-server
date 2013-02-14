package main

import (
	"fmt"
	//"code.google.com/p/go.net/websocket"
)

type GameHub struct {
	// Registered connections
	connections map[*connection]bool

	// Inbound messages from the connections
	// Might change to msgpack later
	broadcast chan string

	// Register requests from the connections
	register chan *connection

	// Unregister requests from the connections
	unregister chan *connection
}

// singleton

var gamehub = GameHub{
	broadcast:   make(chan string),
	register:    make(chan *connection),
	unregister:  make(chan *connection),
	connections: make(map[*connection]bool),
}



func (h *GameHub) Run() {
	fmt.Println("GameHub")
	for {
		select {
		case c := <-h.register:
			h.connections[c] = true
		case c := <-h.unregister:
			delete(h.connections, c)
			close(c.send)
		case m := <-h.broadcast:
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
