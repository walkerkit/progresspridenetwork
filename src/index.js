// Setup
var canvas = document.getElementById('progress-pride-canvas');

// Functions
function runAnimation(ctx, canvas){
    canvasHeight = canvas.getBoundingClientRect().height;
    canvasWidth =  canvas.getBoundingClientRect().width;

    ctx.save()
    ctx.clearRect(0,0,canvasWidth, canvasHeight)

    var centerX = 50;
    var centerY = 50;
    var radius = 2;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = '#003300';
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#003300';
    ctx.stroke();
}

function resizeCanvas(canvas){ 
    canvas.height = canvas.getBoundingClientRect().height;
    canvas.width = canvas.getBoundingClientRect().width;
}

// Init
if (canvas.getContext){
    runAnimation(canvas.getContext('2d'), canvas);
}
window.addEventListener('resize', function(){
    resizeCanvas(canvas);
}, false);