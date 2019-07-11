// Get reference to Canvas
var canvas = document.getElementById('canvas');

// Get reference to Canvas Context
var context = canvas.getContext('2d');

// Get reference to loading screen
var loading_screen = document.getElementById('loading');

// Initialize loading variables
var loaded = false;
var load_counter = 0;

//intialise images for layers
var background = new Image();
var moon = new Image();
var clouds = new Image();
var mid_tree = new Image();
var back_tree  = new Image();
var leaves_back = new Image();
var shadows = new Image();
var panther = new Image();
var front_tree = new Image();
var leaves_front = new Image();
var mask = new Image();
var lights_back = new Image();
var lights_front = new Image();



//create list of layer objects
var layer_list =[
    {
        'image': background, 
        'src': './layers/background.png',
        'z_index': -3.95,
        'position': {x: 0, y:0},
        'blend': null,
        'opasity': 1
    },
    {
        'image': moon, 
        'src': './layers/moon.png',
        'z_index': -3.85,
        'position': {x: 0, y:0},
        'blend': null,
        'opasity': 1
    },
    {
        'image': clouds, 
        'src': './layers/clouds.png',
        'z_index': -3.15,
        'position': {x: 0, y:0},
        'blend': null, 
        'opasity': 1
    },
    {
        'image': mid_tree, 
        'src': './layers/mid_tree.png',
        'z_index': -3,
        'position': {x: 0, y:0},
        'blend': null,
        'opasity': 1
    },
    {
        'image': back_tree, 
        'src': './layers/back_tree.png',
        'z_index': -2.75,
        'position': {x: 0, y:0},
        'blend': null,
        'opasity': 1
    },
    {
        'image': leaves_back, 
        'src': './layers/leaves_back.png',
        'z_index': -2.25,
        'position': {x: 0, y:0},
        'blend': null,
        'opasity': 1
    },
    {
        'image': shadows, 
        'src': './layers/shadows.png',
        'z_index': -1.75,
        'position': {x: 0, y:0},
        'blend': 'multiply', //may need to add blend mode same as procreate//
        'opasity': 1
    },
    {
        'image': panther, 
        'src': './layers/panther.png',
        'z_index': -1.25,
        'position': {x: 0, y:0},
        'blend': null,
        'opasity': 1
    },
    {
        'image': front_tree, 
        'src': './layers/front_tree.png',
        'z_index': -1, 
        'position': {x: 0, y:0},
        'blend': null,
        'opasity': 1
    }, 
    {
        'image': leaves_front, 
        'src': './layers/leaves_front.png',
        'z_index': -0.25,
        'position': {x: 0, y:0},
        'blend': null,
        'opasity': 1
    },
    {
        'image': mask, 
        'src': './layers/mask.png',
        'z_index': 0, // centre of rotaion - stay in place
        'position': {x: 0, y:0},
        'blend': null,
        'opasity': 1
    },
    {
        'image': lights_back, 
        'src': './layers/lights_back.png',
        'z_index': 1,
        'position': {x: 0, y:0},
        'blend': null,
        'opasity': 1
    },
    {
        'image': lights_front, 
        'src': './layers/lights_front.png',
        'z_index': 1.25,
        'position': {x: 0, y:0},
        'blend': null,
        'opasity': 1
    },
];

// Go through the list of layer objects and load images from source
// When all images are loaded, the loading screen will be hidden, and the render loop will start running
layer_list.forEach(function(layer, index) {
	// This is a function to run when the image is loaded
	layer.image.onload = function() {
		// Add 1 to the load counter
		load_counter += 1;
		// Checks if all the images are loaded
		if (load_counter >= layer_list.length) {
			// remove loading mask here
			hideLoading();
			// Start the render Loop!
			requestAnimationFrame(drawCanvas);
		}
	};
	// This actually tells the image to load
	layer.image.src = layer.src;
});

// Function to hide the loading mask
function hideLoading() {
	loading_screen.classList.add('hidden');
}

// Draw layers in Canvas
function drawCanvas() {
	// Erase everything currently on the canvas
	context.clearRect(0, 0, canvas.width, canvas.height);
	
	// This is needed for the animation to snap back to center when you release mouse or touch
	TWEEN.update();
	
	// Calculate how much the canvas should be rotated
	var rotate_x = (pointer.y * -0.15) + (motion.y * 1.2);
	var rotate_y = (pointer.x * 0.15) + (motion.x * 1.2);
	
	// Actually rotate the canvas
	canvas.style.transform = "rotateX(" + rotate_x + "deg) rotateY(" + rotate_y + "deg)";
		
	// Loop through each layer in the list and draw it to the canvas
	layer_list.forEach(function(layer, index) {
		
		// Calculate what the position of the layer should be (getOffset function is below)
		layer.position = getOffset(layer);
		
		// If the layer has a blend mode set, use that blend mode, otherwise use normal
		if (layer.blend) {
			context.globalCompositeOperation = layer.blend;
		} else {
			context.globalCompositeOperation = 'normal';
		}
		// Set the opacity of the layer
		context.globalAlpha = layer.opacity;
		// Draw the layer into the canvas context
		context.drawImage(layer.image, layer.position.x, layer.position.y);
	});
	
	// Loop this function! requestAnimationFrame is a special built in function that can draw to the canvas at 60 frames per second
	// NOTE: do not call drawCanvas() without using requestAnimationFrame here—things will crash!
	requestAnimationFrame(drawCanvas);
}

// Function to calculate layer offset
function getOffset(layer) {
	// Calculate the amount you want the layers to move based on touch or mouse input.
	// You can play with the touch_multiplier variable here. Depending on the size of your canvas you may want to turn it up or down.
	var touch_multiplier = 0.3;
	var touch_offset_x = pointer.x * layer.z_index * touch_multiplier;
	var touch_offset_y = pointer.y * layer.z_index * touch_multiplier;
	
	// Calculate the amount you want the layers to move based on the gyroscope
	// You can play with the motion_multiplier variable here. Depending on the size of your canvas you may want to turn it up or down.
	var motion_multiplier = 2.5;
	var motion_offset_x = motion.x * layer.z_index * motion_multiplier;
	var motion_offset_y = motion.y * layer.z_index * motion_multiplier;
	
	// Calculate the total offset for both X and Y
	// Total offset is a combination of touch and motion
	var offset = {
		x: touch_offset_x + motion_offset_x,
		y: touch_offset_y + motion_offset_y
	};

	// Return the calculated offset to whatever requested it.
	return offset;
}




//// TOUCH AND MOUSE CONTROLS ////

// Initialize variables for touch and mouse-based parallax

// This is a variable we're using to only move things when you're touching the screen, or holding the mouse button down.
var moving = false;

// Initialize touch and mouse position
var pointer_initial = {
	x: 0,
	y: 0
};
var pointer = {
	x: 0,
	y: 0
};

// This one listens for when you start touching the canvas element
canvas.addEventListener('touchstart', pointerStart);
// This one listens for when you start clicking on the canvas (when you press the mouse button down)
canvas.addEventListener('mousedown', pointerStart);

// Runs when touch or mouse click starts
function pointerStart(event) {
	// Ok, you touched the screen or clicked, now things can move until you stop doing that
	moving = true;
	// Check if this is a touch event
	if (event.type === 'touchstart') {
		// set initial touch position to the coordinates where you first touched the screen
		pointer_initial.x = event.touches[0].clientX;
		pointer_initial.y = event.touches[0].clientY;
	// Check if this is a mouse click event
	} else if (event.type === 'mousedown') {
		// set initial mouse position to the coordinates where you first clicked
		pointer_initial.x = event.clientX;
		pointer_initial.y = event.clientY;
	}
}


// This runs whenever your finger moves anywhere in the browser window
window.addEventListener('mousemove', pointerMove);
// This runs whenever your mouse moves anywhere in the browser window
window.addEventListener('touchmove', pointerMove);

// Runs when touch or mouse is moved
function pointerMove(event) {
	// This is important to prevent scrolling the page instead of moving layers around
	event.preventDefault();
	// Only run this if touch or mouse click has started
	if (moving === true) {
		var current_x = 0;
		var current_y = 0;
		// Check if this is a touch event
		if (event.type === 'touchmove') {
			// Current position of touch
			current_x = event.touches[0].clientX;
			current_y = event.touches[0].clientY;
		// Check if this is a mouse event
		} else if (event.type === 'mousemove') {
			// Current position of mouse cursor
			current_x = event.clientX;
			current_y = event.clientY;
		}
		// Set pointer position to the difference between current position and initial position
		pointer.x = current_x - pointer_initial.x;
		pointer.y = current_y - pointer_initial.y; 
	}
};

// Listen to any time you move your finger in the canvas element
canvas.addEventListener('touchmove', function(event) {
	// Don't scroll the screen
	event.preventDefault();
});
// Listen to any time you move your mouse in the canvas element
canvas.addEventListener('mousemove', function(event) {
	// Don't do whatever would normally happen when you click and drag
	event.preventDefault();
});

// Listen for when you stop touching the screen
window.addEventListener('touchend', function(event) {
	// Run the endGesture function (below)
	endGesture();
});
// Listen for when you release the mouse button anywhere on the screen
window.addEventListener('mouseup', function(event) {
	// Run the endGesture function (below)
	endGesture();
});


function endGesture() {
	// You aren't touching or clicking anymore, so set this back to false
	moving = false;
	
	// This removes any in progress tweens
	TWEEN.removeAll();
	// This starts the animation to reset the position of all layers when you stop moving them
	var pointer_tween = new TWEEN.Tween(pointer).to({x: 0, y: 0}, 300).easing(TWEEN.Easing.Back.Out).start();	
}


//// MOTION CONTROLS ////

// Initialize variables for motion-based parallax
var motion_initial = {
	x: null,
	y: null
};
var motion = {
	x: 0,
	y: 0
};

// This is where we listen to the gyroscope position
window.addEventListener('deviceorientation', function(event) {
	// If this is the first run through here, set the initial position of the gyroscope
	if (!motion_initial.x && !motion_initial.y) {
		motion_initial.y = event.beta;
		motion_initial.x = event.gamma;
	}
	
	// Depending on what orientation the device is in, you need to adjust what each gyroscope axis means
	// This can be a bit tricky
    if (window.orientation === 0) {
    	// The device is right-side up in portrait orientation
    	motion.y = event.gamma - motion_initial.x;
    	motion.x = event.beta - motion_initial.y;
    } else if (window.orientation === 90) {
    	// The device is in landscape laying on its left side
    	motion.y = event.beta - motion_initial.y;
    	motion.x = -event.gamma + motion_initial.x;
    } else if (window.orientation === -90) {
    	// The device is in landscape laying on its right side
    	motion.y = -event.beta + motion_initial.y;
    	motion.x = event.gamma - motion_initial.x;
    } else {
    	// The device is upside-down in portrait orientation
		motion.y = -event.gamma + motion_initial.x;
		motion.x = -event.beta + motion_initial.y;
    }

	// This is optional, but prevents things from moving too far (because these are 2d images it can look broken)
	var max_offset = 23;
    
    // Check if magnitude of motion offset along X axis is greater than your max setting
    if (Math.abs(motion.x) > max_offset) {
    	// Check whether offset is positive or negative, and make sure to keep it that way
    	if (motion.x < 0) {
    		motion.x = -max_offset;
    	} else {
    		motion.x = max_offset;
    	}
    }
    // Check if magnitude of motion offset along Y axis is greater than your max setting
    if (Math.abs(motion.y) > max_offset) {
    	// Check whether offset is positive or negative, and make sure to keep it that way
    	if (motion.y < 0) {
    		motion.y = -max_offset;
    	} else {
    		motion.y = max_offset;
    	}
    }
});

// Reset the position of motion controls when device changes between portrait and landscape, etc.
window.addEventListener('orientationchange', function(event) {
	motion_initial.x = 0;
	motion_initial.y = 0;
});
