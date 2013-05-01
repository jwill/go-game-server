/*
 Defines the Deck object.
 @author jwill
 */
backImage = new Image()
backImage.onload = function () {
    console.log("loaded");
}
backImage.src = "/public/blackjack/images/45dpi/back.png";

function Deck(numDecks, ctx) {
    if (!(this instanceof arguments.callee)) {
        return new arguments.callee(arguments);
    }
    var cards;
    var self = this;

    self.init = function () {
        self.numDecks = numDecks;
        self.cards = new Array(52 * numDecks);
        self.initCards();
    }

    self.initCards = function () {
        // Initialize the cards 
        var ordinals = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king'];
        var vals = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10]
        var suits = ['club', 'spade', 'heart', 'diamond'];

        // Populate card array
        for (var k = 0; k < numDecks; k++) {
            for (var j = 0; j < suits.length; j++) {
                for (var i = 0; i < ordinals.length; i++) {
                    self.cards[ (i + (j * 13) + (k * 52)) ] = new Card(ordinals[i], vals[i], suits[j]);
                }
            }
        }
    }


    self.lookupCard = function (value) {
        for (var i = 0; i < 52; i++) {
            var card = self.cards[i];
            if (value.suit == card.suit && value.ord == card.ord) {
                return card.clone();
            }
        }
        return null;
    }

    self.toString = function () {
        var c = [];
        for (var i = 0; i < self.cards.length; i++) {
            c.push(self.cards[i].toString());
        }
        return JSON.stringify(c);
    }

    self.init();
}
