(function(){
    angular
        .module('meanApp')
        .controller('playerCtrl', playerCtrl);

    playerCtrl.$inject = ['$scope', 'YT_event', '$window'];
    function playerCtrl($scope, YT_event, $window) {
        var index = 0;
        var currentPlaylist = [];
        $scope.yt = {
            width: 600,
            height: 480,
            videoid: "M7lc1UVf-VE",
            playerStatus: "NOT PLAYING"
        };

        $scope.YT_event = YT_event;

        $scope.sendControlEvent = function (ctrlEvent) {
            this.$broadcast(ctrlEvent);
        };

        $scope.$on(YT_event.STATUS_CHANGE, function (event, data) {
            $scope.yt.playerStatus = data;
            if(data == 'ENDED'){
                if(index<currentPlaylist.length){
                    index ++;
                    $scope.videoid = currentPlaylist[index].id;
                    $scope.$broadcast(YT_event.PLAY);
                }
            }
        });

        $scope.$on('playlistChanged', function (event, data) {
            currentPlaylist = data.data.JsonPlaylist.songs;
            $scope.videoid = currentPlaylist[0].id;
            index = 0;
        })
    }
})();
