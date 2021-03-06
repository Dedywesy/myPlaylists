(function () {

    angular
        .module('meanApp')
        .directive('player', player);

    player.$inject = ['$window', 'YT_event', 'SC_event', '$http', 'meanData']

    function player($window, YT_event, SC_event, $http, meanData) {

        return {
            restrict: "E",

            scope: {
                height: "@",
                width: "@",
                videoid: "@",
                scid: "@"
            },
            controller: "playerCtrl as yt",

            templateUrl: "/common/directives/player/player.html",

            link: function (scope, element, attrs, $rootScope) {
                /***********YOUTUBE*************/
                var tagYT = document.createElement('script');
                tagYT.src = "https://www.youtube.com/iframe_api";
                var firstScriptTag = document.getElementsByTagName('script')[0];
                firstScriptTag.parentNode.insertBefore(tagYT, firstScriptTag);

                scope.player;

                $window.onYouTubeIframeAPIReady = function () {

                    scope.player = new YT.Player(element.children()[0], {
                        playerVars: {
                            autoplay: 1,
                            html5: 1,
                            theme: "light",
                            modesbranding: 0,
                            color: "white",
                            iv_load_policy: 3,
                            showinfo: 0,
                            controls: 0
                        },

                        height: scope.height,
                        width: scope.width,
                        videoId: scope.videoid,
                        volume: 100,

                        events: {
                            'onStateChange': function (event) {

                                var message = {
                                    event: YT_event.STATUS_CHANGE,
                                    data: ""
                                };

                                switch (event.data) {
                                    case YT.PlayerState.PLAYING:
                                        message.data = "PLAYING";
                                        break;
                                    case YT.PlayerState.ENDED:
                                        message.data = "ENDED";
                                        scope.player.clearVideo();
                                        break;
                                    case YT.PlayerState.UNSTARTED:
                                        message.data = "UNSTARTED";
                                        break;
                                    case YT.PlayerState.PAUSED:
                                        message.data = "PAUSED";
                                        break;
                                }

                                scope.$apply(function () {
                                    scope.$emit(message.event, message.data);
                                });
                            }
                        }

                    });
                };


                /**************SoundCloud******************/
                var clientid = 'b23455855ab96a4556cbd0a98397ae8c';

                var loadSoundcloud = function () {
                    if (scope.scid != "") {
                        meanData.getSoundcloudTrack(scope.scid)
                            .error(function (e) {
                                console.error("error while retrieving music from soundcloud")
                            })
                            .success(function (jsonData) {
                                var data = JSON.parse(jsonData);
                                scope.band = data.user.username;
                                scope.bandUrl = data.user.permalink_url;
                                scope.title = data.title;
                                scope.trackUrl = data.permalink_url;
                                if(data.artwork_url){
                                    scope.albumArt = data.artwork_url;
                                }
                                scope.stream = data.stream_url + '?client_id=' + clientid;
                                scope.song = new Audio();

                                scope.song.onended = function () {
                                    scope.band = "";
                                    scope.title = "";
                                    scope.$emit(YT_event.STATUS_CHANGE, "ENDED");
                                };

                                scope.playing = false;
                                scope.play = function () {
                                    if (scope.song.src == '') {
                                        scope.song.src = scope.stream;
                                    }
                                    scope.song.play();
                                };
                                scope.play();
                                scope.$emit(SC_event.LOADED, scope.song);
                            });
                    }

                };
                /***************Watchers*********************/
                scope.$watch('videoid', function (newValue, oldValue) {
                    if (newValue == oldValue) {
                        return;
                    }
                    if (scope.videoid != "") {
                        scope.player.cueVideoById(scope.videoid);
                        scope.player.playVideo();
                    }
                    else {
                        scope.player.seekTo(0);
                        scope.player.stopVideo();
                    }
                });

                scope.$on('UPDATE', function (data, id) {
                    if(scope.song){
                        scope.song.pause();
                        scope.song.currentTime = 0;
                    }
                    if (scope.scid != "") {
                        loadSoundcloud();
                    }
                });

                scope.$on(YT_event.PLAY, function () {
                    scope.player.playVideo();
                });

                scope.$on(YT_event.PAUSE, function () {
                    scope.player.pauseVideo();
                });

                scope.$on(YT_event.STOP, function () {
                    scope.player.stopVideo();
                });

                scope.$on(SC_event.PLAY, function () {
                    scope.song.play();
                    if (scope.player) {
                        scope.player.pauseVideo();
                    }
                });

                scope.$on(SC_event.PAUSE, function () {
                    scope.song.pause();
                });

                scope.$on(SC_event.STOP, function () {
                    scope.song.pause();
                });

            }
        };
    }
})();

