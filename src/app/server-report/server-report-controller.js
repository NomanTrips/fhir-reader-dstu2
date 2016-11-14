'use strict';

fhirReader.controller('ServerReportCtrl',
  function ($mdSidenav, $location, FhirModel, $timeout, $q, $mdDialog, $mdMedia, ServerConnectionModel) {
    var ctrl = this;
    ctrl.loadingBarIncrement = 30;

    ctrl.status = '  ';
    ctrl.customFullscreen = false;
    ctrl.server;
    ctrl.baseUrl;
    ctrl.setSearchText = setSearchText;

    ctrl.toggleSideNav = function () {
      $mdSidenav('left').toggle();
    };

    ctrl.getPatients = function () {
      FhirModel.fhirSearch('Patient')
        .then(function (entries) {
          ctrl.patientEntries = entries.entry;
        });
    }
    

    function setSearchText(text) {
      ctrl.searchText = text;
    }
    

    ctrl.getServerInfo = function () {
      ServerConnectionModel.getServerInfo().then(function (data) {
        ctrl.server = (data !== 'null') ? data : {};
        ctrl.baseUrl = (data.baseUrl !== 'null') ? data.baseUrl : '';
        ctrl.clientName = (data.clientName !== 'null') ? data.clientName : '';
      });
    };

    ctrl.navToPatient = function (id) {
      var url = '/patients/' + id;
      $location.path(url);
    };


    ctrl.showFhirSettings = function (ev) {
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));
      $mdDialog.show({
        controller: 'SettingsDialogCtrl',
        controllerAs: 'settingsCtrl',
        templateUrl: 'app/server-report/server-settings-dialog.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true,
        fullscreen: useFullScreen
      })
        .then(function (answer) {
          ctrl.status = 'You said the information was "' + answer + '".';
        }, function () {
          ctrl.status = 'You cancelled the dialog.';
        });
    };

    ctrl.getTotal = function (searchBundle) {
      var count;
      try {
        count = searchBundle.total;
      }
      catch (err) {
        count = 0;
      }
      return count;
    }

    ctrl.getResourceCounts = function () {

      FhirModel.fhirSearch('Patient', '_summary=count')
        .then(function (searchBundle) {
          ctrl.patientCount = ctrl.getTotal(searchBundle);
          ctrl.loadingBarIncrement += 10;
        });

      FhirModel.fhirSearch('Encounter', '_summary=count')
        .then(function (searchBundle) {
          ctrl.encounterCount = ctrl.getTotal(searchBundle);
          ctrl.loadingBarIncrement += 10;
        });

      FhirModel.fhirSearch('MedicationOrder', '_summary=count')
        .then(function (searchBundle) {
          ctrl.medicationOrderCount = ctrl.getTotal(searchBundle);
          ctrl.loadingBarIncrement += 10;
        });

      FhirModel.fhirSearch('Procedure', '_summary=count')
        .then(function (searchBundle) {
          ctrl.procedureCount = ctrl.getTotal(searchBundle);
          ctrl.loadingBarIncrement += 10;
        });

      FhirModel.fhirSearch('Condition', '_summary=count')
        .then(function (searchBundle) {
          ctrl.conditionCount = ctrl.getTotal(searchBundle);
          ctrl.loadingBarIncrement += 10;
        });

      FhirModel.fhirSearch('Observation', '_summary=count')
        .then(function (searchBundle) {
          ctrl.observationCount = ctrl.getTotal(searchBundle);
          ctrl.loadingBarIncrement += 20;
        });

    }

    ctrl.getConformance = function (){
      FhirModel.fhirSearch('metadata')
        .then(function (conf) {
          ctrl.publisher = conf.publisher;
          ctrl.fhirVersion = conf.fhirVersion;
          ctrl.formats = conf.format;
          ctrl.contact = conf.contact;
          ctrl.loadingBarIncrement += 10;
        });
    }


    if (!FhirModel.isConnectionInfoResolved()) {
      FhirModel.initConnectionInfo().then(function () {
        ctrl.getPatients();
        ctrl.getResourceCounts();
        ctrl.getConformance();
        ctrl.getServerInfo();
      });
    } else {
      ctrl.getPatients();
      ctrl.getResourceCounts();
      ctrl.getConformance();
      ctrl.getServerInfo();
    };

  });

