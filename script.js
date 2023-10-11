const apiKey = "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";

const maxImages = 4; // number of images that will be generated
let selectedImageNumber = null;

// function to generate random number between min and max
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// function to disable the generate button once processing
function disableGenerateButton() {
  document.getElementById("generate").disabled = true;
}

// function to enable the generate button after process
function enableGenerateButton() {
  document.getElementById("generate").disabled = false;
}

// function to clear image grid
function clearImageGrid() {
  const imageGrid = document.getElementById("image-grid");
  imageGrid.innerHTML = "";
}

// function to generate images
async function generateImages(input) {
  disableGenerateButton();
  clearImageGrid();

  const loading = document.getElementById("loading");
  loading.style.display = "block";

  const imageUrls = [];

  for (let i = 0; i < maxImages; i++) {
    // generate random number between 1 and 10000 then append to prompt
    const randomNumber = getRandomNumber(1, 10000);
    const prompt = `${input} ${randomNumber}`;

    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    if (!response.ok) {
      alert("Failed to generate image");
    }

    const blob = await response.blob();
    const imgUrl = URL.createObjectURL(blob);
    imageUrls.push(imgUrl);

    const img = document.createElement("img");
    img.src = imgUrl;
    img.alt = `art-${i + 1}`;
    img.onClick = () => downloadImage(imgUrl, i);
    document.getElementById("image-grid").appendChild(img);
  }

  loading.style.display = "none";
  enableGenerateButton();

  selectedImageNumber = null; // reset selected image number
}

document.getElementById("generate").addEventListener("click", () => {
  const input = document.getElementById("user-prompt").ariaValueMax;
  generateImages(input);
});

// function that allows images to be downloaded
function downloadImage(imgUrl, imageNumber) {
  const link = document.createElement("a");
  link.href = imgUrl;
  link.download = `image-${imageNumber + 1}.jpg`;
  link.click();
}
