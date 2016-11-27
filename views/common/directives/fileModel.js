(function () {

    angular
        .module('meanApp')
        .directive('fileModel', ['$parse', function ($parse) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    var model = $parse(attrs.fileModel);
                    var modelSetter = model.assign;

                    var onChangeFunc = function(){
                        console.log("ça m'en touche une");
                        scope.$apply(function () {
                            modelSetter(scope, element[0].files[0]);
                        })
                    }

                    element.bind('change', onChangeFunc);
                }
            };
        }])
})();

