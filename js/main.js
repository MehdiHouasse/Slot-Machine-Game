/*----- constants -----*/
//maps symbols to their respective images and ratios
const SM_LOOKUP = {
  bar: { img: 'imgs/bar.png', two: 1, three: 2 },
  bell: { img: 'imgs/bell.png', two: 1, three: 2 },
  cherries: { img: 'imgs/cherries.png', two: 1, three: 2 },
  lemon: { img: 'imgs/lemon.png', two: 1, three: 2 },
  seven: { img: 'imgs/seven.png', two: 1, three: 2 },
};
// defines the sequence of symbols on the reels
const SM_RATIO = ['seven', 'bell', 'bell', 'lemon', 'lemon', 'lemon', 'bar', 'bar', 'bar', 'bar', 'cherries', 'cherries', 'cherries', 'cherries', 'cherries'];

/*----- state variables -----*/
//These variables are essential for keeping track of the game's progres.
let symbolCounts = {};
let playerBalance;
let betAmount;
let reelPositions;
let winningAmount;
let stoppingPoint;
let outcome;

/*----- cached elements  -----*/
const winSound = new Audio('sound/congrats.flac');
const spinAudio = new Audio('sound/sound.mp3');
const doors = document.querySelectorAll('.door');
document.querySelectorAll('.door');
const message = document.querySelector('.popup')

/*----- event listeners -----*/
document.querySelector('#spinner').addEventListener('click', handleSpin);
document.querySelector('#reseter').addEventListener('click', init);
document.querySelector('#place-bet').addEventListener('click', handlePlaceBet);
document.querySelector('#spinner').addEventListener('click', () => {
  const spinAudio = new Audio('sound/sound.mp3');
  spinAudio.addEventListener('ended', () => {
    spinAudio.pause();
    spinAudio.currentTime = 0; //
  });
  spinAudio.play();
  setTimeout(() => {
    spinAudio.pause();
  }, 3400);
  handleSpin();
});

document.addEventListener('DOMContentLoaded', () => {
  const spinButton = document.getElementById('spinner');

  spinButton.addEventListener('click', () => {
    // Simulate reel positions for this example
    const reelPositions = ['bell', 'bell', 'bell'];

    // Calculate winning amount based on reel positions
    const winningAmount = calculateWinningAmount(reelPositions);

    // Update playerBalance based on winning amount
    playerBalance += winningAmount;

    // Update balance display
    const balanceAmountElement = document.getElementById('balance-amount');
    balanceAmountElement.textContent = playerBalance;
    render();
  });
});


/*----- functions -----*/

function init() {
  playerBalance = 100;
  betAmount = 20;
  reelPositions = ['bell', 'bell', 'bell'];
  winningAmount = 0;
  currentSymbolIndex = 0;
  message.style.display = 'none';
  render();
}
//display reel images and manages the outcome of the game
function render() {
  doors.forEach((value, idx) => {
    value.style.backgroundImage = `url(${SM_LOOKUP[reelPositions[idx]].img})`;
    value.style.backgroundSize = 'cover';
  });

  outcome = getWinner();
  console.log(outcome)

  if (outcome === 'win') {
    const winningAmountDisplay = document.getElementById('winning-amount-display');
    winningAmountDisplay.textContent = `Winning Amount: $${winningAmount}`;

    setTimeout(() => {
      showWinPopup(winningAmount);
      winningAmount = 0; // Reset the winning amount after showing the popup
      winningAmountDisplay.textContent = `Winning Amount: $${winningAmount}`;
    }, 2000); // Adjust the duration as needed
  } else {
    const winningAmountDisplay = document.getElementById('winning-amount-display');
    winningAmountDisplay.textContent = `Winning Amount: $0`;
  }
}
//Handles user bets, updating the bet amount and player balance.
function handlePlaceBet() {
  const betInput = document.getElementById('bet-amount');
  const userBet = parseInt(betInput.value);

  if (userBet <= 0 || userBet > playerBalance) {
    alert("Invalid bet amount. Please enter a valid bet.");
    return;
  }

  betAmount = userBet;
  playerBalance -= betAmount;
  render();
}
//Initiates the spinning animation of the reels
function startSpinAnimation() {
  const spinInterval = setInterval(() => {
    updateReelsAnimation();
  }, 100); // Adjust the interval

  setTimeout(() => {
    clearInterval(spinInterval); // Stop the spinning animation after a certain time
    render();
  }, 3000);
}
//Simulates spinning the reels, updating the game's internal state,
//and triggering the spinning animation.
function handleSpin() {
  symbolCounts = {};

  for (let i = 0; i < 3; i++) {
    const randomIndex = Math.floor(Math.random() * SM_RATIO.length);
    reelPositions[i] = SM_RATIO[randomIndex];
    symbolCounts[reelPositions[i]] = (symbolCounts[reelPositions[i]] || 0) + 1;
  }

  if (playerBalance < betAmount) {
    alert("Insufficient balance. Please add more credits.");
    return;
  }

  playerBalance -= betAmount*2;
  stoppingPoint = Math.floor(Math.random() * SM_RATIO.length);
  startSpinAnimation();
  updateReelsAnimation();
  setTimeout(() => {
    playerBalance += winningAmount;
    outcome = getWinner();
    if (outcome === 'win') {
      showWinPopup(winningAmount);
      winningAmount = 0;
    }
    render();
  }, 3000);
}

//Updates the reel images during the spinning animation
function updateReelsAnimation() {
  for (let i = 0; i < doors.length; i++) {
    const symbolIndex = Math.floor(Math.random() * SM_RATIO.length)
    let symbol = SM_RATIO[symbolIndex]
    doors[i].style.backgroundImage = `url(${SM_LOOKUP[symbol].img})`;
  }

}
function animationComplete() {
  stopReels();
  // Call render when the animation stops
}

//Determines the winning outcome based on symbol combinations.
function getWinner() {


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
  return winningCombination ? 'win' : 'lose';
}
//Calculates the winning amount based on symbol occurrences and payout ratios.
function calculateWinningAmount() {
  const symbolsInWinningCombination = reelPositions[0];
  const occurrenceCount = reelPositions.filter(symbol => symbol === symbolsInWinningCombination).length;
  const payoutMultiplier = SM_LOOKUP[symbolsInWinningCombination].three;
  console.log('amount', betAmount * payoutMultiplier * occurrenceCount)
  return betAmount * payoutMultiplier * occurrenceCount;
}
//Displays a winning message with the winning amount,
 //and hides it after 5 sec.
function showWinPopup(winningAmount) {
  console.log('amount', winningAmount);
  if (winningAmount > 0) {
    message.style.display = 'block';
    message.textContent = `Congratulations! You won $${winningAmount}!`;
    message.classList.add('win-message');
    winSound.play();
    setTimeout(() => {
      message.classList.remove('win-message');
      message.style.display = 'none'; // Hide the popup after a certain duration
    }, 5000);
  }
}




// Initialize the game
init();
