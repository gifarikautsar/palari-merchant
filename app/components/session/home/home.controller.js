phinisiApp.controller('detailsController', ['$scope', '$http', '$window', '$log', '$state', 'cloudinary',
	function($scope, $http, $window, $log, $state, cloudinary){
		$scope.uploading = false;
		$scope.load = true;
		$scope.haveStore = false;
		$scope.storeDetails = {
			merchant_details: {}, 
			merchant_address: {}
		}
		$scope.provinces = {};
		$scope.cities = {};
		$scope.districts = {};
		$scope.fail = {
			status: false,
			description: '',
		};
		$scope.totalProduct = 0;

		$scope.hideFail = function(){
			$scope.fail.status = false;
			$scope.fail.description = '';
		};
		
		$scope.submit = function(){
			if($scope.editDetailsForm.$valid){
				//get store details from model
				$log.debug($window.sessionStorage.token);
				$log.debug($scope.storeDetails);
				$http.post(
					//url
					phinisiEndpoint + '/merchant/info/create',
					//data
					{
					  merchant_details : $scope.storeDetails.merchant_details,
					  merchant_address : $scope.storeDetails.merchant_address
					},
					//config
					{
						headers :{ 'Content-Type': 'application/json','Accept': 'application/json'}	,
					})
				.success(function(data,status,headers,config){
					if(data.success){
						if(data.success){
							$log.debug('Create store success!');
							$state.transitionTo('merchant.home', {arg : 'arg'});
						}else{
							$scope.error = data.description;
							if(data.description=="Token is not valid"){
								$state.transitionTo('login', {arg : 'arg'});
							}
							else{
								$scope.fail.status = true;
								if(data.description == null){
									$scope.fail.description = 'Add store details fail';
								}
								else{
									$scope.fail.description = data.description;
								}
							}
						}
					}
					$log.debug(data);
				})
				.error(function(data,status,headers,config){
					$log.debug(data);
					$scope.error = data.error;
				});
			}
		};

		$scope.getProvinceList = function(){
			$scope.storeDetails.merchant_address.city_id = '',
			$scope.storeDetails.merchant_address.district_id = '',
			$http.get(
				//url
				phinisiEndpoint + '/area/province',
				//config
				{
					headers :{ 'Content-Type': 'application/json','Accept': 'application/json'}	,
				}
			)
			.success(function(data){
				$scope.provinces = data;
				$log.debug($scope.provinces);
				$log.debug("Get province list success");
			})
			.error(function(data){
				$scope.error = data.description;
			});
		};

		$scope.getCityList = function (){
			$scope.storeDetails.merchant_address.district_id = '',
			$http.get(
				//url
				phinisiEndpoint + '/area/city?parent=' + $scope.storeDetails.merchant_address.province_id,
				//config
				{
					headers :{ 'Content-Type': 'application/json','Accept': 'application/json'}	,
				}
			)
			.success(function(data){
				$scope.cities = data;	
				$log.debug($scope.cities);
				$log.debug("Get city list success");
			})
			.error(function(data){
				$scope.error = data.description;
			});
		};

		$scope.getDistrictList = function (){
			$http.get(
				//url
				phinisiEndpoint + '/area/district?parent=' + $scope.storeDetails.merchant_address.city_id,
				//config
				{
					headers :{ 'Content-Type': 'application/json','Accept': 'application/json'}	,
				}
			)
			.success(function(data){
				$scope.districts = data;	
				$log.debug($scope.districts);
				$log.debug("Get district list success");
			})
			.error(function(data){
				$scope.error = data.description;
			});
		};

		$scope.getStoreDetails = function(){
			$scope.load = true;
			$http.post(
				//url
				phinisiEndpoint + '/merchant/info',
				//data
				{},
				//config
				{
					headers :{ 'Content-Type': 'application/json','Accept': 'application/json'}	,
				})
			.success(function(data,status,headers,config){
				if(data.hasOwnProperty('merchant_id')){
					$scope.passingData(data);
					$scope.getProductList();
					$scope.haveStore = true;
					$log.debug('Get store details  success!');	
				}
				else{
					$scope.haveStore = false;
					$scope.error = data.description;
					if(data.description=="Token is not valid"){
						$state.transitionTo('login', {arg : 'arg'});
					}
					else{
						$scope.getProvinceList();
					}
				}
				$log.debug(data);
			})
			.error(function(data,status,headers,config){
				$log.debug(data);
				$scope.error = data.error;
			});
			setTimeout(function() {
				$scope.load = false;
			}, 50);
		};

		$scope.passingData = function(data){
			$scope.storeDetails.merchant_details.merchant_name = data.merchant_name;
			$scope.storeDetails.merchant_details.merchant_logo_url = data.merchant_url;
			$scope.storeDetails.merchant_address.address = data.merchant_address;
			$scope.storeDetails.merchant_address.phone_number = data.merchant_phone;
			$scope.storeDetails.merchant_address.city = data.merchant_city;
			$scope.getProvinceList();
			$scope.storeDetails.merchant_address.province_id = $scope.getProvinceId(data.merchant_city_id);
			$scope.getCityList();
			$scope.storeDetails.merchant_address.city_id = data.merchant_city_id;
			$scope.getDistrictList();

		};
		$scope.getProvinceId = function(cityId){
			provinceId = cityId;
			while(provinceId >= 100){
				provinceId = provinceId/10;
			};
			//$log.debug("province id: " + provinceId);
			return Math.floor(provinceId);
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
                    $scope.storeDetails.merchant_details.merchant_logo_url = data.url;
                    $scope.uploading = false;
                }).error(function(data,status,headers,config){
                	$scope.uploading = false;
				});;
	        }
    	};

    	$scope.getProductList = function(){
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
				$scope.totalProduct = data.merchant_product.length; 
			}	
			else{
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
	};

	}]).config(function (cloudinaryProvider) {
	  	cloudinaryProvider.config({
		    upload_endpoint: 'https://api.cloudinary.com/v1_1/', // default
		    cloud_name: 'dwdaddxw9', // required
		    upload_preset: 'ym6oc9j6', // optional
		});
	})
