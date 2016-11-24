(function () {

    angular
        .module('meanApp')
        .directive('foot', foot);

    function foot () {
        return {
            restrict: 'EA',
            templateUrl: '/common/directives/foot/footer.template.html',
            controller: 'footerCtrl as footervm'
        };
    }

})();