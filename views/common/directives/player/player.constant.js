(function () {

    angular
        .module('meanApp')
        .constant('YT_event',{
            STOP:            0,
            PLAY:            1,
            PAUSE:           2,
            STATUS_CHANGE:   3
        } );

})();

(function () {

    angular
        .module('meanApp')
        .constant('SC_event',{
            STOP:            4,
            PLAY:            5,
            PAUSE:           6,
            STATUS_CHANGE:   7
        } );

})();