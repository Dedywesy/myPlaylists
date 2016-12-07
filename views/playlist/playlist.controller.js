(function () {
    angular
        .module('meanApp')
        .controller('playlistCtrl', playlistCtrl);

    playlistCtrl.$inject = ['$location', 'meanData', 'authentication', '$routeParams'];
    function playlistCtrl($location, meanData, authentication, $routeParams) {
        vm = this;
        var id = parseInt($routeParams.id);

        //If the playlist can be accessed
        var playlistRetrieved = function () {
            if (vm.playlist == {}) {
                alert("no playlist at this id");
                $location.path('home');
            }
            meanData.getProfile(vm.playlist.UserID)
                .error(function (error) {
                    console.error("Error while retrieving user", error)
                })
                .then(function (data) {
                    vm.profile = data.data;
                });

            meanData.getComments(vm.playlist.ID)
                .error(function(error) {
                    console.error("Error while retrieving comments", error)
                })
                .then(function (data){
                    console.log(data.data);
                    vm.comments = data.data;
                })

        };

        vm.play = function () {
            //TODO
            console.log("play playlist");
        };

        vm.addComment = function () {
            if (vm.newComment != "") {
                meanData.commentPlaylist(vm.playlist.ID, vm.newComment)
                    .error(function (error) {
                        alert("Error while adding comment, try again later")
                    })
                    .then(function (result) {
                        result.data.Name = authentication.currentUser().name;
                        vm.comments.push(result.data);
                        vm.newComment = "";
                    });
            }
        };

        //Real entry point of the controller
        vm.playlist = {};
        vm.profile = {};
        vm.comments = [];
        vm.newComment = "";
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
