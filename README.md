go-game-server
==============

Go-game-server is a proof of concept game server using Websockets for
communication and powered by Google Go.

There is currently a quizbowl game implemented. TicTacToe solver works
too but isn't wired up to a full on game.

Import the following libraries with _go get_:

"launchpad.net/rjson"
"github.com/dchest/uniuri"
"code.google.com/p/go.net/websocket"

Running the application:

go run *.go

Open a browser at http://localhost:8080
