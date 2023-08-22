/*----- constants -----*/
const SM_LOOKUP = {
  bar: { img: 'imgs/bar.png', two: 1, three: 2 },
  bell: { img: 'imgs/bell.png', two: 1, three: 4 },
  cherries: { img: 'imgs/cherries.png', two: 1, three: 2 },
  lemon: { img: 'imgs/lemon.png', two: 1, three: 3 },
  seven: { img: 'imgs/seven.png', two: 1, three: 5 },
};

const SM_RATIO = ['seven', 'bell', 'bell', 'lemon', 'lemon', 'lemon', 'bar', 'bar', 'bar', 'bar', 'cherries', 'cherries', 'cherries', 'cherries', 'cherries'];

/*----- state variables -----*/
let playerBalance;
let betAmount;
let reelPositions;
let winningAmount;

/*----- cached elements  -----*/
const reels = document.querySelectorAll('.reel');
const spinButton = document.querySelector('.spin-button');

/*----- event listeners -----*/
spinButton.addEventListener('click', handleSpin);

/*----- functions -----*/

function init() {
  playerBalance = 100;
  betAmount = 20;
  reelPositions = [];
  winningAmount = 0;
  render();
}

function render() {
  updateReelsAnimation();
  const outcome = getWinner();
  // updateWinningDisplay(outcome);
  // ... (other code to update the UI)
}

function handleSpin() {
  if (playerBalance < betAmount) {
    alert("Insufficient balance. Please add more credits.");
    return;
  }

  playerBalance -= betAmount;

  getWinner(); // No need to call getSpinResults here

  updateReelsAnimation();

  setTimeout(() => {
    stopReels();
  }, 3000);

  playerBalance += winningAmount;
  winningAmount = 0; // Move this line after updating the balance

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

  render();
}

function getWinner() {
  const symbolCounts = {};

  for (let i = 0; i < 3; i++) {
    const randomIndex = Math.floor(Math.random() * SM_RATIO.length);
    reelPositions[i] = SM_RATIO[randomIndex];
    symbolCounts[reelPositions[i]] = (symbolCounts[reelPositions[i]] || 0) + 1;
  }

  const winningCombinations = [
    { symbols: ['bar', 'bar', 'bar'], outcome: 'win' },
    { symbols: ['bell', 'bell', 'bell'], outcome: 'win' },
    { symbols: ['cherries', 'cherries', 'cherries'], outcome: 'win' },
    { symbols: ['seven', 'seven', 'seven'], outcome: 'win' },
    { symbols: ['lemon', 'lemon', 'lemon'], outcome: 'win' },

  ];

  const winningCombination = winningCombinations.find(combination => {
    return combination.symbols.every(symbol => symbolCounts[symbol] === 3);
  });

  winningAmount = winningCombination ? calculateWinningAmount() : 0;
  return winningCombination ? winningCombination.outcome : 'lose';
}

function calculateWinningAmount() {
  const symbolsInWinningCombination = reelPositions[0];
  const occurrenceCount = reelPositions.filter(symbol => symbol === symbolsInWinningCombination).length;
  const payoutMultiplier = SM_LOOKUP[symbolsInWinningCombination].three;
  return betAmount * payoutMultiplier * occurrenceCount;
}

// Initialize the game
init();
