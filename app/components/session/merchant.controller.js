phinisiApp.controller('merchantController', function($scope, $window, $rootScope, $state) {
	$scope.$window = $window;
	$scope.showMenu = false;

    $scope.checkToken = function(){
        if($window.sessionStorage.token == null){
            $state.transitionTo('login', {arg : 'arg'});
        }   
    }

	$scope.clickMenu = function() {
           $scope.showMenu = !$scope.showMenu;

            if ($scope.showMenu) {
                $scope.$window.onclick = function (event) {
                    closeSearchWhenClickingElsewhere(event, $scope.clickMenu);
                };
            } else {
                $scope.showMenu = false;
                $scope.$window.onclick = null;
                $scope.$apply();
            }		
	}

    function closeSearchWhenClickingElsewhere(event, callbackOnClose) {

        var clickedElement = event.target;
        if (!clickedElement) return;

        var elementClasses = clickedElement.classList;
        var clickedOnSearchDrawer = elementClasses.contains('menu-button') || elementClasses.contains('sidebar') || (clickedElement.parentElement !== null && clickedElement.parentElement.classList.contains('sidebar'));

        if (!clickedOnSearchDrawer) {
            callbackOnClose();
            return;
        }

    }

});

phinisiApp.controller('signoutController', ['$http', '$scope', '$window', '$log', '$state', function($http, $scope, $window, $log, $state){

    $scope.signout = function(){        

        $http.get(
            phinisiEndpoint + '/merchant/signout/' + $window.sessionStorage.token 
        )
        .success(function(data,status,headers,config){
            $log.debug(data);
            if(data.success){                
                $window.sessionStorage.token = null;   
            }
            $state.transitionTo('login');
        })
        .error(function(data,status,headers,config){
            $log.debug(data.error);
            $state.transitionTo('login');
        });    
    }

    $scope.signout();
    
}]);




