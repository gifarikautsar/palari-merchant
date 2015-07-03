phinisiApp.controller('tokenController', ['$rootScope', '$scope', '$http', '$location', '$log', '$window',
	function($rootScope, $scope, $http, $location, $log, $window){
		$scope.tokenModel = {};
		$scope.tokenModel.sandbox = {};
		$scope.tokenModel.production = {};		
		$scope.fail = {
			status: false,
			description: '',
		};
		$scope.success = false;

		$scope.hideFail = function(){
			$scope.fail.status = false;
			$scope.fail.description = '';
		};

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
					$scope.success = true;
				}else{
					$scope.error = data.description;
					if(data.description=="Token is not valid"){
						$state.transitionTo('login', {expired : true});
					}
					else{
						$scope.fail.status = true;
						$scope.fail.description = 'Access Keys is not valid';
					}
				}
			})
			.error(function(data,status,headers,config){
				$log.debug(data);
				$scope.error = data.error;
				$state.transitionTo('500', { arg: 'arg'});			
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
				$state.transitionTo('500', { arg: 'arg'});	
			});
			

		};
}]);

phinisiApp.controller('changePasswordController', ['$rootScope', '$scope', '$http', '$log', '$state', 'md5',
	function($rootScope, $scope, $http, $log, $state, md5){
		$scope.currentPassword = '';
		$scope.newPassword = '';
		$scope.confirmNewPassword = '';
		$scope.fail = {
			status: false,
			description: '',
		};
		$scope.success = false;
		$scope.hideFail = function(){
			$scope.fail.status = false;
			$scope.fail.description = '';
		};

		$scope.afterSuccess = function(){
			$scope.success = false;
			$state.transitionTo('merchant.settings', {arg : 'arg'});
		};

		$scope.changePassword = function(){
			if($scope.changePasswordForm.$valid && $scope.newPassword == $scope.confirmNewPassword){
				$http.post(
					//url
					phinisiEndpoint + '/merchant/changepassword',
					//data
					{
						old_password: md5.createHash($scope.currentPassword || ''),
						new_password: md5.createHash($scope.newPassword || '')
					},
					//config
					{
						headers :{ 'Content-Type': 'application/json','Accept': 'application/json'}	,				
					})
				.success(function(data,status,headers,config){
					$log.debug(data);
					if(data.hasOwnProperty('result')){
						$log.debug("Change password success");
						$scope.success = true;
					}
					else{
						$scope.error = data.description;
						if(data.description=="Token is not valid"){
							$state.transitionTo('login', {expired : true});
						}
						else{
							$scope.fail.status = true;
							if(data.description == null){
								$scope.fail.description = 'Change password fail';
							}
							else{
								$scope.fail.description = data.description;
							}
						}
					}
				})
				.error(function(data,status,headers,config){
					$log.debug(data);
					$scope.error = data.error;
					$state.transitionTo('500', { arg: 'arg'});				
				});
			}
		};
}]);