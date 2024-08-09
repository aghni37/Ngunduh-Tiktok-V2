$(document).ready(function () {
  // Handle the paste button click
  $("#paste-button").click(function () {
    navigator.clipboard
      .readText()
      .then(function (text) {
        $("#tiktok-url").val(text);
      })
      .catch(function (err) {
        console.error("Failed to read clipboard contents: ", err);
      });
  });

  // Fetch TikTok data function
  function fetchTikTokData(callback) {
    var tiktokUrl = $("#tiktok-url").val();
    var apiUrl =
      "https://api.tiklydown.eu.org/api/download?url=" +
      encodeURIComponent(tiktokUrl);

    $.ajax({
      url: apiUrl,
      method: "GET",
      headers: {
        accept: "application/json",
      },
      success: function (response) {
        callback(response);
      },
      error: function () {
        alert("Error occurred while fetching TikTok details.");
      },
    });
  }

  // Download video button click event
  $("#download-video-button").click(function () {
    fetchTikTokData(function (response) {
      if (response && response.video && response.video.noWatermark) {
        window.open(response.video.noWatermark, "_blank");
      } else {
        alert("Failed to get the video URL.");
      }
    });
  });

  // Download music button click event
  $("#download-music-button").click(function () {
    fetchTikTokData(function (response) {
      if (response && response.music && response.music.play_url) {
        window.open(response.music.play_url, "_blank");
      } else {
        alert("Failed to get the music URL.");
      }
    });
  });

  // Toggle dark mode
  $(".toggle-switch").click(function () {
    $("body").toggleClass("dark-mode");
  });
});

// animasi downloading

document.addEventListener("DOMContentLoaded", function () {
  const downloadVideoButton = document.getElementById("download-video-button");
  const downloadMusicButton = document.getElementById("download-music-button");

  downloadVideoButton.addEventListener("click", function () {
    toggleLoadingState(downloadVideoButton);
    // Simulate download process with a timeout
    setTimeout(() => {
      toggleLoadingState(downloadVideoButton);
    }, 3000);
  });

  downloadMusicButton.addEventListener("click", function () {
    toggleLoadingState(downloadMusicButton);
    // Simulate download process with a timeout
    setTimeout(() => {
      toggleLoadingState(downloadMusicButton);
    }, 3000);
  });

  function toggleLoadingState(button) {
    const isLoading = button.getAttribute("data-loading") === "true";
    button.setAttribute("data-loading", !isLoading);
    button.innerHTML = isLoading
      ? button.getAttribute("data-original-text")
      : button.getAttribute("data-loading-text");
  }

  // Store the original text on page load
  downloadVideoButton.setAttribute(
    "data-original-text",
    downloadVideoButton.innerHTML
  );
  downloadMusicButton.setAttribute(
    "data-original-text",
    downloadMusicButton.innerHTML
  );
});
