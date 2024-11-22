let timerInterval;
let remainingTime = 0;
let totalTime = 0;

// Fetch the music information from music.txt
fetch("music.txt")
    .then((response) => {
        if (!response.ok) {
            throw new Error("Failed to fetch music list.");
        }
        return response.text();
    })
    .then((data) => {
        const alarmSoundSelect = document.getElementById("alarm-sound");
        alarmSoundSelect.innerHTML = ""; // Clear placeholder options
        const lines = data.split("\n").filter((line) => line.trim() !== "");

        if (lines.length === 0) {
            const option = document.createElement("option");
            option.textContent = "No music available";
            option.disabled = true;
            alarmSoundSelect.appendChild(option);
        } else {
            // Populate the dropdown with the music information
            lines.forEach((line) => {
                const [filename, description] = line.split(" - ");
                const option = document.createElement("option");
                option.value = filename.trim();
                option.textContent = description.trim();
                alarmSoundSelect.appendChild(option);
            });
        }
    })
    .catch((error) => {
        console.error("Error loading music information:", error);
        const alarmSoundSelect = document.getElementById("alarm-sound");
        alarmSoundSelect.innerHTML = ""; // Clear placeholder options
        const option = document.createElement("option");
        option.textContent = "Error loading music";
        option.disabled = true;
        alarmSoundSelect.appendChild(option);
    });

document.getElementById("start").addEventListener("click", () => {
    const seconds = parseInt(prompt("Set timer duration in seconds (1-5400):"), 10);
    if (isNaN(seconds) || seconds < 1 || seconds > 5400) {
        alert("Please enter a valid number between 1 and 5400.");
        return;
    }

    totalTime = seconds;
    remainingTime = totalTime;

    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
    updateProgress(1);
});

document.getElementById("pause").addEventListener("click", () => {
    clearInterval(timerInterval);
});

document.getElementById("reset").addEventListener("click", () => {
    clearInterval(timerInterval);
    remainingTime = 0;
    updateProgress(0);
    updateTimeDisplay(0);
});

function updateTimer() {
    if (remainingTime <= 0) {
        clearInterval(timerInterval);
        playSound(); // Play the sound first
        alert("Time's up!"); // Then show the alert (doesn't block the sound)
        return;
    }

    remainingTime--;
    updateProgress(remainingTime / totalTime);
    updateTimeDisplay(remainingTime);
}

function updateTimeDisplay(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    document.getElementById("time-display").textContent = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function updateProgress(progress) {
    const circle = document.getElementById("progress-circle");
    const offset = 565 * (1 - progress); // Calculate stroke-dashoffset
    circle.style.strokeDashoffset = offset;
}

function playSound() {
    const sound = document.getElementById("alarm-sound").value;
    if (!sound) {
        console.warn("No sound selected.");
        return;
    }
    const audio = new Audio(`music/${sound}`);
    audio.play();
}
