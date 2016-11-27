'use strict';

fhirReader.controller('ServerReportCtrl',
  function ($mdSidenav, $location, FhirModel, $timeout, $q, $mdDialog, $mdMedia, ServerConnection, Auth) {
    var ctrl = this;
    ctrl.loadingBarIncrement = 30;
    ctrl.status = '  ';
    ctrl.customFullscreen = false;
    ctrl.server;
    ctrl.baseUrl;
    ctrl.clientName;
    ctrl.setSearchText = setSearchText;
    var originatorEv;
    ctrl.isOpen = false;
    ctrl.connected = false;

    ctrl.authItems = {
      default: { name: "Default user", icon: "account", direction: "bottom", show: "true" },
      google: { name: "Google", icon: "google", direction: "top", show: "true" },
      signout: { name: "Sign out", icon: "sign-out", direction: "bottom", show: "false" }
    };

    ctrl.account = ctrl.authItems.default;

    //github: { name: "Github", icon: "img/icons/hangout.svg", direction: "bottom", show: "true" },

    ctrl.authEvent = function (authItem) {
      if (authItem.name == 'Sign out') {
        Auth.authObj.$signOut();
        ctrl.authItems.default.show = true;
        ctrl.authItems.google.show = true;
        //ctrl.authItems.github.show = true;
        ctrl.authItems.signout.show = false;
        ctrl.account = ctrl.authItems.default;
      } else {
        Auth.authenticate(authItem.name).then(function (result) {
          //console.log("Signed in as:", result.user.uid);
          ctrl.authItems.default.show = false;
          ctrl.authItems.google.show = false;
          //ctrl.authItems.github.show = false;
          ctrl.authItems.signout.show = true;
          ctrl.account = ctrl.authItems.google;
        }).catch(function (error) {
          console.error("Authentication failed:", error);
        });
      }
    }

    ctrl.openMenu = function ($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
    };



    ctrl.initProfile = function () {

      var firebaseUser = Auth.authObj.$getAuth();

      if (firebaseUser) {
        console.log("Signed in as:", firebaseUser.uid);
        ctrl.authItems.default.show = false;
        ctrl.authItems.google.show = false;
        //ctrl.authItems.github.show = false;
        ctrl.authItems.signout.show = true;
        ctrl.account = ctrl.authItems.google;
      } else {
        ctrl.authItems.signout.show = false;
        ctrl.account = ctrl.authItems.default;
        console.log("Signed out");
      }

    }

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

    ctrl.authenticate = function () {
      Auth.authenticate();
      //console.log(Auth.authObj);
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

    ctrl.getConformance = function () {
      FhirModel.fhirSearch('metadata')
        .then(function (conf) {
          ctrl.publisher = conf.publisher;
          ctrl.fhirVersion = conf.fhirVersion;
          ctrl.formats = conf.format;
          ctrl.contact = conf.contact;
          ctrl.loadingBarIncrement += 10;
        });
    }


    ServerConnection.initServerInfo().then(function () {
      ctrl.initProfile();
      //console.log(ServerConnection.getBaseUrl());
      if (ServerConnection.getBaseUrl() != undefined && ServerConnection.getBaseUrl() != '' ) {
        ctrl.server = ServerConnection.server;
        ctrl.baseUrl = ServerConnection.getBaseUrl();
        ctrl.clientName = ServerConnection.getClientName();
        ctrl.getPatients();
        ctrl.getResourceCounts();
        ctrl.getConformance();
        ctrl.connected = true;
      } else {
        ctrl.connected = false;
        ctrl.loadingBarIncrement = 110;
      }

    })

  });

