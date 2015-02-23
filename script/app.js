'use strict';

/*
 * Main module of the application.
 */
angular
  .module('toyRobotApp', [
    'ngAnimate',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'controllers',
    'services'
  ])
  .config(function ($routeProvider, $httpProvider) {
    $httpProvider.defaults.useXDomain = true;

    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html',
        controller: 'homeController'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

