var BlackJackGame = function (ws) {
    this.ws = ws;
    this.k = new Kibo();
    this.init();
    this.players = [];
};

/*
 * Game States:
 * START - beginning of round
 * BET   - players place their beginning bets (will skip in beta)
 * DEAL  - deal cards to players
 * PLAY  - players hit/stay/etc
 * EVAL  - evaluate hands
 * DPLAY - play dealer hand
 * END   - end of game 
 */

BlackJackGame.prototype.createCanvas = function () {
    /* Width of sidebar + 5px gap */
    this.gameWidth = window.innerWidth - 305;
    this.gameHeight = window.innerHeight;
    this.canvas = document.querySelector('canvas');
    this.canvas.width = this.gameWidth;
    this.canvas.height = this.gameHeight;
    this.ctx = this.canvas.getContext("2d");
    this.drawBackground(this.ctx, this.gameWidth, this.gameHeight);
};

BlackJackGame.prototype.drawSideCanvas = function (width, height) {
    this.canvasSideBar = document.getElementById('canvasSideBar');
    this.canvasSideBar.width = width;
    this.canvasSideBar.height = height;
    this.sidebarWidth = width;
    this.sidebarHeight = height;
    this.sidebarCtx = this.canvasSideBar.getContext('2d');
    this.drawBackground(this.sidebarCtx, width, height);
};


BlackJackGame.prototype.init = function () {
    //this.playerId = gapi.hangout.getLocalParticipantId();
    this.dealer = new Player();
    this.dealer.isDealer = true;
    this.gameState = 'BET';
    this.dealer.id = 'dealer';
    //this.evaluator = new Evaluator();
    //this.evaluator.setDealer(this.dealer.getCurrentHand());
    this.players = [];
    //this.createCanvas();
    $('#quizbowlArea').get(0).style.display = 'none';
    $('#playingArea').get(0).style.display = 'block';
    $('#board').empty();
    var canvas = document.createElement('canvas');
    this.ctx = canvas.getContext('2d');
    $("#board").get(0).appendChild(canvas);
    this.deck = new Deck(1, this.ctx);

    //this.setupButtons();
    this.updateGameBoard();
    var self = this;
    $().ready(function () {
        self.createCanvas();
    });
};

BlackJackGame.prototype.getContext = function () {
    return this.ctx;
};

BlackJackGame.prototype.getSidebarContext = function () {
    return this.sidebarCtx;
};

//BlackJackGame.prototype.drawVideoFeed = function () {
//    var video = gapi.hangout.layout.getVideoCanvas();
//    video.setPosition(window.innerWidth - video.getWidth(), 0);
//    video.setVisible(true);
//};

BlackJackGame.prototype.drawBackground = function (context, width, height) {
    context.save();
    context.fillStyle = 'green';
    context.strokeStyle = 'black'
    context.lineCap = 'round';
    context.fillRect(0, 0, width, height);
    context.restore();
};

BlackJackGame.prototype.drawStaticAssets = function () {
    // draw game text and player images
    this.ctx.save();
    this.ctx.font = '20px Arial';
    this.ctx.fillStyle = 'black';
    this.ctx.fillText('Dealer', 0, 20);
    this.ctx.restore();
};

BlackJackGame.prototype.setupButtons = function () {
    var self = this;
    var btnDeal = document.querySelector('#btnDeal');
    btnDeal.onclick = function () {
        // TODO Check for proper game state
        if (game.isGameHost()) {
            game.newRound();
            // TODO Remove this later
            game.dealInitialHand();
        }
    }


    var btnStand = document.querySelector('#btnStand');
    btnStand.onclick = function () {
        if (game.checkTurn()) {
            var playerTurn = gapi.hangout.data.getValue('playerTurn');
            player = _.find(game.players, function (p) {
                return p.id == playerTurn
            });
            player.stand();
        }
    }

    var btnHit = document.querySelector('#btnHit');
    btnHit.onclick = function () {
        if (game.checkTurn()) {
            var playerTurn = gapi.hangout.data.getValue('playerTurn');
            player = _.find(game.players, function (p) {
                return p.id == playerTurn
            });
            if (!game.evaluator.isBust(player.getCurrentHand())) {
                player.hit(game.deck.dealCard());
                player.hands[player.currentHand].drawHand(game.getSidebarContext());
            }
        }
    }

    var btnDblDown = document.querySelector('#btnDoubleDown');
    btnDblDown.onclick = function () {
        if (game.checkTurn()) {
            var playerTurn = gapi.hangout.data.getValue('playerTurn');
            player = _.find(game.players, function (p) {
                return p.id == playerTurn
            });
            // If the player hasn't hit yet
            if (player.getCurrentHand().cards.length == 2) {
                player.hit(game.deck.dealCard());
                player.hands[player.currentHand].drawHand(game.getSidebarContext());
                player.stand();
            }
        }
    }
}

BlackJackGame.prototype.adjustControls = function () {
    switch (this.gameState) {
        case 'BET':
            document.querySelector('#btnDeal').style.display = 'none';
            document.querySelector('#btnHit').style.display = 'none';
            document.querySelector('#btnDoubleDown').style.display = 'none';
            document.querySelector('#btnSplit').style.display = 'none';
            document.querySelector('#btnStand').style.display = 'none';

            break;
        case 'DEAL':
            if (this.isGameHost()) {
                document.querySelector('#btnDeal').style.display = '';
            }
            document.querySelector('#btnHit').style.display = 'none';
            document.querySelector('#btnDoubleDown').style.display = 'none';
            document.querySelector('#btnSplit').style.display = 'none';
            document.querySelector('#btnStand').style.display = 'none';
            break;
        case 'PLAY':
            if (this.isGameHost()) {
                document.querySelector('#btnDeal').style.display = 'none';
            }
            document.querySelector('#btnHit').style.display = '';
            document.querySelector('#btnDoubleDown').style.display = '';
            document.querySelector('#btnSplit').style.display = '';
            document.querySelector('#btnStand').style.display = '';
            break;
        case 'DPLAY':
            document.querySelector('#btnHit').style.display = 'none';
            document.querySelector('#btnDoubleDown').style.display = 'none';
            document.querySelector('#btnSplit').style.display = 'none';
            document.querySelector('#btnStand').style.display = 'none';
            break;
        case 'END':
            if (this.isGameHost()) {
                document.querySelector('#btnDeal').style.display = '';
            }
            break;
    }
}

BlackJackGame.prototype.setupKeys = function () {
    this.k.down('h', function () {
        var player;
        if (game.checkTurn()) {
            var playerTurn = gapi.hangout.data.getValue('playerTurn');
            player = _.find(game.players, function (p) {
                return p.id == playerTurn
            });
            if (!game.evaluator.isBust(player.getCurrentHand())) {
                player.hit(game.deck.dealCard());
                player.hands[player.currentHand].drawHand(game.getSidebarContext());
            }
        }
    });

    this.k.down('s', function () {
        var player;
        if (game.checkTurn()) {
            var playerTurn = gapi.hangout.data.getValue('playerTurn');
            player = _.find(game.players, function (p) {
                return p.id == playerTurn
            });
            player.stand();
            player.hands[player.currentHand].drawHand(game.getSidebarContext());
        }
    });

    this.k.down('c', function () {
        game.dealer.hands[0] = new Hand();
        game.drawBackground(this.ctx, this.gameWidth, this.gameHeight);
    });
};

BlackJackGame.prototype.drawPlayerHeader = function (player) {
    var playerSidebarImage = document.querySelector('img');
    playerSidebarImage.src = player.playerImageURL;
    playerSidebarImage.width = 48;

    var playerName = document.querySelector('#name');
    playerName.textContent = player.name;

    var playerScore = document.querySelector('#score');
    playerScore.textContent = '$' + player.tokens;
};

BlackJackGame.prototype.updateGameBoard = function () {
    this.drawBackground(this.ctx, this.gameWidth, this.gameHeight);
    //this.drawBackground(this.getSidebarContext(), this.sidebarWidth, this.sidebarHeight);
    //this.drawVideoFeed();
    //this.adjustControls();
    // Draw the dealer
    if ((this.gameState == 'BET') || (this.gameState == 'DEAL') || (this.gameState == 'PLAY'))
        this.dealer.getCurrentHand().drawDealerHand(this.getContext());
    else this.dealer.getCurrentHand().drawHand(this.getContext());

    // Draw the player panel
    // TODO Allow drawing other players and storing the current viewed player
    var self = this;
    var currentPlayer = _.find(this.players, function (p) {
        return p.id === self.playerId
    });
    if (currentPlayer != undefined) {
        this.drawPlayerHeader(currentPlayer);

        _.each(currentPlayer.hands, function (hand) {
            hand.drawHand(self.getSidebarContext());
        });

    }
    //this.adjustControls();
    // Draw the static assets

};

BlackJackGame.prototype.newRound = function () {
    var updates = {};
    updates['gameState'] = 'DEAL';
    this.players = this.loadPlayerData();
    _.each(this.players, function (player) {
        player.clearCards();
        updates[player.id] = player.toString();
    });

    this.dealer.clearCards();
    updates['dealer'] = this.dealer.toString();
    this.evaluator.setDealer(this.dealer.getCurrentHand());

    game.updateGameBoard();
    //gapi.hangout.data.submitDelta(updates);
}

BlackJackGame.prototype.createTurnIndicator = function () {
    var url = "/public/blackjack/images/button.png";
    var temp = gapi.hangout.av.effects.createImageResource(url);
    this.overlay = temp.createOverlay({
        position: {x: -0.35, y: 0.25},
        scale: {
            magnitude: 0.25, reference: gapi.hangout.av.effects.ScaleReference.WIDTH
        }});
};

BlackJackGame.prototype.findPlayerById = function (id) {
    for (var i = 0; i < game.players.length; i++) {
        var player = game.players[i];
        if (player.id == id) return player;
    }
    return null;
}

BlackJackGame.prototype.loadState = function (text) {
    var playerData = JSON.parse(text);
    if (playerData != null) {
    var handsData = JSON.parse(playerData.hands);
    var hands = [];
    // Parse cards/hands
    _.each(handsData, function (hand) {
        var h = new Hand();
        _.each(hand, function (cardValue) {
            var card = game.deck.lookupCard(JSON.parse(cardValue));
            h.addToHand(card);
        });
        hands.push(h);
    });
    }
    return hands;
};

BlackJackGame.prototype.handleMessage = function (msg) {
    switch (msg.Operation) {
        case 'BlackJackGameState':

            break;
        default:
            break;
    }
}

BlackJackGame.prototype.calculateHandPositions = function () {

}

BlackJackGame.prototype.stateUpdated = function (evt) {
    var gameHost = game.getGameHost();
    var currentPlayer = gapi.hangout.getLocalParticipantId();
    if (game.isGameHost()) {
        // Only run on host
        // Manage game state and evaluators
        game.gameState = evt.state.gameState;
        if (game.gameState != undefined) {
            if (game.gameState.substr(0, 5) == "DPLAY") {
                game.gameState = 'DPLAY';
                console.log('DPLAY');
                //try {
                game.playDealerHand();
            } else if (game.gameState == 'EVAL') {
                // Evaluate game hands and do payouts
                var hand = game.loadState('dealer')[0];
                var handStatus = game.evaluator.evaluate(hand);
                game.evaluateHands(handStatus);
            } else {
                game.players = game.loadPlayerData();
                game.updateGameBoard();
            }
        }
    } else {
        game.players = game.loadPlayerData();
        game.updateGameBoard();

    }
}

BlackJackGame.prototype.standUp = function () {
    var message = {
        Operation: "StandUp",
        RoomId: app.roomID,
        Sender: app.playerId,
        Message: ""
    }
    app.ws.send(JSON.stringify(message));
}

BlackJackGame.prototype.sitDown = function (pos) {
    var message = {
        Operation: "SitDown",
        RoomId: app.roomID,
        Sender: app.playerId,
        Message: "" + pos
    }
    app.ws.send(JSON.stringify(message));
}

BlackJackGame.prototype.bet = function (amount) {
    var message = {
        Operation: "Bet",
        RoomId: app.roomID,
        Sender: app.playerId,
        Message: "" + amount
    }
    app.ws.send(JSON.stringify(message));
}

window.BlackJackGame = BlackJackGame;


/*
 Quizbowl.prototype.sendAnswer = function (questionId, answerId) {
 var answer = {
 RoomId: app.roomId,
 QuestionId: questionId,
 AnswerId: answerId
 }

 var data = {
 Operation: 'SendAnswer',
 RoomId: "QuizBowl",
 Sender: app.playerId,
 MessageMap: JSON.stringify(answer)
 }
 app.ws.send(JSON.stringify(data));
 app.currentGame.clearAnswers();
 }
 */