'use strict';

fhirReader.factory("FhirModel", function ($http, $q, ServerConnection, Auth, LocalStorageModel) {
  self = this;
  self.connectionInfoResolved = false;

  function getSearchURL(resourceType, searchString) {
    if (searchString !== undefined) {
      var url = ServerConnection.getBaseUrl() + resourceType + '?' + searchString;
    } else {
      var url = ServerConnection.getBaseUrl() + resourceType
    }
    return {
      method: 'GET',
      url: url,
      headers: {
        'Accept': 'application/json; charset=UTF-8'
      },
    }
  };

  function getSearchByIdURL(resourceType, searchId) {
    return {
      method: 'GET',
      url: ServerConnection.getBaseUrl() + resourceType,
      headers: {
        'Accept': 'application/json; charset=UTF-8'
      },
      params: { patient: searchId },
    }
  };

  function getGetByIdURL(resourceType, searchId) {
    return {
      method: 'GET',
      url: ServerConnection.getBaseUrl() + resourceType + '/' + searchId,
      headers: {
        'Accept': 'application/json; charset=UTF-8'
      },
    }
  };


  function extract(result) {
    if (result.data === undefined) {
      return [];
    } else {
      return result.data;
    }
  }

  return {
    isConnectionInfoResolved: function () {
      return self.connectionInfoResolved;
    },
    
    fhirSearchById: function (id, resourceType) {
      var deferred = $q.defer();
      $http(getSearchByIdURL(resourceType, id)).then(function successCallback(response) {
        deferred.resolve(extract(response));
      }, function errorCallback(response) {
        deferred.reject(response);
      });
      return deferred.promise;
    },

    fhirSearch: function (resourceType, searchString) {
      var deferred = $q.defer();
      $http(getSearchURL(resourceType, searchString)).then(function successCallback(response) {
        deferred.resolve(extract(response));
      }, function errorCallback(response) {
        deferred.reject(response);
      });
      return deferred.promise;
    },

    fhirGetById: function (id, resourceType) {
      var deferred = $q.defer();
      $http(getGetByIdURL(resourceType, id)).then(function successCallback(response) {
        deferred.resolve(extract(response));
      }, function errorCallback(response) {
        deferred.reject(response);
      });
      return deferred.promise;
    }

  }

});