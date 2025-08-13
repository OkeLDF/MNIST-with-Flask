import { canvas, ctx, ctx_resized } from "./canvas.js"

const send_btn = document.getElementById('send')

export function generate_img(ctx_resized){
    const img = ctx_resized.getImageData(0, 0, 28, 28).data
    const bw_img = []

    for (let y = 0; y < 28; y++) {
        const row = []
        for (let x = 0; x < 28; x++) {
            const index = (y * 28 + x) * 4
            const brightness = img[index + 3]
            row.push(brightness)
        }
        bw_img.push(row)
    }

    return bw_img
}

send_btn.addEventListener('click', (e) => {
    const bw_img = generate_img(ctx_resized)
    const number_input = document.getElementById('number-input')
    const number = number_input.value

    if(!number) {
        alert("Por favor, insira qual número foi desenhado.")
        return
    }

    fetch("http://localhost:5000/dataset/send", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            img: bw_img,
            number: number
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log("Response:", data)
        })
        .catch(error => {
            console.error("Error:", error)
        })

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx_resized.clearRect(0, 0, 28, 28)
    number_input.value = ""
})