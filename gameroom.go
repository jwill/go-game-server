package main

type GameRoom struct {
	players map[string]bool
	roomId  string
}

type Game interface {
}

func (room *GameRoom) addPlayer(player *Player) {
	room.players[player.id] = true
	// Send message saying player was added.
}

func (room *GameRoom) removePlayer(player *Player) {
	delete(room.players, player.id)
	// Send message saying player was removed
}
