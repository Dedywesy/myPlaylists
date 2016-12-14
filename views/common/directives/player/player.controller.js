(function () {
    angular
        .module('meanApp')
        .controller('playerCtrl', playerCtrl);

    playerCtrl.$inject = ['$scope', 'YT_event', 'SC_event', '$window'];
    function playerCtrl($scope, YT_event, SC_event, $window) {
        $scope.index = 0;
        var time_update_interval;
        $scope.currentPlaylist = [];
        var playingFrom = "";
        $scope.isPlaying = true;
        $scope.yt = {
            title: "",
            link: "",
            artwork: ""
        };

        $scope.YT_event = YT_event;

        $scope.sendControlEvent = function () {
            $scope.isPlaying = !$scope.isPlaying;
            if ($scope.isPlaying) {
                if (playingFrom == "YT") {
                    this.$broadcast(YT_event.PLAY);
                }
                if (playingFrom == "SC") {
                    this.$broadcast(SC_event.PLAY);
                }
            } else {
                if (playingFrom == "YT") {
                    this.$broadcast(YT_event.PAUSE);
                }
                if (playingFrom == "SC") {
                    this.$broadcast(SC_event.PAUSE);
                }
            }
        };

        $scope.nextSong = function () {
            if ($scope.index + 1 < $scope.currentPlaylist.length) {
                $scope.index++;
                var song = $scope.currentPlaylist[$scope.index];
                if (song.from == "Youtube") {
                    $scope.scid = "";
                    $scope.videoid = song.id;
                    $scope.$broadcast(YT_event.PLAY);
                    playingFrom = "YT";
                } else if (song.from == "Soundcloud") {
                    $scope.videoid = "";
                    $scope.scid = song.id;
                    ;
                    playingFrom = "SC";
                }
                $scope.$broadcast("UPDATE", $scope.scid);
                $scope.yt.title = song.title;
                $scope.yt.link = song.link;
                $scope.yt.artwork = song.artwork;
            }
        };

        $scope.prevSong = function () {
            if ($scope.index > 0) {
                $scope.index -= 2;
                $scope.nextSong();
            }

        };

        $scope.firstSong = function () {
            return ($scope.index <= 0);
        };
        $scope.lastSong = function () {
            return $scope.index == $scope.currentPlaylist.length -1;
        };

        $scope.$on(YT_event.STATUS_CHANGE, function (event, data) {
            clearInterval(time_update_interval);
            if (data == 'ENDED') {
                $scope.nextSong();
            }
            if (data == 'PLAYING') {
                var player = $scope.player;
                time_update_interval = setInterval(function () {
                    $scope.$apply(function () {
                        var elapsedMin = parseInt((player.getCurrentTime() / 60), 10);
                        var elapsedSec = parseInt((player.getCurrentTime() % 60), 10);
                        if (elapsedSec < 10){
                            elapsedSec = '0'+elapsedSec;
                        }
                        var totalMin = parseInt((player.getDuration() / 60), 10);
                        var totalSec = parseInt((player.getDuration() % 60), 10);
                        if(totalSec < 10){
                            totalSec = '0'+totalSec;
                        }
                        $scope.timePlayed = elapsedMin + ":" + elapsedSec + "/" + totalMin + ":" + totalSec;
                    })
                }, 1000)
            }
        });

        $scope.$on(SC_event.LOADED, function (event, data) {
            var song = data;
            song.ontimeupdate = function () {
                $scope.$apply(function () {
                    var elapsedMin = parseInt((song.currentTime / 60), 10);
                    var elapsedSec = parseInt((song.currentTime % 60), 10);
                    if (elapsedSec < 10){
                        elapsedSec = '0'+elapsedSec;
                    }
                    var totalMin = parseInt((song.duration / 60), 10);
                    var totalSec = parseInt((song.duration % 60), 10);
                    if(totalSec < 10){
                        totalSec = '0'+totalSec;
                    }
                    $scope.timePlayed = elapsedMin + ":" + elapsedSec + "/" + totalMin + ":" + totalSec;
                })
            }
        });

        $scope.$on('playlistChanged', function (event, data) {
            $scope.currentPlaylist = data.data.JsonPlaylist.songs;
            if (playingFrom == "YT") {
                $scope.$broadcast(YT_event.STOP);
            }
            if (playingFrom == "SC") {
                $scope.$broadcast(SC_event.STOP);
            }
            $scope.index = -1;
            $scope.nextSong();
        })
    }
})();
