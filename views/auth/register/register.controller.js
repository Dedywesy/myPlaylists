(function () {

  angular
    .module('meanApp')
    .controller('registerCtrl', registerCtrl);

  registerCtrl.$inject = ['$location', 'authentication'];
  function registerCtrl($location, authentication) {
    var vm = this;

    vm.credentials = {
      name : "",
      email : "",
      password : ""
    };

    vm.onSubmit = function () {
      authentication.register(vm.credentials, function (response) {
          if(response.status === 200){
              $location.path('profile');
          } else{
              alert(err);
          }
      })
    };
  }

})();