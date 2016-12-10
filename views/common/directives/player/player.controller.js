(function () {
    angular
        .module('meanApp')
        .controller('playerCtrl', playerCtrl);

    playerCtrl.$inject = ['$scope', 'YT_event', 'SC_event', '$window'];
    function playerCtrl($scope, YT_event, SC_event, $window) {
        var index = 0;
        var currentPlaylist = [];
        var playingFrom = "";
        var playing = true;
        $scope.yt = {
            title: "",
            link: ""
        };

        $scope.YT_event = YT_event;

        $scope.sendControlEvent = function () {
            playing = !playing;
            if(playing){
                if(playingFrom == "YT"){
                    this.$broadcast(YT_event.PLAY);
                }
                if(playingFrom == "SC"){
                    this.$broadcast(SC_event.PLAY);
                }
            }else{
                if(playingFrom == "YT"){
                    this.$broadcast(YT_event.PAUSE);
                }
                if(playingFrom == "SC"){
                    this.$broadcast(SC_event.PAUSE);
                }
            }
        };

        $scope.nextSong = function(){
            if (index + 1 < currentPlaylist.length) {
                index++;
                var song = currentPlaylist[index];
                if (song.from == "Youtube") {
                    $scope.scid ="";
                    $scope.videoid = song.id;
                    $scope.$broadcast(YT_event.PLAY);
                    playingFrom = "YT";
                } else if (song.from == "Soundcloud") {
                    $scope.videoid="";
                    $scope.scid = song.id;
                    playingFrom = "SC";
                }
                $scope.yt.title = song.title;
                $scope.yt.link = song.link;
            }
        };

        $scope.$on(YT_event.STATUS_CHANGE, function (event, data) {
            $scope.yt.playerStatus = data;
            if (data == 'ENDED') {
                $scope.nextSong();
            }
        });

        $scope.$on('playlistChanged', function (event, data) {
            currentPlaylist = data.data.JsonPlaylist.songs;
            index = -1;
            $scope.nextSong();
        })
    }
})();
