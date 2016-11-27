(function () {

    angular
        .module('meanApp')
        .controller('profileCtrl', profileCtrl);

    profileCtrl.$inject = ['meanData'];
    function profileCtrl(meanData) {
        var vm = this;
        vm.user = {};
        meanData.getProfile()
            .success(function (data) {
                vm.user = data;
            })
            .error(function (e) {
                console.log(e);
            });
    }

})();
