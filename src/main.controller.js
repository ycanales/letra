angular
  .module('app')
  .controller('MainCtrl', function ($scope, Lyrics) {
    $scope.playedSongs = Lyrics.playedSongs;
    $scope.state = {
      song: 'Cargando'
    }
    $scope.scan = Lyrics.latestScan


    $scope.$on('NEW-SONG', (e, song) => {
      console.log('la cancion cambio a ', song)
      Lyrics
        .getLyrics()
        .then(song => {
          console.log(song)
          $scope.state.song = song
        })
    })
  })
