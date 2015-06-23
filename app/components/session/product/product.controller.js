phinisiApp.controller('addProductController', ['$scope' , '$http' , '$log' , '$window' , '$state', '$stateParams', 'cloudinary' , function($scope, $http, $log, $window, $state, $stateParams, cloudinary){
	$scope.uploading = false;
	$scope.load = true;
	$scope.haveProduct = false;
	$scope.hideQuantity = false; 
	$scope.productDetails = {
		name: '',
		description: '',
		price: '',
		image_url: [],
		limitless: false,
		weight: '0',
		need_address: false
	}	
	$scope.merchantProduct = {
		merchant_id : '',
		merchant_product: {}
	};

	$scope.quantityToggle = function(){
		$scope.hideQuantity = !$scope.hideQuantity;
	}

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
				$log.debug($scope.merchantProduct);
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

			if(!$scope.enableShipping){
				$scope.productDetails.weight =0;
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
					if(data.description=="Token is not valid"){
						$state.transitionTo('login', {arg : 'arg'});
					}
				}				
			})
			.error(function(data,status,headers,config){
				$log.debug(data);
				$scope.error = data.error;			
			});
		}		
	};

	$scope.upload = function (files) {
		if(files && files.length){
			$log.debug(files[0].type);
			$scope.uploading = true;
	        cloudinary.upload(files, {

	        }).progress(function (evt) {
                // var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                // console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
            }).success(function (data, status, headers, config) {
                console.log('image url: ' + data.url);
                $scope.productDetails.image_url.push(data.url);
                $scope.uploading = false;
            }).error(function(data,status,headers,config){
            	$scope.uploading = false;
			});;
        }
	};

}]);

phinisiApp.controller('productDetailsController', ['$scope' , '$http' , '$log' , '$state' , '$stateParams', 'cloudinary' , function($scope, $http, $log, $state, $stateParams, cloudinary){
	$scope.productDetails = {};
	$scope.uploading = false;
	$scope.deletePopUp = false;
	$scope.showURL = false;
	$scope.choosenProduct = $stateParams.productId;
	$scope.productURL = null;
	$scope.paymentURL = 'http://128.199.71.156:2081/#/payment/';
	$scope.hideQuantity = false; 

	$scope.getURL = function(){
		return $scope.paymentURL + $scope.choosenProduct;
	};

	$scope.quantityToggle = function(){
		$scope.hideQuantity = !$scope.hideQuantity;
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
				$scope.hideQuantity = $scope.productDetails.limitless;
			}
			else{
				$scope.error = data.success;
				if(data.description=="Token is not valid"){
					$state.transitionTo('login', {arg : 'arg'});
				}
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
					if(data.description=="Token is not valid"){
						$state.transitionTo('login', {arg : 'arg'});
					}
				}				
			})
			.error(function(data,status,headers,config){
				$log.debug(data);
				$scope.error = data.error;			
			});	
		}
	};

	$scope.upload = function (files) {
		if(files && files.length){
			$log.debug(files[0].type);
			$scope.uploading = true;
	        cloudinary.upload(files, {

	        }).progress(function (evt) {
                // var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                // console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
            }).success(function (data, status, headers, config) {
                console.log('image url: ' + data.url);
                $scope.productDetails.image_url = [];
                $scope.productDetails.image_url.push(data.url);
                $scope.uploading = false;
            }).error(function(data,status,headers,config){
            	$scope.uploading = false;
			});;
        }
	};

}]);

	
