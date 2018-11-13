var getRandomNumber = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/* CircleScene Class */
function CircleScene(gravity, initCircles, offset, width) {
  // Constructor(...)
  this.canvas = document.getElementById('scene');
  this.colors = ["#4285f4", "#34a853", "#fbbc05", "#ea4335"];
  this.gravity = gravity; // 0.44;
  this.initCircles = initCircles;
  this.mouse = { x: 0, y: 0, isDown: false, index: -1 };
  this.ctx = this.canvas.getContext('2d');
  this.canvasOffset = offset;
  this.ctx.canvas.width = width;
  this.circles = [];
  this.collisionOn = true;
  
  for (var i = 0; i < initCircles; i++) {
    this.addCircle();
  }
};

CircleScene.prototype.resizeCanvas = function (width, height) {
  this.ctx.canvas.width = width;
  this.ctx.canvas.height = height;
};

CircleScene.prototype.setMousePosition = function (e) {
  if (e.which == 1) {
    this.mouse.x = e.pageX - this.canvas.offsetLeft - this.canvasOffset.left;
    this.mouse.y = e.pageY - this.canvas.offsetTop - this.canvasOffset.top - 63; //this.canvas.offsetTop;
  } else if (e.which == 0 && e.touches != null && e.touches.length > 0) {
    this.mouse.x = e.touches[0].pageX - this.canvas.offsetLeft - this.canvasOffset.left;
    this.mouse.y = e.touches[0].pageY - this.canvas.offsetTop - this.canvasOffset.top - 63;
  }
};

CircleScene.prototype.findNearestCircle = function findNearestCircle() {
  var circles = this.circles;
  var x = this.mouse.x; // mouse x-cord where the user just clicked/touched
  var y = this.mouse.y; // mouse y-cord where the user just clicked/touched
  
  for (var i = 0; i < circles.length; i++) {
    if (circles[i].x + circles[i].radius + 90 >= x && circles[i].x - circles[i].radius - 90 <= x &&
        circles[i].y + circles[i].radius + 90 >= y && circles[i].y - circles[i].radius - 90 <= y) {
      return i;
    }
  }
  
  return 0;
};

CircleScene.prototype.mouseDown = function (e) {
  if (e.which == 1) {
    // left-click only
    this.setMousePosition(e);
    var circleIndex = this.findNearestCircle();
    this.mouse.index = circleIndex;
    this.mouse.isDown = true;
    this.circles[circleIndex].x = this.mouse.x;
    this.circles[circleIndex].y = this.mouse.y;
  }
};

CircleScene.prototype.touchDown = function (e) {
  if (e.which == 0 && e.touches != null) {
    this.setMousePosition(e);
    var circleIndex = this.findNearestCircle();
    this.mouse.index = circleIndex;
    this.mouse.isDown = true;
    this.circles[circleIndex].x = this.mouse.x;
    this.circles[circleIndex].y = this.mouse.y;
  }
};

CircleScene.prototype.mouseUp = function (e) {
  if (e.which == 1) {
    // left-click only
    this.mouse.isDown = false;
    this.circles[this.mouse.index].dx = -1 * (this.circles[this.mouse.index].x - this.mouse.x) / 10;
    this.circles[this.mouse.index].dy = -1 * (this.circles[this.mouse.index].y - this.mouse.y) / 10;
  } else if (e.which == 0 && e.touches != null) {
    this.mouse.isDown = false;
    this.circles[this.mouse.index].dx = -1 * (this.circles[this.mouse.index].x - this.mouse.x) / 10;
    this.circles[this.mouse.index].dy = -1 * (this.circles[this.mouse.index].y - this.mouse.y) / 10;
  }
};

CircleScene.prototype.addCircle = function () {
  this.circles.push({
    radius: getRandomNumber(15, 20),
    x: getRandomNumber(3, this.ctx.canvas.width - 10),
    y: getRandomNumber(30, 300),
    dx: 0,
    dy: getRandomNumber(1, 4),
    color: this.colors[getRandomNumber(0, 3)],
    mass: 10,
    radiusFactor: -1
  });
};

CircleScene.prototype.handleWalls = function handleWalls(index) {
  var c = this.circles[index];
  if(c.x + c.dx > this.ctx.canvas.width - c.radius || c.x + c.dx < c.radius) {
    c.dx = -c.dx;
  }
  if(c.y + c.dy > (this.ctx.canvas.height - c.radius) || c.y + c.dy < c.radius) {
    c.dy = -c.dy - this.gravity;
  }
};

CircleScene.prototype.detectCollision = function (index) {
  var c1 = this.circles[index];
  for (var i = 0; i < this.circles.length; i++) {
    if (i != index) {
      var c2 = this.circles[i];
      var dx = c1.x - c2.x;
      var dy = c1.y - c2.y;
      var distanceSquared = dx * dx + dy * dy;
      
      if (distanceSquared <= (c1.radius + c2.radius) * (c1.radius + c2.radius)) {
        this.handleCollision(index, i);
        return;
      }
    }
  }
};

CircleScene.prototype.handleCollision = function (index1, index2) {
  var c1 = this.circles[index1];
  var c2 = this.circles[index2];
  
  var dist = Math.sqrt((c1.x - c2.x) * (c1.x - c2.x) + (c1.y - c2.y) * (c1.y - c2.y));
  var normX = (c2.x - c1.x) / dist;
  var normY = (c2.y - c1.y) / dist;
  var p = 2 * (c1.dx * normX + c1.dy * normY - c2.dx * normX - c2.dy * normY) / (c1.mass + c2.mass);
  var newDx1 = c1.dx - p * c1.mass * normX;
  var newDy1 = c1.dy - p * c1.mass * normY;
  var newDx2 = c2.dx + p * c2.mass * normX;
  var newDy2 = c2.dy + p * c2.mass * normY;
  
  this.circles[index1].dx = newDx1;
  this.circles[index1].dy = newDy1;
  
  this.circles[index2].dx = newDx2;
  this.circles[index2].dy = newDy2;
};

CircleScene.prototype.initEvents = function initEvents() {
  var self = this;
  // mouse
  this.canvas.onmousemove = function (e) {
    self.setMousePosition(e);
  };
  this.canvas.onmousedown = function(e) {
    self.mouseDown(e);
  };
  this.canvas.onmouseup = function(e) {
    self.mouseUp(e);
  };
  // touch
  this.canvas.addEventListener('touchstart', function (e) {
    self.touchDown(e);
  }, false);
  this.canvas.addEventListener('touchmove', function (e) {
    self.setMousePosition(e);
  }, false);
  this.canvas.addEventListener('touchend', function (e) {
    self.mouseUp(e);
  }, false);
};

CircleScene.prototype.renderCircle = function renderCircle(c) { 
  this.ctx.beginPath();
  this.ctx.arc(c.x, c.y, c.radius, 0, Math.PI*2);
  this.ctx.fillStyle = c.color;
  this.ctx.fill();
  this.ctx.closePath();
};

CircleScene.prototype.render = function render() {
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  
  for (var i = 0; i < this.circles.length; i++) {
    var c = this.circles[i];
    
    if (this.collisionOn) {
      this.detectCollision(i);
    }
    
    this.renderCircle(c);
    
    if (this.mouse.isDown && this.mouse.index == i) {
      // highlight selected circle
      var index = this.mouse.index;
      this.ctx.beginPath();
      this.ctx.moveTo(this.circles[index].x, this.circles[index].y);
      this.ctx.lineTo(this.mouse.x, this.mouse.y);
      this.ctx.stroke();
      this.ctx.closePath();
    } else {
      this.circles[i].dy += this.gravity;
      this.circles[i].x += this.circles[i].dx;
      this.circles[i].y += this.circles[i].dy;
      
      this.handleWalls(i);
    }
  }
};

(function($) {
  "use strict"; // Start of use strict
  
  var scene = null, interval = null;

  // Smooth scrolling using jQuery easing
  $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: (target.offset().top)
        }, 1000, "easeInOutExpo");
        return false;
      }
    }
  });

  // Closes responsive menu when a scroll trigger link is clicked
  $('.js-scroll-trigger').click(function() {
    $('.navbar-collapse').collapse('hide');
  });

  // Activate scrollspy to add active class to navbar items on scroll
  $('body').scrollspy({
    target: '#sideNav'
  });
  
  $('[data-toggle="tooltip"]').tooltip();
  
  $('#circleSceneBtn').click(function () {
    $('#circleSceneModal').modal({
      backdrop: 'static',
      keyboard: false
    });
    var offset = $('#dialog').offset();
    var width = $('#dialog').width();
    console.log('width', width);
    scene = new CircleScene(0.44, 2, offset, width - 10);
    scene.initEvents();
    interval = setInterval(function () {
      scene.render();
    }, 10);
  });
  
  $('#addBtn').click(function () {
    scene.addCircle();
  });
  
  $('#circleSceneModal').on('hide.bs.modal', function (e) {
    clearInterval(interval);
    interval = null;
    scene = null;
  });
  
  $('#collisionBtn').click(function () {
    if (scene.collisionOn) {
      $('#collisionBtn').removeClass('btn-success');
      $('#collisionBtn').addClass('btn-warning');
      scene.collisionOn = false;
      $('#collisionBtn').text('Collision is off');
    } else {
      $('#collisionBtn').removeClass('btn-warning');
      $('#collisionBtn').addClass('btn-success');
      $('#collisionBtn').text('Collision is on');
      scene.collisionOn = true;
    }
  });
  
  $('#grunt').click(function () {
    $('.easter-egg').removeClass('easter-egg');
  });
  
  $(window).resize(function () {
    var canvasWidth = $('#dialog').width();
    scene.resizeCanvas(canvasWidth, 480);
  });

})(jQuery); // End of use strict
