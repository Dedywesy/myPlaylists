(function () {

    angular
        .module('meanApp')
        .controller('navigationCtrl', navigationCtrl);

    navigationCtrl.$inject = ['authentication', '$location', '$rootScope'];
    function navigationCtrl(authentication, $location, $rootScope) {
        var vm = this;
        vm.research = "";
        vm.isLoggedIn = authentication.isLoggedIn();

        vm.currentUser = authentication.currentUser();

        vm.search = function () {
            if(vm.research !=""){
                $location.path("/search/" + vm.research)
            }
        };

        $rootScope.$on('userLoggedIn', function () {
            vm.isLoggedIn = authentication.isLoggedIn();
            vm.currentUser = authentication.currentUser();
        });
    }

})();