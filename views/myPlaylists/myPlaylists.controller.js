(function () {

    angular
        .module('meanApp')
        .controller('myPlaylistsCtrl', myPlaylistsCtrl);

    myPlaylistsCtrl.$inject = ['$location','meanData', 'currentPlaylist'];
    function myPlaylistsCtrl($location, meanData, currentPlaylist) {
        var vm = this;

        vm.playlists = {};
        vm.newPlaylist = {
            name: "",
            description: "",
            isPublic: true
        };

        meanData.getMyPlaylists()
            .success(function (data) {
                vm.playlists = data;
            })
            .error(function (error) {
                console.error(error);
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
                });
        };

        vm.edit = function (playlist) {
            currentPlaylist.set(playlist);
            $location.path('editPlaylist');
        };

        vm.play = function (playlist) {
            console.log("Play", playlist); //TODO
        }
    }

})();