(function () {

    angular
        .module('meanApp')
        .constant('YT_event',{
            STOP:            0,
            PLAY:            1,
            PAUSE:           2,
            STATUS_CHANGE:   3,
            LOADED :         4
        } );

})();

(function () {

    angular
        .module('meanApp')
        .constant('SC_event',{
            STOP:            5,
            PLAY:            6,
            PAUSE:           7,
            STATUS_CHANGE:   8,
            LOADED:          9
        } );

})();