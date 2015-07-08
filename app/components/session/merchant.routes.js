routesApp.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {  

  $stateProvider

  	.state('merchant', {
  		templateUrl: 'app/components/session/merchant.html',
      controller: 'merchantController'
  	})

    .state('merchant.home', {
    	url: '/merchant/home',
    	templateUrl: 'app/components/session/home/home.html',
      controller: 'detailsController'
    })

    .state('merchant.editDetails', {
      url: '/merchant/edit-details',
      templateUrl: 'app/components/session/home/edit-details.html',
      controller: 'detailsController'
    })

    .state('merchant.product', {
      url: '/merchant/product',
      templateUrl: 'app/components/session/product/product.html',
      controller: 'addProductController'
    })

    .state('merchant.addProduct', {
      url: '/merchant/add-product',
      templateUrl: 'app/components/session/product/add-product.html',
      controller: 'addProductController'
    })

    .state('merchant.productDetails', {
      url: '/merchant/product-details/:productId',
      templateUrl: 'app/components/session/product/product-details.html',
      controller: 'productDetailsController'
    })

    .state('merchant.editProduct', {
      url: '/merchant/edit-product/:productId',
      templateUrl: 'app/components/session/product/edit-product.html',
      controller: 'productDetailsController'
    })

    .state('merchant.settings', {
      url: '/merchant/settings',
      templateUrl: 'app/components/session/settings/settings.html',
      controller: 'tokenController'
    })

    .state('merchant.changePassword', {
      url: '/merchant/change-password',
      templateUrl: 'app/components/session/settings/change-password.html',
      controller: 'changePasswordController'
    })

    .state('merchant.transaction', {
      url: '/merchant/transaction',
      templateUrl: 'app/components/session/transaction/transaction.html',
      controller: 'transactionController'
    })

    .state('merchant.transactionDetails', {
      url: '/merchant/transaction-details/:transactionId',
      templateUrl: 'app/components/session/transaction/transaction-details.html',
      controller: 'transactionDetailsController'
    })

    .state('merchant.signout', {
      url: '/merchant/signout',
      templateUrl: 'app/components/login/login.html',
      controller: 'signoutController'
    })

    .state('404', {
      url: '/404',
      templateUrl: 'app/components/errors/404.html'
    })
    
    .state('500', {
      url: '/500',
      templateUrl: 'app/components/errors/500.html'
    });
    
  // $locationProvider.html5Mode(true);

}]);