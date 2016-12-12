(function () {
    angular
        .module('meanApp')
        .controller('researchResultCtrl', researchResultCtrl);

    researchResultCtrl.$inject = ['meanData', '$routeParams'];
    function researchResultCtrl( meanData, $routeParams) {
        vm = this;
        vm.research = $routeParams.search;
        vm.retrievedPlaylists = [];
        vm.retrievedUsers = [];

        vm.search = function () {
            meanData.searchUser(vm.research)
                .error(function (error) {
                    console.error(error);
                })
                .then(function(result){
                    vm.retrievedUsers = result.data;
                });

            meanData.searchPlaylist(vm.research)
                .error(function (error) {
                    console.error(error);
                })
                .then(function (result) {
                    vm.retrievedPlaylists = result.data;
                })
        };
        vm.search();

    }
})();
