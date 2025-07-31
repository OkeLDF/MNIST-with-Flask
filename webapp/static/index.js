// Drawable canvas
const canvas = document.getElementById('drawing-board')
const ctx = canvas.getContext('2d')

let canvasOffsetX = canvas.offsetLeft
let canvasOffsetY = canvas.offsetTop

canvas.width = 280
canvas.height = 280

// 28x28 canvas
const resized_canvas = document.createElement('canvas')
const ctx_resized = resized_canvas.getContext('2d')

resized_canvas.width = 28
resized_canvas.height = 28

// Buttons
const clear_btn = document.getElementById('clear')
const predict_btn = document.getElementById('predict')

// Variables
let isPainting = false
const lineWidth = 20
let startX
let startY

// Model output
let prediction
let probabilities

const draw = (e) => {
    e.preventDefault()
    if (!isPainting) return

    canvasOffsetX = canvas.getBoundingClientRect().left;
    canvasOffsetY = canvas.getBoundingClientRect().top;

    ctx.lineWidth = lineWidth
    ctx.lineCap = 'round'

    if (e.touches) ctx.lineTo(e.touches[0].clientX - canvasOffsetX, e.touches[0].clientY - canvasOffsetY)
    else ctx.lineTo(e.clientX - canvasOffsetX, e.clientY - canvasOffsetY)
    ctx.stroke()
}

const end_stroke = (e) => {
    e.preventDefault()
    isPainting = false
    ctx.stroke()
    ctx.beginPath()

    ctx_resized.clearRect(0, 0, resized_canvas.width, resized_canvas.height)
    ctx_resized.drawImage(canvas, 0, 0, resized_canvas.width, resized_canvas.height)
}

clear_btn.addEventListener('click', (e) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
})

canvas.addEventListener('mousedown', (e) => {
    isPainting = true
    startX = e.clientX
    startY = e.clientY
})

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault()
    isPainting = true
    startX = e.touches[0].clientX
    startY = e.touches[0].clientY
})

canvas.addEventListener('mouseup', end_stroke)
canvas.addEventListener('touchend', end_stroke)
canvas.addEventListener('mouseleave', end_stroke)

canvas.addEventListener('mousemove', draw)
canvas.addEventListener('touchmove', draw)

predict_btn.addEventListener('click', (e) => {
    const img = ctx_resized.getImageData(0, 0, 28, 28).data
    const bw_img = []
    const bw_img_ravel = []

    for (let y = 0; y < 28; y++) {
        const row = []
        for (let x = 0; x < 28; x++) {
            const index = (y * 28 + x) * 4
            const brightness = img[index + 3]
            bw_img_ravel.push(brightness)
        }
    }

    fetch("http://localhost:5000/send_img", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ img: bw_img_ravel })
    })
        .then(response => response.json())
        .then(data => {
            prediction = data.prediction
            probabilities = data.probabilities

            document.getElementById("prediction-output").innerText = `Prediction: ${prediction}`;

            const container = document.getElementById("probability-bars");
            container.innerHTML = "";

            probabilities.forEach((prob, index) => {
                const barWrapper = document.createElement("div");
                barWrapper.className = "bar-container";

                const label = document.createElement("div");
                label.className = "label";
                label.textContent = index;

                const barBg = document.createElement("div");
                barBg.className = "bar-bg";

                const bar = document.createElement("div");
                bar.className = "bar";
                bar.style.width = `${prob * 100}%`;

                const probText = document.createElement("div");
                probText.className = "prob-value";
                probText.textContent = (prob * 100).toFixed(1) + "%";

                barBg.appendChild(bar);
                barWrapper.appendChild(label);
                barWrapper.appendChild(barBg);
                barWrapper.appendChild(probText);

                container.appendChild(barWrapper);
            });
        })
        .catch(error => {
            console.error("Error:", error);
        });
})