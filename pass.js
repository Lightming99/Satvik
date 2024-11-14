const toggleSidebar = document.getElementById("toggleSidebar");
const sidebar = document.getElementById("sidebar");
const closeSidebar = document.getElementById("closeSidebar");
const loginBtn = document.getElementById("loginBtn");
const courseList = document.getElementById("courseList");
const mediaPlayer = document.getElementById("mediaPlayer");
const subtitles = document.getElementById("subtitles");

// Sidebar Toggle
toggleSidebar.addEventListener("click", () => {
    sidebar.classList.toggle("open");
    toggleSidebar.classList.toggle("active");
});

// Close Sidebar
closeSidebar.addEventListener("click", () => {
    sidebar.classList.remove("open");
    toggleSidebar.classList.remove("active");
});

// Handle Video or PDF Selection
courseList.addEventListener("click", (e) => {
    const item = e.target;
    const src = item.dataset.src;
    const type = item.dataset.type;

    // Mark video as watched
    if (type === "video") {
        markAsWatched(item);
        loadSubtitles(item);  // Load subtitles dynamically
    }

    // Set media player source
    if (type === "video") {
        mediaPlayer.src = src;
        mediaPlayer.play();
    } else if (type === "pdf") {
        window.open(src, "_blank");
    }

    // Close sidebar on mobile
    if (window.innerWidth <= 768) {
        sidebar.classList.remove("open");
    }
});

// Authenticate User
loginBtn.addEventListener("click", async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const response = await fetch("/authenticate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (data.success) {
        document.getElementById("loginContainer").style.display = "none";
        document.getElementById("courseContainer").style.display = "block";
        loadWatchedVideos();
    } else {
        loginError.style.display = "block";
    }
});

// Mark video as watched
function markAsWatched(item) {
    item.classList.add("watched");

    // Save watched video to localStorage
    let watchedVideos = JSON.parse(localStorage.getItem("watchedVideos")) || [];
    if (!watchedVideos.includes(item.textContent)) {
        watchedVideos.push(item.textContent);
        localStorage.setItem("watchedVideos", JSON.stringify(watchedVideos));
    }
}

// Load subtitles dynamically based on the selected video
function loadSubtitles(item) {
    const subtitlesText = item.dataset.subtitles;
    subtitles.textContent = subtitlesText; // Set subtitles text content

    // Change the subtitle color dynamically with animation
    subtitles.style.animation = "subtitleColorChange 5s infinite alternate";
}

// Load watched videos
function loadWatchedVideos() {
    const watchedVideos = JSON.parse(localStorage.getItem("watchedVideos")) || [];
    const allItems = document.querySelectorAll("#courseList li");

    allItems.forEach(item => {
        if (watchedVideos.includes(item.textContent)) {
            item.classList.add("watched");
        }
    });
}
