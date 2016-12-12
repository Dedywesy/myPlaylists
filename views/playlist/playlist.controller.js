(function () {
    angular
        .module('meanApp')
        .controller('playlistCtrl', playlistCtrl);

    playlistCtrl.$inject = ['$location', 'meanData', 'authentication', '$routeParams', 'playlistService'];
    function playlistCtrl($location, meanData, authentication, $routeParams, playlistService) {
        vm = this;
        var id = parseInt($routeParams.id);

        //If the playlist can be accessed
        var playlistRetrieved = function () {
            if (vm.playlist == {}) {
                alert("no playlist at this id");
                $location.path('home');
            }
            //Get profile
            meanData.getProfile(vm.playlist.UserID)
                .error(function (error) {
                    console.error("Error while retrieving user", error)
                })
                .then(function (data) {
                    vm.profile = data.data;
                });

            //Get playlist comments
            meanData.getComments(vm.playlist.ID)
                .error(function (error) {
                    console.error("Error while retrieving comments", error)
                })
                .then(function (data) {
                    vm.comments = data.data;
                });

            //Get playlist likes
            meanData.getPlaylistLikes(vm.playlist.ID)
                .error(function (error) {
                    console.error(error);
                })
                .then(function (data) {
                    var likes = data.data;
                    vm.playlist.likeCount = likes.length;
                    vm.playlist.liked = false;
                    for (var i = 0; i < likes.length; i++) {
                        if (likes[i].UserID == vm.user._id) {
                            vm.playlist.liked = true;
                            break;
                        }
                    }
                })
        };

        vm.play = function () {
            playlistService.setPlaylist(vm.playlist);
        };

        vm.addComment = function () {
            if (vm.newComment != "") {
                meanData.commentPlaylist(vm.playlist.ID, vm.newComment)
                    .error(function (error) {
                        alert("Error while adding comment, try again later")
                    })
                    .then(function (result) {
                        result.data.Name = vm.user.name;
                        vm.comments.push(result.data);
                        vm.newComment = "";
                    });
            }
        };

        vm.toggleLike = function () {
            if (vm.playlist.liked) {
                meanData.unlikePlaylist(vm.playlist.ID)
                    .error(function (error) {
                        console.log(error);
                    })
                    .then(function (data) {
                        vm.playlist.liked = false;
                        vm.playlist.likeCount--;
                    });
            }
            else {
                meanData.likePlaylist(vm.playlist.ID)
                    .error(function (error) {
                        console.log(error);
                    })
                    .then(function (data) {
                        vm.playlist.likeCount++;
                        vm.playlist.liked = true;

                    });
            }
        };

        //Real entry point of the controller
        vm.playlist = {};
        vm.profile = {};
        vm.comments = [];
        vm.newComment = "";
        vm.user = authentication.currentUser();
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
