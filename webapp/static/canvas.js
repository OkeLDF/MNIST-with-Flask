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

// Button
const clear_btn = document.getElementById('clear')

// Variables
let isPainting = false
const lineWidth = 20
let startX
let startY

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

export { canvas, ctx, ctx_resized }