import { ctx_resized } from "./canvas.js"
import { ravel_img } from "./ravel_img.js"

const predict_btn = document.getElementById('predict')

// Model output
let prediction
let probabilities

predict_btn.addEventListener('click', (e) => {
    const bw_img_ravel = ravel_img(ctx_resized)

    fetch("http://localhost:5000/predict", {
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