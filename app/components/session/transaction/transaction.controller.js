sessionApp.controller('transactionController', ['$scope' , '$http' , '$log' , '$window' , '$state' ,'$stateParams' , 
	function($scope, $http, $log, $window, $state, $stateParams){
		$scope.load = true;
		$scope.haveTransaction = false;
		$scope.transactionType = '';
		$scope.transactions = null;
		$scope.getTransactionList = function(){
			$scope.load = true;
			$http.post(
				//url
				phinisiEndpoint + '/merchant/transaction',
				//data
				{
				},
				//config
				{
					headers :{ 'Content-Type': 'application/json','Accept': 'application/json'}	,				
				})
			.success(function(data,status,headers,config){
				if(data.hasOwnProperty('success')){
					if(!data.success){
						$scope.error = data.description;
						if(data.description=="Token is not valid"){
							$state.transitionTo('login', {arg : 'arg'});
						}
					}
				}	
				else{
					$scope.transactions = data;
					$log.debug($scope.transactions);
					if($scope.transactions.length > 0){
						$scope.haveTransaction = true;
					}
					else{
						$scope.haveTransaction = false;	
					}
					$log.debug('Get transactions list success!');
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
}]);

sessionApp.controller('transactionDetailsController', ['$scope' , '$http' , '$log' , '$window' , '$state' ,'$stateParams' , 
	function($scope, $http, $log, $window, $state, $stateParams){
		$scope.fail = {
			status: false,
			description: '',
		};
		$scope.load = true;
		$scope.transactionId = $stateParams.transactionId;
		$scope.shipping = false;
		$scope.transaction = '';
		$scope.confirm = false;
		$scope.trackingId = null;
		$scope.trackingDone = false;
		$scope.backToList = false;

		$scope.getTransactionDetails = function(){
			$scope.load = true;
			$http.post(
				//url
				phinisiEndpoint + '/merchant/transaction/detail',
				//data
				{
					order_id : $scope.transactionId,
				},
				//config
				{
					headers :{ 'Content-Type': 'application/json','Accept': 'application/json'}	,				
				})
			.success(function(data,status,headers,config){
				if(data.hasOwnProperty('order_id')){
					$scope.transaction = data;
					$log.debug('Get transactions details success!');
					$log.debug($scope.transaction);
					$scope.initShipping(data);
				}	
				else{
					$scope.error = data.description;
					if(data.description=="Token is not valid"){
						$state.transitionTo('login', {arg : 'arg'});
					}
					else{
						$scope.fail.status = true;
						if(data.description == null){
							$scope.fail.description = 'Get transaction details fail';
						}
						else{
							$scope.fail.description = data.description;
						}
						$scope.backToList = true;
					}
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

		$scope.hideFail = function(){
			$scope.fail.status = false;
			$scope.fail.description = '';
			if($scope.backToList){
				$state.transitionTo('merchant.transaction', {arg : 'arg'});
			}
		};

		$scope.initShipping = function(data){
			if(data.hasOwnProperty('shipping_address')){
				$scope.shipping = true;
				if(data.hasOwnProperty('transaction_tracking_id')){
					$scope.trackingDone = true;
				}
				else{
					$scope.trackingDone = false;
				}
			}
			else{
				$scope.shipping = false;
			}
			

		};
		$scope.paymentStatus = function(){
			return ($scope.transaction.transaction_status === 'capture' || $scope.transaction.transaction_status === 'settlement');
		};

		$scope.totalAmount = function(){
			var total = 0;
			for(i in $scope.transaction.transaction_detail){
				total += $scope.transaction.transaction_detail[i].item_price * $scope.transaction.transaction_detail[i].item_quantity;
			}
			return total;
		};

		$scope.confirmToggle = function(){
			$scope.confirm = !$scope.confirm;
		};

		$scope.confirmOrder = function(){
			$scope.confirm = !$scope.confirm;
			if($scope.shipping){
				$http.post(
					//url
					phinisiEndpoint + '/merchant/transaction/tracking',
					//data
					{
						order_id : $scope.transactionId,
		  				tracking_id : $scope.trackingId, 
		  				courier_type : "jne"					},
					//config
					{
						headers :{ 'Content-Type': 'application/json','Accept': 'application/json'}	,				
					})
				.success(function(data,status,headers,config){
					if(data.hasOwnProperty('tracking_id')){
						$log.debug(data);
						$log.debug('Set tracking id success!');
						location.reload();
					}	
					else{
						$log.debug(data.description);
						$scope.error = data.description;
						if(data.description=="Token is not valid"){
							$state.transitionTo('login', {arg : 'arg'});
						}
						else{
							$scope.fail.status = true;
							if(data.description == null){
								$scope.fail.description = 'Confirm order fail';
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
				});
			}
		};
}]);

	