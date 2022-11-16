const cards = document.querySelectorAll(".card"),
timeTag = document.querySelector(".time b"),
flipsTag = document.querySelector(".flips b"),
leftFlipsTag = document.querySelector(".left-flips b"),
refreshBtn = document.querySelector(".details button");

let maxTime = 20;
let timeLeft = maxTime;
let flips = 0;
let leftFlips = 0;
let matchedCard = 0;
let disableDeck = false;
let isPlaying = false;
let cardOne, cardTwo, timer;


function initTimer() {
  if (timeLeft <= 0) {
    swal({
      text: "Game Over !\nYou Lose",
      buttons: {
        ok:{
            text: "OK!",
            closeModal: false,
        },
        cancel: "try again",
      },
    })
      .then((value) => {
        switch (value){
            case "ok":
                window.location.href = "./gameOver.html";
                break;
            default :
                swal("good luck");            
        }
      })
      .catch((err) => {
        if (err) {
          console.log(err);
        } else {
          swal.stopLoading();
          swal.close();
        }
      });
    return clearInterval(timer);
  }
  timeLeft--;
  timeTag.innerText = timeLeft;
}

function flipCard({ target: clickedCard }) {
  if (!isPlaying) {
    isPlaying = true;
    timer = setInterval(initTimer, 1000);
  }
  if (
    clickedCard !== cardOne &&
    !disableDeck &&
    timeLeft > 0 &&
    leftFlips > 0
  ) {
    clickedCard.classList.add("flip");
    if (!cardOne) {
      return (cardOne = clickedCard);
    }
    flips++;
    flipsTag.innerText = flips;
    leftFlips--;
    leftFlipsTag.innerText = leftFlips;
    cardTwo = clickedCard;
    disableDeck = true;
    let cardOneImg = cardOne.querySelector(".back-view img").src,
      cardTwoImg = cardTwo.querySelector(".back-view img").src;
    matchCards(cardOneImg, cardTwoImg);
    if(leftFlips <=0){
        swal({
            text: "Game Over !\nYou Lose",
            buttons: {
              ok:{
                  text: "OK!",
                  closeModal: false,
              },
              cancel: "try again",
            },
          })
            .then((value) => {
              switch (value){
                  case "ok":
                      window.location.href = "./gameOver.html";
                      break;
                  default :
                      swal("good luck");            
              }
            })
            .catch((err) => {
              if (err) {
                console.log(err);
              } else {
                swal.stopLoading();
                swal.close();
              }
            });
    }
  }
}

function matchCards(img1, img2) {
  if (img1 === img2) {
    matchedCard++;
    if (matchedCard == 6 && timeLeft > 0) {
        clearInterval(timer);
        swal({
            text: "Congratulation !\nYou Win",
            content: {
              element: "input",
              attributes: {
                placeholder: "Save your name",
                type: "text",
              },
            },
            button: {
                  text: "OK!",
                  closeModal: false,
              },
          })
            .then((name) => {
              let dt = JSON.parse(localStorage.getItem("data"));
              if(dt === null){
                  localStorage.setItem('data', 
                      JSON.stringify(
                      [
                          {
                              "id" : 1,
                              "name" : name,
                              "maxFlips" : localStorage.getItem('limitFlip'),
                              "flips" : flips,
                              "limitTime" : localStorage.getItem('limitTime'),
                              "lefttime" : timeLeft,
                          }
                      ]
                      ));
              }else{
                  localStorage.setItem('data', 
                      JSON.stringify(
                      [...dt,
                          {
                              "id" : localStorage.getItem('data').length + 1,
                              "name" : name,
                              "maxFlips" : localStorage.getItem('limitFlip'),
                              "flips" : flips,
                              "limitTime" : localStorage.getItem('limitTime'),
                              "lefttime" : timeLeft,
                          }
                      ]
                  ));
              }
              clearInterval(timer);
              window.location.href = "./gameOver.html";
            })
            .catch((err) => {
              if (err) {
                console.log(err);
              } else {
                swal.stopLoading();
                swal.close();
              }
            });
    }
    cardOne.removeEventListener("click", flipCard);
    cardTwo.removeEventListener("click", flipCard);
    cardOne = cardTwo = "";
    return (disableDeck = false);
  }

  setTimeout(() => {
    cardOne.classList.add("shake");
    cardTwo.classList.add("shake");
  }, 400);

  setTimeout(() => {
    cardOne.classList.remove("shake", "flip");
    cardTwo.classList.remove("shake", "flip");
    cardOne = cardTwo = "";
    disableDeck = false;
  }, 1200);
}

function shuffleCard() {
  maxFlips = localStorage.getItem("limitTime");
  timeLeft = maxFlips;
  flips = matchedCard = 0;
  cardOne = cardTwo = "";
  clearInterval(timer);
  timeTag.innerText = timeLeft;
  leftFlips = localStorage.getItem("limitFlip");
  flipsTag.innerText = flips;
  leftFlipsTag.innerText = leftFlips;
  disableDeck = isPlaying = false;

  let arr = [1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6];
  arr.sort(() => (Math.random() > 0.5 ? 1 : -1));
  let firstWord = "HSDC".charAt(Math.floor(Math.random() * 4));
  cards.forEach((card, index) => {
    card.classList.remove("flip");
    let imgTag = card.querySelector(".back-view img");
    setTimeout(() => {
      imgTag.src = `images/PNG/${arr[index]}${firstWord}.png`;
    }, 500);
    card.addEventListener("click", flipCard);
  });
}

shuffleCard();

refreshBtn.addEventListener("click", shuffleCard);

cards.forEach((card) => {
  card.addEventListener("click", flipCard);
});


