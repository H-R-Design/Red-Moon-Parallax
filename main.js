//get ref to canvas
var canvas = document.getElementById('canvas');

//get ref to canvas context 
var context = canvas.getContext('2d');

// get ref to loading screen
// Get reference to loading screen
var loading_screen = document.getElementById('loading');

// initialise loading variables 
var loaded = false;
var load_counter = 0;

//intialise images for layers
var background = new image();
var tree_back = new image();
var moon = new image();
var clouds = new image();
var tree_mid  = new image();
var floaties_1 = new image();
var tree_front = new image();
var leaf_back = new image();
var shadows = new image();
var mask = new image();
var panther = new image();
var leaves_left = new image();
var leaves_right = new image();
var floaties_2 = new image();

//create list of layer objects
var layer_list =[
    {
        'image': background, 
        'src': './layers/',
        'z_index': -4.25,
        'position': {x: 0, y:0},
        'blend': null,
        'opasity': 1
    },
    {
        'image': tree_back, 
        'src': './layers/',
        'z_index': -4,
        'position': {x: 0, y:0},
        'blend': null,
        'opasity': 1
    },
    {
        'image': moon, 
        'src': './layers/',
        'z_index': -3.25,
        'position': {x: 0, y:0},
        'blend': null, //may need to add blend mode same as procreate//
        'opasity': 1
    },
    {
        'image': clouds, 
        'src': './layers/',
        'z_index': -3,
        'position': {x: 0, y:0},
        'blend': null,
        'opasity': 1
    },
    {
        'image': tree_mid, 
        'src': './layers/',
        'z_index': -2.25,
        'position': {x: 0, y:0},
        'blend': null,
        'opasity': 1
    },
    {
        'image': floaties_1, 
        'src': './layers/',
        'z_index': -2,
        'position': {x: 0, y:0},
        'blend': null,
        'opasity': 1
    },
    {
        'image': tree_front, 
        'src': './layers/',
        'z_index': -1.25,
        'position': {x: 0, y:0},
        'blend': null,
        'opasity': 1
    },
    {
        'image': leaf_back, 
        'src': './layers/',
        'z_index': -1,
        'position': {x: 0, y:0},
        'blend': null,
        'opasity': 1
    },
    {
        'image': shadows, 
        'src': './layers/',
        'z_index': -0.25,
        'position': {x: 0, y:0},
        'blend': null,
        'opasity': 1
    },
    {
        'image': mask, 
        'src': './layers/',
        'z_index': 0, // centre of rotaion - stay in place
        'position': {x: 0, y:0},
        'blend': null,
        'opasity': 1
    }, //look to be forward in space
    {
        'image': panther, 
        'src': './layers/',
        'z_index': 0.25,
        'position': {x: 0, y:0},
        'blend': null,
        'opasity': 1
    },
    {
        'image': leaves_left, 
        'src': './layers/',
        'z_index': 1,
        'position': {x: 0, y:0},
        'blend': null,
        'opasity': 1
    },
    {
        'image': leaves_right, 
        'src': './layers/',
        'z_index': 1.25,
        'position': {x: 0, y:0},
        'blend': null,
        'opasity': 1
    },
    {
        'image': floaties_2, 
        'src': './layers/',
        'z_index': 2,
        'position': {x: 0, y:0},
        'blend': null,
        'opasity': 1
    },

];

layer_list.forEach(function(layer,index){
    layer.image.onload = function(){
        load_counter +=1;
        if(load_counter >= layer_list.length){
            hideLoading();
            requestAnimationFrame(drawCanvas);
        }
    }
    layer.image.src = layer.src;
});

function hideLoading() {
	loading_screen.classList.add('hidden');
}

function drawCanvas(){
    // clear canvas 
    context.clearRect(0,0, canvas.width, canvas.height);

    TWEEN.update();
    // calculate how much canvas should rotate
    var rotate_x = (pointer.y * -0.15) + (motion.y * -1.2);
    var rotate_y = (pointer.x * 0.15) + (motion.x * 1.2);
    
    // actually rotate canvas 
    canvas.style.transform = "rotateX(" + rotate_x + "deg) rotateY(" + rotate_y + "deg)";

    // loop through each layer and draw on cnavas
    layer_list.forEach(function(layer, index){

        layer.position = getOffset(layer);

        if(layer.blend){
            context.globalCompositeOperation = layer.blend;
        }else {
            context.globalCompositeOperation = 'normal';
        }

        //context.globalAlpha = layer.opasity;

        context.drawImage(layr.image, layer.position.x, layer.position.y);
    });
    requestAnimationFrame(drawCanvas);
}
function getOffset(layer){
    var touch_multiplier = 0.2;
    var touch_offset_x = pointer.x * layer.z_index * touch_multiplier;
    var touch_offset_y = pointer.y * layer.z_index * touch_multiplier;

    var motion_multiplier = 2.5;
	var motion_offset_x = motion.x * layer.z_index * motion_multiplier;
	var motion_offset_y = motion.y * layer.z_index * motion_multiplier;
	
    var offset = {
        x: touch_offset_x + motion_offset_x,
        y: touch_offset_y + motion_offset_y
    };
    return offset;
}

//--- Touch and mouse controls ---//
var moving = false;

//initialise touch and mouse position
var pointer_initial ={
    x:0,
    y:0
};

var pointer ={
    x:0,
    y:0
};

canvas.addEventListener('touchstart', pointerStart);
canvas.addEventListener('mousedown', pointerStart);

function pointerStart(event){
    moving = true;
    if (event.type === 'touchstart'){
        alert('touch');
        pointer_initial.x = event.touches[0].clientX;
        pointer_initial.y = event.touches[0].clientY;
    }else if (event.type === 'mousedown'){
        alert('mousedown');
        pointer_initial.x = event.clientX;
        pointer_initial.y = event.clientY;
    }
}

window.addEventListener('touchmove', pointerMove);
window.addEventListener('mousemove', pointerMove);

function pointerMove(event){
    event.preventDefault();
    if (moving === true){
        var current_x = 0;
        var current_y = 0;
        if (event.type === 'touchmove') {
            current_x = event.touches[0].clientX;
            current_y = event.touches[0].clientY;
        } else if(event.type === 'mousemove'){
            current_x = event.clientX;
            current_y = event.clientY;
        }
        pointer.x = current_x - pointer_initial.x;
        pointer.y = current_y - pointer_initial.y;
    }
}
canvas.addEventListener('touchmove', function(event){
    event.preventDefault();
});
canvas.addEventListener('mousemove', function(event){
    event.preventDefault();
});

// snap back after no touch/mouse
window.addEventListener('touchend', function(event){
    endGesture();
});
window.addEventListener('mouseup', function(event){
    endGesture();
});

function endGesture(){
    moving = false;
    
    // This removes any in progress tweens
	TWEEN.removeAll();
	// This starts the animation to reset the position of all layers when you stop moving them
	var pointer_tween = new TWEEN.Tween(pointer).to({x: 0, y: 0}, 300).easing(TWEEN.Easing.Back.Out).start();	
}

//--- Motion controls ---//

//initialise varibels for motion based paralax
var motion_initial ={
    x:null,
    y:null
};

var motion = {
    x: 0, 
    y: 0
};

// listen to gyroscope events 
window.addEventListener('deviceorientation', function(event){
    // if first time through 
    if(!motion_initial.x && !motion_initial.y){
        motion_initial.x = event.beta;
        motion_initial.y = event.gamma;
    }

    // check orientation 
    if(window.orientation === 0){
        // the device is in portrait orientation
        motion.x = event.gamma - motion_initial.y;
        motion.y = event.beta - motion_initial.x;
        
    } else if (window.orientation === 90){
        // in landscape left
        motion.x = event.beta - motion_initial.x;
        motion.y = -event.gamma + motion_initial.y
        
    } else if (window.orientation === -90){
        // in landscpe right 
        motion.x = -event.beta + motion_initial.x;
    	motion.y = event.gamma - motion_initial.y;
    } else {
        // upside down
        motion.x = -event.gamma + motion_initial.y;
        motion.y = -event.beta + motion_initial.x;
    } 

});

// fix mix-matched layes when changing orientation 
window.addEventListener('orientationchange', function(event) {
	motion_initial.x = 0;
	motion_initial.y = 0;
});
