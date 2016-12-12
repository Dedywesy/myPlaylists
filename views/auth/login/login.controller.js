(function () {

  angular
  .module('meanApp')
  .controller('loginCtrl', loginCtrl);

  loginCtrl.$inject = ['$location', 'authentication', '$rootScope'];
  function loginCtrl($location, authentication, $rootScope) {
    var vm = this;

    vm.credentials = {
      email : "",
      password : ""
    };

    vm.onSubmit = function () {
      authentication
        .login(vm.credentials)
        .error(function(err){
          alert(err);
        })
        .then(function(){
          $rootScope.$broadcast('userLoggedIn');
          $location.path('profile');
        });
    };
  }

})();