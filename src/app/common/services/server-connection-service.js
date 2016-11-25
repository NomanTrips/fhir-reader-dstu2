'use strict';

fhirReader.service('ServerConnection', function ($q, LocalStorageModel, Auth) {
    var service = this;
    service.server = {};
    service.baseUrl;
    service.clientName;

    return {
        initServerInfo: function () {
            var deferred = $q.defer();
            if (Auth.authObj.$getAuth()) { // logged in user, try to download server settings from firebase

                var settings = Auth.getFhirSettings();
                settings.$loaded().then(function () {
                    angular.forEach(settings, function (value, key) {
                        service.server[key] = value;
                    });

                    service.baseUrl = (settings.baseUrl !== 'null') ? settings.baseUrl : '';
                    service.clientName = (settings.clientName !== 'null') ? settings.clientName : '';
                    deferred.resolve();
                });

            } else {
                service.server = LocalStorageModel.getServerInfo();
                service.baseUrl = (service.server.baseUrl !== 'null') ? service.server.baseUrl : '';
                service.clientName = (service.server.clientName !== 'null') ? service.server.clientName : '';
                deferred.resolve();
            }

            return deferred.promise;
        },
        updateServerInfo: function (serverObj) {
            if (Auth.authObj.$getAuth()) {  // update on firebase
                Auth.saveFhirSettings(serverObj);
            } else { //update local storage
                LocalStorageModel.update(serverObj);
            }
        },
        getBaseUrl: function () {
            return service.baseUrl;
        },
        getServer: function () {
            return service.server;
        },
        getClientName: function () {
            return service.clientName;
        }
    }
});