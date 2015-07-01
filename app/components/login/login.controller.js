phinisiApp.config(function($sceDelegateProvider, $httpProvider) {
	$sceDelegateProvider.resourceUrlWhitelist([
    // Allow same origin resource loads.
    'self',
    // Allow loading from our assets domain.  Notice the difference between * and **.
    'https://api.sandbox.veritrans.co.id/v2/**'
	])
});

normalApp.controller('loginController', ['$rootScope',
	'$scope',
	'$http',
	'$location',
	'$log',
	'$state',
	'$window',
	'$stateParams',
	'md5',
	function($rootScope, $scope, $http, $location, $log, $state, $window, $stateParams, md5){
		$scope.loginModel = {};
		$scope.$log = $log;
		$scope.expired = $stateParams.expired;

		$scope.checkSession = function(){
			if($window.sessionStorage.token){
				// $state.transitionTo('merchant.home', {arg : 'arg'});
			}
		}

		$scope.login = function(){
			if ($scope.loginForm.$valid){
				//get username and password from model
				console.log($scope.loginModel.username);
				console.log($scope.loginModel.password);

				$http.post(
					//url
					phinisiEndpoint + '/merchant/account/login', 
					//data
					{
						email : $scope.loginModel.username, 
						password: md5.createHash($scope.loginModel.password || '')
					},
					//config
					{
						headers :{ 'Content-Type': 'application/json','Accept': 'application/json'}	,				
					})
				.success(function(data,status,headers,config){
					if(data.success){
						$window.sessionStorage.token = data.token;
						$state.transitionTo('merchant.home', {arg : 'arg'});										
					}else{
						console.log(data);
						$scope.error = data.description;
						$scope.loginModel = {};					
					}
					console.log(data);			
				})
				.error(function(data,status,headers,config){
					$log.debug(data);
					$scope.error = 'Internal server error';
					$scope.loginModel = {};				
				});	
			}
			$scope.checkSession();
		};

		
	}]);



