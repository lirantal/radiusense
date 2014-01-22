var servers = angular.module('servers', []);

function serversController($scope, $http) {
	$scope.server = {};

	// Get all servers on page load
	$http.get('/servers')
		.success(function(data) {
			$scope.server = data;
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});

	$scope.createServer = function() {

		// Prepare request to create or update 
		var body = {
			"title": this.server.title,
			"radius": {
				"address": this.server.radius.address,
				"port": this.server.radius.port,
				"secret": this.server.radius.secret
			}
		};

		$http.post('/servers', body)
			.success(function(data) {
				$scope.server = data;
			})
			.error(function(data) {
				console.log('Error: ' + data);
			})
	};
}