function initSlick() {
  $(".raffle-course-list").slick({
    responsive: [
      {
        breakpoint: 2048,
        settings: "unslick"
      },
      {
        breakpoint: 768,
        settings: {
          variableWidth: true,
          arrows: false
        }
      }
    ]
  });
}
let lastX = window.innerWidth;
window.onresize = () => {
  // slick при переключении на моб устройства не правильно отрабатывает
  // По этому приходится писать этот код
  console.log(lastX)
  if (window.innerWidth <= 768 && lastX >= 768) initSlick();
  lastX = window.innerWidth;
}
initSlick();

function launchFullScreen(element) {
  if(element.requestFullScreen) {
    element.requestFullScreen();
  } else if(element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if(element.webkitRequestFullScreen) {
    element.webkitRequestFullScreen();
  }
}

let video = document.querySelector(".raffle-video");
let interval = null;
document.querySelectorAll(".raffle-start-btn").forEach(btn => {
    btn.onclick = function() {
    // На случай если браузер не вызывает событие onfullscreenchange
    if (!interval) {
      interval = setInterval(() => {
        if (!document.fullscreen) {
          video.pause();
        }
      }, 200)
    }
    launchFullScreen(video);
    video.play();
  }
})
video.onfullscreenchange = e => {
  let elem = e.target;
  let isFullscreen = document.fullscreenElement === elem;
  if (!isFullscreen) elem.pause(); 
}

// var fistWave = wavify( document.querySelector('.raffle-wave--first path'), {
//   height: 100,
//   bones: 4,
//   amplitude: 120,
//   color: '#c10931bb',
//   speed: .45
// })

// var secondWave = wavify( document.querySelector('.raffle-wave--second path'), {
//   height: 60,
//   bones: 5,
//   amplitude: 160,
//   color: '#c1093177',
//   speed: .35
// })
const getRandomAlpha = () => {
  let dict = ["a", "b", "c", "d", "e", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
  return dict[Math.floor(Math.random() * dict.length)] + dict[Math.floor(Math.random() * dict.length)]

}
document.querySelectorAll(".raffle-bg__part").forEach(part => {
  part.querySelectorAll("svg path").forEach(wave => {
    if (!wave.parentNode.classList.contains("raffle__wave--line")) {
      wavify(wave, {
        height: 100,
        bones: 4,
        amplitude: 100 + Math.floor(Math.random() * Math.floor(6)) * 10,
        color: '#c10931' + getRandomAlpha(),
        speed: .1 + Math.random() / 3
      })
    }
  })
})
wavify(document.querySelector(".raffle__wave--mobile"), {
  height: 20,
  bones: 4,
  amplitude: 200,
  color: '#c10931',
  speed: 0.4
})
document.querySelectorAll(".raffle__wave--line path").forEach(wave => {
  wavify(wave, {
    height: 100,
    bones: 4,
    amplitude: 100 + Math.floor(Math.random() * Math.floor(6)) * 10,
    color: "transparent",
    speed: .1 + Math.random() / 3
  })
})


const timer = {
  start: 1613497009493,
  el: null,
  secondsNow: 0,
  currentTime: 0,
  revert: false,
  mask: "a:aaa:aaa",
  splitter: ":",
  sign: false,
  allTime: 0,
  numberNums: -1,
  updateTimerView(seconds) {
    this.el.innerHTML = "";
    this.secondsNow = seconds;
    let padNum = this.numberNums == -1 ? String(this.secondsNow).length : this.numberNums;
    let secondsString = String(this.secondsNow).padStart(padNum, "0");
    let maskIndexes = this.mask.split("").map((e, i) => e === this.splitter ? i : null).filter(e => e != null);
    maskIndexes = maskIndexes.map((e, i) => e - i);
    let elementsTimerArr = [];
    secondsString.split("").map((n, i) => {
      if (maskIndexes.find(index => index === i)) {
        elementsTimerArr.push(this.getTemplateForNumber(this.splitter));
      }
      elementsTimerArr.push(this.getTemplateForNumber(n));
    });
    let createElemsFromText = text => {
      let body = document.createElement("body");
      body.innerHTML = text;
      return body.querySelectorAll("body > *");
    }
    let elems = createElemsFromText(elementsTimerArr.join(""));
    // createElemsFromText(elementsTimerArr.join("")).forEach(node => this.el.appendChild(node));
    elems.forEach(node => this.el.appendChild(node))
  },
  getTemplateForNumber(number) {
    return number = number == this.splitter ? `<span>${this.splitter}</span>` : `<span class="raffle-timer__num">${number}</span>`;
  },
  initTimerView() {
    let miliseconds = 0;
    if (this.revert && this.allTime) miliseconds = this.allTime - new Date() + this.start;
    else miliseconds = new Date() - this.start;
    this.currentTime = Math.floor(miliseconds / 1000);
    this.updateTimerView(this.currentTime);
  },
  init(el, conf = {}) {
    this.el = el;
    if (this.el) {
      if (conf.revert) {
        this.revert = conf.revert
        this.sign = -1;
      };
      if (conf.allTime) this.allTime = conf.allTime;
      if (conf.numberNums) this.numberNums = conf.numberNums;
      if (conf.mask) this.mask = conf.mask;
      this.initTimerView();
      setInterval(() => {
        this.currentTime -= 1;
        this.updateTimerView(this.currentTime);
      }, 1000)
    }
    else throw "element is not html tag";
    return this;
  }
}
let timerSecond = {};
Object.assign(timerSecond, timer);
timer.init(document.querySelector(".raffle-title__timer--positive"), {
  revert: true,
  allTime: 1000000000,
  numberNums: 7
});

timerSecond.init(document.querySelector(".raffle-title__timer--negative"), {
  numberNums: 8,
  mask: "00:00:00:00",
  revert: true,
  allTime: 1000000000,
});

// // Объект отвечает за анимацию кривых
// const animator = {
//   canvas: null,
//   ctx: null,
//   curves: [],
//   width: 0,
//   height: 0,
//   lineWidth: 1,
//   color: "black",
//   init(canvas, conf={}) {
//     this.canvas = canvas;
//     this.ctx = this.canvas.getContext("2d");
//     this.width = 500;
//     this.height = 500;
//     if (conf.color) this.color = conf.color;
//     if (conf.lineWidth) this.lineWidth = conf.lineWidth;
//   },
//   addRandomCurve() {
//     this.ctx.beginPath();
//     this.ctx.strokeStyle = this.color;
//     this.ctx.lineWidth = this.lineWidth;

//     let points = this.generateRandomPoints(10);
//     for (let i = 0; i < points.length; i+=2) {
//       this.ctx.quadraticCurveTo(...points[i], ...points[i + 1]);
//     }
//     this.ctx.stroke();
//   },
//   generateRandomPoints(pointsNum) {
//     if (!pointsNum) pointsNum = this.getRandomInt(10) + 5;
//     let x = 0;
//     let step = this.width / pointsNum;
//     let getRandomPolynom = () => {
//       let t = this.getRandomInt(this.width - 10) + 10;
//       let a = this.getRandomInt(10) - this.getRandomInt(10);
//       let b = this.getRandomInt(10) - this.getRandomInt(10);
//       let c = 1/3 * (2*b*t - a*t**2);
//       console.log((b + Math.sqrt(b*b - 3*a*c))/a)
//       return new Function("x", `return ${a} * (x**3) + ${b} * (x**2) + ${c} * x`)
//     }
//     let polynom = getRandomPolynom(10);
//     console.log(polynom)
//     return Array(pointsNum).fill(null).map(() => {
//       x += step;const adder = new Function('a', 'b', 'return a + b');
//       // console.log(polynom(x))
//       return [x, polynom(x)];
//     })
//   },
//   getRandomInt(max=3) {
//     return Math.floor(Math.random() * Math.floor(max));
//   }
// }

// animator.init(document.querySelector(".raffle__bg"), {
//   color: "#bc0037",
//   lineWidth: 2
// });
// animator.addRandomCurve();
// setInterval(() => {
//   animator.ctx.clearRect(0, 0, animator.width, animator.height);
//   animator.addRandomCurve();
// }, 1000)