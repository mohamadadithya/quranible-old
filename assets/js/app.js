/* Copyright 2021 by Mohamad Adithya */
if('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker
    .register('/serviceWorker.js')
    .then(res => console.log('Service worker registered'))
    .catch(err => console.log('Service worker not registered', err))
  })
}

const mainNav = document.querySelector('.main-nav')
const surahsContainer = document.querySelector('.surahs .container')
const loader = document.querySelector('.loader')
const surahPage = document.querySelector('.surah-page')
const versesContainer = document.querySelector('.verses')
const audioEl = document.querySelector('.audio')
const themeToggle = document.querySelector('.check-toggle')
const footer = document.querySelector('footer')

let darkTheme = false

// Check Theme
const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null

if(currentTheme) {
  document.documentElement.setAttribute('data-theme', currentTheme)

  if(currentTheme === 'dark') {
    const toggleIcon = themeToggle.previousElementSibling
    themeToggle.checked = true
    toggleIcon.classList.replace('fa-moon', 'fa-sun')
    darkTheme = true
  }
}

const getSurahs = async () => {
  const response = await fetch(`https://api.quran.sutanlab.id/surah/`)
  showLoader()
  const result = await response.json()
  const surahs = await result.data
  showSurahs(surahs)
  hideLoader()
  footer.style.display = 'block'
}

getSurahs()

const showSurahs = (surah) => {
  for (let i in surah) {
    surahsContainer.innerHTML += `<div class="surah flex shadow" onclick="showSurah(${surah[i].number})">
             <p class="number">${surah[i].number}</p>
             <div>
              <h3 class="name">${surah[i].name.transliteration.id}</h3>
               <p class="desc text-gray">${surah[i].name.translation.id} • ${surah[i].numberOfVerses} ayat</p>
             </div>
           </div>`
  }
}

const showSurah = (surahNumber) => {
  showLoader()
  fetch(`https://api.quran.sutanlab.id/surah/${surahNumber}`)
    .then(res => res.json())
    .then(res => {
      getSurah(res.data)
      hideLoader()
    })
  surahPage.classList.add('active')
}

const getSurah = (surah) => {
  document.body.style.overflowY = 'hidden'
  mainNav.innerHTML = `
         <li onclick="closeSurah()"><i class="far fa-chevron-left"></i></li>
         <li class="logo">${surah.name.transliteration.id}</li>
         <li class="far fa-play toggle" onclick="toggleAudios(this)" data-number="${surah.number}"></li>
         `
  let i
  /* If surah number is 1 change i variable value to 1, else 0  */
  (surah.number === 1) ? i = 1: i = 0
  for (i; i < surah.verses.length; i++) {
    versesContainer.innerHTML += `<ul class="verse">
         <li class="arab">${surah.verses[i].text.arab}</li>
         <li class="latin">${surah.verses[i].number.inSurah}. ${surah.verses[i].text.transliteration.en}</li>
         <li class="means text-gray">${surah.verses[i].translation.id}</li>
         <li class="far fa-play toggle" onclick="toggleAudio(this)" data-audio="${surah.verses[i].audio.primary}"></li>
       </ul>`
  }
}

const toggleAudio = (el) => {
  changeAudioToggles()
  let audioSrc = el.getAttribute('data-audio')
  el.classList.toggle('play')
  audioEl.src = audioSrc
  if (el.classList.contains('play')) {
    el.classList.replace('fa-play', 'fa-stop')
    audioEl.play()
  } else {
    el.classList.replace('fa-stop', 'fa-play')
    audioEl.pause()
  }
  audioEl.onended = () => {
    el.classList.replace('fa-stop', 'fa-play')
  }
}

const toggleAudios = (el) => {
  changeAudioToggles()
  let surahNumber = el.getAttribute('data-number')
  el.classList.toggle('play')
  fetch(`https://api.quran.sutanlab.id/surah/${surahNumber}`)
    .then(res => res.json())
    .then(res => {
      playAudios(res.data.verses, el)
    })
}

const playAudios = (verses, el) => {
  let i = 1
  audioEl.src = verses[0].audio.primary
  if (el.classList.contains('play')) {
    audioEl.play()
    el.classList.replace('fa-play', 'fa-stop')
  } else {
    audioEl.pause()
    el.classList.replace('fa-stop', 'fa-play')
  }
  audioEl.onended = () => {
    el.classList.replace('fa-stop', 'fa-play')
    audioEl.src = verses[i++].audio.primary
    audioEl.play()
    el.classList.replace('fa-play', 'fa-stop')
  }
}

const closeSurah = () => {
  document.body.style.overflowY = 'auto'
  surahPage.classList.remove('active')
  mainNav.innerHTML = `<li class="logo">Quranible</li>
  <li class="theme-toggle">
  <label for="check-toggle" class="far ${darkTheme === true ? 'fa-sun' : 'fa-moon'} toggle"></label>
  <input type="checkbox" class="check-toggle" id="check-toggle" onchange="setTheme(this)">
  </li>`
  setTimeout(() => {
    versesContainer.innerHTML = ''
  }, 500);
}

const changeAudioToggles = () => {
  const toggles = document.querySelectorAll('.toggle')
  toggles.forEach((toggle) => {
    toggle.classList.replace('fa-stop', 'fa-play')
  })
}

const setTheme = (el) => {
  const toggleIcon = el.previousElementSibling
  if(el.checked) {
    toggleIcon.classList.replace('fa-moon', 'fa-sun')
    darkTheme = true
    document.documentElement.setAttribute('data-theme', 'dark')
    localStorage.setItem('theme', 'dark')
  } else {
    toggleIcon.classList.replace('fa-sun', 'fa-moon')
    darkTheme = false
    document.documentElement.setAttribute('data-theme', 'light')
    localStorage.setItem('theme', 'light')
  }
}

const showLoader = () => {
  loader.classList.add('active')
}

const hideLoader = () => {
  loader.classList.remove('active')
}
/* Copyright 2021 by Mohamad Adithya */