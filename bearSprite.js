 
(function() {

    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

(function () {
			
	var bear, background, bearImage, canvas, backgroundCanvas, backgroundImage, ballon;
    var ghostscanvas, ghost1, ghost2, ghost1Image, ghost2Image, bulletImage,bulletCanvasObj;
        
    var WIDTH = 1000;
    var HEIGHT = 600;
    var imageFile = "images/bear_.png";
    var imageGhost1 = "images/ghost1.gif";
    var imageGhost2 = "images/ghost2.gif";
    var imageBG = "images/cartoon-forest-landscape.jpg";
    var imageBullet = "images/bullet_.png";

	function gameLoop () {
	  window.requestAnimationFrame(gameLoop);
	  background.render();
      ghost1.render();
      ghost2.render();
	  bear.update();
	  bear.render();
      if (ballon != null) {
          ballon.update();
          ballon.render();
      }
	}
    
    function staticSprite (options) {
        var that = {};
		that.context = options.context;
        that.x = options.xPos;
		that.y = options.yPos;
		that.width = options.width;
		that.height = options.height;
		that.image = options.image;

		that.render = function () {
		  // Draw the animation
		  that.context.drawImage(
		    that.image,
		    that.x,
		    that.y,
            that.width,
            that.height);
		};

		return that;
	}

    function randomSprite (options) {

        var that = {};
		that.context = options.context;
        that.x = options.xPos;
		that.y = options.yPos;
		that.width = options.width;
		that.height = options.height;
		that.image = options.image;
        that.xOld = options.xPos;
        that.yOld = options.yPos;
        that.widthOld = options.width;
        that.heightOld = options.height;

        that.getRandomInt = function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

		that.render = function () {
          xPos = that.x + that.getRandomInt(-8, 8);
          if (xPos < WIDTH && xPos > 0) {
              that.xOld = that.x;
              that.x = xPos;
          }
          yPos = that.y + that.getRandomInt(-5, 5);
          if (yPos < HEIGHT + 300 && yPos > 0) {
              that.yOld = that.y;
              that.y = yPos;
          }
          sizeRan = that.getRandomInt(-10, 10);
          widthS = that.width + (Math.floor(that.width * sizeRan) / 100);
          if ( widthS < 200 && widthS > 50) {
              that.widthOld = that.width;
              that.width = widthS;
          }
          heightS = that.height + (Math.floor(that.height * sizeRan) / 100);
          if ( heightS < 250 && heightS > 50) {
              that.heightOld = that.height;
              that.height = heightS;
          }

          that.context.clearRect(that.xOld, that.yOld, that.widthOld, that.heightOld);
		  // Draw the animation
		  that.context.drawImage(
		    that.image,
		    that.x,
		    that.y,
            that.width,
            that.height
          );
		};

		return that;
	}

    function bulletSprite (options) {

        var that = {},
            frameIndex = 0,
            tickCount = 0,
            ticksPerFrame = options.ticksPerFrame || 0,
            numberOfFrames = options.numberOfFrames || 1;

        that.context = options.context;
        that.x = options.xPos;
        that.y = options.yPos;
        that.width = options.width;
        that.height = options.height;
        that.image = options.image;
        that.speed = options.speed;
        that.yOld = 0;
        this.render = true;

        that.update = function () {
            if (this.render == false) {
                return;
            }
            tickCount += 1;
            if (tickCount > ticksPerFrame) {
                tickCount = 0;
                // If the current frame index is in range
                if (frameIndex < numberOfFrames - 1) {
                    // Go to the next frame
                    frameIndex += 1;
                } else {
                    frameIndex = 0;
                }
            }
            if (that.y > (-that.height)) {
                that.yOld = that.y;
                that.y -= that.speed;
            } else {
                that.context.clearRect(that.x, 0, that.width, HEIGHT);
                this.render = false;
            }
        };

        that.render = function () {
            if (this.render == false) {
                return;
            }
            //clear
            that.context.clearRect(that.x, that.yOld, that.width, that.height);
            // Draw the animation
            that.context.drawImage(
                that.image,
                that.width * frameIndex,
                0,
                that.width,
                that.height,
                that.x,
                that.y,
                that.width,
                that.height
            );
        };

        return that;
    }

	function sprite (options) {

		var that = {},
			frameIndex = 0,
			tickCount = 0,
			ticksPerFrame = options.ticksPerFrame || 0,
			numberOfFrames = options.numberOfFrames || 1;

		that.context = options.context;
		that.width = options.width;
		that.height = options.height;
		that.image = options.image;
		that.x = options.xPos;
		that.y = options.yPos;
		that.speed = options.speed;

		that.update = function () {
            tickCount += 1;
            if (tickCount > ticksPerFrame) {
				tickCount = 0;
                // If the current frame index is in range
                if (frameIndex < numberOfFrames - 1) {	
                    // Go to the next frame
                    frameIndex += 1;
                } else {
                    frameIndex = 0;
                }
            }
        };

		that.render = function () {
		  // Clear the canvas
		  that.context.clearRect(0, that.y, WIDTH, that.height);
		  // Draw the animation
		  that.context.drawImage(
		    that.image,
		    that.width * frameIndex,
		    0,
		    that.width,
		    that.height,
			that.x,
			that.y,
			that.width,
		    that.height
			);
		};

	    this.KeyDown = function (evt){
			switch (evt.keyCode) {
				case 39:  /* Arrow to the right */
					if (that.x + that.width + that.speed < WIDTH) {
						that.x += that.speed;
					}
					break;
				case 37:  /* Arrow to the left */
					if (that.x > 0) {
						that.x -= that.speed;
					}
					break;
                case 32: /*throw ballons*/
                    ballon = bulletSprite({
                        context: bulletCanvasObj.getContext("2d"),
                        width: 35,
                        height: 35,
                        image: bulletImage,
                        xPos:  Math.floor(that.width / 2)  + that.x,
                        yPos: that.y,
                        numberOfFrames: 4,
                        ticksPerFrame: 4,
                        speed: 35
                    });
                    break;
			}
		}

		window.addEventListener('keydown', this.KeyDown);

		return that;
	}

	// Get canvas
	canvas = document.getElementById("bearAnimation");
	canvas.width = WIDTH;
	canvas.height = HEIGHT;
    backgroundCanvas = document.getElementById("background");
    backgroundCanvas.width = WIDTH;
    backgroundCanvas.height = HEIGHT;
    ghostscanvas = document.getElementById("ghosts");
	ghostscanvas.width = WIDTH;
	ghostscanvas.height = HEIGHT;
    bulletCanvasObj = document.getElementById("bulletCanvas");
    bulletCanvasObj.width = WIDTH;
    bulletCanvasObj.height = HEIGHT;

	// Create sprite sheet
	bearImage = new Image();
    bearImage.src = imageFile;
    backgroundImage = new Image();
    backgroundImage.src = imageBG;
    ghost1Image = new Image();
    ghost1Image.src = imageGhost1;
    ghost2Image = new Image();
    ghost2Image.src = imageGhost2;
    bulletImage = new Image();
    bulletImage.src = imageBullet;

	//Background
	background = staticSprite({
		context: backgroundCanvas.getContext("2d"),
		width: WIDTH, 
		height: HEIGHT,
		image: backgroundImage,
        xPos: 0,
		yPos: 0
	});
	// Create bear sprite
	bear = sprite({
		context: canvas.getContext("2d"),
		width: 200,
		height: 248,
		image: bearImage,
        numberOfFrames: 4,
		ticksPerFrame: 4,
		xPos: 0,
		yPos: 320,
		speed: 20
	});
    // Ghosts
    ghost1 = randomSprite({
		context: ghostscanvas.getContext("2d"),
		width: 50, 
		height: 50,
		image: ghost1Image,
        xPos: 720,
		yPos: 15
	});
    ghost2 = randomSprite({
		context: ghostscanvas.getContext("2d"),
		width: 50, 
		height: 50,
		image: ghost2Image,
        xPos: 270,
		yPos: 150
	});
    //ballon sprite
    ballon = null;

	// Load sprite sheet
	bearImage.addEventListener("load", gameLoop);

} ());

