/***********************************
 * 
 *    Creation and Computation Experiment 3 
 * 
 *    Ania Medrek & Orlando Bascunan
 * 
 *    Server Sketch
 * 
 * 
 *    November 2016
 * 
 */ //////////////////////////////////

var round0 = [0, 1, 2, 3];
var round1 = [4, 3, 0, 1];
var round2 = [2, 7, 3, 6];
var round3 = [5, 1, 4, 0];
var round4 = [2, 6, 3, 7];

var cardsToDraw = [round0, round1, round2, round3, round4, round2, round4, round1, round0, round3];

var answers = [2, 4, 3, 4, 6, 3, 6, 4, 2, 4];
var roundFlags = [0, 1, 2, 3, 4, 2, 4, 1, 0, 3];

var roundOrder = [0, 1, 2, 3, 4, 2, 4, 1, 0, 3];

var currentRound = 0;

var channelName = "whoisnt";
var myUserID;
var playersJoined = 0;
var playerNames = ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-'];

var pointsForAnswering = 15;
var scores;
var scoreboard = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
//var scoreboard = [6, 5, 3, 2, 1, 67, 50, 68, 68, 0];
//var playerNames = ['seis', 'cinco', 'tres', 'dos', 'uno', 'seissiete', 'cincuenta', 'sesocho', 'sesosho', 'cero'];

var gameStart = false;
var gameEnded = false;
var timePerRound = 5;
var serverClock;

var serial;

function setup() {
  createCanvas(600, 600);
  startServer();
  serverClock = new Date().getTime();
  orderPoints();

  serial = new p5.SerialPort(); //create the serial port object
  serial.open("COM9"); //open the serialport. determined 
  serial.on('open', ardCon); //open the socket connection and execute the ardCon callback

}

function draw() {
  background(255);
  if (gameEnded) {
    drawResults();
  }
  if (gameStart && !gameEnded) {
    text('Round ' + currentRound + ', Time ' + countDown(), 100, 100);

  } else {
    text('Click to start the game.', 100, 100);
  }
}

function drawResults() {
  for (var i = 0; i < playerNames.length; i++) {
    text(scoreboard[i], windowWidth / 2 - 30, 200 + i * 30);
    text(playerNames[i], windowWidth / 2, 200 + i * 30);
  }
}

function ardCon() {
  console.log("connected to the arduino");
  serial.write(6);
}

function countDown() {
  var roundCountdown = 1 + floor((serverClock / 1000 + timePerRound - new Date().getTime() / 1000) % timePerRound);
  if (roundCountdown < 0) {
    newRound();
    roundCountdown = 1 + floor((serverClock / 1000 + timePerRound - new Date().getTime() / 1000) % timePerRound);
  }

  return roundCountdown;
}

function mousePressed() {
  if (gameStart) {
    //newRound();
  } else {
    startGame();
  }
}

// For debugging purposes, press a key and move a servo.
function keyPressed() {
  if (key == 0) {
    serial.write(0);
  }
  if (key == 1) {
    serial.write(1);
  }
  if (key == 2) {
    serial.write(2);
  }
  if (key == 3) {
    serial.write(3);
  }
  if (key == 4) {
    serial.write(4);
  }
  if (key == 5) {
    serial.write(5);
  }
  if (key == 6) {
    serial.write(6);
  }
}

function newRound() {
  currentRound++;

  if (currentRound < roundOrder.length) {
    pointsForAnswering = 15;
    startTime();
    serial.write(roundFlags[currentRound]);
  } else {
    //finish the game
    console.log("game is over");
    gameOver();

  }

}

function gameOver() {
  console.log('game over sent');
  gameEnded = true;
  dataServer.publish({
    channel: channelName,
    message: {
      msgType: "gameover"

    }
  });
}

function startGame() {
  serverClock = new Date().getTime();
  gameStart = true;

  dataServer.publish({
    channel: channelName,
    message: {
      thisRound: currentRound,
      thisTime: serverClock,
      msgType: "start"

    }
  });
  serial.write(roundFlags[currentRound]);
}

function startTime() {
  serverClock = new Date().getTime();
  dataServer.publish({
    channel: channelName,
    message: {
      userID: myUserID,
      thisRound: currentRound,
      timeStart: 1000,
      user00: playerNames[0],
      user01: playerNames[1],
      user02: playerNames[2],
      user03: playerNames[3],
      user04: playerNames[4],
      user05: playerNames[5],
      user06: playerNames[6],
      user07: playerNames[7],
      user08: playerNames[8],
      user09: playerNames[9],
      msgType: "start"

    }
  });

}

function orderPoints() {
  scores = [{
      name: playerNames[0],
      value: scoreboard[0]
    }, {
      name: playerNames[1],
      value: scoreboard[1]
    }, {
      name: playerNames[2],
      value: scoreboard[2]
    }, {
      name: playerNames[3],
      value: scoreboard[3]
    }, {
      name: playerNames[4],
      value: scoreboard[4]
    }, {
      name: playerNames[5],
      value: scoreboard[5]
    }, {
      name: playerNames[6],
      value: scoreboard[6]
    }, {
      name: playerNames[7],
      value: scoreboard[7]
    }, {
      name: playerNames[8],
      value: scoreboard[8]
    }, {
      name: playerNames[9],
      value: scoreboard[9]
    }

  ];
  scores.sort(function(a, b) {
    if (a.value < b.value) {
      return 1;
    }
    if (a.value > b.value) {
      return -1;
    }
    return 0;
  });

  for (var i = 0; i < playerNames.length; i++) {
    playerNames[i] = scores[i].name;
    scoreboard[i] = scores[i].value;
  }
}

function startServer() {
  dataServer = PUBNUB.init({
    publish_key: 'pub-c-485812ca-4ddd-4016-82f8-b26c837a753f', //get these from the pubnub account online
    subscribe_key: 'sub-c-ec4d4828-a4f5-11e6-9ec8-02ee2ddab7fe',
    uuid: myUserID,
    ssl: true //enables a secure connection. This option has to be used if using the OCAD webspace
  });

  dataServer.subscribe( //start listening to a specific channel
    {
      channel: channelName, //this uses our variable to listen to the correct channel
      message: receiveAnswers //the value here must match up with the name of the function that handles the incoming data
    });
}

function receiveAnswers(message) {
  switch (message.msgType) {
    case 'join':
      userJoined(message.userName);
      sendScoreboard();
      break;
    case 'pick':
      checkAnswers(message);
      sendScoreboard();
      break;
  }
}

function userJoined(userName) {
  console.log(userName + " joined.");
  playerNames[playersJoined] = userName;
  playersJoined++;
}

function sendScoreboard() {
  console.log('sending scoreboard');
  dataServer.publish({
    channel: channelName,
    message: {
      userID: myUserID,
      thisRound: currentRound,
      user00: playerNames[0],
      user01: playerNames[1],
      user02: playerNames[2],
      user03: playerNames[3],
      user04: playerNames[4],
      user05: playerNames[5],
      user06: playerNames[6],
      user07: playerNames[7],
      user08: playerNames[8],
      user09: playerNames[9],
      score00: scoreboard[0],
      score01: scoreboard[1],
      score02: scoreboard[2],
      score03: scoreboard[3],
      score04: scoreboard[4],
      score05: scoreboard[5],
      score06: scoreboard[6],
      score07: scoreboard[7],
      score08: scoreboard[8],
      score09: scoreboard[9],
      msgType: "scoreboard"

    }
  });
}

function checkAnswers(message) {
  console.log('chekc answer');
  if (message.choosen < answers.length) {
    var thisRoundValues = cardsToDraw[currentRound];
    console.log('User: ' + message.userID + ' Chose :' + thisRoundValues[message.choosen]);
    console.log('Right Answer: ' + answers[currentRound]);

    if (thisRoundValues[message.choosen] == answers[currentRound]) {
      console.log('Correct');

      for (var i = 0; i < playerNames.length; i++) {
        if (message.userName == playerNames[i]) {
          p = i;
        }

      }
      scoreboard[p] += pointsForAnswering;
      pointsForAnswering--;
      console.log(scoreboard[p]);
    } else {
      console.log('Incorrect');
    }

  }
}


function userWasWrong(_userID) {
  dataServer.publish({
    channel: channelName,
    message: {
      userID: _userID,
      thisRound: currentRound,
      user00: playerNames[0],
      msgType: "result"

    }
  });
}