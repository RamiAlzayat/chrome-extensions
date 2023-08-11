document.addEventListener('DOMContentLoaded', function () {
  fetchQuote();
});

const maxChar = 600


function getRandomAyahNumber() {
  return Math.floor(Math.random() * 6236) + 1;
}

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

const arabicTextElement = document.querySelector(".arabic-text");
const ayahNumberElement = document.querySelector(".ayah-number");
const englishSubElement = document.querySelector(".english-sub");
const surahNameElement = document.querySelector(".surah-name-text");

console.log(arabicTextElement);
console.log(ayahNumberElement);
console.log(englishSubElement);

function fetchQuote() {
  fetch(`https://api.alquran.cloud/v1/ayah/${getRandomAyahNumber()}/editions/ar.alafasy,en.asad`)
    .then(response => response.json())
    .then(data => {
      const resAr = data.data[0]
      const resEn = data.data[1]

      const arTextValue = resAr.text;
      const enTextValue = resEn.text;
      const ayahNumberValue = resAr.numberInSurah
      const alfatihaValue = resAr.surah.number === 1

      arabicTextElement.textContent = renderArText(arTextValue, alfatihaValue);
      ayahNumberElement.textContent = `(${ayahNumberValue})`
      englishSubElement.textContent = enTextValue.trim().substring(0, maxChar);
      surahNameElement.textContent = `${resAr.surah.name} ${resAr.surah.englishName}`
    })
    .catch(error => {
      console.error('Error fetching quote:', error);
    });
}
