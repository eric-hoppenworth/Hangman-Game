//plant class will store each plant's growthstage and condition
class Plant {
	constructor(row,col) {
		this.stage = 0;
		this.condition = 0;
		this.row = row;
		this.col = col;
		this.elem = document.getElementById("row"+this.row).children[this.col];

		//this will be overridden by the other classes
		this.type = "plant";
	};

	grow() {
 		//alert(this.type + " is growing");
 		//change the growth stage and image
 		this.stage += 1;
 		if (this.stage > lastPlantStage + this.cycle ){
 			this.stage = lastPlantStage;
 			//this plant will produce fruit now
 			this.scoreElem.innerHTML = parseInt(this.scoreElem.innerHTML,10) + (this.fruitCount-this.condition);
 		}
 		//reset to healthy plant
 		this.condition = 0;
		this.image = "assets/images/" + this.type + this.stage + this.condition + ".png";
		this.elem.src = this.image;
	};

	wilt() {
		//change wilt to the next stage
		this.condition = 1;
		this.image = "assets/images/" + this.type + this.stage + this.condition + ".png";
		this.elem.src = this.image;
	};

	kill(myGame) {
		//this kills the plant
		this.image = "assets/images/dirt.png";
		this.elem.src = this.image;
		//removes the LAST plant from the array
		//technically this functionality is broken, but when .kill is called I am only ever
		//killing the last plant in the array.
		myGame.plants.splice(-1,1);
	};
};
//Tomato class, a specific type of plant
class Tomato extends Plant{
	constructor(row,col){
		//first call the constructor for the plant class
		super(row,col);
		this.type = "tomato";
		this.image = "assets/images/" + this.type + this.stage + this.condition + ".png";
		this.cycle = 1;
		this.fruitCount = 4;
		this.scoreElem = document.getElementById(this.type + "Score");
		this.elem.src = this.image;

	}
};
//Pepper class, a specfic type of plant
class Pepper extends Plant{
	constructor(row,col){
		//first call the constructor for the plant class
		super(row,col);
		this.type = "pepper";
		this.image = "assets/images/" + this.type + this.stage + this.condition + ".png";
		this.cycle = 2;
		this.fruitCount = 2;
		this.scoreElem = document.getElementById(this.type + "Score");
		this.elem.src = this.image;
	}
};

//object constructor for game engine
function Game() {
	 
	this.guessLetters = document.getElementById("guessLetters").firstChild;
	this.guessCountNode = document.getElementById("guessCount").firstChild;
	this.guessCount = globalGuessCount;
	
	//holds the HTML element that containss thh puzzle
	this.puzzle = document.getElementById("myPuzzle");
	//all lowercase, holds the current puzzl, might be more than one word
	this.word= "a";
	//all lowercase, holds each word of a multi-word puzzle
	this.words = [];
	
	this.guesses= [];
	this.wins= 0;
	//this will be set just extra high. is overwriten when a word is chosen
	this.remainingLetters = 1000;
	//collection of plants
	this.plants = [];

	this.guess = function(letter){
		var i = 0;
		var j = 0;
		var isMatched = false;
		var isGuessed = false;
		var txt = "";
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
				//every other child is a text node (due to line breaks)
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
				if (this.guessCount === 0 ){
					//you lose!
					this.lose();
				} else if (this.guessCount === Math.floor(globalGuessCount/3) ){
					//wilt all plants
					for (var i= 0;i < this.plants.length;i++){
						this.plants[i].wilt();
					}
				} else if (this.guessCount === Math.floor(globalGuessCount*2/3) ){
					//wilt some plants
					for (var i= 0;i < this.plants.length;i++){
						if (Math.random() < 0.5){
							this.plants[i].wilt();
						}
					}
				}

			}
		} else if (isGuessed === true){
			//do nothing if the letter has already been guessed
		}
	};

	this.win = function() {
		//alert("You got the word-- " + this.word.toUpperCase());

		//grow any plants
		for (var i = 0; i < this.plants.length; i++){
			this.plants[i].grow();
		}
		//create a new plant only if there are fewer than 24
		if (this.plants.length < plantMax){
			var row = Math.floor(this.plants.length/rowWidth);
			var col = this.plants.length % rowWidth	;

			var rand = randBetween(1,3);
			//debug line
			//console.log(rand);

			//peppers are less common than tomatoes
			if (rand === 3){
				this.plants.push(new Pepper(row,col));
			}else{
				this.plants.push(new Tomato(row,col));
			}
		}
		
		//start a newWord
		//this.newWord();
		waiting = true;
	};

	this.lose = function(){
		//kill any plants based on the number of missing letters
		var missingLetters = this.remainingLetters;
		for (var i = 1; i <= missingLetters; i++){
			if(this.plants.length-i >= 0){
				this.plants[this.plants.length-1].kill(this);
			}
		}
		
		//start a newWord
		//this.newWord();
		waiting = true;
	};

	this.newWord = function(){
		waiting = false;
		//get a new word from some list somewhere
		var rand = randBetween(0,myWords.length-1);
		this.word = myWords[rand];
		myWords.splice(rand,1);
		//debug line
		//this.word = "horticulturalist";
		//console.log(this.word);

		//split the chosen word into an array of words
		this.words = this.word.split(" ");
		this.remainingLetters = 0;
		//clear out the old puzzle
		var txt;
		while (this.puzzle.hasChildNodes()) {
			this.puzzle.removeChild(this.puzzle.lastChild);
		}

		//print the new puzzle
		for (var j = 0; j< this.words.length; j++) {
			txt = "";
			this.remainingLetters += this.words[j].length;
			for (var i = 0; i < this.words[j].length; i++) {
				txt += " _";	
			}
			//add each word as its own line and a <br> after it.
			myGame.puzzle.appendChild(document.createTextNode(txt));
			myGame.puzzle.appendChild(document.createElement('br'));
		}

		//clear out the guesses
		this.guesses = [];
		this.guessLetters.nodeValue = " ";
		this.guessCount = globalGuessCount;
		this.guessCountNode.nodeValue = this.guessCount;
	};
	
	document.onkeypress = function(event) {
		var charCode = event.which;
		//Catches letters only
		if (waiting){
			myGame.newWord();
		} else if ((charCode >= 97 )&&(charCode <= 122)){
			var letter = String.fromCharCode(charCode);
			//should come in as lowercase anyway, but just to be sure
			myGame.guess(letter.toLowerCase());
		}
		
	};
}
//global function call
function randBetween(min, max) {
	//gets a random integer between min and max, inclusive
	return Math.floor(Math.random() * (max - min + 1)) + min;
};
//global variable calls
var globalGuessCount = 15;
var myGame = new Game();
var myWords = wordList;
var rowWidth = 4;
var rows = 5;
var plantMax = rowWidth*rows;
var waiting = true;
var lastPlantStage = 3;
var tomScore = 0;
var pepScore = 0;

//script

//create a plant and start the game.
myGame.plants.push(new Tomato(0,0));
//myGame.newWord();
//newWord will be called when a key is pressed


