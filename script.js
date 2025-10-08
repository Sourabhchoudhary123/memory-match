// --- Game Configuration ---
const cardValues = ['🍍', '🍎', '🍇', '🍌','🍒','🍈','🥭','🧅']; // 8 unique values
const gameBoard = document.getElementById('game-board');
const restartBtn = document.getElementById('restart-btn');

// --- Game State Variables ---
let gameCards = [];
let flippedCards = [];
let matchedPairs = 0;
let lockBoard = false; // Flag to prevent flipping more than two cards

// --- Utility Function: Shuffle Array (Fisher-Yates Algorithm) ---
/**
 * Shuffles an array in place.
 * @param {Array} array - The array to shuffle.
 */
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// --- Initialization Function ---
function initializeGame() {
    // 1. Create the full set of cards (two of each value)
    gameCards = [...cardValues, ...cardValues];

    // 2. Shuffle the cards
    shuffle(gameCards);

    // 3. Clear the board and reset state
    gameBoard.innerHTML = '';
    flippedCards = [];
    matchedPairs = 0;
    lockBoard = false;
    gameBoard.classList.remove('disable-clicks'); // Ensure clicks are enabled

    // 4. Create and append the card DOM elements
    gameCards.forEach((value, index) => {
        const cardContainer = document.createElement('div');
        cardContainer.classList.add('card-container');
        cardContainer.dataset.value = value;
        cardContainer.dataset.index = index;
        cardContainer.addEventListener('click', flipCard);

        cardContainer.innerHTML = `
            <div class="card">
                <div class="card-face card-back">?</div>
                <div class="card-face card-front">${value}</div>
            </div>
        `;

        gameBoard.appendChild(cardContainer);
    });
}

// --- Card Flip Logic ---
function flipCard() {
    // Do nothing if the board is locked or the card is already flipped
    if (lockBoard || this.classList.contains('matched') || this === flippedCards[0]) return;

    // Add the 'flip' class to reveal the front
    this.querySelector('.card').classList.add('flip');
    flippedCards.push(this);

    // Check if two cards are flipped
    if (flippedCards.length === 2) {
        lockBoard = true; // Lock the board
        gameBoard.classList.add('disable-clicks'); // Add a class to disable clicks via CSS
        checkForMatch();
    }
}

// --- Match Checking Logic ---
function checkForMatch() {
    const [card1, card2] = flippedCards;
    const isMatch = card1.dataset.value === card2.dataset.value;

    if (isMatch) {
        // Match found: Keep cards flipped and mark them as matched
        card1.classList.add('matched');
        card2.classList.add('matched');
        handleMatch();
    } else {
        // No match: Flip cards back after a delay
        setTimeout(handleMismatch, 1000); // 1 second delay
    }
}

// --- Handle Match ---
function handleMatch() {
    matchedPairs++;
    resetBoard();

    // Check for win condition
    if (matchedPairs === cardValues.length) {
        setTimeout(() => {
            alert('🎉 Congratulations! You found all the pairs! 🎉');
        }, 300); // Small delay after last match is visually registered
    }
}

// --- Handle Mismatch ---
function handleMismatch() {
    // Remove the 'flip' class to hide the front face
    flippedCards.forEach(cardContainer => {
        cardContainer.querySelector('.card').classList.remove('flip');
    });

    resetBoard();
}

// --- Reset Flipped Cards and Unlock Board ---
function resetBoard() {
    flippedCards = [];
    lockBoard = false;
    gameBoard.classList.remove('disable-clicks');
}

// --- Restart Function ---
function restartGame() {
    initializeGame();
}

// --- Event Listeners ---
restartBtn.addEventListener('click', restartGame);

// --- Start the game for the first time ---
initializeGame();