(function () {

    angular
        .module('meanApp')
        .controller('navigationCtrl', navigationCtrl);

    navigationCtrl.$inject = ['$location', 'authentication'];
    function navigationCtrl($location, authentication) {
        var vm = this;

        vm.isLoggedIn = authentication.isLoggedIn();

        vm.currentUser = authentication.currentUser();

        vm.logout = function () {
            alert('maitre gims'); //TODO delete
            /*authentication.logout();
            $location.path('/');*/
        }

    }

})();