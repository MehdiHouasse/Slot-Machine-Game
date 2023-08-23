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
let symbolCounts = {};
let playerBalance;
let betAmount;
let reelPositions;
let winningAmount;
let stoppingPoint;

/*----- cached elements  -----*/
//const pResultEl = document.getElementById('p-result');
const doors = document.querySelectorAll('.door');
document.querySelectorAll('.door');

/*----- event listeners -----*/
document.querySelector('#spinner').addEventListener('click', handleSpin);
document.querySelector('#reseter').addEventListener('click', init);
document.querySelector('#place-bet').addEventListener('click', handlePlaceBet);


/*----- functions -----*/

function init() {
  playerBalance = 100;
  betAmount = 20;
  reelPositions = ['bell','bell','bell'];
  winningAmount = 0;
  currentSymbolIndex = 0;
  //startSpinAnimation();
  render();
}
// function renderResults() {
//   pResultEl.src = RPS_LOOKUP[results.p].img;
//   pResultEl.style.borderColor = winner === 'p' ? 'grey' : 'white';
// }
function render() {
  // if (reelPositions.length){
  doors.forEach((value,idx) => {
    value.style.backgroundImage = `url(${SM_LOOKUP[reelPositions[idx]].img})`;
  })
  // updateReelsAnimation();
  const outcome = getWinner();
  console.log(outcome);
  const winningAmountDisplay = document.getElementById('winning-amount-display');
  winningAmountDisplay.textContent = `Winning Amount: $${winningAmount}`;

}
function handlePlaceBet() {
  const betInput = document.getElementById('bet-amount');
  const userBet = parseInt(betInput.value);

  if (isNaN(userBet) || userBet <= 0 || userBet > playerBalance) {
    alert("Invalid bet amount. Please enter a valid bet.");
    return;
  }

  betAmount = userBet;
  playerBalance -= betAmount;
  render();
}
function startSpinAnimation() {
  const spinInterval = setInterval(() => {
    updateReelsAnimation();
  }, 100); // Adjust the interval as needed

  setTimeout(() => {
    clearInterval(spinInterval); // Stop the spinning animation after a certain time
    //stopReels();
    render();
  }, 3000); // Adjust the duration as needed
}
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

  playerBalance -= betAmount;
  stoppingPoint = Math.floor(Math.random() * SM_RATIO.length);
  startSpinAnimation();
  updateReelsAnimation();
  setTimeout(() => {

    //stopReels();
  }, 3000);
  playerBalance += winningAmount;
  winningAmount = 0;

  render();
}

//  let currentSymbolIndex = 0; //variable to keep track of the current symbol index
// function updateReelsAnimation(){
//   for (){

//   }
// }

function updateReelsAnimation() {
  for (let i = 0; i < doors.length; i++) {
    const symbolIndex = Math.floor(Math.random()*SM_RATIO.length)
    let symbol = SM_RATIO[symbolIndex]
    // const symbolContainer = doors[i].querySelector('.spin-container');
    doors[i].style.backgroundImage = `url(${SM_LOOKUP[symbol].img})`;
  }

  // currentSymbolIndex;
}


// function updateReelsAnimation() {
//   const symbolIndex = currentSymbolIndex % SM_RATIO.length;
//   console.log(symbolIndex)
//   doors[0].style.backgroundImage = `url(${SM_LOOKUP[SM_RATIO[symbolIndex]].img})`;
//   doors[1].style.backgroundImage = `url(${SM_LOOKUP[SM_RATIO[(symbolIndex + 1) % SM_RATIO.length]].img})`;
//   doors[2].style.backgroundImage = `url(${SM_LOOKUP[SM_RATIO[(symbolIndex + 2) % SM_RATIO.length]].img})`;

//   currentSymbolIndex++;

//   // if (currentSymbolIndex < SM_RATIO.length) {
//   //   requestAnimationFrame(updateReelsAnimation); //
//   // } else {
//   //   animationComplete();
//   // }
// }





function animationComplete() {
  stopReels();
  // Call render when the animation stops
}




// function stopReels() {
//   console.log(doors);
//   doors.forEach(reel => {
//     const symbolContainers = reel.querySelectorAll('.doors');
//     // console.log(symbolContainers);
//     symbolContainers.forEach(container => {
//       container.classList.toggle('spin-container', false);
//     });

//   });
//   console.log(reelPositions);
//   doors[0].style.backgroundImage = `url(${SM_LOOKUP[reelPositions[0]].img})`;
//   doors[1].style.backgroundImage = `url(${SM_LOOKUP[reelPositions[1]].img})`
//   doors[2].style.backgroundImage = `url(${SM_LOOKUP[reelPositions[2]].img})`
//    render();
// }

function getWinner() {
  // const symbolCounts = {};

  // for (let i = 0; i < 3; i++) {
  //   const randomIndex = Math.floor(Math.random() * SM_RATIO.length);
  //   reelPositions[i] = SM_RATIO[randomIndex];
  //   symbolCounts[reelPositions[i]] = (symbolCounts[reelPositions[i]] || 0) + 1;
  // }

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
console.log(winningCombination);
  winningAmount = winningCombination ? calculateWinningAmount() : 0;
  return winningCombination ? 'win' : 'lose';
}

function calculateWinningAmount() {
  const symbolsInWinningCombination = reelPositions[0];
  const occurrenceCount = reelPositions.filter(symbol => symbol === symbolsInWinningCombination).length;
  const payoutMultiplier = SM_LOOKUP[symbolsInWinningCombination].three;
  return betAmount * payoutMultiplier * occurrenceCount;
}

// Initialize the game
init();
