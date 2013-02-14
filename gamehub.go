package main

import (
	//"code.google.com/p/go.net/websocket"
	"github.com/sqp/godock/libs/log"
)

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
}

// singleton

var gamehub = GameHub{
	players:     make(map[string]*Player),
	broadcast:   make(chan string),
	register:    make(chan *Player),
	unregister:  make(chan *Player),
	connections: make(map[*connection]bool),
}

func (h *GameHub) Run() {
	log.SetPrefix("GameHub")
	log.SetDebug(true)
	log.Info("Started GameHub")

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
