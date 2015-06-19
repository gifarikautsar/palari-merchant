phinisiApp.controller('addProductController', ['$scope' , '$http' , '$log' , '$window' , '$state', '$stateParams' , function($scope, $http, $log, $window, $state, $stateParams){
	$scope.load = true;
	$scope.haveProduct = false;
	$scope.productDetails = {
		name: '',
		description: '',
		price: '',
		image: '',
		limitless: false,
		weight: '0',
		insurance: 'No',
		need_address: false
	}	
	$scope.merchantProduct = {
		merchant_id : '',
		merchant_product: {}
	};
	$scope.getProductList = function(){
		$scope.load = true;
		$log.debug($window.sessionStorage.token);
		$http.post(
			//url
			phinisiEndpoint + '/merchant/product',
			//data
			{
			},
			//config
			{
				headers :{ 'Content-Type': 'application/json','Accept': 'application/json'}	,				
			})
		.success(function(data,status,headers,config){
			if(data.hasOwnProperty('merchant_id')){
				$scope.merchantProduct.merchant_id = data.merchant_id;
				$scope.merchantProduct.merchant_product = data.merchant_product; 
				$log.debug('Get product list success!');
				if($scope.merchantProduct.merchant_product.length > 0){
					$scope.haveProduct = true;
				}
				else{
					$scope.haveProduct = false;	
				}
				$log.debug($scope.merchantProduct);
			}	
			else{
				$scope.error = data.description;
			}
		})
		.error(function(data,status,headers,config){
			$log.debug(data);
			$scope.error = data.error;				
		});
		setTimeout(function() {
			$scope.load = false;
		}, 50);
	};

	$scope.submitProduct = function(){
		if ($scope.addProductForm.$valid){
			$log.debug($scope.productDetails.name);
			$log.debug($scope.productDetails.description);
			$log.debug($scope.productDetails.price);
			$log.debug($scope.productDetails.image);
			$log.debug($scope.productDetails.weight);
			$log.debug($scope.productDetails.insurance);

			if(!$scope.enableShipping){
				$scope.productDetails.weight =0;
				$scope.productDetails.insurance = 0;
			}

			$http.post(
				//url
				phinisiEndpoint + '/merchant/product/new',
				$scope.productDetails,
				{
					headers :{ 'Content-Type': 'application/json','Accept': 'application/json'}	,	
				})
			.success(function(data,status,headers,config){
				$log.debug(data);
				if(data.hasOwnProperty('id')){
					$log.debug("success save product");
					$state.transitionTo('merchant.productDetails', {productId: data.id});
				}else{
					$scope.error = data.description;
				}				
			})
			.error(function(data,status,headers,config){
				$log.debug(data);
				$scope.error = data.error;			
			});
		}		
	};

}]);

phinisiApp.controller('productDetailsController', ['$scope' , '$http' , '$log' , '$state' , '$stateParams' , function($scope, $http, $log, $state, $stateParams){
	$scope.productDetails = {};
	$scope.deletePopUp = false;
	$scope.showURL = false;
	$scope.choosenProduct = $stateParams.productId;
	$scope.productURL = null;
	$scope.paymentURL = 'http://128.199.71.156:2081/#/payment/';

	$scope.getURL = function(){
		return $scope.paymentURL + $scope.choosenProduct;
	};

	$scope.getProductDetails = function(){
		$log.debug($scope.choosenProduct);
		$http.post(
			//url
			phinisiEndpoint + '/merchant/product/detail',
			//data
			{
				id: $scope.choosenProduct,
			},
			//config
			{
				headers :{ 'Content-Type': 'application/json','Accept': 'application/json'}	,				
			})
		.success(function(data,status,headers,config){
			if(data.hasOwnProperty('id')){
				$scope.productDetails = data;
				$log.debug($scope.productDetails);
				$log.debug("Get product details success");
				if(!$scope.productDetails.hasOwnProperty('weight')){
					$scope.productDetails.weight = 0;
				}
				if(!$scope.productDetails.hasOwnProperty('insurance')){
					$scope.productDetails.insurance = 'No';
				}
			}
			else{
				$scope.error = data.success;
			}
		})
		.error(function(data,status,headers,config){
			$log.debug(data);
			$scope.error = data.error;				
		});
	};

	$scope.urlToggle = function(){
		$scope.showURL =  !$scope.showURL;
		if($scope.showURL){
			$scope.productURL = $scope.getURL();
		}
	}

	$scope.deleteToggle = function(){
		$scope.deletePopUp = !$scope.deletePopUp;
	};

	$scope.deleteProduct = function(){
		$scope.deletePopUp = !$scope.deletePopUp;
		$state.transitionTo('merchant.product', {arg : 'arg'});	
	};

	$scope.updateProduct = function(){
		if ($scope.editProductForm.$valid){
			$scope.productDetails.id = $scope.choosenProduct;
			$log.debug($scope.productDetails);
			$http.post(
				//url
				phinisiEndpoint + '/merchant/product/update',
				$scope.productDetails,
				{
					headers :{ 'Content-Type': 'application/json','Accept': 'application/json'}	,	
				})
			.success(function(data,status,headers,config){
				$log.debug(data);
				if(data.hasOwnProperty('name')){
					$log.debug("update product success");
					$state.transitionTo('merchant.productDetails', {productId: $scope.choosenProduct});
				}else{
					$scope.error = data.description;
				}				
			})
			.error(function(data,status,headers,config){
				$log.debug(data);
				$scope.error = data.error;			
			});	
		}
	};
}]);

	
