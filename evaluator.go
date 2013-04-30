package main

import "math"

type Evaluator struct {
	dealerHand *Hand
}

func (eval *Evaluator) isBust(hand *Hand) bool {
	x := eval.getHandTotals(hand)
	for _, i := range x {
		if i > 21 {
			return true
		}
	}
	return false
}

func (eval *Evaluator) getMaxHandTotal(hand *Hand) int {
	x := eval.getHandTotals(hand)
	if len(x) == 2 {
		return int(math.Max(float64(x[0]), float64(x[1])))
	}
	return x[0]
}

func (eval *Evaluator) getHandTotals(hand *Hand) []int {
	totals := make([]int, 0)
	lowValue := 0
	for _, c := range hand.cards {
		lowValue += c.val
	}
	totals = append(totals, lowValue)
	if hand.hasAce() == true {
		newValue := lowValue + 10
		if newValue <= 21 {
			totals = append(totals, newValue)
		}
	}
	return totals
}

func (h *Hand) hasAce() bool {
	for _, c := range h.cards {
		if c.ord == "1" {
			return true
		}
	}
	return false
}

type EvaluatorResult struct {
	HandTotals []int
	MaxTotal int
	IsBust bool
}

func (eval *Evaluator) evaluate(hand *Hand)*EvaluatorResult {
   result := &EvaluatorResult{}
	result.HandTotals = eval.getHandTotals(hand)
	result.MaxTotal = eval.getMaxHandTotal(hand)
	result.IsBust = eval.isBust(hand)
	return result
}
