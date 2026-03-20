let blocks = Array.from(document.querySelectorAll(".game-blocks"));
let enterName = document.querySelector(".start_screen .start-btn");
let startScreen = document.querySelector(".start_screen");
let setUserName = document.querySelector(".name span");
let nameScreen = document.querySelector(".userName");
let nameField = document.querySelector("#username"); 
let nameButton = document.querySelector(".name_btn");
let triesElement = document.querySelector(".tries span");


/*Start Screen Logic*/
enterName.addEventListener('click', ()=>{
    startScreen.classList.add('hideScreen');
    nameScreen.classList.remove('hideScreen');
});


/*User Name*/
nameButton.addEventListener('click', ()=>{
    setName();
});


/*User Name Set*/
let setName = ()=>{
    if(nameField.value.trim() === ""){
        setUserName.innerHTML = "Unknown?";
    } else {
        setUserName.innerHTML = nameField.value;
    }

    nameScreen.remove();
};


/*Main var*/
let duration = 1000;
let flippedBlocks = [];
let wrongTries = 0;
let matchedCount = 0;
let isBusy = false;

let blockContainer = document.querySelector(".game-block-container");

//create array to add all the block on the single array
let eachBlock = Array.from(blockContainer.children);

//access enumerable index of each array block
let orderRange = Array.from(Array(eachBlock.length).keys());

shuffle(orderRange);

//add order property on each block
eachBlock.forEach((block, index) =>{
    block.style.order = orderRange[index];
});


//Shuffle Function
function shuffle(array){
    let currentIndex = array.length;

    while (currentIndex != 0){
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex --;

        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]] 
    }
}


//flip each block
blocks.forEach((block) => {
    block.addEventListener('click', flipBlock);
});

//Flip Block Function
function flipBlock() {

    if (isBusy) return;
    if (this.classList.contains("is-flipped") || this.classList.contains("is-match")) return;

    this.classList.add("is-flipped");
    flippedBlocks.push(this);

    if (flippedBlocks.length === 2) {

        isBusy = true;

        checkMatch(flippedBlocks[0], flippedBlocks[1]);

        setTimeout(() => {
            flippedBlocks = [];
            isBusy = false;
        }, duration);
    }
}


//Matched Blocks Function
function checkMatch(firstBlock, secondBlock){
    if(firstBlock.dataset.character === secondBlock.dataset.character){
        firstBlock.classList.remove("is-flipped");
        secondBlock.classList.remove("is-flipped");

        firstBlock.classList.add("is-match");
        secondBlock.classList.add("is-match");

        matchedCount += 2;

        playSound("success");

        checkWin();
    } else{

        wrongTries++;
        triesElement.textContent = wrongTries;

        playSound("fail");

        setTimeout(()=>{
            firstBlock.classList.remove("is-flipped");
            secondBlock.classList.remove("is-flipped");
        }, duration);
    }
}


//Win Condition
function checkWin() {
    if (matchedCount === blocks.length) {

        setTimeout(() => {
            playSound("win");
            document.getElementById("final-tries").textContent = wrongTries;
            document.getElementById("win-screen").classList.add("show");
        }, 500);
    }
}


//Sound Function
function playSound(type) {
    let sound;

    if (type === "success") sound = document.getElementById("success-sound");
    if (type === "fail") sound = document.getElementById("fail-sound");
    if (type === "win") sound = document.getElementById("win-sound");

    if (sound) {
        sound.currentTime = 0;
        sound.play();
    }
}


document.getElementById("play-again").addEventListener("click", function () {
    document.getElementById("win-screen").classList.remove("show");
    restartGame();
});

//Restart Function Logic
document.getElementById("restart-btn").addEventListener("click", restartGame);

function restartGame() {

    blocks.forEach(block => {
        block.classList.remove("is-flipped", "is-match");
    });

    wrongTries = 0;
    matchedCount = 0;
    flippedBlocks = [];
    isBusy = false;
    
    triesElement.textContent = 0;

    shuffle(orderRange);

    eachBlock.forEach((block, index) => {
        block.style.order = orderRange[index];
    });
}