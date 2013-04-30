package main

import (
	//"fmt"
	"strings"
	"time"
	"math/rand"
)

type Card struct {
	meta map[string]string
	ord  string
	val  int
	suit string
}

func (c *Card) Clone() *Card {
	d := &Card{meta:c.meta, ord:c.ord, val:c.val, suit:c.suit}
	return d
}

func (c *Card) String() string {
	return c.ord + "-" + c.suit
}

func (c *Card) ShallowEquals(d *Card) bool {
	if c.ord == d.ord && c.suit == d.suit {
		return true
	}
	return false
}

func (c *Card) Equals(d *Card) bool {
	if c.ord == d.ord && c.suit == d.suit {
		return true
	}
	return false
}

type Hand struct {
	cards []*Card
}

type Deck struct {
	numDecks int
	cards    []*Card
	sortedCards []*Card

}

func NewDeck(num int) *Deck {
	d := &Deck{numDecks: num}
	d.cards = make([]*Card, 0)
	d.initCards()
	return d
}

func (d *Deck) String() string {
	vals := make([]string, 0)
	for _, c := range d.cards {
		vals = append(vals, c.String())
	}
	return "["+ strings.Join(vals, " ")+"]"
}

func (d *Deck) initCards() {
	ordinals := []string{"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king"}
	vals := []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10}
	suits := []string{"club", "spade", "heart", "diamond"}

	// Populate card array
	for i := 0; i < d.numDecks; i++ {
		for _, suit := range suits {
			for j, ordinal := range ordinals{
				d.sortedCards = append(d.sortedCards, &Card{ord:ordinal, val:vals[j], suit:suit})
			}
		}
	}
	d.reshuffleDecks()
}

func (d *Deck) swap(a int, b int) {
	temp := d.cards[b]
	d.cards[b] = d.cards[a]
	d.cards[a] = temp
}

func (d *Deck) ShuffleDecks() {
	rand.Seed( time.Now().UTC().UnixNano())

	for i:=0; i<d.numDecks; i++ {
		for j:= d.numDecks*51; j>0; j-- {
			var r = rand.Intn(j)
			d.swap(j,r)
		}
	}
}

func (d *Deck) DealCards(num int)[]*Card {
	var cards = make([]*Card, 0)
	for i:=0; i<num; i++ {
		cards = append(cards, d.DealCard())
	}
	return cards
}

func (d *Deck) DealCard()*Card {
	if (len(d.cards) > 0) {
	   card := d.cards[0:1]
	   d.cards = d.cards[1:]
	   return card[0]
	} else {
		d.reshuffleDecks()
		return d.DealCard()
	}
	return nil
}

func (d *Deck) reshuffleDecks() {
	d.cards = make([]*Card, 52*d.numDecks)
    copy(d.cards, d.sortedCards)
   d.ShuffleDecks()
}

/*
 console.log('reshuffling decks...');
      var numDecks = JSON.parse(gapi.hangout.data.getValue('numDecks'));
      var deckData = JSON.parse(game.deck.toString());
      var newCards = [];

      _.times(numDecks, function() {
        _.each(deckData, function(c) {
          newCards.push(c);
        });
        newCards = _.shuffle(newCards);
      });
      var cardValue = JSON.parse(newCards.pop());
      var card = self.lookupCard(cardValue);
      gapi.hangout.data.setValue('deck', JSON.stringify(newCards));
      return [card,newCards];

 */
