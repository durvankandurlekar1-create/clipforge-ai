
const videoInput = document.getElementById("videoInput");
const videoUrl = document.getElementById("videoUrl");
const clipLength = document.getElementById("clipLength");

const previewButton = document.getElementById("previewButton");
const clipButton = document.getElementById("clipButton");
const hookButton = document.getElementById("hookButton");
const captionButton = document.getElementById("captionButton");
const verticalButton = document.getElementById("verticalButton");

const videoPreview = document.getElementById("videoPreview");
const status = document.getElementById("status");
const results = document.getElementById("results");

let currentObjectUrl = null;

function showStatus(message) {
  status.textContent = message;
}

function getVideo() {
  return videoPreview.querySelector("video");
}

videoInput.addEventListener("change", () => {
  const file = videoInput.files[0];

  if (!file) return;

  if (!file.type.startsWith("video/")) {
    showStatus("Please select a valid video.");
    return;
  }

  if (currentObjectUrl) {
    URL.revokeObjectURL(currentObjectUrl);
  }

  currentObjectUrl = URL.createObjectURL(file);

  const player = document.createElement("video");
  player.src = currentObjectUrl;
  player.controls = true;
  player.playsInline = true;
  player.preload = "metadata";

  videoPreview.replaceChildren(player);

  showStatus("Video uploaded successfully!");

  videoUrl.value = "";
});

previewButton.addEventListener("click", () => {
  const player = getVideo();

  if (player) {
    player.play();
    showStatus("Playing your uploaded video.");
    return;
  }

  showStatus(
    "Upload a video first. Direct video URLs are supported only when they point to playable video files."
  );
});

clipButton.addEventListener("click", () => {
  const player = getVideo();

  if (!player) {
    showStatus("Please upload a video first.");
    return;
  }

  const duration = Number(clipLength.value);

  if (!Number.isFinite(player.duration)) {
    showStatus("Wait for the video to finish loading.");
    return;
  }

  const end = Math.min(duration, player.duration);

  player.currentTime = 0;

  player.play();

  showStatus(
    `Previewing the first ${end.toFixed(1)} seconds. This is not an exported clip yet.`
  );

  const stopPreview = () => {
    if (player.currentTime >= end) {
      player.pause();
      player.removeEventListener("timeupdate", stopPreview);
    }
  };

  player.addEventListener("timeupdate", stopPreview);
});

hookButton.addEventListener("click", () => {
  const ideas = [
    "Here's something you probably didn't know...",
    "This changed everything for me...",
    "Wait until you hear this...",
    "The biggest mistake people make is...",
    "Here's what nobody tells you...",
    "You need to understand this...",
    "This is the secret behind success..."
  ];

  results.replaceChildren();

  const heading = document.createElement("h3");
  heading.textContent = "Hook ideas";
  results.appendChild(heading);

  ideas.forEach((idea) => {
    const paragraph = document.createElement("p");
    paragraph.textContent = idea;
    results.appendChild(paragraph);
  });

  showStatus("Sample hook ideas generated. AI hook generation is not connected yet.");
});

captionButton.addEventListener("click", () => {
  showStatus(
    "Caption settings will be available after we connect speech transcription."
  );
});

verticalButton.addEventListener("click", () => {
  const player = getVideo();

  if (!player) {
    showStatus("Upload a video first.");
    return;
  }

  player.style.width = "min(100%, 320px)";
  player.style.aspectRatio = "9 / 16";
  player.style.objectFit = "contain";

  showStatus(
    "Vertical preview enabled. Actual video cropping and export are not connected yet."
  );
});

window.addEventListener("beforeunload", () => {
  if (currentObjectUrl) {
    URL.revokeObjectURL(currentObjectUrl);
  }
});
