'use strict';

/**
 * @ngdoc function
 * @name toyRobotApp.controller: homeController
 */
angular.module('controllers', [])
  .controller('homeController', ['$scope', 'dataService', function ($scope, dataService) {
  	//Define the grid bounds
  	$scope.bounds = {
  		max_x: 4,
  		min_x: 0,
  		max_y: 4,
  		min_y: 0
  	};

  	//Init robot position
  	$scope.robot = {
  		position: {},
  		isSet: false
  	};
  	$scope.nameExisted = false;
  	$scope.isCreated = false;                              //Indicate if the robot has been created
  	$scope.logs = [];                                      //Store all the logs data
  	$scope.newPosition = {};                               //Store the new position
  	$scope.angles = ['NORTH', 'EAST', 'SOUTH', 'WEST'];    //Angles array for dropdown
    $scope.showError = false;                                  //Toggle error message
    
  	/* Create Robot function */
  	//Will check its valid name first
  	$scope.create = function(){
  		$scope.nameExisted = false;
  		if($scope.robot.name === ''){
  			alert('Please enter the name');
  		}else{
  			dataService.createRobot($scope.robot.name).then(function(res){
  				$scope.isCreated = true;
		  		$scope.logs.unshift({
		  			time: moment().format('MM/DD/YYYY h:mm:ss a'),
		  			events: 'Robot ' + $scope.robot.name + ' has been created.',
		  			_class: 'normal'
		  		});
  			}, function(error){
  				if(error.status === 303){
  					$scope.nameExisted = true;
  				}
  			});
	  	}
  	};

  	/* Place robot function */
  	//Will check if the new position to be placed is valid
  	$scope.place = function(){
  		var now = new Date();

  		//Check if the position is valid
  		if($scope.newPosition.x_pos !== undefined && $scope.newPosition.y_pos !== undefined && $scope.newPosition.angle !== undefined){
        if($scope.checkPosition($scope.newPosition, $scope.bounds)){
          $scope.logs.unshift({
            time: moment().format('MM/DD/YYYY h:mm:ss a'),
            events: 'Robot has been placed at (' + $scope.newPosition.x_pos + ',' + $scope.newPosition.y_pos + '), ' + $scope.newPosition.angle + '.',
            _class: 'normal'
          });


          //I can't seem to do POST JSON data via AngularJS
          //The server side needs to set 'Origin, X-Requested-With, Content-Type, Accept' for $http to POST JSON
          //So I use the traditional Ajax call to solve the problem with a simple proxy server and use curl service
          $.ajax({
            type: "POST",
            url: './script/services/proxy.php',
            dataType: "json", 
            data: {
              csurl: 'http://toyrobotservice-env.elasticbeanstalk.com/webapi/robot/' + $scope.robot.name + '/position',
              x_pos: $scope.newPosition.x_pos,
              y_pos: $scope.newPosition.y_pos,
              angle: $scope.newPosition.angle
            },

            success: function(res) {
              $scope.showError = false;
              $scope.robot.position.x_pos = res.x_pos;
              $scope.robot.position.y_pos = res.y_pos;
              $scope.robot.position.angle = res.angle; 
              $scope.robot.isSet = true;
            },

            error: function(error){
              $scope.showError = true;
              $scope.error = error;
            }
          });
        }else{
          $scope.showError = true;
          $scope.error = 'Please place the robot in a valid position. It falls down from the table.';
          $scope.logs.unshift({
            time: moment().format('MM/DD/YYYY h:mm:ss a'),
            events: 'Robot has been placed at (' + $scope.newPosition.x_pos + ',' + $scope.newPosition.y_pos + '), ' + $scope.newPosition.angle + '. It falls down from the table. Please replace it.',
            _class: 'error'
          });
          $scope.robot.isSet = false;
          $scope.newPosition = {};
        }
		  }else{
        $scope.showError = true;
		  	$scope.error = 'Please enter x,y values of the position and set its direction.';
		  }
  	};

  	//Check if the position is within the bounds
  	$scope.checkPosition = function(my_position, bounds){
  		if(my_position.x_pos <= bounds.max_x && my_position.y_pos <= bounds.max_y && my_position.x_pos >=bounds.min_x && my_position.y_pos >= bounds.min_y){
  			return true;
  		}else{
  			return false;
  		}
  	};

  	/* Rotate robot function */
  	//Will check if the robot has been placed at a valid position first
  	//Robot will face the new direction accroding to this action but stay at the same position
  	$scope.rotate = function(direction){
  		if(!$scope.robot.isSet){
        $scope.showError = true;
  			$scope.error = 'Please place your robot first';
  		}else{
  			dataService.rotateRobot(direction).then(function(res){
  				$scope.robot.position = res.data;
          $scope.showError = false;

  				$scope.logs.unshift({
		  			time: moment().format('MM/DD/YYYY h:mm:ss a'),
		  			events: 'Robot has rotated and turned ' + direction + '. Now it is at (' + $scope.robot.position.x_pos + ',' + $scope.robot.position.y_pos + '), ' + $scope.robot.position.angle + '.',
		  			_class: 'normal'
		  		});
  			}, function(error){
          $scope.showError = true;
          $scope.error = error.data;
        });
  		}
  	};

  	/* Move robot function */
  	//Will check if the robot has been placed at a valid position first
  	//Robot will move one step towards the current direction
  	$scope.move = function(){
  		if(!$scope.robot.isSet){
        $scope.showError = true;
  			$scope.error = 'Please place your robot first';
  		}else{
		  	dataService.moveRobot().then(function(res){
		  		$scope.robot.position = res.data;
          $scope.showError = false;

		  		$scope.logs.unshift({
		  			time: moment().format('MM/DD/YYYY h:mm:ss a'),
		  			events: 'Robot moved forward. Now it is at (' + $scope.robot.position.x_pos + ',' + $scope.robot.position.y_pos + '), ' + $scope.robot.position.angle + '.',
		  			_class: 'normal'
		  		});
		  	}, function(error){
          $scope.showError = true;
          $scope.error = error.data;
        });
	  	}
  	};
  }]);
