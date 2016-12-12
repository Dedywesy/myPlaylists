(function () {

    angular
        .module('meanApp')
        .controller('myPlaylistsCtrl', myPlaylistsCtrl);

    myPlaylistsCtrl.$inject = ['$location', 'meanData', 'playlistService'];
    function myPlaylistsCtrl($location, meanData, playlistService) {
        var vm = this;

        vm.playlists = [];
        vm.likes = [];
        vm.newPlaylist = {
            name: "",
            description: "",
            isPublic: true
        };

        meanData.getMyPlaylists()
            .error(function (error) {
                console.error(error);
            })
            .then(function (data) {
                vm.playlists = data.data;
                meanData.getLikedPlaylists()
                    .error(function (error) {
                        console.error(error);
                    })
                    .then(function (data) {
                        vm.likes = data.data;
                        vm.playlists.forEach(function (itemPlaylist) {
                            vm.likes.forEach(function (itemLike) {
                                if (itemPlaylist.ID == itemLike.PlaylistID) {
                                    itemPlaylist.liked = true;
                                }
                            })
                        })
                    })
            });



        vm.addPlaylist = function () {
            console.log("creating playlist. Name : ", vm.newPlaylist.name);
            meanData.createPlaylist(vm.newPlaylist)
                .error(function (err) {
                    alert("Error while adding playlist", err);
                })
                .then(function (data) {
                    vm.playlists.push(data.data);
                    vm.newPlaylist.name = "";
                    vm.newPlaylist.description = "";
                    $location.path('/editPlaylist/' + data.data.ID);
                });
        };

        vm.edit = function (playlist) {
            $location.path('editPlaylist/' + playlist.ID);
        };

        vm.play = function (playlist) {
            playlistService.setPlaylist(playlist);
        };

        vm.toggleLike = function (playlist) {
            if(playlist.liked){
                meanData.unlikePlaylist(playlist.ID)
                    .error(function (error) {
                        console.log(error);
                    })
                    .then(function (data) {
                        var index = vm.likes.indexOf(playlist.ID);
                        if(index != -1){
                            vm.likes.splice(index, 1);
                        }
                        vm.playlists.forEach(function (item) {
                            if (item.ID == playlist.ID) {
                                item.likeCount--;
                                item.liked = false;
                            }
                        })
                    });
            }
            else{
                meanData.likePlaylist(playlist.ID)
                    .error(function (error) {
                        console.log(error);
                    })
                    .then(function (data) {
                        vm.likes.push(playlist.ID);
                        vm.playlists.forEach(function (item) {
                            if (item.ID == playlist.ID) {
                                item.likeCount++;
                                item.liked = true;
                            }
                        })
                    });
            }
        };
    }

})();