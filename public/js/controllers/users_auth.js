var users_auth = angular.module('users_auth', []);

function usersAuthController($scope, $http) {

	var credentials = {
		username: '',
		password: ''
	};

	// Set default server object structure
	$scope.signin = function() {
		$http.post('/auth/signin', $scope.credentials).success(function(response) {
			window.location.href = "/";
		}).error(function(response) {
			$scope.message = response.message;
		});
	};

}