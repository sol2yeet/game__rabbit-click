'use strict';

//함수단위로 정의하면서 하나씩 메꾸어 나가기

//게임필드를 가져와서 아이템들을 추가할 공간을 만든다
//필드가 있는 위치(x, y, width, hight)를 알아내기위해 Rect 만듦

//함수를 호출하게 되면 당근과 벌래들을 5개씩 랜덤한 자리에 배치되도록 만들기 해당 기능을 게임필드에 추가

const CARROT_SIZE = 80;
const CARROT_COUNT = 20;
const BUG_COUNT = 20;
const GAME_DURATION_SEC = 20; //running time

const field = document.querySelector('.game__field');
const fieldRect = field.getBoundingClientRect();
const gameBtn = document.querySelector('.game__button');
const timerIndicator = document.querySelector('.game__timer');
const gameScore = document.querySelector('.game__score');

const popUp = document.querySelector('.pop-up');
const popUpText = document.querySelector('.pop-up__message');
const popUpRefresh = document.querySelector('.pop-up__refresh');

const carrotSound = new Audio('./sound/carrot_pull.mp3');
const alertSound = new Audio('./sound/alert.wav');
const bgSound = new Audio('./sound/bg.mp3');
const bugSound = new Audio('./sound/bug_pull.mp3');
const winSound = new Audio('./sound/game_win.mp3');

//variation for memory game`s status
let started = false; //when the game started
let score = 0; //Final score
let timer = undefined; //remain time (시작되지 않았을 때는 undefined)


//step 3

//Finishing the game
field.addEventListener('click', onFieldClick);

//step 2


//Press the play button to invoke the function
gameBtn.addEventListener('click', () => {
    if (started){
        stopGame();
    }else{
        startGame();
    }
});


popUpRefresh.addEventListener('click',() =>{
    startGame();
    hidePopup();
});

//function to start and stop game
//게임이 시작되면~~
function startGame() {
    started = true;
    initGame();
    showStopButton();
    showTimerAndScore();
    startGameTimer();
    playSound(bgSound);
  }

//게임이 끝나면~~
function stopGame(){
    started = false;
    stopGameTimer();
    hideGameButton();
    showPopUpWithText('REPLAY❓');
    playSound(alertSound);
    stopSound(bgSound);
}

function finishGame(win){
    started = false;
    hideGameButton();
    if (win) {
        playSound(winSound);
      } else {
        playSound(bugSound);
      }
    stopGameTimer();
    stopSound(bgSound);
    showPopUpWithText(win ? 'YOU WIN 🎉' : 'YOU LOST 💩')
}

function showStopButton(){
    const icon = gameBtn.querySelector('.fas');
    icon.classList.add('fa-stop');
    icon.classList.remove('fa-play');
    gameBtn.style.visibility = 'visible';
}

function hideGameButton(){
    gameBtn.style.visibility= 'hidden';
}

function showTimerAndScore(){
    timerIndicator.style.visibility = 'visible';
    gameScore.style.visibility ='visible';
}


//step 3


//Add timer
//Web API : SetInterval
//google : MDN create interval
function startGameTimer() {
    let remainingTimeSec = GAME_DURATION_SEC;
    updateTimerText(remainingTimeSec);

//Create interval repeatedly
timer = setInterval(() => {
    if (remainingTimeSec <= 0) {
      clearInterval(timer);
      finishGame(score === CARROT_COUNT);
      return;
    }

     //if문을 돌고나서 1초씩 감소하는 함수 호출 
     updateTimerText(--remainingTimeSec);
    }, 1000);
  }
  

  //stopping game button 
  function stopGameTimer(){
      clearInterval(timer);
  }

//함수 생성
function updateTimerText(time){
    //한번더 생각해보기
const minutes = Math.floor(time/60); //integer로 만들어주는 함수
const seconds = time % 60;
timerIndicator.innerHTML = `${minutes}:${seconds}`;
}



//step 4 


function showPopUpWithText(text){
 popUpText.innerHTML = text;
 popUp.classList.remove('pop-up--hide');
}

function hidePopUp(){
    popUp.classList.add('pop-up--hide');
}


// step 1


function initGame() { 
    score = 0;
    field.innerHTML = ''; //field 초기화
    gameScore.innerText = CARROT_COUNT;
    //벌레와 당근을 생성한 뒤 field에 추가해줌
    addItem('carrot', CARROT_COUNT, 'img/carrot.png');
    addItem('bug', BUG_COUNT, 'img/bug.png');
  }


  function onFieldClick(event) {
    if (!started) {
      return;
    }
    const target = event.target;
    if (target.matches('.carrot')) {
      // 당근!!
      target.remove();
      score++;
      playSound(carrotSound);
      updateScoreBoard();
      if (score === CARROT_COUNT) {
        finishGame(true);
      }
    } else if (target.matches('.bug')) {
      finishGame(false);
    }
  }
  
  function playSound(sound) {
    sound.currentTime = 0;
    sound.play();
  }


function stopSound(sound) {
    sound.pause();
  }

function updateScoreBoard(){
    gameScore.innerText = CARROT_COUNT - score;//Show remainig carrot number
}


//당근과 벌레의 position을 random으로 정해서 뿌려주기
//클래스의 이름, 아이템 갯수, 이미지경로를 추가해서 인자로 넘겨줌
//아이템을 absolute로 지정해주고 필드를 relative로 바꿔줌
//
function addItem(className, count, imgPath) {
    
    const x1 = 0;
    const y1 = 0;

    //item field 안에 아이템이 맞게 들어가도록 아이템 크기만큼 줄여주기
    const x2 = fieldRect.width - CARROT_SIZE;
    const y2 = fieldRect.height - CARROT_SIZE;

    //count만큼 반복시켜서 아이템을 여러개 뿌리기
    for (let i = 0; i < count; i++) {
        const item = document.createElement('img');
        item.setAttribute('class', className);
        item.setAttribute('src', imgPath);
        item.style.position = 'absolute';

        //getting random number
        const x = randomNumber(x1, x2);
        const y = randomNumber(y1, y2);
        item.style.left = `${x}px`;
        item.style.top = `${y}px`;

        //add item in feld
        field.appendChild(item);
    }
}

//specify item number upto min~ max (using math)
//google : javascript random number between two numbers
function randomNumber(min, max){
    return Math.random() * (max - min) + min;
}
