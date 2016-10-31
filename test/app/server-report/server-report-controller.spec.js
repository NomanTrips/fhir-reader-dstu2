'use strict';

describe('Controller: ServerReportCtrl', function () {
  beforeEach(module('fhirReader'));

  var ServerReportCtrl,
    mockFhirModel,
    location

  beforeEach (inject(function ($templateCache, $controller, $q, $location) {
    location = $location;
    var createPromise = function (returnData) {
      var deferred = $q.defer();
      deferred.resolve(returnData);
      return deferred.promise;
    };

    mockFhirModel = {
      fhirSearch: function () {
        return createPromise({ data: '{"meta": {"lastUpdated": "2015-12-11T14:19:48.25617+00:00","versionId": "8a0cc4a3-d2ea-445b-9701-7652e7cb6d95"},"id": "8a0cc4a3-d2ea-445b-9701-7652e7cb6d95","resourceType": "Patient","name": [{"given": ["Holly"]}]}' })
      }

    };


    ServerReportCtrl = $controller('ServerReportCtrl', {
      FhirModel: mockFhirModel,
    });
  }));

  it('should be defined', function () {
    expect(ServerReportCtrl).toBeDefined();
  });

  it('should set the patient search text to user supplied value', function () {
    ServerReportCtrl.setSearchText('Skywalker');
    expect(ServerReportCtrl.searchText).toBe('Skywalker');
  });

  it('should set the location path to specific patient', function () {
    location.path('');
    ServerReportCtrl.navToPatient('999');
    expect(location.path()).toBe('/patients/999');
  });

});