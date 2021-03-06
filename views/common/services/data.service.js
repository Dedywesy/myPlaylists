(function () {

    angular
        .module('meanApp')
        .service('meanData', meanData);

    meanData.$inject = ['$http', 'authentication'];
    function meanData($http, authentication) {
        /*Profile */
        var getProfile = function (userID) {
            return $http.get('/api/profile/' + userID, {
                headers: {
                    Authorization: 'Bearer ' + authentication.getToken()
                }
            });
        };

        var searchUser = function(research) {
            return $http.get('/api/profile/?q=' + research, {
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

        var searchPlaylist = function (research) {
            return $http.get('/api/playlist/?q=' + research, {
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

        var getPlaylistLikes = function (playlistID) {
            return $http.get('/api/likes/' + playlistID, {
                headers: {
                    Authorization: 'Bearer ' + authentication.getToken()
                }
            })
        };

        var getTopPlaylist = function () {
            return $http.get('/api/topPlaylists');
        };

        /*Likes*/
        var likePlaylist = function (playlistID) {
            return $http.post('/api/likes',
                {
                    playlistID: playlistID
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + authentication.getToken()
                    }
                });
        };

        var unlikePlaylist = function (playlistID) {
            return $http.delete('/api/likes/' + playlistID, {
                headers: {
                    Authorization: 'Bearer ' + authentication.getToken()
                }
            });
        };

        /*Comments*/
        var commentPlaylist = function (playlistID, comment) {
            return $http.post('/api/comments/',
                {
                    playlistID: playlistID,
                    comment: comment
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + authentication.getToken()
                    }
                });
        };

        var getComments = function (playlistID) {
            return $http.get('/api/comments/' + playlistID, {
                headers: {
                    Authorization: 'Bearer ' + authentication.getToken()
                }
            });
        };

        var getYoutubeResults = function (research) {
            return $http.get('/api/youtubeResults/' + research, {
                headers: {
                    Authorization: 'Bearer ' + authentication.getToken()
                }
            });
        };

        var getSoundcloudResults = function (research) {
            return $http.get('/api/soundcloudResults/' + research, {
                headers: {
                    Authorization: 'Bearer ' + authentication.getToken()
                }
            });
        };

        var getSoundcloudTrack = function (trackID) {
            return $http.get('/api/soundcloudSong/' + trackID, {
                headers: {
                    Authorization: 'Bearer ' + authentication.getToken()
                }
            });
        };


        return {
            getProfile: getProfile,
            searchUser: searchUser,
            getMyPlaylists: getMyPlaylists,
            getUserPlaylists: getUserPlaylists,
            createPlaylist: createPlaylist,
            editPlaylist: editPlaylist,
            deletePlaylist: deletePlaylist,
            getPlaylist: getPlaylist,
            searchPlaylist: searchPlaylist,
            getLikedPlaylists: getLikedPlaylists,
            getPlaylistLikes: getPlaylistLikes,
            getTopPlaylists: getTopPlaylist,
            likePlaylist: likePlaylist,
            unlikePlaylist: unlikePlaylist,
            commentPlaylist: commentPlaylist,
            getComments: getComments,
            getYoutubeResults: getYoutubeResults,
            getSoundcloudResults: getSoundcloudResults,
            getSoundcloudTrack: getSoundcloudTrack
        };
    }

})();