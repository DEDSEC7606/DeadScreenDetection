let files = [];
const fileInput = document.getElementById("fileInput");
const preview = document.getElementById("preview");
const resultBox = document.getElementById("result");

fileInput.addEventListener("change", (e) => {
    for (let f of e.target.files) files.push(f);
    renderPreview();
});

function renderPreview() {
    preview.innerHTML = "";

    files.forEach((file, index) => {
        const url = URL.createObjectURL(file);

        const wrap = document.createElement("div");
        wrap.className = "preview-item";

        const img = document.createElement("img");
        img.src = url;

        const rm = document.createElement("button");
        rm.className = "remove";
        rm.innerText = "×";
        rm.onclick = () => {
            files.splice(index, 1);
            renderPreview();
        };
        wrap.appendChild(img);
        wrap.appendChild(rm);
        preview.appendChild(wrap);
    });
}

function clearAll() {
    files = [];
    renderPreview();
    updateBars(0, 0, 0);
    document.getElementById("verdictText").innerText = "";
}

function updateBars(sim, sus, prod) {
    document.getElementById("simBar").style.width = sim + "%";
    document.getElementById("susBar").style.width = sus + "%";
    document.getElementById("prodBar").style.width = prod + "%";

    document.getElementById("simVal").innerText = sim + "%";
    document.getElementById("susVal").innerText = sus + "%";
    document.getElementById("prodVal").innerText = prod + "%";
}

async function analyze() {
    if (files.length < 2) {
        resultBox.classList.remove("hidden");
        document.getElementById("verdictText").innerText = "Upload at least 2 screenshots to analyze.";
        updateBars(0,0,0);
        return;
}
    const form = new FormData();
    files.forEach(f => form.append("screenshots", f));

    const res = await fetch("/analyze", { method: "POST", body: form });
    const data = await res.json();

    updateUI(data);
}

function updateUI(data) {
    resultBox.classList.remove("hidden");
    document.getElementById("verdictText").innerText = data.verdict;

    updateBars(
        Math.round(data.avg_similarity),
        Math.round(data.suspicion),
        Math.round(data.productivity)
    );
}

async function analyzeRange(minutes) {
    const res = await fetch(`/analyze_range?minutes=${minutes}`);
    const data = await res.json();
    updateUI(data);
}