package main

// Improved original JS algo with heuristics from http://www.ntu.edu.sg/home/ehchua/programming/java/JavaGame_TicTacToe_AI.html

import (
	//"fmt"
	"github.com/sqp/godock/libs/log"
	"math"
	"math/rand"
	"time"
)

type TicTacToeAI struct {
	board      [3][3]string
	compLetter string
}

func GetOtherPlayer(currentPlayer string) string {
	if currentPlayer == "X" {
		return "O"
	}
	return "X"
}

func (t *TicTacToeAI) initBoard() {
	t.board = [3][3]string{{"-", "-", "-"}, {"-", "-", "-"}, {"-", "-", "-"}}
}

func (t *TicTacToeAI) evaluate() int {
	score := 0
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
	for _, value := range lines {
		a := t.evaluateLine(value)
		score = score + a
	}
	return score
}

func (t *TicTacToeAI) evaluateLine(line [][2]int) int {
	var score int
	v1 := line[0]
	v2 := line[1]
	v3 := line[2]
	otherPlayer := GetOtherPlayer(t.compLetter)

	// First cell
	if t.board[v1[0]][v1[1]] == t.compLetter {
		score = 1
	} else if t.board[v1[0]][v1[1]] == otherPlayer {
		score = -1
	}

	// Second cell
	if t.board[v2[0]][v2[1]] == t.compLetter {
		if score == 1 {
			score = 10
		} else if score == -1 {
			return 0
		}
	} else if t.board[v2[0]][v2[1]] == otherPlayer {
		if score == -1 {
			score = -10
		} else if score == 1 {
			return 0
		} else {
			score = -1
		}
	}

	// Third cell
	if t.board[v3[0]][v3[1]] == t.compLetter {
		if score > 0 {
			score *= 10
		} else if score < 0 {
			return 0
		} else {
			score = 1
		}
	} else if t.board[v2[0]][v2[1]] == otherPlayer {
		if score < 0 {
			score *= 10
		} else if score > 1 {
			return 0
		} else {
			score = -1
		}
	}
	return score

}

func (t *TicTacToeAI) miniMax(depth int, currentPlayer string) []int {
	var bestScore int
	bestMove := []int{-1, -1}

	if currentPlayer == t.compLetter {
		bestScore = math.MinInt32
	} else {
		bestScore = math.MaxInt32
	}

	currentScore := 0

	moves := t.generateMovesFromBoard()
	if len(moves) == 0 || depth == 0 {
		bestScore = t.evaluate()
	} else {
		for _, v := range moves {
			t.board[v[0]][v[1]] = currentPlayer
			if currentPlayer == t.compLetter {
				currentScore = t.miniMax(depth - 1, GetOtherPlayer(currentPlayer))[0]
				if currentScore > bestScore {
					bestScore = currentScore
					bestMove = v
				}
			} else { // oppSeed is minimizing player
				currentScore = t.miniMax(depth - 1, t.compLetter)[0]
				if currentScore < bestScore {
					bestScore = currentScore
					bestMove = v
				}
			}
			// Undo move
			t.board[v[0]][v[1]] = "-"
		}
	}
	return []int{bestScore, bestMove[0], bestMove[1]}
}

func (t *TicTacToeAI) generateMovesFromBoard() []([]int) {
	emptySlots := make([]([]int), 0)
	b := t.board

	if t.checkForWin() != "" {
		return emptySlots
	}

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
	moves := t.generateMovesFromBoard()
	num := rand.Intn(len(moves))
	return moves[num]
}

func (t *TicTacToeAI) completeMove(letter string, move []int) {
	if move[0] == -1 || move[1] == -1 {
		return
	}
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

		if a != "-" && a == b && a == c {
			winner = a
			//log.Debug("winner:" + a)
			return winner
		}
	}
	if emptySpaces == 0 {
		//log.Debug("winner:draw")
		winner = "draw"
	}
	return winner
}

func (t *TicTacToeAI) PrintBoard() {
	for i := 0; i < 3; i++ {
		a := t.board[i][0]
		b := t.board[i][1]
		c := t.board[i][2]

		log.Debug(a + b + c)
	}
}
