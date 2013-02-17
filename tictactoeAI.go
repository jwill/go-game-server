package main

import (
	"fmt"
	"github.com/sqp/godock/libs/log"
	"math/rand"
	"time"
)

type TicTacToeAI struct {
	depthLimit   int
	currentDepth int
	board        [3][3]string
	bestMove     []int
}

func GetOtherPlayer(currentPlayer string) string {
	if currentPlayer == "X" {
		return "O"
	}
	return "X"
}

func (t *TicTacToeAI) miniMax(currentPlayer string) int {
	//log.Debug("Starting MiniMax run")
	best := -10

	if t.currentDepth == t.depthLimit {
		return 0
	}

	if t.checkForWin() == currentPlayer {
		return 1
	}

	if t.checkForWin() == GetOtherPlayer(currentPlayer) {
		return -1
	}

	t.currentDepth++

	newBoard := t.board
	moves := t.generateMovesFromBoard(currentPlayer)
  fmt.Println(moves)

	for i := 0; i < len(moves); i++ {
		m := moves[i]
		newBoard[m[0]][m[1]] = currentPlayer
		value := -t.miniMax(GetOtherPlayer(currentPlayer))
		// reverse move
		defer func(){newBoard[m[0]][m[1]] = ""}
		if value > best {
			best = value
			t.bestMove = m
		}
	}
	if best == -10 {
		return 0
	}
	// Should nver reach this point
	return -20

}

func (t *TicTacToeAI) generateMovesFromBoard(player string) []([]int) {
	b := t.board
	fmt.Println(b)
	emptySlots := make([]([]int), 0)
	for i := 0; i < 3; i++ {
		for j := 0; j < 3; j++ {
			if b[i][j] == "" || b[i][j] == "-" {
				emptySlots = append(emptySlots, []int{i, j})
			}
		}
	}
	return emptySlots
}

func (t *TicTacToeAI) pickRandomMove(letter string) []int {
	rand.Seed(time.Now().Unix())
	moves := t.generateMovesFromBoard(letter)
	num := rand.Intn(len(moves))
	fmt.Println("random: ", num)
	fmt.Println(moves[num])
	return moves[num]
}

func (t *TicTacToeAI) completeMove(letter string, move []int) {
	t.board[move[0]][move[1]] = letter
}

func (t *TicTacToeAI) checkForWin() string {
	winner := ""
	emptySpaces := 0
	// yeah I know this is a lazy algo, but it works ;)
	lines := [][][2]int{
		{{0, 0}, {1, 1}, {2, 2}},
		{{0, 2}, {1, 1}, {2, 0}},
		{{0, 0}, {0, 1}, {0, 2}},
		{{1, 0}, {1, 1}, {1, 2}},
		{{2, 0}, {2, 1}, {2, 2}},
		{{0, 0}, {1, 0}, {2, 0}},
		{{0, 1}, {1, 1}, {2, 1}},
		{{0, 2}, {1, 2}, {2, 2}},
	}
	for i := 0; i < len(lines); i++ {
		line := lines[i]
		a := t.board[line[0][0]][line[0][1]]
		b := t.board[line[1][0]][line[1][1]]
		c := t.board[line[2][0]][line[2][1]]

		if a == "-" {
			emptySpaces++
		}
		if b == "-" {
			emptySpaces++
		}
		if c == "-" {
			emptySpaces++
		}

		if a != "" && a == b && a == c {
			winner = a
			log.Debug("winner:" + a)
			return winner
		}
	}
	if emptySpaces == 0 {
		log.Debug("winner:draw")
		winner = "draw"
	}
	return winner
}

func (t *TicTacToeAI) computerTurn() {

}

func (t *TicTacToeAI) PrintBoard() {
	for i := 0; i < 3; i++ {
		a := t.board[i][0]
		b := t.board[i][1]
		c := t.board[i][2]

		log.Debug(a + b + c)
	}
}

/*

TTT.computerTurn =  function() {
	// Randomize starting position
	moves = TTT.generateMovesFromBoard(TTT.gameBoard, "O");
	clickedCell = null;
	if (moves.length == 9) 
		clickedCell = TTT.pickRandomMove();	
	else {
		mini = new MiniMax();
		move = mini.miniMax(TTT.gameBoard, "O");
		clickedCell = TTT.cellContainer.findByPos(move[0], move[1]);
		if (TTT.isGameOver) {
            clickedCell.toggleState();
            return;
        }
		if (clickedCell === undefined) {
			clickedCell = TTT.pickRandomMove();
		}
	}
	clickedCell.toggleState();
}
*/
