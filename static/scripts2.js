document.addEventListener('DOMContentLoaded', () => {
    const wordContainer = document.getElementById('wordDisplay');
    const statusText = document.getElementById('status');
    const hintContainer = document.getElementById('hint');
    const hangmanImage = document.getElementById('hangmanImage');
    const letterButtons = document.querySelectorAll('.letter');
  
    const words = {
      movies: [
        { word: 'INCEPTION', hint: 'A movie about dreams within dreams' },
        { word: 'TITANIC', hint: 'A love story set on a sinking ship' },
        { word: 'INTERSTELLAR', hint: 'A team of explorers travel through a wormhole in space' },
        { word: 'JOKER', hint: 'A dark comic villain' },
        { word: 'FROZEN', hint: 'Disney ice princess' },
        { word: 'ROCKY', hint: 'Boxing underdog' },
      ],
      sports: [
        { word: 'SOCCER', hint: 'A popular sport also known as football' },
        { word: 'BASKETBALL', hint: 'A sport played with a ball and a hoop' },
        { word: 'TENNIS', hint: 'A racket sport game' },
        { word: 'BASEBALL', hint: 'Score runs by hitting a thrown ball and running to a series of four bases' },
        { word: 'RUGBY', hint: 'Oval ball, physical game' },
        { word: 'BOXING', hint: 'Combat sport with gloves' },
      ],
      animals: [
        { word: 'ELEPHANT', hint: 'The largest land animal' },
        { word: 'KANGAROO', hint: 'A marsupial from Australia' },
        { word: 'GIRAFFE', hint: 'The tallest animal on Earth' },
        { word: 'DOLPHIN', hint: 'A highly intelligent marine mammal' },
        { word: 'PENGUIN', hint: 'A flightless bird that lives in the Antarctic' },
        { word: 'CROCODILE', hint: 'A large aquatic reptile with a long snout' },
      ],
    };
  
    let selectedWordData;
    let displayWord;
    let wrongGuesses;
    const maxWrongGuesses = 6;
    let currentCategory = 'movies';
  
    const startGame = () => {
      const wordsArray = words[currentCategory];
      selectedWordData = wordsArray[Math.floor(Math.random() * wordsArray.length)];
      displayWord = Array(selectedWordData.word.length).fill('_');
      wrongGuesses = 0;
      updateHangmanImage();
      wordContainer.textContent = displayWord.join(' ');
      hintContainer.textContent = `Hint: ${selectedWordData.hint}`;
      statusText.textContent = 'Status: Guess the word!';
      letterButtons.forEach(button => {
        button.classList.remove('used');
        button.disabled = false;
      });
    };
  
    const guessLetter = (letter) => {
      if (!/^[A-Z]$/.test(letter)) return; // Ensure valid letter input
      const buttonElement = document.querySelector(`.letter[data-letter="${letter}"]`);
  
      // If the letter has already been guessed, ignore it
      if (!buttonElement || buttonElement.disabled) return;
  
      buttonElement.classList.add('used');
      buttonElement.disabled = true;
  
      if (selectedWordData.word.includes(letter)) {
        selectedWordData.word.split('').forEach((char, index) => {
          if (char === letter) {
            displayWord[index] = letter;
          }
        });
      } else {
        wrongGuesses++;
        updateHangmanImage();
      }
  
      wordContainer.textContent = displayWord.join(' ');
  
      if (wrongGuesses >= maxWrongGuesses) {
        statusText.textContent = `Game Over! The word was "${selectedWordData.word}".`;
        endGame();
      } else if (!displayWord.includes('_')) {
        statusText.textContent = 'Congratulations! You won!';
        endGame();
      }
    };
  
    const updateHangmanImage = () => {
      hangmanImage.src = `static/images/H${wrongGuesses}.png`;
    };
  
    const resetGame = () => {
      startGame();
    };
  
    const endGame = () => {
      letterButtons.forEach(button => {
        button.disabled = true;
      });
    };
  
    const selectCategory = (category) => {
      currentCategory = category;
      startGame();
    };
  
    const handleKeyPress = (event) => {
      const letter = event.key.toUpperCase();
      guessLetter(letter);
    };
  
    // Add event listeners for buttons
    letterButtons.forEach(button => {
      button.addEventListener('click', () => guessLetter(button.getAttribute('data-letter')));
    });
  
    // Add event listener for keyboard input
    document.addEventListener('keydown', handleKeyPress);
  
    // Expose functions globally
    window.resetGame = resetGame;
    window.selectCategory = selectCategory;
  
    startGame();
  });
  