sessionApp.controller('tokenController', ['$rootScope', '$scope', '$http', '$location', '$log', '$window',
	function($rootScope, $scope, $http, $location, $log, $window){
		$scope.tokenModel = {};
		$scope.tokenModel.sandbox = {};
		$scope.tokenModel.production = {};		

		$scope.saveToken = function(){
			$log.debug($scope.tokenModel.sandbox.server_key);
			$log.debug($scope.tokenModel.sandbox.client_key);
			$log.debug($scope.tokenModel.production.server_key);
			$log.debug($scope.tokenModel.production.client_key);

			$http.post(
				//url
				phinisiEndpoint + '/merchant/key/create',
				//data
				{sandbox : $scope.tokenModel.sandbox, production : $scope.tokenModel.production},
				//config
				{
					headers :{ 'Content-Type': 'application/json','Accept': 'application/json'}	,				
				})
			.success(function(data,status,headers,config){
				$log.debug(data);
				if(data.success){
					$log.debug("success save token");
				}else{
					$scope.error = data.description;
				}
			})
			.error(function(data,status,headers,config){
				$log.debug(data);
				$scope.error = data.error;				
			});
		};

		$scope.getToken = function(){

			$http.get(
				//url
				phinisiEndpoint + '/merchant/key/' + $window.sessionStorage.token,				
				//config
				{
					headers :{ 'Content-Type': 'application/json','Accept': 'application/json'}	,				
				}

			)
			.success(function(data){
				$log.debug('get token data: ' + data);
				$scope.tokenModel.sandbox.server_key = data.sandbox.server_key;
				$scope.tokenModel.sandbox.client_key = data.sandbox.client_key;
				$scope.tokenModel.production.server_key = data.production.server_key;
				$scope.tokenModel.production.client_key = data.production.client_key;				
			})
			.error(function(data){
				$scope.error = data.description;				
			});
			

		};

		$scope.getToken();
}]);

sessionApp.controller('changePasswordController', function($scope){
	$scope.currentPassword = '';
	$scope.newPassword = '';
	$scope.confirmNewPassword = '';
})