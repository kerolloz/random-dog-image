const $ = document.querySelector.bind(document);

/**
 * @returns {string} the value of id query parameter
 * @example
 * returns 123 => "example.com?id=123"
 */
function getQueryId() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}

/**
 * returns the permanent link string for the page
 * according to the id of the image
 * @param {string} imageUri
 */
function createPermaLink(imageUri) {
  const id = imageUri.match(/breeds\/(.*)/)[1];
  const url = location.origin + location.pathname;
  return `${url}?id=${id}`;
}

/**
 * returns the breed according to the uri
 * @param {string} uri the image uri from dog api
 */
function getDogBreed(uri) {
  return uri.match(/breeds\/(.*)\//)[1];
}

/**
 * returns a random img url from the dog api
 * @returns {Promise<string>}
 */
async function getRandomImage() {
  const r = await fetch("https://dog.ceo/api/breeds/image/random");
  const { message: link } = await r.json();
  return link;
}

/**
 * returns the image uri from the dogs api according to the id
 * @param {string} id
 */
function getImageFromId(id) {
  return `https://images.dog.ceo/breeds/${id}`;
}

/**
 * hides HTML element by its query selector
 *
 * @param {string} qs element selector
 */
function hideElement(qs) {
  $(qs).style.display = "none";
}

/**
 * set HTML element as visible according to its query selector
 *
 * @param {string} qs element selector
 */
function showElement(qs) {
  $(qs).style.display = "flex";
}

let link = "";
async function onStart(forceNew = false) {
  hideElement("#main-content");
  showElement("#loading");
  const imgId = forceNew ? false : getQueryId();
  if (imgId) {
    link = getImageFromId(imgId);
  } else {
    link = await getRandomImage();
  }
  $("#pic").src = link;
  $("#breed").innerText = getDogBreed(link);
  const anchorTag = $("#perma-link");
  anchorTag.href = createPermaLink(link);
}

(() => {
  const img = $("#pic");

  img.addEventListener("load", () => {
    showElement("#main-content");
    hideElement("#loading");
  });
  img.addEventListener("error", () => {
    $("#loading").innerHTML = `
        <h1 class="error">Error</h1>
        <h2>Failed loading the requested image!</h2>
        <small>${getQueryId()}</small>
        `;
  });

  onStart().catch(console.error);

  function share(url, target) {
    const options = "toolbar=0,status=0,resizable=1,width=626,height=436";
    window.open(url, target, options);
  }

  $("#fb-share-btn").addEventListener("click", () => {
    const url =
      "https://facebook.com/sharer.php?display=popup&u=" +
      createPermaLink(link);
    share(url, "_blank");
  });
  $("#tweet-btn").addEventListener("click", () => {
    const url =
      "https://twitter.com/intent/tweet?related=kerolloz&text=" +
      createPermaLink(link);
    share(url, "share-twitter");
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "r") {
      onStart(true).catch(console.error);
    }
  });
})();
