phinisiApp.factory('authInterceptor', ['$rootScope', '$q' , '$window', function($rootScope,$q,$window){
	return {
		request: function(config){
			config.headers = config.headers || {};
			if($window.sessionStorage.token) {
				// config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
			}
			return config;
		},
		response: function(response){
			if (response.status === 401) {
        		// handle the case where the user is not authenticated
      		}	
      		return response || $q.when(response);
		}
	};
}]);

phinisiApp.config(function($httpProvider, $windowProvider) {	
	$httpProvider.interceptors.push('authInterceptor');
	var myWindow = $windowProvider.$get();
	if(myWindow.sessionStorage.token){
		$httpProvider.defaults.transformRequest = function(data){
			if(data){
				data.token = myWindow.sessionStorage.token;
				console.log(data);	
			}
		}
	}	
});