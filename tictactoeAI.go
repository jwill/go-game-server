package main

// Improved original JS algo with heuristics from http://www.ntu.edu.sg/home/ehchua/programming/java/JavaGame_TicTacToe_AI.html

import (
	"fmt"
	"github.com/sqp/godock/libs/log"
	"math"
	"math/rand"
	"time"
)

type TicTacToeAI struct {
	depthLimit   int
	currentDepth int
	board        [3][3]string
	myLetter     string
	//bestMove     []int
}

func GetOtherPlayer(currentPlayer string) string {
	if currentPlayer == "X" {
		return "O"
	}
	return "X"
}

func (t *TicTacToeAI) miniMax(currentPlayer string) []int {
	//log.Debug("Starting MiniMax run")
	var bestScore int
	bestMove := []int{-1, -1}

	if currentPlayer == t.myLetter {
		bestScore = math.MinInt32
	} else {
		bestScore = math.MaxInt32
	}

	currentScore := -1

	moves := t.generateMovesFromBoard()
	if len(moves) == 0 {
		fmt.Println("0 moves left")
		if t.checkForWin() == currentPlayer {
			return 1
		}

		if t.checkForWin() == GetOtherPlayer(currentPlayer) {
			return -1
		} else {
			return 0
		}

	}

	if t.currentDepth == t.depthLimit {
		fmt.Println("dfd")
		return 0
	}

	t.currentDepth++
	fmt.Println("current depth:", t.currentDepth)

	newBoard := board
	moves := t.generateMovesFromBoard(newBoard, currentPlayer)
	fmt.Println(moves)

	var i int
	for i = 0; i < len(moves); i++ {
		m := moves[i]
		fmt.Println(i)
		fmt.Println(m)
		newBoard[m[0]][m[1]] = currentPlayer
		value := -t.miniMax(newBoard, GetOtherPlayer(currentPlayer))
		// reverse move
		newBoard[m[0]][m[1]] = "-"
		if value > best {
			best = value
			bestMove = m
		}
	}
	if best == -10 {
		return 0
	}
	return -333

}

func (t *TicTacToeAI) generateMovesFromBoard() []([]int) {
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
	fmt.Println("emptySlots:", emptySlots)
	return emptySlots
}

func (t *TicTacToeAI) pickRandomMove(letter string) []int {
	rand.Seed(time.Now().Unix())
	moves := t.generateMovesFromBoard(t.board, letter)
	num := rand.Intn(len(moves))
	fmt.Println("random: ", num)
	fmt.Println(moves[num])
	return moves[num]
}

func (t *TicTacToeAI) completeMove(letter string, move []int) {
	t.board[move[0]][move[1]] = letter
	t.PrintBoard()
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
