package main

import "math"

type Evaluator struct {
	dealerHand *Hand
}

func (eval *Evaluator) getDealerUpCard()*Card {
	return eval.dealerHand.GetLastCard()
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
	if hand.HasAce() == true {
		newValue := lowValue + 10
		if newValue <= 21 {
			totals = append(totals, newValue)
		}
	}
	return totals
}

func (h *Hand) HasAce() bool {
	for _, c := range h.Cards {
		if c.ord == "1" {
			return true
		}
	}
	return false
}

func (eval *Evaluator)isHardTotal(h *Hand)bool {
	return h.HasAce()
}

func (eval *Evaluator)evalDealerUpCard(nums []int) bool{
	upCard := eval.dealerHand.GetLastCard()
	for _, v := range nums {
		if v == upCard.val {
			return true
		}
	}
	return false
}

func (eval *Evaluator)shouldHit(h *Hand) bool {
	totals := eval.GetHandTotals(h)
	hasAce := h.HasAce()
	if hasAce {
	   if (totals[1] == 18 && eval.evalDealerUpCard([]int{1,9,10})){
		   return true
	   } else if (totals[1] == 17 && eval.evalDealerUpCard([]int{2,7,8,9,10,1})){
		  return true
	   } else if ((totals[1] == 15 || totals[1] == 16) && eval.evalDealerUpCard([]int{2,3,7,8,9,10,1})){
		  return true
	   } else if ((totals[1] == 13 || totals[1] == 14) && eval.evalDealerUpCard([]int{2,3,4,7,8,9,10,1})){
		   return true
	   }
	} else {
	   if ((totals[0] <= 16 && totals[0] >= 12) || (totals[0] == 9)) && eval.evalDealerUpCard([]int{1,7,8,9,10}) {
		  return true
	   } else if totals[0] == 12 && eval.evalDealerUpCard([]int{2,3}) {
		   return true
	   } else if totals[0] == 11 && eval.evalDealerUpCard([]int{1}) {
		   return true
	   } else if totals[0] == 10 && eval.evalDealerUpCard([]int{1,10}) {
		   return true
	   } else if totals[0] == 9 && eval.evalDealerUpCard([]int{2}) {
		   return true
	   } else if totals[0] >= 5 && totals[0] <= 8 {
		   return true
	   }
	}
	return false
}

func (eval *Evaluator) shouldStay(h *Hand) bool {
	totals := eval.GetHandTotals(h)
	isHard := eval.isHardTotal(h)
	if isHard {
	   if totals[0] >= 17 && totals[0] <= 20 {
		   return true
	   } else if totals[0] >= 13 && totals[0] <= 16 && eval.evalDealerUpCard([]int{2,3,4,5,6}) {
		   return true
	   } else if totals[0] == 12 && eval.evalDealerUpCard([]int{4,5,6}) {
		   return true
	   }
	} else {
		if (totals[1] == 19 || totals[1] == 20) {
			return true
		} else if totals[1] == 18 && eval.evalDealerUpCard([]int{2,7,8}) {
			return true
		}
	}
	return false
}

func (eval *Evaluator) DealerEvaluate(d *Deck) {
	handTotals := eval.GetHandTotals(eval.dealerHand)
	var lt17 bool
	var is21 bool
	for _, v := range handTotals {
		if v < 17 {
			lt17 = true
		}
		if v == 21 {
			is21 = true
		}
	}
	if is21 {
		return
	}
	if lt17 {
		eval.dealerHand.Cards = append(eval.dealerHand.Cards, d.DealCard())
		eval.DealerEvaluate(d)
	} else {
		return
	}

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
