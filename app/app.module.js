var phinisiApp = angular.module('phinisiApp', [
	'routesApp', 
	'sessionApp', 
	'normalApp', 
	'angularUtils.directives.dirPagination',
  'angular-cloudinary'
]);

var sessionApp = angular.module('sessionApp',[]);
var normalApp = angular.module('normalApp',[]);