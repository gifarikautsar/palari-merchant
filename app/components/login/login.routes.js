routesApp.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
	$stateProvider
		.state('login', {
			url: '/merchant/login',
			templateUrl: 'app/components/login/login.html',
			controller: 'loginController',
			params: {
				expired: false
			}
		})
		.state('loginError', {
			url: '/merchant/login?error',
			templateUrl: 'app/components/login/login.html',
			controller: 'loginController'
		})
		.state('forgotPassword', {
			url: '/merchant/forgot-password',
			templateUrl: 'app/components/login/forgot-password.html'
		});
});