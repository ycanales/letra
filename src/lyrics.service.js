const cheerio = require('cheerio')
const fs = require('fs')
const path = require('path')
const shell = require('shelljs')
const tmp = require('tmp')

angular
  .module('app')
  .service('Lyrics', function ($q, $interval, $rootScope, genius) {
    // Spotify applescript is inside asar archive
    // so its unreachable by the shell. We copy its contents
    // to a tmp file and then call osascript on that file.
    let spotify = fs.readFileSync(path.join(__dirname, '/spotify.applescript'))
    let spotifyTmp = tmp.fileSync()
    fs.writeFile(spotifyTmp.fd, spotify)
    let command = `osascript ${spotifyTmp.name}`

    this.latestScan = ''
    this.playedSongs = []

    // Vemos si cambia o no la canción actual
    $interval(() => {
      let currentSong = shell.exec(command, {async: true})
      currentSong.stdout.on('data', output => {
        if (this.latestScan !== output) {
          this.latestScan = output
          $rootScope.$broadcast('NEW-SONG', output)
        }
      })
    }, 1000)


    this.getPlayedLyrics = song => {
      analytics.event('lyrics', 'getPlayedLyrics', `${song.artist} - ${song.song}`, 1)
      return this.playedSongs.find(s => s.song === song.song &&
                                        s.artist === song.artist)
    }

    this.getCurrentLyrics = () => {
      return this.playedSongs[this.playedSongs.length - 1]
    }


    this.getLyrics = () => {
      let deferred = $q.defer()
      let currentSong = shell.exec(command, {async: true})

      currentSong.stdout.on('data', output => {
        // ES6 array destructuring assignment
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
        let [artist, song] = output.split('-')
        this.playedSongs.push({artist, song});

        // Fetch API - Headers
        // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#Headers
        let geniusHeaders = new Headers()
        geniusHeaders.append('Authorization', `Bearer ${genius.ACCESS_TOKEN}`)

        document.querySelector('.song').innerHTML = song
        document.querySelector('.artist').innerHTML = artist
        song = song.replace('Live', '')
        encodedSong = encodeURIComponent(`${artist} ${song}`)

        // Fetch API - Making fetch requests
        // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#Making_fetch_requests
        fetch(`http://api.genius.com/search?q=${encodedSong}`, {
          method: 'GET',
          headers: geniusHeaders
        })
          // json() method of the response returns a Promise
          .then(response => {
            return response.json()
          })
          .then(json => {
            return fetch(json.response.hits[0].result.url)
          })
          .then(response => {
            return response.text()
          })
          .then(text => {
            let $ = cheerio.load(text)
            let lyrics = $('.lyrics').text().trim().replace(/googletag\.cmd\.push\(.*}\);/g, '')
            let tmpSong = this.playedSongs.pop()

            analytics.event('lyrics', 'getLyrics', `${tmpSong.artist} - ${tmpSong.song}`, 1)
            tmpSong.lyrics = lyrics
            this.playedSongs.push(tmpSong)
            deferred.resolve(tmpSong)
          })
      })

      return deferred.promise;
    }
  })
