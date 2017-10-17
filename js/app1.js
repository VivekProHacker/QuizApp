'use strict';
var app = angular.module('quizApp', ['ui.router', 'ngResource', 'ui.bootstrap'])
        
    // Routing has been added to keep flexibility in mind. This will be used in future.
      .config(['$urlRouterProvider', '$stateProvider', function ($urlRouterProvider, $stateProvider) {
          $urlRouterProvider.otherwise('/');
          $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'templates/quiz1.html',
                controller: 'quizCtrl'
            })
            .state('review', {
                url: '/review',
                templateUrl: 'templates/review',
                controller: 'reviewCtrl'
            })
            .state('result', {
                url: '/result',
                templateUrl: 'templates/result',
                controller: 'quizCtrl'
            })
            .state('contact', {
                url: '/contact',
                templateUrl: 'contact.html',
                controller: 'quizCtrl'
            })
            .state('create', {
                url: '/create',
                templateUrl: 'templates/create',
                controller: 'createCtrl'
            })
			
			
      }])



