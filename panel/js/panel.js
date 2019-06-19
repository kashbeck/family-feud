var game = null;
var whichTeamTurn = null;
var maxMiss = 3;
var missPointTeam1 = 0;
var missPointTeam2 = 0;
var audio = null;

var currentQ = 0;
var maxQ = 0;

var sounds = {
  ff_answer_correct: new Audio("sfx/ff_answer_correct.mp3"),
  ff_answer_duplicate: new Audio("sfx/ff_answer_duplicate.mp3"),
  ff_answer_incorrect: new Audio("sfx/ff_answer_incorrect.mp3"),
  ff_answer_number_one: new Audio("sfx/ff_answer_number_one.mp3"),
  ff_buzz_in: new Audio("sfx/ff_buzz_in.mp3"),
  ff_commercial: new Audio("sfx/ff_commercial.mp3"),
  ff_fast_money_reveal: new Audio("sfx/ff_fast_money_reveal.mp3"),
  ff_theme_full: new Audio("sfx/ff_theme_full.mp3"),
  ff_theme_med: new Audio("sfx/ff_theme_med.mp3"),
  ff_theme_short: new Audio("sfx/ff_theme_short.mp3"),
  ff_times_up: new Audio("sfx/ff_times_up.mp3"),
  zz_applause: new Audio("sfx/zz_applause.mp3"),
  zz_boo: new Audio("sfx/zz_boo.ogg"),
  zz_clock: new Audio("sfx/zz_clock.ogg"),
  zz_dun: new Audio("sfx/zz_dun.mp3"),
  zz_ticking_clock: new Audio("sfx/zz_ticking_clock.mp3"),
  zz_yeah: new Audio("sfx/zz_yeah.ogg"),
}

function start_game() {	
  
  document.getElementById("buttonStart").disabled = true;

  game.document.getElementById("welcomePageInfo").style.display = "none";	
  game.app.init();
}

function finish_game() {
  game.document.getElementById("idcLogo").style.width = '50%';
  game.document.getElementById("welcomePageInfo").innerHTML = "Thanks for playing!";
  game.document.getElementById("welcomePageInfo").style.display = "";
}

function open_game_window() {
  game = window.open("game.html");//, "_blank", "resizable=yes,fullscreen=yes");
  document.getElementById("buttonStart").disabled = false;
  document.getElementById("buttonOpen").disabled = true;
  document.getElementById("buttonClose").disabled = false;	
}

function close_game_window() {
  game.close();
}

function game_window_init_done() {
  document.getElementById("question").className = "label label-success";
  document.getElementById("buttonStart").disabled = true;
  document.getElementById("buttonAwardT1").disabled = false;
  document.getElementById("buttonAwardT2").disabled = false;
  document.getElementById("buttonAwardT3").disabled = false;

}

function game_window_closed() {
  game = null;
}

// play sound object

function play_sound(sound) {
  pause_sound();
  audio = sounds[sound];
  
  if (audio) {
    audio.currentTime = 0;
    audio.play();
  }
}

function pause_sound() {
  if (audio) {
    audio.pause();   
  }
}

function hideQuestion() {
  game.app.hideQuestion();
}

function showQuestion() {
  game.app.showQuestion();
}

function printMissPoint() {
  var i = 0;
  resetMissPoint();
  for (i = 0; i < missPointTeam1; i++) { 
    game.document.getElementById("missTeam1_"+ (i+1)).style.visibility = "visible";
  }
  for (i = 0; i < missPointTeam2; i++) { 
    game.document.getElementById("missTeam2_"+ (i+1)).style.visibility = "visible";
  }
}

function deleteMissPoint() {
  missPointTeam1 = 0;
  missPointTeam2 = 0;
  document.getElementById("misspoint1").innerHTML = missPointTeam1;
  document.getElementById("misspoint2").innerHTML = missPointTeam2;
  resetMissPoint();
}

function resetMissPoint() {
  game.document.getElementById("missTeam1_1").style.visibility = "hidden";
  game.document.getElementById("missTeam1_2").style.visibility = "hidden";
  game.document.getElementById("missTeam1_3").style.visibility = "hidden";
  game.document.getElementById("missTeam2_1").style.visibility = "hidden";
  game.document.getElementById("missTeam2_2").style.visibility = "hidden";
  game.document.getElementById("missTeam2_3").style.visibility = "hidden";
}

function showMissPoint(team) {
  if (team == "1") {
    if (missPointTeam1 < maxMiss) { missPointTeam1++; }
    document.getElementById("misspoint1").innerHTML = missPointTeam1;
  }
  else if (team == "2") {
    if (missPointTeam2 < maxMiss) { missPointTeam2++; }
    document.getElementById("misspoint2").innerHTML = missPointTeam2;
  }	
  printMissPoint();
  play_sound("ff_answer_incorrect");
}

function hideMissPoint(team) {
  if (team == "1") {
    if (missPointTeam1 > 0) { missPointTeam1--; }
    document.getElementById("misspoint1").innerHTML = missPointTeam1;
  }
  else if (team == "2") {
    if (missPointTeam2 > 0) { missPointTeam2--; }
    document.getElementById("misspoint2").innerHTML = missPointTeam2;
  }	
  printMissPoint();
}

function nextQuestion(){
  deleteTableRows();
  deleteMissPoint();
  game.app.changeQuestion();

}

function deleteTableRows() {
  var table = document.getElementById("tableAnswers");
  for(var i = table.rows.length - 1; i > 0; i--) {
    table.deleteRow(i);
  }
}

function calculatePoints(team) {
  if (team == "1") {
    game.document.getElementById("awardTeam1").click();
  }
  else if (team == "2") {
    game.document.getElementById("awardTeam2").click();
  }

  play_sound("ff_theme_short");
}

function GetQuestion(questionParam) {
  document.getElementById("question").innerHTML = questionParam;
}

function GetAnswers(answers, currentQnumber, totalQnumber) {
  var i;
  var table = document.getElementById("tableAnswers");
  for (i = 0; i < answers.length; i++) { 
    var row = table.insertRow(i+1);
    var cell1 = row.insertCell(0)
    var cell2 = row.insertCell(1)
    var cell3 = row.insertCell(2)

    var tempID = "answer_" + i;

    row.setAttribute("id", tempID, 0);
    row.onclick = function() { 
      game.document.getElementById(this.id).click();
      var tempBgColor = this.style.backgroundColor;
      if(tempBgColor == ""){
        this.setAttribute("style", "background-color: lightgreen;");
        play_sound("ff_answer_correct");
      }
      else if(tempBgColor == "lightgreen"){
        this.setAttribute("style", "background-color: ;");
      }
    }  
    cell1.innerHTML = i;
    cell2.innerHTML = answers[i][0];
    cell3.innerHTML = answers[i][1];

    document.getElementById("tableAnswers").style.display = "";
    document.getElementById("answerInfo").style.display = "none";

    document.getElementById("totalQ").innerHTML = totalQnumber;
    document.getElementById("currentQ").innerHTML = currentQnumber;
    document.getElementById("txtCurrentQ").value = currentQnumber;
    
    currentQ = currentQnumber;
    maxQ = totalQnumber;
  }


}

function turnOfTeam(team) {
  whichTeamTurn = team;
  if (team == "team1") {
    game.document.getElementById("team1").classList.add("elem--focus");
    game.document.getElementById("team2").classList.remove("elem--focus");

    document.getElementById("buttonMistakeT1").disabled = false;
    document.getElementById("buttonUndoMistakeT1").disabled = false;
    document.getElementById("buttonMistakeT2").disabled = true;
    document.getElementById("buttonUndoMistakeT2").disabled = true;
  }
  else if (team == "team2") {
    game.document.getElementById("team2").classList.add("elem--focus");
    game.document.getElementById("team1").classList.remove("elem--focus");

    document.getElementById("buttonMistakeT1").disabled = true;
    document.getElementById("buttonUndoMistakeT1").disabled = true;
    document.getElementById("buttonMistakeT2").disabled = false;
    document.getElementById("buttonUndoMistakeT2").disabled = false;
  }
}

function gameClosed() {
  //sıfırlayacaksın abi herşeyi!!!
  game = null;
  document.getElementById("question").innerHTML = "The game has been finished.";
  document.getElementById("question").className = "label label-danger";
  missPointTeam1 = 0;
  document.getElementById("misspoint1").innerHTML = missPointTeam1;
  missPointTeam1 = 0;
  document.getElementById("misspoint2").innerHTML = missPointTeam1;

  document.getElementById("buttonClose").disabled = true;
  document.getElementById("buttonMistakeT1").disabled = true;
  document.getElementById("buttonUndoMistakeT1").disabled = true;
  document.getElementById("buttonMistakeT2").disabled = true;
  document.getElementById("buttonUndoMistakeT2").disabled = true;
  document.getElementById("buttonAwardT1").disabled = true;
  document.getElementById("buttonAwardT2").disabled = true;
  document.getElementById("buttonAwardT3").disabled = true;
  document.getElementById("buttonStart").disabled = true;
  document.getElementById("buttonOpen").disabled = false;
  document.getElementById("tableAnswers").style.display = "none";
  document.getElementById("answerInfo").style.display = "";

  var table = document.getElementById("tableAnswers");
  for(var i = table.rows.length - 1; i > 0; i--) {
    table.deleteRow(i);
  }
}

function gameCompleted() {
  var x = game.document.getElementById("firework");
  document.getElementById("buttonWinner").disabled = false;
  if (x.style.visibility === "hidden") {
    x.style.visibility = "visible";
    game.document.getElementById("gameBoardId").style.display = "none";
    game.document.getElementById("ffLogo").style.width = "50%";
  }
  else {
    x.style.visibility = "hidden";
  }


  var table = document.getElementById("tableAnswers");
  for(var i = table.rows.length - 1; i > 0; i--){
    table.deleteRow(i);
  }
  announceWinner();
}

function hideFirework() {		
  game.document.getElementById('firework').style.visibility = "hidden";
}

function announceWinner() {
  game.document.getElementById("winnerId").innerHTML = game.winner();
  game.document.getElementById('winnerId').style.display = "block";
}

function changeTeamNames() {
  game.teamNameChange();
}

function changeTeamPoint() {
  game.teamPointChange();
  document.getElementById("team1POINT").innerHTML = game.document.getElementById("team1").value;
  document.getElementById("team2POINT").innerHTML = game.document.getElementById("team2").value;
}

function changeTurn() {
  if(whichTeamTurn == "team1") {
    turnOfTeam("team2");
  }
  else if (whichTeamTurn == "team2") {
    turnOfTeam("team1");
  }
}

function changeQuestionNum() {
  var questionNum = parseInt(document.getElementById("txtCurrentQ").value, 10);
  
  if (isNaN(questionNum)) {
    return;
  }
  
  deleteTableRows();
  deleteMissPoint();
  game.app.setQuestion(questionNum - 1);
}

function receivePostMessage(event) {
  // if (event.origin !== "http://example.org:8080") {
  //   return;
  // }

  //event.data
}

window.addEventListener("message", receivePostMessage, false);