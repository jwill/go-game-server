package main

type GameRoom struct {
	players map[string]bool
	roomId  string
}

type Game interface {
}

func (room *GameRoom) joinRoom(playerId string) {
	room.players[playerId] = true
	// Send message saying player was added.
}

func (room *GameRoom) leaveRoom(playerId string) {
	delete(room.players, playerId)
}
