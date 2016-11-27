(function() {
    angular
        .module('meanApp')
        .controller('editPlaylistCtrl', editPlaylistCtrl);

    editPlaylistCtrl.$inject = ['$location', 'authentication', 'currentPlaylist', 'meanData'];
    function editPlaylistCtrl ($location, authentication, currentPlaylist, meanData) {
        vm = this;

        var copyPlaylist = function (playlist) {
            return {
                ID: playlist.ID,
                userId: playlist.userID,
                isPublic: playlist.isPublic,
                name: playlist.name,
                description: playlist.description,
                jsonPlaylist: playlist.jsonPlaylist
            }
        };

        vm.playlist = currentPlaylist.get();
        vm.tempPlaylist = copyPlaylist(vm.playlist);

        if(vm.playlist == {}){
            alert("no playlist to edit");
            $location.path('home');
        }
        if(authentication.currentUser()._id != vm.playlist.userId){
            alert("This is not the playlist you are looking for :)");
            $location.path('home');
        }

        vm.editMode = false;
        vm.saveEdit = function(){
            console.log("Saving modifications to title/description");
            meanData.editPlaylist(vm.tempPlaylist)
                .error(function (err) {
                    alert("error while updating playlist", err);
                })
                .then(function (data) {
                    vm.playlist = data.data;
                    currentPlaylist.set(vm.playlist);
                    vm.tempPlaylist = vm.playlist;
                    vm.editMode = false;
                })
        };

        vm.cancelEdit = function(){
            vm.editMode = false;
            vm.tempPlaylist = vm.playlist;
        };

        vm.saveList = function(){
            console.log("saving modifications to list");
        };


    }

})();