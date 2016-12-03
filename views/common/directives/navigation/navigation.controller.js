(function () {

    angular
        .module('meanApp')
        .controller('navigationCtrl', navigationCtrl);

    navigationCtrl.$inject = ['authentication'];
    function navigationCtrl(authentication) {
        var vm = this;

        vm.isLoggedIn = authentication.isLoggedIn();

        vm.currentUser = authentication.currentUser();
    }

})();