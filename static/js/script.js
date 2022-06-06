// add action listener for all the buttons
document.querySelector('#Hit-button').addEventListener('click', hitButtonClicked);
document.querySelector('#Stand-button').addEventListener('click', standButtonClicked);
document.querySelector('#Deal-button').addEventListener('click', dealButtonClicked);




/////////////////// Hit Button ///////////////////////
let blckJackGame = {
    'you' : { 'scoreSpan' : '#your-result-id', 'div' : '#your-div-id', 'score' : 0},
    'dealer' : { 'scoreSpan' : '#dealer-result-id', 'div' : '#dealer-div-id', 'score' : 0},
    'cards' : ['2','3','4','5','6','7','8','9','10','K','J','Q','A'],
    'cardsMap' : {'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'K':10,'J':10,'Q':10,'A':[1,11]},
    'win' : 0,
    'loss' : 0,
    'draw' : 0,
    'isStand' : false, // stand button is active/done or not
    'turnsOver' : false // hit and stand button done completely
};

const YOU = blckJackGame['you']
const DEALER = blckJackGame['dealer']
// sounds for pressing the hit button
// sounds after winning and lossing the game
const hitSound = new Audio('static/sounds/swish.m4a');
const winSound = new Audio('static/sounds/cash.mp3');
const lossSound = new Audio('static/sounds/aww.mp3');


function hitButtonClicked(){
    // if the Stand button is not activated, the Hit button will work
    if(blckJackGame['isStand']===false){
        let card = randomCardGenerator();
        showCard(card, YOU);
        updateScores(card, YOU);
        showScoreFrontEnd(YOU);
    }
}

function randomCardGenerator(){
    let ranCard = Math.floor(Math.random()*13);
    return blckJackGame['cards'][ranCard];
}

function showCard(card, activePlayer){
    if(activePlayer['score'] <=21){
        let imageHit = document.createElement('img');
        imageHit.src = `static/images/${card}.png`;
        document.querySelector(activePlayer['div']).appendChild(imageHit);
        hitSound.play();
    }
}

function updateScores(card, activePlayer){
    // if adding 11 keeps me below 21 then add 11, otherwise add 1 for the Ace Card
    if(card==='A'){
        if(activePlayer['score'] + blckJackGame['cardsMap'][card][1] <= 21){
            activePlayer['score'] += blckJackGame['cardsMap'][card][1];
        }
        else{
            activePlayer['score'] += blckJackGame['cardsMap'][card][0];
        }
    }
    else{
        activePlayer['score'] += blckJackGame['cardsMap'][card];
    }
}

function showScoreFrontEnd(activePlayer){
    if(activePlayer['score'] <=21){
        document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    }
    else{
        document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST!';
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
    }
}


/////////////////// Stand Button ///////////////////////
function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}
// stand button
async function standButtonClicked(){
    blckJackGame['isStand']= true;
    while(DEALER['score'] < 16 && blckJackGame['isStand'] === true){
        let card = randomCardGenerator();
        showCard(card, DEALER);
        updateScores(card, DEALER);
        showScoreFrontEnd(DEALER);
        await sleep(1000);
    }

    blckJackGame['turnsOver'] = true;
    dealerAutoStop = computeWinner();
    showResultMessage(dealerAutoStop);
};

function computeWinner(){
    let winner;
    // if your score is less than 21
    if(YOU['score'] <= 21){
        // your score is more than dealer score or dealer score is more than 21
        if(YOU['score'] > DEALER['score'] || DEALER['score'] > 21){
            winner = YOU;
            blckJackGame['win']++;
        }
        // if delaer score is more than your's
        else if (YOU['score'] < DEALER['score']){
            winner = DEALER;
            blckJackGame['loss']++;
        }
        // if delaer score is equal to your's
        else if (YOU['score'] === DEALER['score']){
            blckJackGame['draw']++;
        }
    }
    else if(YOU['score'] > 21 && DEALER['score'] <= 21){
        winner = DEALER;
        blckJackGame['loss']++;
    }
    else if(YOU['score'] > 21 && DEALER['score'] > 21){
        blckJackGame['draw']++;
    }
    return winner;
}

function showResultMessage(winner){
    let message, messageColor;
    if(blckJackGame['turnsOver']===true){
        if(winner===YOU){
            message = 'You Won!';
            messageColor = 'green';
            winSound.play();
            document.querySelector('#win').textContent =  blckJackGame['win'];
        } else if(winner===DEALER){
            message = 'You Lost!';
            messageColor = 'red';
            lossSound.play();
            document.querySelector('#loss').textContent =  blckJackGame['loss'];
        }else{
            message = 'You Drew!';
            messageColor = 'black';
            document.querySelector('#draw').textContent =  blckJackGame['draw'];
        }
    
        document.querySelector('#blackjack-result-id').textContent = message;
        document.querySelector('#blackjack-result-id').style.color = messageColor;
    }
}



/////////////////// Deal Button ///////////////////////
// deal button will remove all the cards from both your and dealer div
function dealButtonClicked() {
    if(blckJackGame['turnsOver']===true){
        // make the upper message as default and change the color as black
        document.querySelector('#blackjack-result-id').textContent = "Let's Play!";
        document.querySelector('#blackjack-result-id').style.color = "black";

        // remove all the cards from user div
        let allImagesYourDiv = document.querySelector('#your-div-id').querySelectorAll('img');
        for(let i = 0; i <allImagesYourDiv.length; i++){
            allImagesYourDiv[i].remove();
        }
        YOU['score'] = 0; // make score 0
        document.querySelector('#your-result-id').textContent = 0; // make score 0 for frontend
        document.querySelector('#your-result-id').style.color = 'white'; // color white

        // remove all the cards from dealer div
        let allImagesDealerDiv = document.querySelector('#dealer-div-id').querySelectorAll('img');
        for(let i = 0; i <allImagesDealerDiv.length; i++){
            allImagesDealerDiv[i].remove();
        }
        DEALER['score'] = 0; // make score 0
        document.querySelector('#dealer-result-id').textContent = 0; // make score 0 for frontend
        document.querySelector('#dealer-result-id').style.color = 'white'; // color white

        // make values as default
        blckJackGame['isStand']= false;
        blckJackGame['turnsOver']= false;
//  
    }
  
};



