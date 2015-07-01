// var registerApp = angular.module('registerApp', ['ngAnimate']);

phinisiApp.controller('registerController', ['$rootScope', '$scope', '$http', '$location', '$log', '$state', 'md5',
	function($rootScope, $scope, $http, $location, $log, $state, md5){
		$scope.regModel = {};
		$scope.$log = $log;
		$scope.register = function(){
			if ($scope.registerForm.$valid){
				//get username and password from model
				console.log($scope.regModel.username);
				console.log($scope.regModel.password);			

				$http.post(
					//url
					phinisiEndpoint + '/merchant/register', 
					//data
					{email : $scope.regModel.username, password: md5.createHash($scope.regModel.password || '')},
					//config
					{
						headers :{ 'Content-Type': 'application/json','Accept': 'application/json'}	,				
					})
				.success(function(data,status,headers,config){
					console.log(data);			
					if(data.success){
						console.log('success register');
						$state.transitionTo('registerSuccess', {arg : 'arg'});					
					}else{
						console.log('failed register');
						$scope.error = data.description;
						$scope.regModel = {};
					}
				})
				.error(function(data,status,headers,config){
					console.log(data);
					$scope.error = 'Internal server error';
					$scope.regModel = {};		
				});				
			}

		};

		$scope.isModelValid = function(){
			return $scope.regModel.username.length > 0 && $scope.regModel.password.length > 0;
		}
}]);