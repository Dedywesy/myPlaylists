(function () {

  angular
    .module('meanApp')
    .controller('registerCtrl', registerCtrl);

  registerCtrl.$inject = ['$rootScope', '$location', 'authentication'];
  function registerCtrl($rootScope, $location, authentication) {
    var vm = this;
    vm.errorMessage = "";

    vm.credentials = {
      name : "",
      email : "",
      password : ""
    };

    vm.onSubmit = function () {
      authentication.register(vm.credentials, function (response) {
          if(response.status === 200){
              $rootScope.$broadcast('userLoggedIn');
              $location.path('profile');
          } else{
              vm.errorMessage = response.data.message;
          }
      })
    };
  }

})();