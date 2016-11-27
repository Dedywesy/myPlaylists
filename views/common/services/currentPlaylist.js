(function () {

    angular
        .module('meanApp')
        .service('currentPlaylist', currentPlaylist);
    currentPlaylist.$inject = ['$window']
    function currentPlaylist($window) {

        function set(playlist){
            $window.localStorage['currentPlaylist'] = JSON.stringify(playlist);
        }
        function get(){
            return JSON.parse($window.localStorage['currentPlaylist']);
        }

        return {
            get: get,
            set: set
        };
    }

})();
