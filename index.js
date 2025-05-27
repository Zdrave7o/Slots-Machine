const handleButton = document.getElementById("handle");
const reels = document.querySelectorAll(".reel");
const message = document.getElementById("message");
const slotMachine = document.querySelector(".slot-machine");

const slotMachineDisplay = document.querySelector("#slot-machine-display");
const welcomePage = document.querySelector("#mainPageSection");
const submitBtn = document.querySelector('#submitCredits');
const availableCreditsDisplay = document.querySelector("#availableCredits");
let credits = 0;

slotMachineDisplay.style.display = "none";

//array of image source in the reels
const images = ["Images/seven.png", 
    "Images/lemon.png", 
    "Images/cherries.png"];
let confettiInterval;

//function to enter the credits and show the slots machine
function enterCredits(){
    credits = Number(document.getElementById("creditInput").value);
    console.log(credits);
    
    if(credits < 100){
        window.prompt("You cannot enter less than 100 credits!");
    } else{
        // console.log(credits);//checkout if its working
        welcomePage.style.display = "none";
        slotMachineDisplay.style.display = "flex";
    }

    initializeReels();
}

submitBtn.addEventListener("click", enterCredits);


//initialize reels to show only one image at the start
function initializeReels(){
    //displaying the reels
    let randomNum = Math.floor(Math.random()*images.length);
    reels.forEach(reel => {
        reel.innerHTML = `<img src='${images[randomNum]}' alt="default">`; 
    });
    availableCreditsDisplay.textContent = `Available credits: ${credits}`;
}
//function to spin each reel
function spinReel(reel, duration){
    let index = Math.floor(Math.random()*images.length);

    return new Promise(resolve => {
        let startTime = Date.now();
        const interval = 100;

        const spin = setInterval(() => {
            index = (index + 1) % images.length;
            reel.innerHTML = `<img src='${images[index]}' 
            alt='${images[index]}'>`

            if(Date.now() - startTime >= duration){
                clearInterval(spin);
                resolve(images[index]);
            }
        }, interval)
    })
}
//function to create and display continous confetti
function startConfetti(){
    confettiInterval = setInterval(() =>{
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.backgroundColor = `hsl(${Math.random() * 
        360}, 100%; 50%;)`;

        document.body.appendChild(confetti);

        //remove confetti after if falls
        setTimeout(() => {
            confetti.remove();
        }, 1500);
    }, 200);
}
//function to stop confetti animation
function stopConfetti(){
    clearInterval(confettiInterval);
}

//main function to start the game
async function startGame(){
    let bet = Number(document.getElementById("bet").value);

    if (bet > credits) {
        window.prompt("insufficent funds!");
    } else if(bet <= 0){
        window.prompt("You cannot bet less than 1 credit!");
    } 
    else {
        message.textContent = "";

        //reset any previous effects
        slotMachine.classList.remove("loss", "win");
        stopConfetti();

        initializeReels();

        const results = await Promise.all([
            spinReel(reels[0], 2000),
            spinReel(reels[1], 3000),
            spinReel(reels[2], 4000),

        ]);

        handleButton.disabled = false;

        //check if all results are the same
        if (results[0] === results[1] && results[1] === results[2]) {
            credits += bet*3;
            message.textContent = `YOU WIN !`
            slotMachine.classList.add("win");
            availableCreditsDisplay.textContent = `Available credits: ${credits}`;

            startConfetti();
        } else {
            credits-=bet;
            console.log(credits);//debugging
            
            message.textContent = "Try Again"
            slotMachine.classList.add("loss");
            availableCreditsDisplay.textContent = `Available credits: ${credits}`;

            if(credits <= 0){
                window.alert("You Have Spent All Your Credits!")
            }
        }
    }
}
//initializing the reels on page load

function disableButton(){
    let interval = 4000;
    handleButton.disabled = true;

    setTimeout(() => {
        handleButton.disabled = false
        }, interval);

}

handleButton.addEventListener("click", () => {
  startGame();
  disableButton();
});