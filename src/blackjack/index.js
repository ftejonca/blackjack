import _ from "underscore";
// (function() {
    // self-invoked anonymous function
// })();

const blackJackModule = (() => {   //self-invoked anonymous function, this one is used for module pattern
    'use strict'       // enables strict evaluation of the code    
    
    let deck = [];
    const types = ['C', 'D', 'H', 'S'], //Clubs, Diamonds, Hearts, Spades
          figures = ['A', 'J', 'Q', 'K']; // Ace, Jack, Queen, King
    
    let points = [];
    
    // HTML references
    const btnRequest = document.querySelector('#btnRequest'),
            btnNew = document.querySelector('#btnNew'),
            btnStop = document.querySelector('#btnStop');
    
    const divPlayersCards = document.querySelectorAll('.cardsDiv'),
            htmlPoints = document.querySelectorAll('small');
    
    
    // Function to start the game
    const startGame = (numPlayers = 2) => {
        deck = createDeck();
        
        points = [];
        for(let i = 0; i < numPlayers; i++){
            points.push(0);
        }
        
        htmlPoints.forEach(elem => elem.innerText = 0);
        divPlayersCards.forEach(elem => elem.innerHTML = '');
        
        btnRequest.disabled = false;
        btnStop.disabled = false;
    }
    
    // Function to create an untidy new deck
    const createDeck = () => {
        
        deck =[];
        
        for( let i = 2; i <= 10; i++) {
            for( let type of types ) {
                deck.push( i + type);
            }
        }
        
        for( let type of types){
            for(let figure of figures){
                deck.push(figure + type);
            }
        }
        return _.shuffle(deck);  // Underscore function returning a randomly ordered array
    }
    
    // Function to take one random card
    const requestCard = () => {
        
        if (deck.length === 0){
            throw 'There are no cards in the deck'
        }
        
        return deck.shift();
    }
    
    
    const cardValue = (card) => {
        
        const value = card.substring(0, card.length - 1);
        return (isNaN(value)) ?
                (value === 'A') ? 11 : 10
            : parseInt(value);
        
         // let scores = 0;
         // if( isNaN(value)){
         //     console.log('It is not a number');
         //     scores = ( value === 'A') ? 11 : 10;
         // } else{
         //     console.log('It is a number');
         //     scores = parseInt(value);
         // }
         // console.log(scores);
    }
    // turn: 0 first player, last player is the croupier
    const accumulatePoints = (card, turn) => {
        points[turn] = points[turn] + cardValue(card);
        htmlPoints[turn].innerText = points[turn];
        return points[turn];
    }
    
    const createCard = (card, turn) => {
        const cardImg = document.createElement('img');
        cardImg.src = `assets/cards/${card}.png`;
        cardImg.classList.add('card');  // cardImg.className = 'card'; one possible way to do it
        divPlayersCards[turn].append(cardImg); // Inster the created card in the HTML

    }
    
    const whoWins = () => {
        
        const[minimumPoints, croupierPoints] = points;
        
        setTimeout(() => {
            if(croupierPoints === minimumPoints) {
                alert('It`s a draw!');
            } else if (minimumPoints > 21){
                alert('Croupier wins');
            } else if (croupierPoints > 21){
                alert('You win');
            } else if (minimumPoints === 21){
                alert('21 points! Amazing! You win!');
            } else {
                alert('Croupier wins');
            }
            }, 100);
    }
    
     // Croupier's turn
    const croupierTurn = (minimumPoints) => {
        
        let croupierPoints = 0;
        
        do {
            const card = requestCard();
            croupierPoints = accumulatePoints(card, points.length - 1);
            createCard(card, points.length - 1);
            
        } while((croupierPoints < minimumPoints) && (minimumPoints < 21));
        
        whoWins();
    }
    
    
    // Events
    btnRequest.addEventListener('click', () => {
        
        const card = requestCard();
        const playerPoints = accumulatePoints(card, 0);
        
        createCard(card, 0);
        
        if (playerPoints > 21){
            console.warn('Sorry, but you have lost the game');
            btnRequest.disabled = true;
            btnStop.disabled = true;
            croupierTurn(playerPoints);
            
        } else if (playerPoints === 21) {
            console.warn('21 points!! Amazing!');
            btnRequest.disabled = true;
            btnStop.disabled = true;
            croupierTurn(playerPoints);
        }
    })
    
    btnStop.addEventListener('click', () =>{
        btnRequest.disabled = true;
        btnStop.disabled = true;
        croupierTurn(points[0]);
    })
    
    btnNew.addEventListener('click', () =>{
        startGame();
        console.clear();
    })
    
    return {
        newGame: startGame
    };
    
})();




