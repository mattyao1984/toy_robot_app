'use strict';

angular.module('services', [])
.constant('BASE_URL', 'http://toyrobotservice-env.elasticbeanstalk.com/webapi')
.constant('PROXY_URL', 'proxy.php')
.factory('dataService', ['$http','$q', 'BASE_URL', 'PROXY_URL', function($http, $q, BASE_URL, PROXY_URL) {
	var robotName = '';

	return{
		createRobot: function(name){
			robotName = name;

			var req = {
        method: 'POST',     
        url: BASE_URL + '/robot/' + name
      };

      var promise = $http(req).success(function(data, status, headers, config) {
          return data;
      });

      return promise;
		},

		getPosition: function(){
			var req = {
        method: 'GET',
        url: BASE_URL + '/robot/' + robotName + '/position'
      };

      var promise = $http(req).success(function(data, status, headers, config) {
          return data;
      });

      return promise;
		},

		//I can't seem to do POST JSON data via AngularJS
		//The server side needs to set 'Origin, X-Requested-With, Content-Type, Accept' for $http to POST JSON
		//However, from the response header settings, I can't find this being allowed
		placeRobot: function(position_data){
			var req = {
        method: 'POST',  
        url: './script/services/proxy.php',
        data: {
          csurl: BASE_URL + '/robot/' + robotName + '/position',
        	x_pos: parseInt(position_data.x_pos),
        	y_pos: parseInt(position_data.y_pos),
        	angle: position_data.angle
        }
      };

      var promise = $http(req).success(function(data, status, headers, config) {
          return data;
      });

      return promise;
		},

		rotateRobot: function(direction){
			var req = {
        method: 'PUT',
        url: BASE_URL + '/robot/' + robotName + '/position/' + direction
      };

      var promise = $http(req).success(function(data, status, headers, config) {
          return data;
      });

      return promise;
		},

		moveRobot: function(){
			var req = {
        method: 'PUT',
        url: BASE_URL + '/robot/' + robotName + '/position/move'
      };

      var promise = $http(req).success(function(data, status, headers, config) {
          return data;
      });

      return promise;
		}
	}
}]);