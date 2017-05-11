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
	this.puzzle = document.getElementById("myPuzzle").firstChild;
	this.guessLetters = document.getElementById("guessLetters").firstChild;
	this.guessCountNode = document.getElementById("guessCount").firstChild;
	this.guessCount = 15;
	//all lowercase
	this.word= "a";
	this.guesses= [];
	this.wins= 0;
	this.correctLetters = 0;
	//collection of plants
	this.plants = [];
	this.rows = [];

	this.guess = function(letter){
		var i = 0
		var isMatched = false;
		var isGuessed = false;
		var txt = "";
		var puzzleString = this.puzzle.nodeValue
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
			for (i =0;i< this.word.length;i++){
				if (this.word[i].toLowerCase() === letter){
					//if any particular letter matches, I want it to show up on the screen
					//in the correct position
					txt += " "+letter.toUpperCase();
					isMatched = true;
					this.correctLetters += 1
				} else {
					//if the guess does not go in that spot, leave a blank
					txt += " " + puzzleString[(i*2)+1];
				}
			}
			
			if (isMatched) {
				//replace the word
				this.puzzle.nodeValue = txt;
				//check if the puzzle is finished
				if (this.correctLetters === this.word.length){
					//you win!
					this.win();
				}
			} else {
				//if no match was found, that letter will be added to the guessLetters
				this.guessLetters.nodeValue += letter.toUpperCase() + " , ";
				//and the remaining guesses will decrease
				this.guessCount -= 1;
				this.guessCountNode.nodeValue = this.guessCount
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
		//kill any plants
		//change to plain dirt
		this.plants[this.plants.length-1].kill(this);
		//start a newWord
		this.newWord();

	}

	this.newWord = function(){
		//get a new word from some list somewhere
		this.word = "a"
		//clear out the puzzle
		var txt = ""
		for (var i = 0; i < this.word.length; i++) {
			txt += " _";
		}
		this.puzzle.nodeValue = txt;
		//clear out the guesses
		this.guesses = [];
		this.guessLetters.nodeValue = " ";
		this.guessCount = 15;
		this.guessCountNode.nodeValue = this.guessCount;
		this.correctLetters = 0;
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



var myGame = new Game();
myGame.newWord();

myGame.plants.push(new Plant(0,0));
