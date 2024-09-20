$(document).ready(function () {
  // Handle the paste button click
  $("#paste-button").click(function () {
    // Clear the input field and reset buttons without reloading the page
    $("#tiktok-url").val("");
    $("#download-video-button").prop("disabled", true).data("type", "");
    $("#download-music-button").prop("disabled", true);
    $("#image-gallery").empty(); // Clear the gallery

    // Read clipboard contents and paste the URL into the input field
    navigator.clipboard
      .readText()
      .then(function (text) {
        // Set the pasted text into the input field
        $("#tiktok-url").val(text);

        // Call the function to resolve URL and detect content type
        resolveTikTokUrl(text);
      })
      .catch(function (err) {
        console.error("Failed to read clipboard contents: ", err);
      });
  });

  // Function to resolve TikTok short URL to full URL
  function resolveTikTokUrl(url) {
    var apiUrl =
      "https://api.tiklydown.eu.org/api/download?url=" +
      encodeURIComponent(url);

    $.ajax({
      url: apiUrl,
      method: "GET",
      headers: {
        accept: "application/json",
      },
      success: function (response) {
        if (response.url) {
          var finalUrl = response.url;
          detectContentType(finalUrl); // Detect content type based on resolved URL
          handleMusicDownload(response.music); // Handle music download
        } else {
          alert("Failed to resolve the URL.");
        }
      },
      error: function () {
        alert("Error occurred while resolving TikTok URL.");
      },
    });
  }

  // Function to detect content type based on the final resolved URL
  function detectContentType(url) {
    var isPhoto = url.includes("/photo/");
    var isVideo = url.includes("/video/");

    if (isPhoto) {
      $("#download-video-button")
        .prop("disabled", false)
        .data("type", "photo")
        .html('<i class="fas fa-download"></i> Unduh Gambar');
    } else if (isVideo) {
      $("#download-video-button")
        .prop("disabled", false)
        .data("type", "video")
        .html('<i class="fas fa-download"></i> Unduh Video');
    } else {
      $("#download-video-button").prop("disabled", true);
      $("#download-music-button").prop("disabled", true);
    }
  }

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

  // Function to display images and music
  function displayImagesAndMusic(images, music) {
    var gallery = $("#image-gallery");
    gallery.empty();

    images.forEach(function (image, index) {
      var imageElement = `
        <div class="col-md-4 mb-4">
          <img src="${image.url}" class="img-fluid" alt="TikTok Image ${
        index + 1
      }">
          <a href="${image.url}" target="_blank" download="TikTok-Image-${
        index + 1
      }.webp" class="btn btn-primary mt-2 d-block">
            <i class="fas fa-download"></i> Unduh
          </a>
        </div>
      `;
      gallery.append(imageElement);
    });

    handleMusicDownload(music); // Handle music download
  }

  // Handle music download
  function handleMusicDownload(music) {
    if (music && music.play_url) {
      $("#download-music-button").prop("disabled", false);
      $("#download-music-button")
        .off("click")
        .on("click", function () {
          toggleButtonLoading($(this), true); // Show loading animation
          window.open(music.play_url, "_blank"); // Open music in new tab
          toggleButtonLoading($(this), false); // Hide loading animation
        });
    } else {
      $("#download-music-button").prop("disabled", true);
    }
  }

  // Download button click event (for both video and photo)
  $("#download-video-button").click(function () {
    var button = $(this);
    var contentType = button.data("type");

    toggleButtonLoading(button, true); // Show loading animation

    fetchTikTokData(function (response) {
      if (
        contentType === "photo" &&
        response.images &&
        response.images.length > 0
      ) {
        displayImagesAndMusic(response.images, response.music); // Display images and music
      } else if (
        contentType === "video" &&
        response.video &&
        response.video.noWatermark
      ) {
        window.open(response.video.noWatermark, "_blank"); // Open video in new tab
      } else {
        alert("Failed to get the " + contentType + " URL.");
      }

      handleMusicDownload(response.music); // Ensure music is handled after content fetch

      toggleButtonLoading(button, false); // Hide loading animation
    });
  });

  // Toggle dark mode
  $(".toggle-switch").click(function () {
    $("body").toggleClass("dark-mode");
  });

  // Function to toggle loading animation on button
  function toggleButtonLoading(button, isLoading) {
    if (isLoading) {
      var loadingText = button.data("loading-text");
      button.data("original-text", button.html());
      button.html(loadingText);
      button.prop("disabled", true);
    } else {
      button.html(button.data("original-text"));
      button.prop("disabled", false);
    }
  }
});
