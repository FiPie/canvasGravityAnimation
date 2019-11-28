//Initial Setup
var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');

var mouse = {
  x: undefined,
  y: undefined
};

var colourScheme = 1;
var colourArray = [
  ['#FCBB6D',
    '#D8737F',
    '#AB6C82',
    '#685D79',
    '#475C7A'
  ],
  ['#F8B195',
    '#F67280',
    '#C06C84',
    '#6C5B7B',
    '#355C7D'
  ],
  ['#E5FCC2',
    '#9DE0AD',
    '#45ADA8',
    '#547980',
    '#594F4F '
  ],
  ['#805C22',
    '#FFD591',
    '#FFB845',
    '#806A49',
    '#CC9337'
  ],
  ['#425780',
    '#D1E0FF',
    '#85ADFF',
    '#697080',
    '#6A8BCC'
  ]
];

var gravity = 1;
var friction = 0.9;
var quantity = 1;
var repulsiveForce = 1;
var actionRange = 150;


window.addEventListener('mousemove', function(event) {
  mouse.x = event.x;
  mouse.y = event.y;
});

window.addEventListener('resize', function() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init(quantity);
});

window.addEventListener('click', function() {
  init(quantity);
});

window.addEventListener('wheel', function(event) {
  event.preventDefault();
  if (quantity < 1) {
    quantity = 1;
  } else {
    quantity += event.deltaY;
  }
  init(quantity);
});

//useful functions
function randomColor(colourArray, colourScheme) {
  return colourArray[colourScheme][Math.floor(Math.random() * colourArray.length)];
};

function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

function distance(x1, y1, x2, y2) {
  let xDist = x2 - x1;
  let yDist = y2 - y1;
  return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
};

//Objects
function Ball(x, y, dx, dy, radius, color) {
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.radius = radius;
  this.color = color;

  this.update = function() {
    if (this.y + this.radius + this.dy > canvas.height) {
      //this changes the velocity in opposite direction after hitting bottom border of canvas
      this.dy = -this.dy * friction;
      this.dx = this.dx * 0.995;
    } else {
      //here we're adding gravity/acceleration
      this.dy += gravity;
    }

    if (this.x + this.radius + this.dx > canvas.width || this.x - this.radius < 0) {
      this.dx = -this.dx * friction;
    }

    this.x += this.dx;
    this.y += this.dy;

    //we check if the snowflakes are withing the actionRange from the mouse cursor
    if (distance(mouse.x, mouse.y, this.x, this.y) < actionRange) {
      if (this.x >= mouse.x && this.y >= mouse.y) {
        this.dx += repulsiveForce;
        this.dy += repulsiveForce;
      } else if (this.x >= mouse.x && this.y < mouse.y) {
        this.dx += repulsiveForce;
        this.dy -= repulsiveForce;
      } else if (this.x < mouse.x && this.y >= mouse.y) {
        this.dx -= repulsiveForce;
        this.dy += repulsiveForce;
      } else if (this.x < mouse.x && this.y < mouse.y) {
        this.dx -= repulsiveForce;
        this.dy -= repulsiveForce;
      }

      c.fillText("repulse!", mouse.x, mouse.y);
    }

    this.draw();
  };

  this.draw = function() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.stroke();
    c.closePath();
  };
}

//implementation
var ball;
var ballArray = [];


function init(quantity) {
  for (var i = 0; i < quantity; i++) {
    var radius = randomIntFromRange(3, 20);
    var x = randomIntFromRange(radius, canvas.width - radius);
    var y = randomIntFromRange(0, canvas.height - radius);
    var dx = randomIntFromRange(-2, 2);
    var dy = randomIntFromRange(-2, 2);

    var colour = randomColor(colourArray, colourScheme);
    ballArray.push(new Ball(x, y, dx, dy, radius, colour));
  }

}

//animation
function animate() {
  requestAnimationFrame(animate);

  c.clearRect(0, 0, canvas.width, canvas.height);

  for (var i = 0; i < ballArray.length; i++) {
    ballArray[i].update();
  }

}

init(quantity);
animate();