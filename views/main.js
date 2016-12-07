(function () {

    angular.module('meanApp', ['ngRoute', 'as.sortable']);

    function config($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'home/home.view.html',
                controller: 'homeCtrl',
                controllerAs: 'vm'
            })
            .when('/register', {
                templateUrl: '/auth/register/register.view.html',
                controller: 'registerCtrl',
                controllerAs: 'vm'
            })
            .when('/login', {
                templateUrl: '/auth/login/login.view.html',
                controller: 'loginCtrl',
                controllerAs: 'vm'
            })
            .when('/profile/:id?', {
                templateUrl: '/profile/profile.view.html',
                controller: 'profileCtrl',
                controllerAs: 'vm'
            })
            .when('/contact', {
                templateUrl: '/contact/contact.view.html',
                controller: 'contactCtrl',
                controllerAs: 'vm'
            })
            .when('/topPlaylists', {
                templateUrl: '/topPlaylists/topPlaylists.view.html',
                controller: 'topPlaylistsCtrl',
                controllerAs: 'vm'
            })
            .when('/myPlaylists', {
                templateUrl: '/myPlaylists/myPlaylists.view.html',
                controller: 'myPlaylistsCtrl',
                controllerAs: 'vm'
            })
            .when('/logout', {
                templateUrl: '/home/home.view.html',
                controller: 'logoutCtrl',
                controllerAs: 'vm'
            })
            .when('/editPlaylist/:id', {
                templateUrl: '/editPlaylist/editPlaylist.view.html',
                controller: 'editPlaylistCtrl',
                controllerAs: 'vm'
            })
            .when('/playlist/:id', {
                templateUrl: '/playlist/playlist.view.html',
                controller: 'playlistCtrl',
                controllerAs: 'vm'
            })
            .otherwise({redirectTo: '/'});

        // use the HTML5 History API
        $locationProvider.html5Mode(true);
    }

    function run($rootScope, $location, authentication) {
        $rootScope.$on('$routeChangeStart', function (event, nextRoute, currentRoute) {
            if ($location.path() === '/profile' && !authentication.isLoggedIn()) {
                $location.path('/login');
            }
            if ($location.path() === '/myPlaylists' && !authentication.isLoggedIn()) {
                $location.path('/login');
            }
            if ($location.path() === '/editPlaylist' && !authentication.isLoggedIn()) {
                $location.path('/login');
            }
        });
    }

    angular
        .module('meanApp')
        .config(['$routeProvider', '$locationProvider', config])
        .run(['$rootScope', '$location', 'authentication', run]);

})();