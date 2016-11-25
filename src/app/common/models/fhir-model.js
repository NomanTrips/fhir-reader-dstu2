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
      return $http(getSearchByIdURL(resourceType, id)).then(extract);
    },

    fhirSearch: function (resourceType, searchString) {
      return $http(getSearchURL(resourceType, searchString)).then(extract);
    },

    fhirGetById: function (id, resourceType) {
      return $http(getGetByIdURL(resourceType, id)).then(extract);
    }

  }

});