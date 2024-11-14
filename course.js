      //menu button js

       const navBtn = document.querySelector('.menu-btn')
const navList = document.querySelector('.nav-list')

navBtn.addEventListener('click', function(){
    navList.classList.toggle('active')
    
})

           // Load the YouTube IFrame Player API code asynchronously
        function loadYouTubeAPI() {
            var tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }

        // Create YouTube player
        var player;
        function onYouTubeIframeAPIReady() {
            player = new YT.Player('player', {
                videoId: 'f_OGytLp6Ng', // Replace with your YouTube video ID
                playerVars: {
                    'autoplay': 1,
                    'controls': 1,
                    'modestbranding': 1,
                    'rel': 0,
                    'showinfo': 0
                },
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });
        }

        function onPlayerReady(event) {
            event.target.playVideo();
            document.querySelector('.video-container').classList.add('visible');
        }

        function onPlayerStateChange(event) {
            var videoContainer = document.querySelector('.video-container');
            if (event.data == YT.PlayerState.PAUSED) {
                videoContainer.classList.add('paused');
            } else {
                videoContainer.classList.remove('paused');
            }
        }

        // Scroll event listener to detect when the container is in the viewport
        window.addEventListener('scroll', function () {
            var videoContainer = document.querySelector('.video-container');
            var rect = videoContainer.getBoundingClientRect();
            var isInViewport = rect.top >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight);
            
            // Trigger the animation if the video is paused and in the viewport
            if (isInViewport && player && player.getPlayerState() === YT.PlayerState.PAUSED) {
                videoContainer.classList.add('in-viewport');
            } else {
                videoContainer.classList.remove('in-viewport');
            }
        });

        window.onload = loadYouTubeAPI;

        //pop up after clicking on images

         function openPopup() {
    document.getElementById('popupOverlay').style.display = 'flex';
}

// Close Popup when clicking outside the content
function closePopup(event) {
    if (event.target === document.getElementById('popupOverlay')) {
        document.getElementById('popupOverlay').style.display = 'none';
    }
}

// Handle form submission
document.getElementById('authForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent default form submission

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Send data to the server for validation
    const response = await fetch('/authenticate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    // Redirect based on authentication result
    if (result.success) {
        window.location.href = 'pass.html';
    } else {
        window.location.href = 'fail.html';
    }
});

// Handle signup button click
document.getElementById('signupButton').addEventListener('click', function () {
    window.location.href = 'newuser.html';
});