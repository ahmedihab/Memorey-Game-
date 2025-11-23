// Global Timer Variable
let countdownInterval;
const gameDuration = 120; // 180 seconds

// Music Elements
const bgMusic = document.getElementById('background-music');
const winSound = document.getElementById('win');

// Function to play background music
function playBgMusic() {
    if (bgMusic) {
        bgMusic.volume = 0.3; // Lower the volume
        bgMusic.play().catch(e => console.log("Music play failed:", e));
    }
}

// Function to stop background music
function stopBgMusic() {
    if (bgMusic) {
        bgMusic.pause();
        bgMusic.currentTime = 0;
    }
}

// Function to start the timer
function startTimer() {
    let timerElement = document.querySelector('.timer span');
    let timeLeft = gameDuration;
    timerElement.innerHTML = timeLeft;

    countdownInterval = setInterval(() => {
        timeLeft--;
        timerElement.innerHTML = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            endGame(false); // Game over due to time
        }
    }, 1000);
}

// Function to check if all blocks are matched
function checkAllMatched() {
    let matchedBlocks = blocks.filter(block => block.classList.contains('has-match'));
    if (matchedBlocks.length === blocks.length) {
        clearInterval(countdownInterval);
        endGame(true); // Game over, user won!
    }
}

// Function to handle the end of the game (win or lose)
function endGame(isWin) {
    stopBgMusic();
    blocksContainer.classList.add('no-clicking'); // Prevent further clicks

    // Create a message overlay
    let finishDiv = document.createElement('div');
    finishDiv.className = 'finish-message';
    if (isWin) {
        finishDiv.innerHTML = `Congratulations  ${document.querySelector(".name span").innerHTML}! You Win!`;
        if (winSound) winSound.play();
    } else {
        finishDiv.innerHTML = `Time's Up! Game Over, ${document.querySelector(".name span").innerHTML}.`;
        document.getElementById('fail').play(); // Use the existing fail sound for a loss
    }
    document.body.appendChild(finishDiv);
}

// Function to save name to Local Storage and display it
function setPlayerName(name) {
    // Trim to remove whitespace and check for content
    let nameToSet = name ? name.trim() : '';

    if (nameToSet === '' || nameToSet === null) {
        // If the user cancels or enters nothing, set to 'Unknown'
        nameToSet = 'Unknown';
    }
    document.querySelector(".name span").innerHTML = nameToSet;
    localStorage.setItem('memoryGamePlayerName', nameToSet);
}

// Load name from Local Storage on script load
window.onload = function() {
    const savedName = localStorage.getItem('memoryGamePlayerName');
    const nameElement = document.querySelector(".name span");
    
    // Set the initial name display from storage, or use "Player" as a prompt default
    nameElement.innerHTML = savedName && savedName !== 'Unknown' ? savedName : 'Player';
};

// Select The Start Game Button
document.querySelector(".control-buttons span").onclick = function () {
    const nameElement = document.querySelector(".name span");
    let currentDisplayName = nameElement.innerHTML;
    
    // 1. Get the name stored in Local Storage to use as the default value in the prompt.
    const savedName = localStorage.getItem('memoryGamePlayerName');
    const defaultPromptValue = savedName && savedName !== 'Unknown' ? savedName : 'Player';

    // 2. ALWAYS Prompt the user for their name, using the saved name as the default.
    // The user MUST confirm or change the name before proceeding.
    let yourName = prompt("What's Your Name?", defaultPromptValue);
    
    // If the user clicks Cancel (prompt returns null), or submits an empty string,
    // we should prevent the game from starting, but since the requirement is to
    // write a name, we'll call setPlayerName which handles null/empty by setting 'Unknown'.

    // 3. Set the name and save it to Local Storage
    setPlayerName(yourName);
    
    // Check if the user clicked cancel and the name is now 'Unknown'. 
    // If you want to strictly prevent the game from starting on cancel, you'd add this check:
    // if (document.querySelector(".name span").innerHTML === 'Unknown' && yourName === null) {
    //     return; // Stop function execution if they cancel and we set it to Unknown
    // }
    
    // --- Start Game Logic ---
    
    // Remove Splash Screen
    document.querySelector(".control-buttons").remove();
    
    // Start Game Features
    playBgMusic();
    startTimer();
};

// ... (Rest of your code remains the same)


// Effect Duration
let duration = 1000;

// Select Blocks Container
let blocksContainer = document.querySelector(".memory-game-blocks");

// Create Array From Game Blocks
let blocks = Array.from(blocksContainer.children);

// Create Range Of Keys
let orderRange = [...Array(blocks.length).keys()];

shuffle(orderRange);

// Add Order Css Property To Game Blocks
blocks.forEach((block, index) => {

    // Add CSS Order Property
    block.style.order = orderRange[index];

    // Add Click Event
    block.addEventListener('click', function () {

        // Trigger The Flip Block Function
        flipBlock(block);

    });
});

// Flip Block Function
function flipBlock(selectedBlock) {

    // Add Class is-flipped
    selectedBlock.classList.add('is-flipped');

    // Collect All Flipped Cards
    let allFlippedBlocks = blocks.filter(flippedBlock => flippedBlock.classList.contains('is-flipped'));

    // If Theres Two Selected Blocks
    if (allFlippedBlocks.length === 2) {

        // Stop Clicking Function
        stopClicking();

        // Check Matched Block Function
        checkMatchedBlocks(allFlippedBlocks[0], allFlippedBlocks[1]);
    }
}

// Stop Clicking Function
function stopClicking() {

    // Add Class No Clicking on Main Container
    blocksContainer.classList.add('no-clicking');

    // Wait Duration
    setTimeout(() => {

        // Remove Class No Clicking After The Duration
        blocksContainer.classList.remove('no-clicking');

    }, duration);

}

// Check Matched Block
function checkMatchedBlocks(firstBlock, secondBlock) {

    let triesElement = document.querySelector('.tries span');

    if (firstBlock.dataset.technology === secondBlock.dataset.technology) {

        firstBlock.classList.remove('is-flipped');
        secondBlock.classList.remove('is-flipped');

        firstBlock.classList.add('has-match');
        secondBlock.classList.add('has-match');

        document.getElementById('success').play();
        
        // Check for win condition after a successful match
        setTimeout(checkAllMatched, duration);

    } else {

        triesElement.innerHTML = parseInt(triesElement.innerHTML) + 1;

        setTimeout(() => {

            firstBlock.classList.remove('is-flipped');
            secondBlock.classList.remove('is-flipped');

        }, duration);

        document.getElementById('fail').play();
    }
}


// Shuffle Function (no change)
function shuffle(array) {
    // ... (Your existing shuffle function)
    let current = array.length, temp, random;
    while (current > 0) {
        random = Math.floor(Math.random() * current);
        current--;
        temp = array[current];
        array[current] = array[random];
        array[random] = temp;
    }
    return array;
}