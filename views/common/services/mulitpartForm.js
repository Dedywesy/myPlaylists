(function () {

    angular
        .module('meanApp')
        .service('multipartForm', multipartForm);

    multipartForm.$inject = ['$http'];
    function multipartForm($http) {
        this.post = function(uploadUrl, data, callback){
            var fd = new FormData();
            for(var key in data){
                fd.append(key, data[key]);
            }

            $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).then(
                function(response){
                   callback(response);
                },
                function(response){
                    callback(response);
                }
            );
        }

    }

})();