/*----- constants -----*/
const SM_LOOKUP = {
  bar: { img: 'imgs/bar.png' },
  bell: { img: 'imgs/bell.png' },
  cherries: { img: 'imgs/cherries.png' },
  lemon: { img: 'imgs/lemon.png' },
  seven: { img: 'imgs/seven.png' },
};

/*----- state variables -----*/
let playerBalance; // The amount of credits the player has to bet.
let betAmount; // The amount of credits the player bets on each spin.
let reelPositions; // The current positions of the symbols on each reel.
let winningAmount; // The amount won

/*----- cached elements  -----*/
const reels = document.querySelectorAll('.reel'); // Cache reel elements
const pScoreEl = document.getElementById('p-score'); // Cache player score element
const spinButton = document.querySelector('.spin-button'); // Cache spin button

/*----- event listeners -----*/
spinButton.addEventListener('click', handleSpin);

/*----- functions -----*/

function handleSpin() {
  if (playerBalance < betAmount) {
    // Not enough balance to place a bet
    alert("Insufficient balance. Please add more credits.");
    return;
  }


  playerBalance -= betAmount;


  reelPositions = [
    getRandomSymbol(),
    getRandomSymbol(),
    getRandomSymbol()
  ];


  winningAmount = 0; // For now, assume no winnings


  playerBalance += winningAmount;


  render();
}

function getRandomSymbol() {
  const symbols = Object.keys(SM_LOOKUP);
  const randomIndex = Math.floor(Math.random() * symbols.length);
  return symbols[randomIndex];
}

function render() {
  pScoreEl.innerText = playerBalance;

}
function getWinner() {
  const symbolCounts = {};


  reelPositions.forEach(position => {
    symbolCounts[position] = (symbolCounts[position] || 0) + 1;
  });


  const winningCombinations = [
    { symbols: ['bar', 'bar', 'bar'], outcome: 'win' },
    { symbols: ['bell', 'bell', 'bell'], outcome: 'win' },

  ];

  // Check if any winning combination matches the reel positions
  const winningCombination = winningCombinations.find(combination => {
    return combination.symbols.every(symbol => symbolCounts[symbol] === 3);
  });

  return winningCombination ? winningCombination.outcome : 'lose';
}
