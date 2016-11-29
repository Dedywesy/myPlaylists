(function () {
    angular
        .module('meanApp')
        .controller('editPlaylistCtrl', editPlaylistCtrl);

    editPlaylistCtrl.$inject = ['$location', 'authentication', 'meanData', '$routeParams'];
    function editPlaylistCtrl($location, authentication, meanData, $routeParams) {
        vm = this;
        var id = parseInt($routeParams.id);

        //If the playlist can be accessed
        var playlistRetrieved = function () {
            vm.tempPlaylist = copyPlaylist(vm.playlist);
            vm.link = "";
            vm.title = "";
            vm.songListModified = false;

            if (vm.playlist == {}) {
                alert("no playlist to edit");
                $location.path('home');
            }
            if (authentication.currentUser()._id != vm.playlist.userId) {
                alert("This is not the playlist you are looking for :)");
                $location.path('home');
            }

            vm.editMode = false;
            vm.saveEdit = function () {
                console.log("Saving modifications to title/description");
                if (vm.playlist.title != vm.tempPlaylist.title || vm.playlist.description != vm.tempPlaylist.description || vm.songListModified) {
                    vm.tempPlaylist.jsonPlaylist = angular.toJson(vm.tempPlaylist.jsonPlaylist);
                    meanData.editPlaylist(vm.tempPlaylist)
                        .error(function (err) {
                            alert("error while updating playlist", err);
                        })
                        .then(function (data) {
                            vm.playlist = copyPlaylist(data.data);
                            vm.tempPlaylist = copyPlaylist(vm.playlist);
                            vm.editMode = false;
                            vm.songListModified = false;
                        })
                }
            };

            vm.cancelEdit = function () {
                vm.editMode = false;
                var temp = vm.tempPlaylist.jsonPlaylist;
                vm.tempPlaylist = copyPlaylist(vm.playlist);
                vm.tempPlaylist.jsonPlaylist = temp; //TODO Adapt
            };

            vm.delete = function () {
                console.log('delete playlist');
                var result = confirm("Do you really want to delete this playlist?");
                if (result) {
                    meanData.deletePlaylist(vm.playlist)
                        .error(function (err) {
                            alert("error while deleting playlist", err);
                        })
                        .then(function (data) {
                            $location.path('/myPlaylists');
                        })
                }
            };

            vm.addSong = function () {
                vm.songListModified = true;
                var newSong = {
                    title: vm.title,
                    link: vm.link,
                    rank: vm.tempPlaylist.jsonPlaylist.songs.length
                };
                vm.tempPlaylist.jsonPlaylist.songs.push(newSong);
                vm.title = "";
                vm.link = "";
            };
        };

        var copyPlaylist = function (playlist) {
            return {
                ID: playlist.ID,
                userId: playlist.userID,
                isPublic: playlist.isPublic,
                name: playlist.name,
                description: playlist.description,
                jsonPlaylist: playlist.jsonPlaylist || {"songs": []}
            }
        };
        //Real entry point of the controller
        vm.playlist = {};
        meanData.getPlaylist(id)
            .error(function (error) {
                alert(error);
                $location.path("myPlaylists");
            })
            .then(function (data) {
                vm.playlist = data.data;
                playlistRetrieved();
            });
    }
})();