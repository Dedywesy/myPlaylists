(function () {

    angular
        .module('meanApp')
        .directive('topplaylists', topPlaylists);

    function topPlaylists () {
        return {
            restrict: 'EA',
            templateUrl: '/common/directives/topPlaylists/topPlaylists.template.html',
            controller: 'topplaylistsCtrl as topplaylistsvm'
        };
    }

})();