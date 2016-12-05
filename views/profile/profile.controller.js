(function () {

    angular
        .module('meanApp')
        .controller('profileCtrl', profileCtrl);

    profileCtrl.$inject = ['meanData', 'authentication', '$routeParams'];
    function profileCtrl(meanData, authentication, $routeParams) {
        var vm = this;
        var id;
        if(!$routeParams.id){
            id = authentication.currentUser()._id;
        }else{
            id = parseInt($routeParams.id);
        }
        vm.user = {};
        meanData.getProfile(id)
            .success(function (data) {
                vm.user = data;
            })
            .error(function (e) {
                console.log(e);
            });
    }

})();
