var servers = angular.module('servers', []);

function serversController($scope, $http) {

	// Set default server object structure
	$scope.server = {
		title: "",
		radius: {
			address: "",
			port: "",
			secret: ""
		}
	};

	//Get all servers on page load
	$http.get('/servers')
		.success(function(data) {
			// Validate data before we popuplate our bounded object
			if (data && typeof data == "object") {
				$scope.server = data;
			}
		})
		.error(function(data) {
			$scope.message = {
				status: "warning",
				info: data
			};
		});

	$scope.createServer = function(serverId) {

		// Prepare request to create or update 
		var body = {
			"title": this.server.title,
			"radius": {
				"address": this.server.radius.address,
				"port": this.server.radius.port,
				"secret": this.server.radius.secret
			}
		};

		// If this is a new RADIUS server instance then the serverId parameter
		// will not be defined and we can issue a POST
		if (!serverId) {
			// Create a new RADIUS server instance
			$http.post('/servers', body)
				.success(function(data) {
					$scope.server = data;
				})
				.error(function(data) {
					$scope.message = {
						status: "warning",
						info: data
					};
				})
			} else {
				// Update existing RADIUS server instance
				$http.put('/servers/' + serverId, body)
				.success(function(data) {
					$scope.server = data;
					$scope.message = {
						status: "success",
						info: "Settings updated!"
					};
				})
				.error(function(data) {
					$scope.message = {
						status: "warning",
						info: data
					};
				})
			}
	};
}