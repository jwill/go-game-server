package main

import (
	"fmt"
	//"code.google.com/p/go.net/websocket"
)

type GameHub struct {
	// Registered players
	players map[*Player]bool

	// Registered connections
	connections map[*connection]bool

	// Inbound messages from the connections
	// Might change to msgpack later
	broadcast chan string

	// Register requests from the connections
	register chan *Player

	// Unregister requests from the connections
	unregister chan *Player
}

// singleton

var gamehub = GameHub{
	players:     make(map[*Player]bool),
	broadcast:   make(chan string),
	register:    make(chan *Player),
	unregister:  make(chan *Player),
	connections: make(map[*connection]bool),
}

func (h *GameHub) Run() {
	fmt.Println("GameHub")

	for {
		select {
		case p := <-h.register: // Player entered lobby.
			h.players[p] = true
			h.connections[p.conn] = true
			fmt.Println(h.players)
		case p := <-h.unregister: // Player exited lobby.
			delete(h.players, p)
			delete(h.connections, p.conn)
			close(p.conn.send)
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
