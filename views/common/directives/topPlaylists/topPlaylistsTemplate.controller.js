(function () {

    angular
        .module('meanApp')
        .controller('topPlaylistsTemplateCtrl', topPlaylistsTemplateCtrl);

    topPlaylistsTemplateCtrl.$inject = ['meanData', '$scope'];
    function topPlaylistsTemplateCtrl(meanData, $scope) {
        vm = this;
        vm.TopPlaylists = {};
        vm.Separator = [];
        vm.limitrows = $scope.limitrows;
        meanData.getTopPlaylists()
            .error(function (error) {
                alert(error);
            })
            .then(function (data) {
                vm.TopPlaylists = data.data;
                while (vm.TopPlaylists.length) {
                    vm.Separator.push(vm.TopPlaylists.splice(0, 2));
                }
            })
    }
})();