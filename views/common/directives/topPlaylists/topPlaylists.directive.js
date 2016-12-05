(function () {

    angular
        .module('meanApp')
        .directive('topplaylists', topPlaylists);

    function topPlaylists () {
        return {
            restrict: 'EA',
            scope: {
                limitrows: '='
            },
            templateUrl: '/common/directives/topPlaylists/topPlaylists.template.html',
            controller: 'topPlaylistsTemplateCtrl as topPlaylistsVm'
        };
    }

})();