(function () {

    angular
        .module('meanApp')
        .service('meanData', meanData);

    meanData.$inject = ['$http', 'authentication'];
    function meanData($http, authentication) {

        /*Profile */
        var getProfile = function () {
            return $http.get('/api/profile', {
                headers: {
                    Authorization: 'Bearer ' + authentication.getToken()
                }
            });
        };

        /*Playlists*/
        var getMyPlaylists = function () {
            var currentUserId = authentication.currentUser()._id;
            return getUserPlaylists(currentUserId);
        };

        var getUserPlaylists = function (userID) {
            return $http.get('/api/userPlaylists/' + userID, {
                headers: {
                    Authorization: 'Bearer ' + authentication.getToken()
                }
            });
        };

        var createPlaylist = function (newPlaylist) {
            return $http.post('/api/playlist',
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
            return $http.put('/api/playlist',
                {
                    playlist: playlist
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + authentication.getToken()
                    }
                });
        };

        var deletePlaylist = function (playlist) {
            return $http.delete('/api/playlist/' + playlist.ID,
                {
                    headers: {
                        Authorization: 'Bearer ' + authentication.getToken()
                    }
                });
        };

        var getPlaylist = function (playlistId) {
            return $http.get('/api/playlist/' + playlistId, {
                headers: {
                    Authorization: 'Bearer ' + authentication.getToken()
                }
            });
        };

        var getLikedPlaylists = function () {
            return $http.get('/api/likes', {
                headers: {
                    Authorization: 'Bearer ' + authentication.getToken()
                }
            })
        };

        var likePlaylist = function (playlistID) {
            return $http.post('/api/likes', {
                    playlistID: playlistID
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + authentication.getToken()
                    }
                });
        };

        var unlikePlaylist = function(playlistID){
            return $http.delete('/api/likes/' + playlistID, {
                headers: {
                    Authorization: 'Bearer ' + authentication.getToken()
                }
            });
        };

        return {
            getProfile: getProfile,
            getMyPlaylists: getMyPlaylists,
            createPlaylist: createPlaylist,
            editPlaylist: editPlaylist,
            deletePlaylist: deletePlaylist,
            getPlaylist: getPlaylist,
            getLikedPlaylists: getLikedPlaylists,
            likePlaylist: likePlaylist,
            unlikePlaylist: unlikePlaylist
        };
    }

})();