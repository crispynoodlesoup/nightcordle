// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement("script");

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
let player;
let ctrlq;
function onYouTubeIframeAPIReady() {
  ctrlq = document.getElementById("youtube-audio");
  ctrlq.onclick = toggleAudio1;

  player = new YT.Player("youtube-player", {
    height: "0",
    width: "0",
    videoId: ctrlq.dataset.video,
    events: {
      onReady: onPlayerReady1,
      onStateChange: onPlayerStateChange1,
    },
  });
}

function togglePlayButton1(play) {
  play
    ? (ctrlq.children[0].innertext = "Pause")
    : (ctrlq.children[0].innertext = "Play");
  console.log(ctrlq.children[0].innertext);
}

function toggleAudio1() {
  player.playVideo();
  console.log("play for fucks sake!!!!");
  /*   if (player.getPlayerState() == 1 || player.getPlayerState() == 3) {
    player.pauseVideo();
    togglePlayButton1(false);
  } else {
    player.playVideo();
    togglePlayButton1(true);
  } */
}

function onPlayerReady1(event) {
  player.setPlaybackQuality("small");
  document.getElementById("youtube-audio").style.display = "block";
  togglePlayButton1(player.getPlayerState() !== 5);
}

function onPlayerStateChange1(event) {
  if (event.data === 0) {
    togglePlayButton1(false);
  }
}
