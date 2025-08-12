import { ctx_resized } from "./canvas.js"
import { ravel_img } from "./ravel_img.js"

const send_btn = document.getElementById('send')

send_btn.addEventListener('click', (e) => {
    const bw_img_ravel = ravel_img(ctx_resized)
    console.log(bw_img_ravel)

    fetch("http://localhost:5000/dataset/send", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            img: bw_img_ravel
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log("Response:", data)
        })
        .catch(error => {
            console.error("Error:", error)
        })
})