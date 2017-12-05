//Required Node modules
var inquirer = require('inquirer');
var isLetter = require('is-letter');
// objects/exports
var Word = require('./word.js');
var Game = require('./gamewrd.js');
//hangman graphic
var hangManDisplay = Game.newWord.hangman;

//set the maxListener
require('events').EventEmitter.prototype._maxListeners = 100;
console.log('***********************************************************');
console.log('*Guess the signers of the U.S. Declaration of Independance*');
console.log('***********************************************************');
var hangman = {
  wordBank: Game.newWord.wordList,
  remainGuess: 10,
  //Array for user guessed letters.
  guessedLttrs: [],
  //index for graphic display 
  display: 0,
  currentWord: null,
  //May the games begin
  startGame: function() {
    var that = this;
    //clears array before start of new game.
    if(this.guessedLttrs.length > 0){
      this.guessedLttrs = [];
    }

    inquirer.prompt([{
      name: "play",
      type: "confirm",
      message: "May the game begin?"
    }]).then(function(answer) {
      if(answer.play){
        that.newGame();
      } else{
        console.log("Sorry you don't have the confidence to challenge the Hangman.");
      }
    })},
  //Start game.
  newGame: function() {
    if(this.remainGuess === 10) {
      console.log('\n');
      console.log('********************');
      console.log("*O Yeah! Lets Play!*");
      console.log('********************');
      console.log('\n');
      //generates random number based on the wordBank
      var randNum = Math.floor(Math.random()*this.wordBank.length);
      this.currentWord = new Word(this.wordBank[randNum]);
      this.currentWord.getLets();
      //displays blanks.
      console.log(this.currentWord.wordRender());
      this.keepPromptingUser();
    } else{
      this.resetremainGuess();
      this.newGame();
    }
  },
  resetremainGuess: function() {
    this.remainGuess = 10;
  },
  keepPromptingUser : function(){
    var that = this;
    //Ask for a new guess
    inquirer.prompt([{
      name: "chosenLtr",
      type: "input",
      message: "Pick a letter from A-Z:",
      validate: function(value) {
        if(isLetter(value)){
          return true;
        } else{
          return false;
        }
      }
    }]).then(function(ltr) {
      //Converts letters inputted to capitals
      var letterReturned = (ltr.chosenLtr).toUpperCase();
      //Checks and adds letter to guessed letter array 
      var guessedAlready = false;
        for(var i = 0; i<that.guessedLttrs.length; i++){
          if(letterReturned === that.guessedLttrs[i]){
            guessedAlready = true;
          }
        }
        //Rerun function only for new letter guess or prompts user for new letter
        if(guessedAlready === false){
          that.guessedLttrs.push(letterReturned);

          var found = that.currentWord.checkIfLetterFound(letterReturned);
          //if none were found tell user they were wrong
          if(found === 0){
            console.log('Uh Oh! Wrong guess. The noose is tightening!');
            that.remainGuess--;
            that.display++;
            console.log('Guesses remaining: ' + that.remainGuess);
            console.log(hangManDisplay[(that.display)-1]);

            console.log('\n*******************');
            console.log(that.currentWord.wordRender());
            console.log('\n*******************');

            console.log("Letters guessed: " + that.guessedLttrs);
          } else{
            console.log('Aww Shucks! You guessed right!');
              //checks to see if user won
              if(that.currentWord.didWeFindTheWord() === true){
                console.log(that.currentWord.wordRender());
                console.log('********************************');
                console.log('*Dag Nabit! You won the game!!!*');
                console.log('********************************');
                // that.startGame();
              } else{
                // display the user how many guesses remaining
                console.log('Guesses remaining: ' + that.remainGuess);
                console.log(that.currentWord.wordRender());
                console.log('\n*******************');
                console.log("Letters guessed: " + that.guessedLttrs);
              }
          }
          if(that.remainGuess > 0 && that.currentWord.wordFound === false) {
            that.keepPromptingUser();
          }else if(that.remainGuess === 0){
            console.log('Game Over!');
            console.log('Word to guess was: ' + that.currentWord.word);
          }
        } else{
            console.log("Are you in a brain loop? Guess a different letter.")
            that.keepPromptingUser();
          }
    });
  }
}

hangman.startGame();

