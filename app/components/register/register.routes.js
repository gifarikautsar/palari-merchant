routesApp.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
	$stateProvider
		.state('register', {
			url: '/merchant/register',
			templateUrl: 'app/components/register/register.html',
			controller: 'registerController'			
		})
		.state('registerSuccess', {
			templateUrl: 'app/components/register/register-success.html'		
		});
});

