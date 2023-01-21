var day = new dayCanvas(document.getElementById("canvas-Jan11"),
    () => {

const canvas = document.getElementById("canvas-Jan11");
const ctx = canvas.getContext("2d");

width = window.innerWidth
height = window.innerHeight

canvas.width  = width;
canvas.height = height;

var dynamicAllow = true
canvas.addEventListener("click", () => {dynamicAllow = !dynamicAllow})


// Set the fill style and color background
ctx.fillStyle = "black";
ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)

var noiseSeed = Math.random()

var programStart = Date.now()

var t1 = Date.now()
var t2 = Date.now()

const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
const data = imageData.data;

flowerImages = []
for (let index = 0; index < 30; index++) {
    const img = new Image()
    img.src = `images/flowers/messages_0 (${index}).jpeg`
    flowerImages.push(img)
} 

savedDrawArray = []

nx = 0
ny = 0

function MainLoop() {

    if (canvas.classList.contains("paused")) {
        setTimeout(MainLoop, 10)
        return
    }

    t1 = Date.now()
    var frameTime = t1 - t2
    t2 = Date.now()

    let timeElapsed = t2 - programStart
    
    // nx += noise.simplex2(0, timeElapsed / 100000) * 2
    // ny += noise.simplex2(1000, timeElapsed / 100000) * 2
    
    noise.seed(noiseSeed)
    

    drawArray = []
    curVal = 0
    let x = 0
    let y = 0

    staticInterval = 10 + Math.floor(Math.random() * 50 )
    
    for (let i = 0; i < data.length; i += 4) {
        let pixel = Math.floor(i / 4)
        if (x >= width) {
            x = 0
            y += 1
        }

        dynamicInterval = Math.floor(Math.random() * 100 )

        interval = dynamicAllow ? dynamicInterval : staticInterval
        
        if (i % interval == 0) {
            curNoiseVal = noise.simplex3((x + nx) / 100, (y + ny) / 100, Date.now() / 10000)

            curVal = ((Math.sqrt(curNoiseVal) + 1)* 1/2) * 255 

            if (curNoiseVal > .85 && x % Math.floor(width / 10) == 0 && y % Math.floor(height / 10) == 0) {
                drawArray.push([x,y])
                
                
            }
        }
        

        data[i] = curVal; // red
        data[i + 1] = curVal; // green
        data[i + 2] = curVal; // blue

        x += 1
    }

    ctx.putImageData(imageData, 0, 0);

    

    // drawArray.forEach(pos => {
    //     img = flowerImages[Math.floor(Math.random() * 30)]
    //     ctx.drawImage(img, pos[0] - 50, pos[1] - 50, 100, 100)
    // });
    

    setTimeout(MainLoop, 1)

}
MainLoop()
}   
)

canvasDayList.push(day)