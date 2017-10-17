'use strict';

var app = angular.module('quizApp', ['ui.router', 'ngResource', 'ui.bootstrap','LocalStorageModule'])
    // Routing has been added to keep flexibility in mind. This will be used in future.
      .config(['$urlRouterProvider', '$stateProvider', function ($urlRouterProvider, $stateProvider) {
          $urlRouterProvider.otherwise('/');
          $stateProvider
          .state('home', {
                url: '/',
                templateUrl: 'templates/quizdemo.html',
                controller: 'quizCtrl'
                
            })
            .state('quiz', {
                url: '/quiz',
                templateUrl: 'templates/quiz12.html',
                controller: 'quizCtrl'
                
            })
            .state('submit', {
                url: '/submit',
                templateUrl: 'templates/quizSubmitted.html'
                
                
            })
            
            .state('/getquiz1/:id', {
                url: '/',
                templateUrl: 'templates/quiz12.html',
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
         
			
      }]);

   
app.factory('myService', function($http) {

    var getData = function(file) {

        // Angular $http() and then() both return promises themselves 
        return $http({method:"GET", url:file}).then(function(result){

            // What we return here is the data that will be accessible 
            // to us after the promise resolves
            return result.data;
        });
    };
    var getTime = function() {

        // Angular $http() and then() both return promises themselves 
        return $http({method:"GET", url:'www.json-time.appspot.com/time.json?tz=America/Chicago&callback=foo'}).then(function(result){

            // What we return here is the data that will be accessible 
            // to us after the promise resolves
            //alert(result);
            //alert("hello");
            //alert(result.dateString);
            return result.datetime;
        });
    };


    return { getData: getData , getTime:getTime};
});


/*
app.factory('myService', function ($http) {
        return {
            // 1st function
            serverCall: function () {
                return $http.get('50quiz2.json').then(function (response) {
                    alert(response.data);
                    return response.data;
                });
            },
            // 2nd function
            anotherFunctionCall: function () {
                alert("Hi");
            }
        };
    });
*/