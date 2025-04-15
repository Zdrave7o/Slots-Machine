const handleButton = document.getElementById("handle");
const reels = document.querySelectorAll(".reel");
const message = document.getElementById("message");
const slotMachine = document.querySelector(".slot-machine");


//array of image source in the reels
const images = ["Images/seven.png", 
    "Images/lemon.png", 
    "Images/cherries.png"];
let confettiInterval;

//initialize reels to show only one image at the start
function initializeReels(){
    //changing the reels images
    let intervalTime = 1;
    const countDown = setInterval(() =>{
        intervalTime--;

        if(intervalTime <= 0){
            clearInterval(countDown);
            initializeReels();
        }
    }, 1000);

    //displaying the reels
    let randomNum = Math.floor(Math.random()*images.length);
    reels.forEach(reel => {
        reel.innerHTML = `<img src='${images[randomNum]}' alt="default">`; 
    });

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
//initializing the reels on page load
initializeReels();