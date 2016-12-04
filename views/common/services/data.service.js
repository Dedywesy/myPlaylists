(function () {

    angular
        .module('meanApp')
        .service('meanData', meanData);

    meanData.$inject = ['$http', 'authentication'];
    function meanData($http, authentication) {

        var getProfile = function () {
            return $http.get('/api/profile', {
                headers: {
                    Authorization: 'Bearer ' + authentication.getToken()
                }
            });
        };

        var getMyPlaylists = function () {
            var currentUserId = authentication.currentUser()._id;
            return getPlaylists(currentUserId);
        };

        var getPlaylists = function (userID){
            return $http.get('/api/getPlaylists', {
                headers: {
                    Authorization: 'Bearer ' + authentication.getToken(),
                    touserid: userID
                }
            }) ;
        };

        var createPlaylist = function (newPlaylist) {
            return $http.post('/api/newPlaylist',
                {
                    playlist: newPlaylist
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + authentication.getToken()
                    }
                });
        };

        var editPlaylist = function (playlist) {
            return $http.post('/api/editPlaylist',
                {
                    playlist: playlist
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + authentication.getToken()
                    }
                });
        };



        return {
            getProfile: getProfile,
            getMyPlaylists: getMyPlaylists,
            createPlaylist: createPlaylist,
            editPlaylist: editPlaylist
        };
    }

})();