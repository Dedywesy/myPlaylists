(function () {

    angular
        .module('meanApp')
        .controller('logoutCtrl', logoutCtrl);

    logoutCtrl.$inject = ['$location', 'authentication', '$rootScope'];
    function logoutCtrl($location, authentication, $rootScope) {
        var vm = this;

        authentication.logout();
        $rootScope.$broadcast('userLoggedIn');
        $location.path('/');
    }

})();