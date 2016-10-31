'use strict';

fhirReader.controller('ServerReportCtrl',
  function ($mdSidenav, $location, FhirModel, $timeout, $q, $mdDialog, $mdMedia) {
    var ctrl = this;
    //var resourceType = '';
    //resourceDetail.resList = false;

    ctrl.status = '  ';
    ctrl.customFullscreen = false;

    ctrl.setSearchText = setSearchText;

    ctrl.toggleSideNav = function () {
      $mdSidenav('left').toggle();
    };


    ctrl.getPatients = function () {
      FhirModel.fhirSearch('Patient')
        .then(function (entries) {
          ctrl.patientEntries = entries;
        });
    }

    if (!FhirModel.isConnectionInfoResolved()) {
      FhirModel.initConnectionInfo().then(function () {
        ctrl.getPatients();
      });
    } else {
      ctrl.getPatients();
    };

    function setSearchText(text) {
      ctrl.searchText = text;
    }
    ctrl.clientName = 'Tarrytown Surgery';
    ctrl.servers = { "servers": [{ "server": { "name": "fhirbridge" } }, { "server": { "name": "hapi-fhir-public" } }] };
    ctrl.selectedServer;
    ctrl.getSelectedServer = function () {
      if (ctrl.selectedServer !== undefined) {
        return ctrl.selectedServer.server.name;
      } else {
        return "Please select an server";
      }
    };
    ctrl.setSelectedServer = function (server) {
      ctrl.selectedServer = server;
    }

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

  });

