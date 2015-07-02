phinisiApp.controller('detailsController', ['$scope', '$http', '$window', '$log', '$state', 'cloudinary',
	function($scope, $http, $window, $log, $state, cloudinary){
		$scope.uploading = false;
		$scope.load = true;
		$scope.haveStore = false;
		$scope.uploadFail = false;
		$scope.storeDetails = {
			merchant_details: {}, 
			merchant_address: {}
		}
		$scope.provinces = {};
		$scope.cities = {};
		$scope.districts = {};
		$scope.getCitiesDone = false;
		$scope.getDistrictsDone = false;
		$scope.fail = {
			status: false,
			description: '',
		};
		$scope.totalProduct = 0;
		$scope.rejFiles = {};

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
								$state.transitionTo('login', {expired : true});
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
					$state.transitionTo('500', { arg: 'arg'});
				});
			}
		};

		$scope.getProvinceList = function(){
			$scope.getCitiesDone = false;
			$scope.getDistrictsDone = false;
			$scope.provinces = {};
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
				$state.transitionTo('500', { arg: 'arg'});
			});
		};

		$scope.getCityList = function (){
			$scope.getCitiesDone = false;
			$scope.getDistrictsDone = false;
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
				$scope.getCitiesDone = true;
			})
			.error(function(data){
				$scope.error = data.description;
				$state.transitionTo('500', { arg: 'arg'});
			});
		};

		$scope.getDistrictList = function (){
			$scope.getDistrictsDone = false;
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
				$scope.getDistrictsDone = true;
			})
			.error(function(data){
				$scope.error = data.description;
				$state.transitionTo('500', { arg: 'arg'});
			});
		};

		$scope.getStoreDetails = function(home){
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
					$scope.haveStore = true;
					if(home){
						$scope.getProductList();
					}
					else{
						$scope.initLocation(data);
					}
					$log.debug('Get store details  success!');	
				}
				else{
					$scope.haveStore = false;
					$scope.error = data.description;
					if(data.description=="Token is not valid"){
						$state.transitionTo('login', {expired : true});
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
				$state.transitionTo('500', { arg: 'arg'});
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
		};

		$scope.initLocation = function(data){
			$scope.getProvinceList();
			$scope.getProvinceId(data.merchant_city_id);
			$scope.getCityList();
			$scope.storeDetails.merchant_address.city_id = data.merchant_city_id;
			$scope.getDistrictList();
		};

		$scope.getProvinceId = function(cityId){
			provinceId = cityId;
			while(provinceId >= 100){
				provinceId = provinceId/10;
			};
			$scope.storeDetails.merchant_address.province_id =  Math.floor(provinceId);
		};

		$scope.upload = function (files) {
			if(files && files.length){
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
                	$scope.uploadFail = true;
				});
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
					$state.transitionTo('login', {expired : true});
				}
			}
		})
		.error(function(data,status,headers,config){
			$log.debug(data);
			$scope.error = data.error;	
			$state.transitionTo('500', { arg: 'arg'});			
		});
	};

	}])
