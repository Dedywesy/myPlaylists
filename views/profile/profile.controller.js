(function () {

    angular
        .module('meanApp')
        .controller('profileCtrl', profileCtrl);

    profileCtrl.$inject = ['meanData', 'authentication', '$routeParams', '$location'];
    function profileCtrl(meanData, authentication, $routeParams, $location) {
        var vm = this;
        var id;
        var currentUserID = authentication.currentUser()._id;
        var userID = parseInt($routeParams.id);
        if(!$routeParams.id){
            id = currentUserID
        }else{
            id = userID;
        }
        vm.personalProfile = (currentUserID == id);
        vm.user = {};
        meanData.getProfile(id)
            .success(function (data) {
                vm.user = data;
            })
            .error(function (error) {
                alert(error.message);
                $location.path('/')
            });

        vm.likedPlaylists = [];
        vm.publicPlaylists = [];

        if(vm.personalProfile){
            meanData.getLikedPlaylists()
                .error(function (error) {
                    console.error(error.message);
                })
                .then(function (data){
                    vm.likedPlaylists = data.data;
                })
        } else{
            meanData.getUserPlaylists(id)
                .error(function (error){
                    console.error(error.message)
                })
                .then(function (data){
                    vm.publicPlaylists = data.data;
                })
        }
    }

})();
