document.addEventListener('DOMContentLoaded', () => {
    const choicesContainer = document.querySelector('.choices');
    const gameModeSelect = document.getElementById('game-mode');
    const resultMessage = document.querySelector('.result-message');
    const playerScoreElement = document.getElementById('player-score');
    const computerScoreElement = document.getElementById('computer-score');
    const resetButton = document.querySelector('button');
  
    let playerScore = 0;
    let computerScore = 0;
    let currentGameMode = 'classic';
  
    const classicChoicesArray = ['rock', 'paper', 'scissors'];
    const expandedChoicesArray = ['rock', 'paper', 'scissors', 'lizard', 'spock'];
  
    const winConditions = {
      rock: { scissors: 'crushes', lizard: 'crushes' },
      paper: { rock: 'covers', spock: 'disproves' },
      scissors: { paper: 'cuts', lizard: 'decapitates' },
      lizard: { spock: 'poisons', paper: 'eats' },
      spock: { scissors: 'smashes', rock: 'vaporizes' },
    };
   
    const getComputerChoice = () => {
      const choices = currentGameMode === 'classic' ? classicChoicesArray : expandedChoicesArray;
      return choices[Math.floor(Math.random() * choices.length)];
    };
  
    const determineWinner = (playerChoice, computerChoice) => {
      if (playerChoice === computerChoice) {
        return 'draw';
      } else if (winConditions[playerChoice]?.[computerChoice]) {
        return 'player';
      } else {
        return 'computer';
      }
    };
  
    const handleChoiceClick = (e) => {
      const playerChoice = e.target.closest('.choice').getAttribute('data-choice');
      const computerChoice = getComputerChoice();
      const winner = determineWinner(playerChoice, computerChoice);
      updateScores(winner, playerChoice, computerChoice);
    };
  
    const updateScores = (winner, playerChoice, computerChoice) => {
      if (winner === 'player') {
        playerScore++;
        resultMessage.textContent = `You win! ${playerChoice.charAt(0).toUpperCase() + playerChoice.slice(1)} ${winConditions[playerChoice][computerChoice]} ${computerChoice}.`;
      } else if (winner === 'computer') {
        computerScore++;
        resultMessage.textContent = `Computer wins! ${computerChoice.charAt(0).toUpperCase() + computerChoice.slice(1)} ${winConditions[computerChoice][playerChoice]} ${playerChoice}.`;
      } else {
        resultMessage.textContent = `It's a draw! Both chose ${playerChoice}.`;
      }
  
      playerScoreElement.textContent = playerScore;
      computerScoreElement.textContent = computerScore;
    };
  
    const resetGame = () => {
      playerScore = 0;
      computerScore = 0;
      resultMessage.textContent = 'Make your move!';
      playerScoreElement.textContent = playerScore;
      computerScoreElement.textContent = computerScore;
    };
  
    const renderChoices = () => {
      const choices = currentGameMode === 'classic' ? classicChoicesArray : expandedChoicesArray;
      choicesContainer.innerHTML = ''; // Clear previous choices
  
      choices.forEach(choice => {
        const choiceElement = document.createElement('div');
        choiceElement.classList.add('choice');
        choiceElement.setAttribute('data-choice', choice);
  
        const img = document.createElement('img');
        img.src = `static/images/${choice}.png`;
        img.alt = choice.charAt(0).toUpperCase() + choice.slice(1);
  
        choiceElement.appendChild(img);
        choicesContainer.appendChild(choiceElement);
  
        choiceElement.addEventListener('click', handleChoiceClick); // Attach event listener
      });
    };
  
    const switchGameMode = (mode) => {
      currentGameMode = mode;
      renderChoices();
      resetGame();
    };
  
    // Add event listeners
    gameModeSelect.addEventListener('change', (e) => {
      switchGameMode(e.target.value);
    });
  
    resetButton.addEventListener('click', resetGame);
  
    // Initialize the game
    resetGame();
    switchGameMode(currentGameMode);
  });
  