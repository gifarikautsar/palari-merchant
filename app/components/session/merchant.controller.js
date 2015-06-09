sessionApp.controller('merchantController', function($scope, $window, $rootScope) {
	$scope.$window = $window;
	$scope.showMenu = false;

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

})


