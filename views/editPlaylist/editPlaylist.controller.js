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
            if (authentication.currentUser()._id != vm.playlist.UserID) {
                alert("This is not the playlist you are looking for :)");
                $location.path('home');
            }

            vm.editMode = false;
            vm.saveEdit = function () {
                console.log("Saving modifications");
                if (vm.playlist.Name != vm.tempPlaylist.Name ||
                    vm.playlist.Description != vm.tempPlaylist.Description ||
                    vm.playlist.IsPublic != vm.tempPlaylist.IsPublic ||
                    vm.songListModified) {
                    resetRanks();
                    vm.tempPlaylist.JsonPlaylist = angular.toJson(vm.tempPlaylist.JsonPlaylist);
                    meanData.editPlaylist(vm.tempPlaylist)
                        .error(function (err) {
                            alert("error while updating playlist" + err);
                        })
                        .then(function (data) {
                            vm.playlist = copyPlaylist(data.data);
                            vm.tempPlaylist.JsonPlaylist = JSON.parse(vm.tempPlaylist.JsonPlaylist);
                            vm.songListModified = false;
                        })
                }
                vm.editMode = false;
            };

            vm.cancelEdit = function () {
                vm.editMode = false;
                var temp = vm.tempPlaylist.JsonPlaylist;
                vm.tempPlaylist = copyPlaylist(vm.playlist);
                vm.tempPlaylist.JsonPlaylist = temp; //TODO Adapt
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
                    rank: vm.tempPlaylist.JsonPlaylist.songs.length
                };
                vm.tempPlaylist.JsonPlaylist.songs.push(newSong);
                vm.title = "";
                vm.link = "";
            };

            vm.removeSong = function (song) {
                vm.songListModified = true;
                var index = vm.tempPlaylist.JsonPlaylist.songs.indexOf(song);
                if(index != -1){
                    vm.tempPlaylist.JsonPlaylist.songs.splice(index, 1);
                }
            };

            vm.items = ["1", "2", "3", "4"];

            vm.dragControlListeners = {
                accept: function (sourceItemHandleScope, destSortableScope) {return true},//override to determine
                // drag is allowed or not. default is true.
                itemMoved: function (event) {},//Does nothing,
                orderChanged: function (event) {vm.songListModified = true;},//Do what you want},
                longTouch: true
            };

        };

        var copyPlaylist = function (playlist) {
            return {
                ID: playlist.ID,
                UserID: playlist.UserID,
                IsPublic: playlist.IsPublic,
                Name: playlist.Name,
                Description: playlist.Description,
                JsonPlaylist: playlist.JsonPlaylist || {"songs": []}
            };
        };
        //Real entry point of the controller
        vm.playlist = {};
        meanData.getPlaylist(id)
            .error(function (error) {
                alert(error.message);
                $location.path("myPlaylists");
            })
            .then(function (data) {
                vm.playlist = data.data;
                playlistRetrieved();
            });


        vm.indexOfSong = function(song){
            return vm.tempPlaylist.JsonPlaylist.songs.indexOf(song);
        };

        function resetRanks(){
            for(var i = 0; i<vm.tempPlaylist.JsonPlaylist.songs.length ; i++ ){
                vm.tempPlaylist.JsonPlaylist.songs[i].rank = i;
            }
        }
    }
})();