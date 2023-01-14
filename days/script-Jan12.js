var day = new dayCanvas(document.getElementById("canvas-Jan12"),
    () => {

const canvas = document.getElementById("canvas-Jan12");
const ctx = canvas.getContext("2d");

width = window.innerWidth
height = window.innerHeight

canvas.width  = width;
canvas.height = height;


var baseBall = {
    pos: new Vector(width / 2, 0),
    vel: new Vector(0, 5),
    Hue: 192,
    Lightness: 45,
    radius:20

}

var ballArray = [baseBall]


// Set the fill style and color background
ctx.fillStyle = "black";
ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)

var noiseSeed = Math.random()

var programStart = Date.now()

var t1 = Date.now()
var t2 = Date.now()

const noiseSave = ctx.getImageData(0, 0, width, height)

const noiseSaveData = noiseSave.data
        
i = 0
for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {

        curNoiseVal = noise.simplex3(x / 300, y / 300, Date.now() / 10000)

        curVal = ((Math.sqrt(Math.sqrt(curNoiseVal)) + 1)* 1/2) * 255
        
        noiseSaveData[i] = curVal; // red
        noiseSaveData[i + 1] = curVal; // green
        noiseSaveData[i + 2] = curVal; // blue

        i+= 4
    }
    
}

            


function MainLoop() {

    if (canvas.classList.contains("paused")) {
        setTimeout(MainLoop, 10)
        return
    }

    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    t1 = Date.now()
    var frameTime = t1 - t2
    t2 = Date.now()

    let timeElapsed = t2 - programStart

    //console.log(frameTime)

    i = 0
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {

            curVal = 0;

            if (y + x > height  * 2) {
                curVal = 255
            }
            
            data[i] = curVal; // red
            data[i + 1] = curVal; // green
            data[i + 2] = curVal; // blue

            i+= 4

            
        }
        
    }

    ctx.putImageData(imageData, 0, 0);

    ballArray.forEach(ball => {
        ball.pos = Vector.add(ball.pos, ball.vel)
        

        ctx.beginPath();
        ctx.arc(ball.pos.x, ball.pos.y, ball.radius, 0, 2 * Math.PI);
        ctx.strokeStyle = `hsl(${ball.Hue}, 100%, ${ball.Lightness}%)`
        ctx.stroke();

        collisionPoints = []

        for (let pos of pointsInCircle(ball.pos.x, ball.pos.y, ball.radius)){
            
            var pos1d = Dimension2to1(pos.x, pos.y, width)
            if (data[pos1d * 4] > 0) {
                ball.Hue = "10"
                
                ball.vel = new Vector(0, 0)
                                
                collisionPoints.push(pos)
                
            }
        }

        if (collisionPoints.length > 0) {
        
            var totVector = new Vector()

            for (let vec of collisionPoints) {
                
                dirtoCenter = Vector.sub(ball.pos, vec)
                totVector = Vector.add(totVector, dirtoCenter)
            }
            
            pushVector = Vector.normalize(totVector)
            
            ball.vel = pushVector

        }
        
    })
    

    setTimeout(MainLoop, 10)

}
MainLoop()
}   
)

canvasDayList.push(day)

function* pointsInCircle(x, y, r) {

    for (let xpos = x - r; xpos <= x + r; xpos++) {
        for (let ypos = y - r; ypos <= y + r; ypos++) {
            
            if (((x - xpos) ** 2) + ((y - ypos) ** 2) < r ** 2) {
                
                yield new Vector(xpos, ypos)
            }
        }
    }

}

function Dimension2to1(x, y, width) {
    return x + y * width
}

function Dimension1to2(i, width) {
    return [x % width, Math.floor(i / width)]
}