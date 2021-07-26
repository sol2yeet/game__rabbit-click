'use strict';

//함수를 호출하게 되면 당근과 벌래들을 5개씩 랜덤한 자리에 배치되도록 만들기 해당 기능을 게임필드에 추가

const carrot_size = 80;
const carrot_count = 5;
const bug_count = 5;
const game_duration_sec = 5;

const field = document.querySelector('.game__field');
const fieldRect = field.getBoundingClientRect();
const gameBtn = document.querySelector('.game__button');
const gameTimer = document.querySelector('.game__timer');
const gameScore = document.querySelector('.game__score');

const popUp = document.querySelector('.pop-up');
const popUpText = document.querySelector('.pop-up__message');
const popUpRefresh = document.querySelector('.pop-up__refresh');

let started = false;
let score = 0;
let timer = undefined;

gameBtn.addEventListener('click', () => {
    if (started){
        stopGame();
      
    }else{
        startGame();
    }
    started = !started;
});

function startGame(){
initGame();
showStopButton();
showTimerAndScore();
startGameTimer();
}

function stopGame(){
    stopGameTimer();
    hideGameButton();
    showPopUpWithText('REPLAY❓');
}

function showStopButton(){
    const icon = gameBtn.querySelector('.fa-play');
    icon.classList.add('fa-stop');
    icon.classList.remove('fa-play');
}

function hideGameButton(){
    gameBtn.style.visibility="hidden";
}

function showTimerAndScore(){
    gameTimer.style.visibility ='visible';
    gameScore.style.visibility ='visible';
}


//timer 추가하기
function  startGameTimer(){
 let remainingTimeSec = game_duration_sec;
 updateTimerText(remainingTimeSec);
 timer = setInterval(()=> {
     if (remainingTimeSec <=0) {
         clearInterval(timer);
         return;
     }
     updateTimerText(--remainingTimeSec);
 }, 1000);
}

function  stopGameTimer(){
    clearInterval(timer);
}


function updateTimerText(time){
const minutes = Math.floor(time/60);
const seconds = time % 60;
gameTimer.innerText = `${minutes}:${seconds}`;
}


function showPopUpWithText(text){
 popUpText.innerHTML = text;
 popUp.classList.remove('pop-up--hide');
}

function initGame() { 
    //벌레와 당근을 생성한 뒤 field에 추가해줌
    field.innerHTML = '';
    gameScore.innerText = carrot_count;
    addItem('carrot', carrot_count, '/img/carrot.png'); //당근
    addItem('bug', bug_count, '/img/bug.png'); //벌레

}

//클래스의 이름, 아이템 갯수, 이미지경로를 추가해서 인자로 넘겨줌
function addItem(className, count, imgPath) {
    const x1 = 0;
    const y1 = 0;
    const x2 = fieldRect.width - carrot_size;
    const y2 = fieldRect.height - carrot_size;
    for (let i = 0; i < count; i++) {
        const item = document.createElement('img');
        item.setAttribute('class', className);
        item.setAttribute('src', imgPath);
        item.style.position = 'absolute';
        const x = randomNumber(x1, x2);
        const y = randomNumber(y1, y2);
        item.style.left = `${x}px`;
        item.style.top = `${y}px`;
        field.appendChild(item);
    }
}

function randomNumber(min, max){
    return Math.random() * (max - min) + min;
}

initGame();

// 타이머를 누르면 게임이 시작되고 score의 갯수가 올라간다
