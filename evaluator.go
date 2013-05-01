package main

import "math"

type Evaluator struct {
	dealerHand *Hand
}

func (eval *Evaluator) IsBust(hand *Hand) bool {
	x := eval.GetHandTotals(hand)
	for _, i := range x {
		if i > 21 {
			return true
		}
	}
	return false
}

func (eval *Evaluator) GetMaxHandTotal(hand *Hand) int {
	x := eval.GetHandTotals(hand)
	if len(x) == 2 {
		return int(math.Max(float64(x[0]), float64(x[1])))
	}
	return x[0]
}

func (eval *Evaluator) GetHandTotals(hand *Hand) []int {
	totals := make([]int, 0)
	lowValue := 0
	for _, c := range hand.Cards {
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
	for _, c := range h.Cards {
		if c.ord == "1" {
			return true
		}
	}
	return false
}

type EvaluatorResult struct {
	HandTotals []int
	MaxTotal   int
	IsBust     bool
}

func (eval *Evaluator) Evaluate(hand *Hand) *EvaluatorResult {
	result := new(EvaluatorResult)
	result.HandTotals = eval.GetHandTotals(hand)
	result.MaxTotal = eval.GetMaxHandTotal(hand)
	result.IsBust = eval.IsBust(hand)
	return result
}
