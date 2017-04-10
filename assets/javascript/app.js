//global variables
var numberRight;
var numberWrong;
var currentQuestion;
var timer;
var timeToGuess;
var library; // a copy of the questions for this game
// settings
var questionLength = 10; // seconds you have to guess
var answerLength = 3; // seconds you're shown the answer
var gameLength; // set this to limit the number of questions per game

function initGame(){
	// display intro
	$("#qText").html('When you play Brain Wreck, don\'t let your brain explode. Some of these questions are very difficult, and you only have 10 seconds to answer, not enough time to google it! Good luck.<button id="startGame">Begin Game</button>');
	$("#result").hide();
	$("#choices").hide();
	$("#choices li").empty();
	$(".scoreboard").empty();
	//add listeners
	$("#choices .answer").off().on("click", makeGuess);
	$("#startGame").off().on("click", newQuestion);
	//reset game variables
	numberWrong = 0;
	numberRight = 0;
	// creates a fresh clone of the library on each play
	library = questionsLibrary.slice();
	timeToGuess = questionLength;
	gameLength = library.length;
}
function newQuestion(){
	if(numberRight + numberWrong >= gameLength){
		gameOver();
	} else {
		//pick a random question that hasn't been asked already
		var questionNumber = Math.floor(Math.random() * library.length);
		currentQuestion = library[questionNumber];
		library.splice(questionNumber, 1);
		resetTimer();
		$("#result").empty().hide();
		$("#qText").html(currentQuestion.question);
		$("#choices").show().find(".answer").each(function(i){
			$(this).html(currentQuestion.answers[i]);
		});
		$("body").css("background-image", "url('"+currentQuestion.image+"')");
		// start Question Timer
		timer = setInterval(showTimer, 1000);
	}
}
function makeGuess(){
	if ($(this).data("choice") == currentQuestion.correctAnswer){
		numberRight++;
		showResult("Correct!", "correctResult");
	} else {
		numberWrong++;
		showResult("Wrong. The correct answer was " + currentQuestion.answers[currentQuestion.correctAnswer], "wrongResult");
	}
}
function showResult(msg, addThisClass){
	resetTimer();
	$("#result")
		.html(msg)
		.show()
		.removeClass()
		.addClass(addThisClass);
	setTimeout(newQuestion, answerLength*1000);
	$("#score").html("correct: " + numberRight + " <br> incorrect: " + numberWrong);

}
function showTimer(){
	if (timeToGuess >= 0){
		$("#timer").html(timeToGuess + " seconds left");
		timeToGuess--;
	} else {
		timesUp();
	}
}
function timesUp(){
	numberWrong++;
	resetTimer();
	showResult("Time's Up! The correct answer was " + currentQuestion.answers[currentQuestion.correctAnswer], "timesUp");
}
function resetTimer(){
	clearInterval(timer);
	timeToGuess = questionLength;
	$("#timer").empty();
}
function gameOver(){
	$("body").css("background-image", 'url("assets/images/init-BG.jpg")');
	var score = (numberRight/gameLength);
	var praise = "That was pretty bad. Your brain must be bleeding out of your ears.";
	if (score > .9){
		praise = "BrainWreck! Your brain should be making you money.";
	} else if (score > .8){
		praise = "OK! Your brain is worth a little lol.";
	} else if (score > .7){
		praise = "That's cool, you definitely should think better.";
	} else if (score > .6){
		praise = "That's cool, your brain might be ready!.";
	} else if (score > .5){
		praise = "That's cool, you might be smart.";
	} else if (score > .4){
		praise = "Not bad, you are a little brainy.";
	}
	$("#result").removeClass().html("<h1>Game Over</h1><div class='gameOverText'>You got " + numberRight + " questions right and " + numberWrong + " wrong. " + praise + "</div><button id='newGame'>Play Again</button>");
	$("#newGame").on("click", initGame);
}
$(document).ready(initGame);
