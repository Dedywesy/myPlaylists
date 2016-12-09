(function () {

    angular
        .module('meanApp')
        .controller('profileCtrl', profileCtrl);

    profileCtrl.$inject = ['meanData', 'authentication', '$routeParams'];
    function profileCtrl(meanData, authentication, $routeParams) {
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
            .error(function (e) {
                console.log(e);
            });

        vm.likedPlaylists = [];
        vm.publicPlaylists = [];


        if(vm.personalProfile){
            meanData.getLikedPlaylists()
                .error(function (error) {
                    console.error(error);
                })
                .then(function (data){
                    vm.likedPlaylists = data.data;
                })
        } else{
            meanData.getUserPlaylists(id)
                .error(function (error){
                    console.error(error)
                })
                .then(function (data){
                    vm.publicPlaylists = data.data;
                })
        }
    }

})();
