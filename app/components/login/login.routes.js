routesApp.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
	$stateProvider
		.state('login', {
			url: '/login',
			templateUrl: 'app/components/login/login.html',
			controller: 'loginController',
			params: {
				expired: false
			}
		})
		.state('loginError', {
			url: '/login?error',
			templateUrl: 'app/components/login/login.html',
			controller: 'loginController'
		})
		.state('forgotPassword', {
			url: '/forgot-password',
			templateUrl: 'app/components/login/forgot-password.html'
		});
});