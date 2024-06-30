const maxChar = 600;
const firstAyahNumber = 1;
const lastAyahNumber = 6236;

let currentSurahNumber = null;
let currentAyahNumber = null;

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function convertToArabicDigits(number) {
  return number.replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
}

// Grouping the DOM elements for better organization
const elements = {
  arabicSub: document.querySelector(".arabic-sub"),
  arabicText: document.querySelector(".arabic-text"),
  ayahNumber: document.querySelector(".ayah-number"),
  ayahNumberEnglish: document.querySelector(".ayah-number-english"),
  englishSub: document.querySelector(".english-text"),
  surahNameContainer: document.querySelector(".surah-name"),
  surahName: document.querySelector(".surah-name-text"),
  audio: document.querySelector("#audio-element"),
  prevButton: document.querySelector(".previous-ayah"),
  nextButton: document.querySelector(".next-ayah"),
  surahDropdown: document.querySelector('#surah-dropdown'),
  ayahDropdown: document.querySelector('#ayah-dropdown'),
  surahInfoPopover: document.querySelector("#surah-info-popover"),
  ayahInfoPopover: document.querySelector("#ayah-info-popover"),
  playButton: document.querySelector(".play-button"),
  pauseButton: document.querySelector(".pause-button"),
  stopButton: document.querySelector(".stop-button"),
  unsplashImageElement: document.querySelector("#background-image"),
  videoBackground: document.querySelector("#background-video"),
};

// Fetch and render the initial quote
function init() {
  const randomAyahNumber = getRandomNumber(firstAyahNumber, lastAyahNumber);
  fetchAndRenderQuote(randomAyahNumber);
  // fetchUnsplashImage();
  loadVideoBackground();
}

function loadVideoBackground() {
  const videos = [
    "assets/videos/1.webm",
    "assets/videos/2.webm",
    "assets/videos/3.webm",
  ];
  const videoUrl = chrome.runtime.getURL(videos[getRandomNumber(0, videos.length - 1)]);
  elements.videoBackground.src = videoUrl;
  elements.videoBackground.loop = true;
  elements.videoBackground.muted = true;
  elements.videoBackground.play();

}


// function fetchUnsplashImage() {
//   const accessKey = '5CpYk1i3tVg562ScIhuYnOBoRyC9RkYSwUmZD9JXcBY';
//   const imageUrl = `https://api.unsplash.com/photos/random?client_id=${accessKey}`;

//   fetch(`${imageUrl}`)
//     .then(response => response.json())
//     .then(data => {
//       const imageData = data.urls.full;
//       elements.unsplashImageElement.src = imageData;
//       console.log("Image fetched successfully!", data);
//     })
// }

// Common function to fetch and render a quote
function fetchAndRenderQuote(ayahNumber) {
  const apiUrl = `https://api.alquran.cloud/v1/ayah/${ayahNumber}/editions/ar.alafasy,en.yusufali,ar.jalalayn`;
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const arabicData = data.data[0];
      const englishData = data.data[1];
      // const tafserData = data.data[2];

      currentAyahNumber = arabicData.number;
      currentSurahNumber = arabicData.surah.number;

      const arabicText = arabicData.text;
      const englishText = englishData.text;
      const ayahNumberValue = arabicData.numberInSurah;

      elements.arabicText.textContent = arabicText
      const trimmedString = englishText.length > maxChar ?

        englishText.substring(0, maxChar - 3) + "..." :
        englishText;
      elements.englishSub.textContent = trimmedString

      elements.ayahNumber.textContent = convertToArabicDigits(`${ayahNumberValue} `);
      elements.ayahNumberEnglish.textContent = `﴾${ayahNumberValue}﴿`;

      elements.surahInfoPopover.innerHTML = `
        <div class="tooltiptext">
          <div class="revelation-type">
          Revelation type: ${arabicData.surah.revelationType}
          </div>
          <div class="number-of-ayahs">
          Number of ayahs: ${arabicData.surah.numberOfAyahs} Ayahs
          </div>
          <div class="english-name-translation">
          English name translation: ${arabicData.surah.englishNameTranslation}
          </div>
          </div>
      `;
      // console.log(arabicData);

      // elements.ayahInfoPopover.innerHTML = `
      //   <div class="tooltiptext">
      //     <div class="tafser">
      //       ${tafserData.text}
      //     </div>
      //     </div>
      // `;



      elements.surahName.textContent = `⦑ ${arabicData.surah.name} ${arabicData.surah.number}.${arabicData.surah.englishName} ⦒`;

      updateButtonStates();
      elements.audio.src = arabicData.audio;
      elements.audio.onerror = function () {
        elements.audio.src = arabicData.audioSecondary[0];
      };
      elements.audio.volume = 0.3;

      setDropdownOptions(arabicData.numberInSurah);
      console.log('Quote fetched successfully!', data);
    })
    .catch(error => {
      console.error('Error fetching quote:', error);
    });
}

// Update the state of previous and next buttons
function updateButtonStates() {
  elements.prevButton.disabled = currentAyahNumber === firstAyahNumber;
  elements.nextButton.disabled = currentAyahNumber === lastAyahNumber;
  elements.prevButton.classList.toggle('disabled', elements.prevButton.disabled);
  elements.nextButton.classList.toggle('disabled', elements.nextButton.disabled);
}

// Set options in surah and ayah dropdowns
function setDropdownOptions(ayahNumberInSurah) {
  setSurahDropdownOptions();
  setAyahDropdownOptions(ayahNumberInSurah);
}

// Set options in the surah dropdown
function setSurahDropdownOptions() {
  const apiUrl = `https://api.alquran.cloud/v1/surah`;
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      elements.surahDropdown.innerHTML = data.data
        .map(surah => `<option value="${surah.number}">${surah.number}. ${surah.name} (${surah.englishName})</option>`)
        .join('');

      elements.surahDropdown.value = currentSurahNumber;
    });
}

// Set options in the ayah dropdown
function setAyahDropdownOptions(ayahNumberInSurah) {
  const apiUrl = `https://api.alquran.cloud/v1/surah/${currentSurahNumber}`;
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      elements.ayahDropdown.innerHTML = data.data.ayahs
        .map(ayah => `<option value="${ayah.numberInSurah}" data-ayah-number="${ayah.number}">${ayah.numberInSurah}</option>`)
        .join('');

      elements.ayahDropdown.value = ayahNumberInSurah
    });
}

// Event listeners
document.addEventListener('DOMContentLoaded', function () {
  init();

  elements.prevButton.addEventListener('click', () => fetchAndRenderQuote(currentAyahNumber - 1));
  elements.nextButton.addEventListener('click', () => fetchAndRenderQuote(currentAyahNumber + 1));

  elements.surahDropdown.addEventListener('change', function () {
    const selectedSurahNumber = elements.surahDropdown.value;
    currentSurahNumber = selectedSurahNumber;
    fetchAndRenderQuote(`${selectedSurahNumber}:1`);
  });

  elements.ayahDropdown.addEventListener('change', function () {
    const selectedAyahNumber = elements.ayahDropdown.options[elements.ayahDropdown.selectedIndex].dataset.ayahNumber;
    currentAyahNumber = selectedAyahNumber;
    fetchAndRenderQuote(selectedAyahNumber);
  });

  elements.playButton.addEventListener('click', () => {
    elements.audio.play();
    console.log(elements.audio);
    elements.audio.onended = function () {
      if (currentAyahNumber === lastAyahNumber) {
        fetchAndRenderQuote(firstAyahNumber);
      } else {
        fetchAndRenderQuote(currentAyahNumber + 1);
      }
      elements.audio.autoplay = true;
    }

  });

  elements.pauseButton.addEventListener('click', () => {
    elements.audio.pause();
  });

  elements.stopButton.addEventListener('click', () => {
    elements.audio.pause();
    elements.audio.currentTime = 0;
  });

  // elements.surahNameContainer.addEventListener("click", () => {
  //   elements.surahInfoPopover.classList.toggle("hidden");
  // });

  // elements.arabicSub.addEventListener("click", () => {
  //   elements.ayahInfoPopover.classList.toggle("hidden");
  // });

  // document.addEventListener("click", (event) => {
  //   if (!elements.surahNameContainer.contains(event.target)) {
  //     elements.surahInfoPopover.classList.add("hidden");
  //   }
  // });
});
