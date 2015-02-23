'use strict';

describe('homeController Test', function() {

  beforeEach(module('toyRobotApp'));

  var homeController, scope, $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($rootScope, $controller, _$httpBackend_) {
    scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;
    homeController = $controller('homeController', {
      $scope: scope
    });
  }));

  describe('Initialize values', function() {
    it('should init robot with correct values', function () {
      expect(scope.robot.isSet).toBe(false);
      expect(scope.isCreated).toBe(false);
      expect(scope.logs.length).toBe(0);
      expect(scope.bounds.max_x).toBe(4);
      expect(scope.bounds.max_y).toBe(4);
      expect(scope.bounds.min_x).toBe(0);
      expect(scope.bounds.min_y).toBe(0);
      expect(scope.angles.length).toBe(4);
      expect(scope.nameExisted).toBe(false);
      expect(scope.showError).toBe(false);
    });
  });

  describe('Create robot name', function() {
    it('Should send name to server', function () {
      scope.robot.name = 'Matt';
      $httpBackend.expectPOST('http://toyrobotservice-env.elasticbeanstalk.com/webapi/robot/' + scope.robot.name)
      .respond(200);
      scope.create();
      $httpBackend.flush();
      expect(scope.isCreated).toBe(true);
    });
  });

  describe('Place robot', function() {
    it('should show an error if the position is not set', function () {
      scope.newPosition.x_pos = undefined;
      scope.newPosition.y_pos = undefined;
      scope.newPosition.angle = undefined;
      scope.place();
      expect(scope.robot.isSet).toBe(false);
      expect(scope.showError).toBe(true);
      expect(scope.error).toBe('Please enter x,y values of the position and set its direction.');
    });

    it('should show an error if the position is not valid', function () {
      scope.newPosition.x_pos = 10;
      scope.newPosition.y_pos = 12;
      scope.newPosition.angle = 'EAST';
      scope.place();
      expect(scope.robot.isSet).toBe(false);
      expect(scope.showError).toBe(true);
      expect(scope.error).toBe('Please place the robot in a valid position. It falls down from the table.');
    });
  });

  describe('Rotate robot', function() {
    beforeEach(function() {
      scope.robot.name = 'Matt';
      $httpBackend.expectPOST('http://toyrobotservice-env.elasticbeanstalk.com/webapi/robot/' + scope.robot.name)
      .respond(200);
      scope.create();
      $httpBackend.flush();
    });

    it('Should ignore rotate action without placing the robot first', function () {
      scope.rotate('left');
      expect(scope.robot.position.angle).toBe(undefined);
      expect(scope.showError).toBe(true);
      expect(scope.error).toBe('Please place your robot first');
    });

    it('Should face NORTH if turn left from EAST, and stay at the same position', function () {
      scope.robot.position.x_pos = 2;
      scope.robot.position.y_pos = 3;
      scope.robot.position.angle = 'EAST';
      scope.robot.isSet = true;

      $httpBackend.whenPUT('http://toyrobotservice-env.elasticbeanstalk.com/webapi/robot/Matt/position/left')
      .respond({
        x_pos: 2,
        y_pos: 3,
        angle: 'NORTH'
      });

      scope.rotate('left');
      $httpBackend.flush();
      expect(scope.robot.position.x_pos).toBe(2);
      expect(scope.robot.position.y_pos).toBe(3);
      expect(scope.robot.position.angle).toBe('NORTH');
    });

    it('Should face SOUTH if turn right from EAST, and stay at the same position', function () {
      scope.robot.position.x_pos = 1;
      scope.robot.position.y_pos = 2;
      scope.robot.position.angle = 'SOUTH';
      scope.robot.isSet = true;

      $httpBackend.whenPUT('http://toyrobotservice-env.elasticbeanstalk.com/webapi/robot/Matt/position/right')
      .respond({
        x_pos: 1,
        y_pos: 2,
        angle: 'EAST'
      });

      scope.rotate('right');
      $httpBackend.flush();
      expect(scope.robot.position.x_pos).toBe(1);
      expect(scope.robot.position.y_pos).toBe(2);
      expect(scope.robot.position.angle).toBe('EAST');
    });
  });

  describe('Move robot', function() {
    beforeEach(function() {
      scope.robot.name = 'Matt';
      $httpBackend.expectPOST('http://toyrobotservice-env.elasticbeanstalk.com/webapi/robot/' + scope.robot.name)
      .respond(200);
      scope.create();
      $httpBackend.flush();
    });

    it('Should ignore move action without placing the robot first', function () {
      scope.move();
      expect(scope.robot.position.x_pos).toBe(undefined);
      expect(scope.robot.position.y_pos).toBe(undefined);
      expect(scope.robot.position.angle).toBe(undefined);
      expect(scope.showError).toBe(true);
      expect(scope.error).toBe('Please place your robot first');
    });

    it('Should move to 2,1 and stay facing EAST', function () {
      scope.robot.position.x_pos = 1;
      scope.robot.position.y_pos = 2;
      scope.robot.position.angle = 'SOUTH';
      scope.robot.isSet = true;

      $httpBackend.whenPUT('http://toyrobotservice-env.elasticbeanstalk.com/webapi/robot/Matt/position/move')
      .respond({
        x_pos: 1,
        y_pos: 1,
        angle: 'SOUTH'
      });

      scope.move();
      $httpBackend.flush();
      
      expect(scope.robot.position.x_pos).toBe(1);
      expect(scope.robot.position.y_pos).toBe(1);
      expect(scope.robot.position.angle).toBe('SOUTH');
    });

    it('shoud avoid to fall down from the table, and stay the same direction', function () {
      scope.robot.position.x_pos = 4;
      scope.robot.position.y_pos = 4;
      scope.robot.position.angle = 'NORTH';
      scope.robot.isSet = true;

      $httpBackend.whenPUT('http://toyrobotservice-env.elasticbeanstalk.com/webapi/robot/Matt/position/move')
      .respond({
        x_pos: 4,
        y_pos: 4,
        angle: 'NORTH'
      });

      scope.move();
      $httpBackend.flush();
      
      expect(scope.robot.position.x_pos).toBe(4);
      expect(scope.robot.position.y_pos).toBe(4);
      expect(scope.robot.position.angle).toBe('NORTH');
    });
  });
});
