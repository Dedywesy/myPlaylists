(function () {
    angular
        .module('meanApp')
        .controller('playlistCtrl', playlistCtrl);

    playlistCtrl.$inject = ['$location', 'meanData', '$routeParams'];
    function playlistCtrl($location, meanData, $routeParams) {
        vm = this;
        var id = parseInt($routeParams.id);

        //If the playlist can be accessed
        var playlistRetrieved = function () {
            if (vm.playlist == {}) {
                alert("no playlist at this id");
                $location.path('home');
            }
            meanData.getProfile(vm.playlist.UserID)
                .error(function(error){
                    console.error("Error while retrieving user", error)
                })
                .then(function (data) {
                    vm.profile = data.data;
                })
        };

        vm.play = function(){
            //TODO
            console.log("play playlist");
        };


        //Real entry point of the controller
        vm.playlist = {};
        vm.profile = {};
        meanData.getPlaylist(id)
            .error(function (error) {
                alert(error.message);
                $location.path("myPlaylists");
            })
            .then(function (data) {
                vm.playlist = data.data;
                playlistRetrieved();
            });
    }
})();
