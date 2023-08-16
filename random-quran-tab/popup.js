
const maxChar = 600;

// Utility function to get a random ayah number
function getRandomAyahNumber() {
  return Math.floor(Math.random() * 6236) + 1;
}

//English to Arabic digits.
function EntoAr(number) {
  return number.replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d])
}


// Utility function to render Arabic text
function renderArText(arText, alfatiha) {
  if (alfatiha) {
    return arText.trim().substring(0, maxChar);
  } else {
    return arText
      .split('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ')
      .join(' ')
      .trim()
      .substring(0, maxChar);
  }
}

// DOM elements
const arabicTextElement = document.querySelector(".arabic-text");
const ayahNumberElement = document.querySelector(".ayah-number");
const ayahNumberEnglishElement = document.querySelector(".ayah-number-english");
const englishSubElement = document.querySelector(".english-text");
const surahNameElement = document.querySelector(".surah-name-text");
const audioElement = document.querySelector("#audio-element");
const prev = document.querySelector(".previous-ayah");
const next = document.querySelector(".next-ayah");

// Fetch and render the quote
function fetchQuote(paramAyahNumber) {
  const apiUrl = `https://api.alquran.cloud/v1/ayah/${paramAyahNumber}/editions/ar.alafasy,en.yusufali,ar.jalalayn`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const resAr = data.data[0];
      const resEn = data.data[1];

      const arTextValue = resAr.text;
      const enTextValue = resEn.text;
      const ayahNumberValue = resAr.numberInSurah;
      const alfatihaValue = resAr.surah.number === 1;

      prev.dataset.ayahNumber = Number(paramAyahNumber) - 1;
      next.dataset.ayahNumber = Number(paramAyahNumber) + 1;

      arabicTextElement.textContent = renderArText(arTextValue, alfatihaValue);
      ayahNumberElement.textContent = EntoAr(`${ayahNumberValue}`);
      ayahNumberEnglishElement.textContent = `﴾${ayahNumberValue}﴿`;
      englishSubElement.textContent = enTextValue.trim().substring(0, maxChar);
      surahNameElement.textContent = `⦑ ${resAr.surah.name} ${resAr.surah.englishName} ⦒`;
      audioElement.src = resAr.audio;
      audioElement.onerror = function () {
        audioElement.src = resAr.audioSecondary[0];
      };
      audioElement.volume = 0.3;

      console.log('Quote fetched successfully!', data);
    })
    .catch(error => {
      console.error('Error fetching quote:', error);
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function () {
  const ayahNumber = getRandomAyahNumber();
  fetchQuote(1);

  prev.addEventListener('click', function () {
    fetchQuote(prev.dataset.ayahNumber);
  });

  next.addEventListener('click', function () {
    fetchQuote(next.dataset.ayahNumber);
  });
});



