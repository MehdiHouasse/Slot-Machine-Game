/*----- constants -----*/
const SM_LOOKUP = {
  bar: { img: 'imgs/bar.png', two: 1,three: 5},
  bell: { img: 'imgs/bell.png' },
  cherries: { img: 'imgs/cherries.png' },
  lemon: { img: 'imgs/lemon.png' },
  seven: { img: 'imgs/seven.png' },
};
const SM_RATIO = ['seven', 'bell', 'bell', 'lemon', 'lemon','lemon',];

/*----- state variables -----*/
let playerBalance;
let betAmount;
let reelPositions;
let winningAmount;

/*----- cached elements  -----*/
const reels = document.querySelectorAll('.reel');
const pScoreEl = document.getElementById('p-score');
const spinButton = document.querySelector('.spin-button');

/*----- event listeners -----*/
document.querySelector('.spin-button').addEventListener('click', handleSpin);

/*----- functions -----*/

function init() {
  playerBalance = 100;
  betAmount = 20;
  reelPositions = [];
  getSpinResults();
  winningAmount = 0;
  updateReelsAnimation();
  updateSymbolImages();
  render();
}


function updateSymbolImages() {
  // const symbolContainers = document.querySelectorAll('.symbol');
  // symbolContainers.forEach((container, index) => {
  //   const symbolName = Object.keys(SM_LOOKUP)[index];
  //   const symbolImage = SM_LOOKUP[symbolName].img;
  //   container.querySelector('img').src = symbolImage;
  // });
}

function render() {
  updateReelsAnimation();
  const outcome = getWinner();
  //updateWinningDisplay(outcome);
  // ... (other code to update the UI)
}


/*function updateWinningDisplay(outcome) {
  const resultDisplay = document.querySelector('.result-display');

  if (outcome === 'win') {
    resultDisplay.textContent = 'You won!';
    resultDisplay.style.color = 'black';
    resultDisplay.style.backgroundColor = 'rgba(0, 255, 0, 0.8)';
    resultDisplay.style.border = '2px solid green';
  } else if (outcome === 'lose') {
    resultDisplay.textContent = 'You lost!';
    resultDisplay.style.color = 'black';
    resultDisplay.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
    resultDisplay.style.border = '2px solid red';
  } else {
    resultDisplay.textContent = 'Slot Machine';
    resultDisplay.style.color = 'white';
    resultDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    resultDisplay.style.border = 'none';
  }
}*/



function handleSpin() {
  if (playerBalance < betAmount) {
    alert("Insufficient balance. Please add more credits.");
    return;
  }

  playerBalance -= betAmount;

  getSpinResults();

  updateReelsAnimation();

  setTimeout(() => {
    stopReels();
  }, 3000);

  winningAmount = 0;
  playerBalance += winningAmount;

  render();
}

function updateReelsAnimation() {
  reels.forEach(reel => {
    const symbolContainers = reel.querySelectorAll('.symbol');
    symbolContainers.forEach(container => {
      container.classList.toggle('spin-container', true);
    });
  });
}

function stopReels() {
  reels.forEach(reel => {
    const symbolContainers = reel.querySelectorAll('.symbol');
    symbolContainers.forEach(container => {
      container.classList.toggle('spin-container', false);
    });
  });

  const outcome = getWinner();
  if (outcome === 'win') {
    // Update winning amount and player balance
    winningAmount = calculateWinningAmount();
    playerBalance += winningAmount;
  }

  render();
}

function getSpinResults() {
  for (let i=0;i<3;i++){
    const randomIndex = Math.floor(Math.random() * SM_RATIO.length);
    reelPositions[i] = SM_RATIO[randomIndex];
  }
}

function getWinner() {
  const symbolCounts = {};

  // Count the occurrences of each symbol
  reelPositions.forEach(position => {
    symbolCounts[position] = (symbolCounts[position] || 0) + 1;
  });

  const winningCombinations = [
    { symbols: ['bar', 'bar', 'bar'], outcome: 'win' },
    { symbols: ['bell', 'bell', 'bell'], outcome: 'win' },
    // Add more winning combinations here
  ];

  // winning combination matches the reel positions
  const winningCombination = winningCombinations.find(combination => {
    return combination.symbols.every(symbol => symbolCounts[symbol] === 3);
  });

  return winningCombination ? winningCombination.outcome : 'lose';
}


function calculateWinningAmount() {
  const outcome = getWinner();

  if (outcome === 'win') {
    // Define the payouts for each winning combination
    const payouts = {
      'bar': 10,    //
      'bell': 20,   //

    };

    // Calculate the total winning amount based on the symbols and payouts
    const symbolsInWinningCombination = reelPositions[0];
    const payoutMultiplier = payouts[symbolsInWinningCombination];
    return betAmount * payoutMultiplier;
  }

  return 0; // No winnings for now
}


// Initialize the game
init();
