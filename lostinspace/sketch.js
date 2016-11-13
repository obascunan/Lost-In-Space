/***********************************
 * 
 *    Creation and Computation Experiment 3 
 * 
 *    Ania Medrek & Orlando Bascunan
 * 
 *    Client Sketch
 * 
 * 
 *    November 2016
 * 
 */ //////////////////////////////////

// Server Variables
var myUserID;
var dataServer;
var channelName = "whoisnt";
var username = '';


// Round Variables
var round0 = [0, 1, 2, 3];
var round1 = [4, 3, 0, 1];
var round2 = [2, 7, 3, 6];
var round3 = [5, 1, 4, 0];
var round4 = [2, 6, 3, 7];

var cardsToDraw = [round0, round1, round2, round3, round4, round2, round4, round1, round0, round3];
var playerNames = ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-'];

var answers = [2, 4, 3, 4, 6, 3, 6, 4, 2, 4];

var roundOrder = [0, 1, 2, 3, 4, 2, 4, 1, 0, 3];
var scoreboard = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var currentRound = 0;


var readyScreen = true;
var canAnswer = false;
var xSpacing = 250;

var gameEnded = false;

var answerImg;
var answerPos;

// Function to position cards in screen
function drawImage(Card, Position) {
  image(Card, (Position - 2) * xSpacing + windowWidth / 2, 200, 203, 352);
}

//When it starts connect to the server
function setup() {

  createCanvas(windowWidth, windowHeight);
  connectToServer();
  username = getName();
  dataServer.publish({
    channel: channelName,
    message: {
      userID: myUserID,
      userName: username,
      msgType: "join"
    }
  });

}

// Preloading all images
function preload() {
  cardsImages = [loadImage("images/Card00.png"), loadImage("images/Card01.png"), loadImage("images/Card02.png"), loadImage("images/Card03.png"), loadImage("images/Card04.png"), loadImage("images/Card05.png"), loadImage("images/Card06.png"), loadImage("images/Card07.png")];

  cardRight = loadImage("images/Right.png");
  cardWrong = loadImage("images/Wrong.png");
  introPage = loadImage("images/IntroPage.png");
  waitingPage = loadImage("images/GetReady.png");
  gamebg = loadImage("images/Gamebackground.png");
  scoreboard = loadImage("images/Scoreboard.png");
}


function draw() {
  background(255);

  // If the game ended show the scoreboard
  if (gameEnded) {
    drawResults();
  } else {
    // If not, it could be waiting for users or playing
    if (readyScreen) {
      // Waiting for the game to start
      image(waitingPage, windowWidth / 2 - 400, 100, 500, 500);
      drawScoreBoard();
    } else {
      // Playing the game
      image(gamebg, 0, 0, windowWidth, windowHeight);

      var thisRoundCards = cardsToDraw[currentRound];
      for (var i = 0; i < 4; i++) {
        drawImage(cardsImages[thisRoundCards[i]], i);
      }

      if (answerPos > -1) {
        drawImage(answerImg, answerPos);
      }

    }
  }
}

// Drawing the scores 
function drawResults() {
  image(scoreboard, windowWidth / 2 -200, 100, 650, 500);

  for (var i = 0; i < playerNames.length; i++) {
    text(scoreboard[i], windowWidth / 2 - 30, 200 + i * 30);
    text(playerNames[i], windowWidth / 2, 200 + i * 30);
  }
}

//Mouse released checks for what card was pressed and sends it to the server.
function mouseReleased() {
  if (canAnswer) {
    if (mouseY > 100 && mouseY < 600) {
      var position = floor((mouseX - windowWidth / 2) / xSpacing + 2);

      if (position > 3) {
        return;
      }

      dataServer.publish({
        channel: channelName,
        message: {
          userID: myUserID,
          userName: username,
          choosen: position,
          msgType: "pick"
        }
      });

      var thisRoundValues = cardsToDraw[currentRound];
      if (thisRoundValues[position] == answers[currentRound]) {
        console.log("Right");
        answerImg = cardRight;
        answerPos = position;
      } else {
        console.log("Wrong");
        answerImg = cardWrong;
        answerPos = position;
      }
      console.log("position : " + position);
      // comment for debugging      
      canAnswer = false;

    } else {
      console.log("outside Y");

    }
  }
}

function connectToServer() {
  dataServer = PUBNUB.init({
    publish_key: 'pub-c-485812ca-4ddd-4016-82f8-b26c837a753f', //get these from the pubnub account online
    subscribe_key: 'sub-c-ec4d4828-a4f5-11e6-9ec8-02ee2ddab7fe',
    uuid: myUserID,
    ssl: true //enables a secure connection. This option has to be used if using the OCAD webspace
  });

  dataServer.subscribe( //start listening to a specific channel
    {
      channel: channelName, //this uses our variable to listen to the correct channel
      message: readIncoming //the value here must match up with the name of the function that handles the incoming data
    });

  myUserID = PUBNUB.uuid(); //get my unique userID from pubnub
}


// Reads incoming messages and filters them by type
function readIncoming(message) {
  switch (message.msgType) {
    case 'start':
      readyScreen = false;
      currentRound = message.thisRound;
      canAnswer = true;
      answerPos = -1;
      break;
    case 'nextRound':
      currentRound = message.thisRound;
      canAnswer = true;
      answerPos = -1;
      break;
    case 'gameover':
      gameEnded = true;
      break;
    case 'scoreboard':
      scoreBoard(message);
      break;

  }
  if (message.msgType == 'server') {
    //get new cards to display
    // message.card0, message.card1, message.card2, message.card3, message.card4
    //
    console.log("readingMessage");
    console.log(message.thisRound);

  }
}

function drawScoreBoard() {
  for (var i = 0; i < playerNames.length; i++) {
    text(playerNames[i], windowWidth / 2, 200 + i * 30);
  }
}

function scoreBoard(message) {
  console.log('got the scoreboard');
  playerNames[0] = message.user00;
  playerNames[1] = message.user01;
  playerNames[2] = message.user02;
  playerNames[3] = message.user03;
  playerNames[4] = message.user04;
  playerNames[5] = message.user05;
  playerNames[6] = message.user06;
  playerNames[7] = message.user07;
  playerNames[8] = message.user08;
  playerNames[9] = message.user09;
  scoreboard[0] = message.score00;
  scoreboard[1] = message.score01;
  scoreboard[2] = message.score02;
  scoreboard[3] = message.score03;
  scoreboard[4] = message.score04;
  scoreboard[5] = message.score05;
  scoreboard[6] = message.score06;
  scoreboard[7] = message.score07;
  scoreboard[8] = message.score08;
  scoreboard[9] = message.score09;

}

// getName gets the username from the querystring
function getName() {
  name = "username";
  url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}