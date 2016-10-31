'use strict';

fhirReader.service('ServerConnectionModel', function ($http, ENDPOINT_URI, $q) {
    var service = this;
    service.serverInfoUrl = ENDPOINT_URI + 'serverConnection.json';

    return {
        getServerInfo: function () {
            var deferred = $q.defer();
            $http.get(service.serverInfoUrl).success(function (data) {
                deferred.resolve(data);
            }).error(function (msg, code) {
                console.log(msg)
            });
            return deferred.promise;
        },
        update: function (data) {
            return $http.put(service.serverInfoUrl, data).then();
        },

        authServerURL: function () {
            return "http://www.mitre.auth.com"
        },

        clientName: function () {
            return "tarrytown-surgery-fhir"
        },

        clientSecret: function () {
            return "tarrytown-surgery-fhir"
        }

    }
    /** 
        service.fetch = function (boardId) {
            return $http.get(getUrlForId(boardId)).then(extract);
        };
    
        service.create = function (board) {
            return $http.post(getUrl(), board).then(extract);
        };
    
        service.update = function (boardId, board) {
            return $http.put(getUrlForId(boardId), board).then(extract);
        };
    
        service.destroy = function (boardId) {
            return $http.delete(getUrlForId(boardId)).then(extract);
        };
    */
});