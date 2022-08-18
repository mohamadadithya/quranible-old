/* Copyright 2021 by Mohamad Adithya */
const mainNav = document.querySelector('.main-nav')
const sidebar = document.querySelector('.sidebar')
const surahsContainer = document.querySelector('.surahs .container')
const dailyPrayerContainer = document.querySelector('.daily-prayer-page .container')
const timeListContainer = document.querySelector('.time-list')
const versesContainer = document.querySelector('.verses')
const asmaulHusnaContainer = document.querySelector('.asmaul-husna-page .container')
const prayerIntentionsContainer = document.querySelector('.prayer-intentions-page .container')
const audioEl = document.querySelector('.audio')
const themeToggle = document.querySelector('.check-toggle')
const footer = document.querySelector('footer')
const offlineSection = document.querySelector('.offline')
const sidebarLinks = sidebar.querySelectorAll('.link')
const loader = document.querySelector('.loader')

const pages = document.querySelectorAll('.page')
const surahPage = pages[0]

if('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker
    .register('/serviceWorker.js')
    .then(res => console.log('Service worker registered'))
    .catch(err => console.log('Service worker not registered', err))
  })
}

sidebarLinks.forEach((link, index) => {
    link.addEventListener('click', () => {
      sidebar.classList.remove('active')
    })
    if(index === 1) {
      link.addEventListener('click', async () => {
        pages[index + 1].classList.add('active')
        showLoader()
        const response = await fetch('https://api.npoint.io/31b52b3caae1b5c00c17')
        const result = await response.json()
        const data = await result
        showDailyPrayer(data)
        hideLoader()
      })
    } else if(index === 2) {
      link.addEventListener('click', async () => {
        pages[index - 1].classList.add('active')
        showLoader()
        const response = await fetch('https://api.techniknews.net/ipgeo/')
        const result = await response.json()
        const location = await result
        getLocation(location.city)
      })
    } else if(index === 3) {
      link.addEventListener('click', async () => {
        pages[index].classList.add('active')
        showLoader()
        const response = await fetch('https://api.npoint.io/7c853c9f8335e6e948dd')
        const result = await response.json()
        const data = await result
        showAsmaulHusna(data)
        hideLoader()
      })
    } else if(index === 4) {
      link.addEventListener('click', async () => {
        pages[index].classList.add('active')
        showLoader()
        const response = await fetch('https://api.npoint.io/ab0d08dc6a3ca914b0fe')
        const result = await response.json()
        const data = await result
        showPrayerIntentions(data)
        hideLoader()
      })
    }
})

const showAsmaulHusna = (asmaulNames) => {
  document.body.style.overflowY = 'hidden'
  mainNav.innerHTML = `
  <li onclick="closePage()"><a href="#" class="far fa-chevron-left text-white"></a></li>
  <li class="logo">Asmaul Husna</li>`

  asmaulNames.forEach(asmaul => {
    asmaulHusnaContainer.innerHTML += `<div class="primary-card shadow">
    <h2 class="name">${asmaul.urutan}. ${asmaul.latin}</h2>
    <p class="arab">${asmaul.arab}</p>
    <p class="text-gray">${asmaul.arti}</p>
  </div>`
  })
}

const showPrayerIntentions = (prayerIntentions) => {
  document.body.style.overflowY = 'hidden'
  mainNav.innerHTML = `
  <li onclick="closePage()"><a href="#" class="far fa-chevron-left text-white"></a></li>
  <li class="logo">Niat-Niat Sholat</li>
  `

  prayerIntentions.forEach(intention => {
    prayerIntentionsContainer.innerHTML += `<div class="primary-card shadow">
    <h2 class="name">${intention.name}</h2>
    <p class="arab">${intention.arab}</p>
    <p class="latin">${intention.latin}</p>
    <p class="means">${intention.means}</p>
 </div>`
  })
}

const getLocation = async (city) => {
  const response = await fetch(`https://api.banghasan.com/sholat/format/json/kota/nama/${city}`)
  const result = await response.json()
  const data = await result
  const locationId = data.kota[0].id
  getAdzan(locationId, city)
}

const getAdzan = async (locationId, city) => {
  showLoader()
  const date = new Date().toLocaleDateString('en-CA')
  const response = await fetch(`https://api.banghasan.com/sholat/format/json/jadwal/kota/${locationId}/tanggal/${date}`)
  const result = await response.json()
  const data = await result
  showAdzan(data.jadwal.data, city)
  hideLoader()
}

const showAdzan = (adzan, city) => {
  const elements = {
    location: document.querySelector('.adzan-page .location'),
    name: document.querySelector('.adzan-page .name'),
    time: document.querySelector('.adzan-page .time'),
    timeIcon: document.querySelector('.adzan-page .time-icon'),
    date: document.querySelector('.adzan-page .date')
  }
  document.body.style.overflowY = 'hidden'
  mainNav.innerHTML = `
  <li onclick="closePage()"><a href="#" class="far fa-chevron-left text-white"></a></li>
  <li class="logo">Waktu Sholat</li>
  `
  elements.location.innerHTML = `<i class="far fa-map-marker-alt"></i> ${city}`

  const adzanTimes = {
    shubuh: {
      name: 'Shubuh',
      time: adzan.subuh,
      icon: 'fa-sunrise'
    },
    dhuhr: {
      name: 'Dzuhur',
      time: adzan.dzuhur,
      icon: 'fa-sun'
    },
    ashar: {
      name: 'Ashar',
      time: adzan.ashar,
      icon: 'fa-sun'
    },
    maghrib: {
      name: 'Maghrib',
      time: adzan.maghrib,
      icon: 'fa-sunset'
    },
    isya: {
      name: 'Isya',
      time: adzan.isya,
      icon: 'fa-moon'
    }
  }

  const shubuhTime = adzanTimes.shubuh.time
  const dhuhrTime = adzanTimes.dhuhr.time
  const asharTime = adzanTimes.ashar.time
  const maghribTime = adzanTimes.maghrib.time
  const isyaTime = adzanTimes.isya.time
  const dateObj = new Date()
  const localTime = `${dateObj.toLocaleString('it-IT', {hour: '2-digit', minute: '2-digit'})}`
  
  if(localTime >= shubuhTime && localTime <= dhuhrTime) {
    elements.name.innerText = adzanTimes.dhuhr.name
    elements.timeIcon.classList.replace('fa-none', adzanTimes.dhuhr.icon)
    elements.time.innerText = dhuhrTime
  }
  if(localTime >= dhuhrTime && localTime <= asharTime) {
    elements.name.innerText = adzanTimes.ashar.name
    elements.timeIcon.classList.replace('fa-none', adzanTimes.ashar.icon)
    elements.time.innerText = asharTime
  }
  if(localTime >= asharTime && localTime <= maghribTime) {
    elements.name.innerText = adzanTimes.maghrib.name
    elements.timeIcon.classList.replace('fa-none', adzanTimes.maghrib.icon)
    elements.time.innerText = maghribTime
  }
  if(localTime >= maghribTime && localTime <= isyaTime) {
    elements.name.innerText = adzanTimes.isya.name
    elements.timeIcon.classList.replace('fa-none', adzanTimes.isya.icon)
    elements.time.innerText = isyaTime
  }
  if(localTime >= isyaTime || localTime <= shubuhTime) {
    elements.name.innerText = adzanTimes.shubuh.name
    elements.timeIcon.classList.add('fa-none' ,adzanTimes.shubuh.icon)
    elements.time.innerText = shubuhTime
  }

  elements.date.innerText = dateObj.toLocaleString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  const timeListContainer = document.querySelector('.time-list')
  const adzanTimesArray = Object.values(adzanTimes)

  adzanTimesArray.forEach(adzanTime => {
    timeListContainer.innerHTML += `<div class="card flex align-center between shadow">
    <span class="flex align-center">
       <i class="far fa-fw ${adzanTime.icon}"></i>
       <p class="name">${adzanTime.name}</p>
    </span>
    <p class="time">${adzanTime.time}</p>
 </div>`
  })
}

const showDailyPrayer = (prayers) => {
  document.body.style.overflowY = 'hidden'
  mainNav.innerHTML = `
  <li onclick="closePage()"><a href="#" class="far fa-chevron-left text-white"></a></li>
  <li class="logo">Doa-Doa Harian</li>
  `
  prayers.forEach(prayer => {
    dailyPrayerContainer.innerHTML += `<div class="primary-card shadow">
    <h2 class="name">${prayer.doa}</h2>
    <p class="arab">${prayer.ayat}</p>
    <p class="latin">${prayer.latin}</p>
    <p class="means">${prayer.artinya}</p>
 </div>`
  })
}

window.addEventListener('offline', () => {
  if(!navigator.onLine) {
    offlineSection.style.display = 'grid'
  } else {
    offlineSection.style.display = 'none'
  }
})

// Back Event
window.addEventListener('hashchange', (e) => {
  if(e.oldURL.length > e.newURL.length) {
    closePage()
  }
})

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
  const response = await fetch(`https://api.quran.gading.dev/surah`)
  showLoader()
  const result = await response.json()
  const surahs = await result.data
  showSurahs(surahs)
  hideLoader()
}

getSurahs()

const showSurahs = (surah) => {
  for (let i in surah) {
    surahsContainer.innerHTML += `<a href="#${surah[i].name.transliteration.id.toLowerCase()}" class="surah flex shadow" onclick="showSurah(${surah[i].number})">
             <p class="number">${surah[i].number}</p>
             <div>
              <h3 class="name">${surah[i].name.transliteration.id}</h3>
               <p class="desc text-gray">${surah[i].name.translation.id} • ${surah[i].numberOfVerses} ayat</p>
             </div>
           </a>`
  }
}

const showSurah = (surahNumber) => {
  sidebar.classList.remove('active')
  showLoader()
  fetch(`https://api.quran.gading.dev/surah/${surahNumber}`)
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
         <li onclick="closePage()"><a href="#" class="far fa-chevron-left text-white"></a></li>
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

const closePage = () => {
  document.body.style.overflowY = 'auto'
  const pages = document.querySelectorAll('.page')
  pages.forEach(page => {
    page.classList.remove('active')
  })
  mainNav.innerHTML = `<li class="menu toggle" onclick="showSidebar()"><i class="far fa-bars"></i></li>
  <li class="logo">Quranible</li>
  <li class="theme-toggle">
  <label for="check-toggle" class="far ${darkTheme === true ? 'fa-sun' : 'fa-moon'} toggle"></label>
  <input type="checkbox" class="check-toggle" id="check-toggle" onchange="setTheme(this)">
  </li>`
  setTimeout(() => {
    versesContainer.innerHTML = ''
    dailyPrayerContainer.innerHTML = ''
    timeListContainer.innerHTML = ''
    asmaulHusnaContainer.innerHTML = ''
    prayerIntentionsContainer.innerHTML = ''
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

const showSidebar = () => {
  sidebar.classList.toggle('active')
}

const showLoader = () => {
  loader.classList.add('active')
}

const hideLoader = () => {
  loader.classList.remove('active')
}
/* Copyright 2021 by Mohamad Adithya */
