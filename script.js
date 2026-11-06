
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


function getYouTubeId(url) {
  try {
    const parsed = new URL(url);
    let id = "";

    if (parsed.hostname === "youtu.be") {
      id = parsed.pathname.slice(1);
    } else if (
      parsed.hostname.endsWith("youtube.com") ||
      parsed.hostname.endsWith("youtube-nocookie.com")
    ) {
      if (parsed.pathname === "/watch") {
        id = parsed.searchParams.get("v") || "";
      } else if (
        parsed.pathname.startsWith("/shorts/") ||
        parsed.pathname.startsWith("/embed/")
      ) {
        id = parsed.pathname.split("/")[2] || "";
      }
    }

    return /^[a-zA-Z0-9_-]{11}$/.test(id)
      ? id
      : null;
  } catch {
    return null;
  }
}

previewButton.addEventListener("click", () => {
  const url = videoUrl.value.trim();

  if (url) {
    const id = getYouTubeId(url);

    if (!id) {
      showStatus("Please enter a valid YouTube link.");
      return;
    }

    const frame = document.createElement("iframe");

    frame.src =
      "https://www.youtube-nocookie.com/embed/" + id;

    frame.title = "YouTube video preview";
    frame.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    frame.allowFullscreen = true;
    frame.style.width = "100%";
    frame.style.aspectRatio = "16 / 9";
    frame.style.border = "0";

    videoPreview.replaceChildren(frame);

    showStatus(
      "YouTube video loaded! Upload your authorized video file to create editable clips."
    );

    return;
  }

  const player = getVideo();

  if (player) {
    player.play();
    showStatus("Playing your uploaded video.");
  } else {
    showStatus("Please paste a YouTube link or upload a video.");
  }
});

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
