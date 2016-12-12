(function () {

    angular
        .module('meanApp')
        .controller('navigationCtrl', navigationCtrl);

    navigationCtrl.$inject = ['authentication', '$location'];
    function navigationCtrl(authentication, $location) {
        var vm = this;
        vm.research = "";
        vm.isLoggedIn = authentication.isLoggedIn();

        vm.currentUser = authentication.currentUser();

        vm.search = function () {
            if(vm.research !=""){
                $location.path("/search/" + vm.research)
            }
        }
    }

})();