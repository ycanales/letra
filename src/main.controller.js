angular
  .module('app')
  .controller('MainCtrl', function ($scope, $timeout, Lyrics) {
    $scope.playedSongs = Lyrics.playedSongs;
    $scope.state = {
      song: 'Cargando',
      paused: false,
      changing: false,
    }
    $scope.scan = Lyrics.latestScan


    $scope.$on('NEW-SONG', (e, song) => {
      console.log('la cancion cambio a ', song)
      Lyrics
        .getLyrics()
        .then(song => {
          console.log(song)
          if (!$scope.state.paused) {
            $scope.change(song)
          }
        })
    })

    $scope.change = song => {
      $scope.state.changing = true
      $timeout(() => {
        $scope.state.song = song
        $scope.state.changing = false
      }, 500)
    }


    $scope.resume = () => {
      $scope.state.paused = false
      $scope.state.song = Lyrics.getCurrentLyrics()
    }


    $scope.show = song => {
      let show = false

      // Same song title, different artist
      if (song.song === $scope.state.song.song &&
          song.artist !== $scope.state.song.artist) {
        show = true
      }

      // Same artist, different song
      if (song.artist === $scope.state.song.artist &&
          song.song !== $scope.state.song.song) {
        show = true
      }

      // All different
      if (song.artist !== $scope.state.song.artist &&
          song.song !== $scope.state.song.song) {
        show = true
      }

      if (show) {
        $scope.change(Lyrics.getPlayedLyrics(song))
        $scope.state.paused = true
      }
    }

  })
