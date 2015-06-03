var loginApp = angular.module('loginApp', ['ngAnimate']);

loginApp.config(function($sceDelegateProvider, $httpProvider) {
	$sceDelegateProvider.resourceUrlWhitelist([
    // Allow same origin resource loads.
    'self',
    // Allow loading from our assets domain.  Notice the difference between * and **.
    'https://api.sandbox.veritrans.co.id/v2/**'
	])
});

loginApp.controller('loginController', ['$rootScope',
	'$scope',
	'$http',
	'$location',
	'$log',
	function($rootScope, $scope, $http, $location, $log){
		$scope.loginModel = {};
		$scope.$log = $log;

		$scope.login = function(){
			//get username and password from model
			console.log($scope.loginModel.username);
			console.log($scope.loginModel.password);

			$http.post(
				//url
				phinisiEndpoint + '/merchant/account/login', 
				//data
				{email : $scope.loginModel.username, password: $scope.loginModel.password},
				//config
				{
					headers :{ 'Content-Type': 'application/json','Accept': 'application/json'}	,				
				})
			.success(function(data,status,headers,config){
				if(data.success){
					console.log(data);
					if(data.success){
						console.log('success register ' + data.token);						
					}else{
						$scope.error = data.description;						
					}
				}
				console.log(data);			
			})
			.error(function(data,status,headers,config){
				console.log(data);
				$scope.error = data.error;				
			});
		};
	}]);



