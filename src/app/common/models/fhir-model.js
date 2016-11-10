'use strict';

fhirReader.factory("FhirModel", function ($http, $q, ServerConnectionModel) {
  self = this;
  // var self.baseUrl = 'http://www.fhirbridge.net/';
  self.server;
  self.baseUrl;
  self.connectionInfoResolved = false;

  function getSearchURL(resourceType, searchString) {
    if (searchString !== undefined) {
      var url = self.baseUrl + resourceType + '?' + searchString;
    } else {
      var url = self.baseUrl + resourceType
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
      url: self.baseUrl + resourceType,
      headers: {
        'Accept': 'application/json; charset=UTF-8'
      },
      params: { patient: searchId },
    }
  };

  function getGetByIdURL(resourceType, searchId) {
    return {
      method: 'GET',
      url: self.baseUrl + resourceType + '/' + searchId,
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

    /**
      getServerInfo: function (){
        return ServerConnectionModel.getServerInfo()
        .then(function (result) {
          self.server = (result !== 'null') ? result : {};
          self.baseUrl = (result.baseUrl !== 'null') ? result.baseUrl : '';
        }, function () {
          //ctrl.resetForm();
        });
      },
     */
    initConnectionInfo: function () {
      var deferred = $q.defer();

      ServerConnectionModel.getServerInfo()
        .then(function (data) {
          self.server = (data !== 'null') ? data : {};
          self.baseUrl = (data.baseUrl !== 'null') ? data.baseUrl : '';
          deferred.resolve();
          self.connectionInfoResolved = true;
        }, function () {
          //ctrl.resetForm();
        });

      return deferred.promise;
    },
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

fhirReader.factory("ServerConn", function () {
  var self = this;
  self.baseUrl = '';
  return {
    setBaseUrl: function (url) {
      self.baseUrl = url;
    },
    getBaseUrl: function () {
      return self.baseUrl;
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

});

//fhirReader.factory('ProcedureList',
  //function ($resource) {
    //return $resource('http://www.fhirbridge.net/Procedure?subject=:id', {}, {
      //query: { method: 'GET', params: { id: 'patients' }, isArray: false, headers: { 'Accept': 'application/json; charset=UTF-8' } }
    //});
  //});


