(function () {

    angular
        .module('meanApp')
        .service('playlistService', playlist);

    playlist.$inject = ['$rootScope'];
    function playlist($rootScope) {
        var currentPlaylist;

        var setPlaylist = function(playlist){
            currentPlaylist = playlist;
            $rootScope.$broadcast('playlistChanged', {
                data: playlist
            });
        };

        var getPlaylist = function(){
            return currentPlaylist;
        };

        return{
            getPlaylist : getPlaylist,
            setPlaylist : setPlaylist
        }
    }
})();