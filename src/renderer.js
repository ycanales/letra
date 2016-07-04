// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const cheerio = require('cheerio')
const shell = require('shelljs')
const genius = require('../secret').genius

let currentSong = shell.exec('osascript spotify.applescript', {async: true})

currentSong.stdout.on('data', output => {
  // ES6 array destructuring assignment
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
  let [artist, song] = output.split('-')

  // Fetch API - Headers
  // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#Headers
  let geniusHeaders = new Headers()
  geniusHeaders.append('Authorization', `Bearer ${genius.accessToken}`)

  document.querySelector('.song').innerHTML = song
  document.querySelector('.artist').innerHTML = artist
  song = song.replace('Live', '')

  // Fetch API - Making fetch requests
  // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#Making_fetch_requests
  fetch(`http://api.genius.com/search?q=${artist}+${song}`, {
    method: 'GET',
    headers: geniusHeaders
  })
    // json() method of the response returns a Promise
    .then(function(response) {
      return response.json()
    })
    .then(function(json) {
      return fetch(json.response.hits[0].result.url)
    })
    .then(function(response) {
      return response.text()
    })
    .then(function(text) {
      let $ = cheerio.load(text)
      let lyrics = $('.lyrics').text().trim().replace(/googletag\.cmd\.push\(.*}\);/g, '')
      document.getElementById('lyrics').innerHTML = lyrics
    })
})

