//plant class will store each plant's growthstage and condition
class Plant {
	constructor(row,col) {
		this.stage = 0;
		this.condition = 0;
		this.type = "tomato";
		this.image = "assets/images/plant" + this.stage + ".png";
		this.row = row;
		this.col = col;
		document.getElementById("row" + this.row).children[this.col].src = this.image;
	}

	grow() {
 		//alert(this.type + " is growing");
 		//change the growth stage and image
 		this.stage += 1;
 		if (this.stage > 4 ){
 			this.stage = 3;
 		}
		this.image = "assets/images/plant" + this.stage + ".png";
		document.getElementById("row" + this.row).children[this.col].src = this.image;
	}

	kill(myGame) {
		//this kills the plant
		this.image = "assets/images/dirt.png";
		document.getElementById("row" + this.row).children[this.col].src = this.image;
		myGame.plants.splice(-1,1);
	}
}
//object constructor for game engine
function Game() {
	//will need to reference the even children of puzzle
	this.puzzle = document.getElementById("myPuzzle"); 
	this.guessLetters = document.getElementById("guessLetters").firstChild;
	this.guessCountNode = document.getElementById("guessCount").firstChild;
	this.guessCount = globalGuessCount;
	//all lowercase
	this.word= "a";
	this.words = [];
	this.guesses= [];
	this.wins= 0;
	this.remainingLetters = 100;
	//collection of plants
	this.plants = [];
	this.rows = [];

	this.guess = function(letter){
		var i = 0;
		var j = 0;
		var isMatched = false;
		var isGuessed = false;
		var txt = "";
		//this needs to be adjusted to allow multiple words
		var puzzleString ;
		//first, see if the letter has already been guessed
		for (i =0; i < this.guesses.length; i++){
			if (this.guesses[i] === letter.toUpperCase()){
				//this letter has already been guessed
				//no need to check anything else
				isGuessed = true;
			}
		}
		//if the letter hasn't been guessed,
		if (isGuessed === false){
			//add it to the guesses
			this.guesses.push(letter.toUpperCase());
			//when a guess is made, see if it is in the puzzle word
			for (j = 0; j < this.words.length; j++){
				puzzleString = this.puzzle.childNodes[j*2].nodeValue;
				for (i =0;i< this.words[j].length;i++){
					if (this.words[j][i].toLowerCase() === letter){
						//if any particular letter matches, I want it to show up on the screen
						//in the correct position
						txt += " "+letter.toUpperCase();
						isMatched = true;
						this.remainingLetters -= 1;
					} else {
						//if the guess does not go in that spot, leave a blank
						txt += " " + puzzleString[(i*2)+1];
					}
				}
				//replace the word
				this.puzzle.childNodes[j*2].nodeValue = txt;
				txt = "";
			}
			
			if (isMatched) {
				//check if the puzzle is finished
				//this does not correct for spaceBar characters
				if (this.remainingLetters === 0){
					//you win!
					this.win();
				}
			} else {
				//if no match was found, that letter will be added to the guessLetters
				this.guessLetters.nodeValue += letter.toUpperCase() + " , ";
				//and the remaining guesses will decrease
				this.guessCount -= 1;
				this.guessCountNode.nodeValue = this.guessCount;
				if (this.guessCount <= 0 ){
					//you lose!
					this.lose();
				} else if (this.guessCount <= 5 ){
					//wilt 2
				} else if (this.guessCount <= 10 ){
					//wilt 1
				}

			}
		} else if (isGuessed === true){
			//do nothing if the letter has already been guessed
		}
	}

	this.win = function() {
		

		//grow any plants
		for (var i = 0; i < this.plants.length; i++){
			this.plants[i].grow();
		}
		//create a new plant only if there are fewer than 24
		if (this.plants.length < 24){
			var row = Math.floor(this.plants.length/4);
			var col = this.plants.length % 4;

			this.plants.push(new Plant(row,col));
		}
		

		//start a newWord
		this.newWord();
	}

	this.lose = function(){
		//kill any plants based on the number of missing letters
		var missingLetters = this.remainingLetters;
		for (var i = 1; i <= missingLetters; i++){
			if(this.plants.length-i >= 0){
				this.plants[this.plants.length-1].kill(this);
			}
		}
		
		//start a newWord
		this.newWord();

	}

	this.newWord = function(){
		//get a new word from some list somewhere
		var rand = getRandomInt(0,myWords.length-1);
		this.word = myWords[rand];
		myWords.splice(rand,1);
		//this.word = "garden party";
		//split the chosen word into an array of words
		this.words = this.word.split(" ");
		this.remainingLetters = 0;
		//clear out the puzzle
		var txt;
		while (this.puzzle.hasChildNodes()) {
			this.puzzle.removeChild(this.puzzle.lastChild);
		}
		for (var j = 0; j< this.words.length; j++) {
			txt = "";
			this.remainingLetters += this.words[j].length;
			for (var i = 0; i < this.words[j].length; i++) {
				txt += " _";	
			}

			myGame.puzzle.appendChild(document.createTextNode(txt));
			myGame.puzzle.appendChild(document.createElement('br'));
		}

		//clear out the guesses
		this.guesses = [];
		this.guessLetters.nodeValue = " ";
		this.guessCount = globalGuessCount;
		this.guessCountNode.nodeValue = this.guessCount;
	}
	
	document.onkeypress = function(event) {
		var charCode = event.which;
		//Catches letters only
		if ((charCode >= 97 )&&(charCode <= 122)){
			var letter = String.fromCharCode(charCode);
			//should come in as lowercase anyway, but just to be sure
			myGame.guess(letter.toLowerCase());
		}
		
	}
}
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

var globalGuessCount = 15;
var myGame = new Game();
var myWords = wordList;

myGame.newWord();

myGame.plants.push(new Plant(0,0));
