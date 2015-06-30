var phinisiApp = angular.module('phinisiApp', [
	'routesApp', 
	'sessionApp', 
	'normalApp', 
	'angularUtils.directives.dirPagination',
  	'angular-cloudinary'
]).config(function($logProvider){
  // $logProvider.debugEnabled(false);
  // console.log = function() {}
}).config(function (cloudinaryProvider) {
  	cloudinaryProvider.config({
	    upload_endpoint: 'https://api.cloudinary.com/v1_1/', // default
	    cloud_name: 'dvndkaqtk', // required
	    upload_preset: 'wjrx5otn', // optional
	});
});

var sessionApp = angular.module('sessionApp',[]);
var normalApp = angular.module('normalApp',[]);