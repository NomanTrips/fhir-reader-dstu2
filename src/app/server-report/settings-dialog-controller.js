'use strict';

fhirReader.controller('SettingsDialogCtrl',
  function ($mdDialog, ServerConnectionModel, LocalStorageModel, Auth) {
    var ctrl = this;
    ctrl.server;
    ctrl.baseUrl;
    ctrl.connectionInfoResolved = false;

    ctrl.authServerAddress = ServerConnectionModel.authServerURL();
    ctrl.hide = function () {
      $mdDialog.hide();
    };

    ctrl.getServerInfo = function () {
      ctrl.server = {};
      var settings = Auth.getFhirSettings();
      console.log(settings);

      settings.$loaded().then(function () {
        angular.forEach(settings, function (value, key) {
          ctrl.server[key] = value;
        });

        ctrl.baseUrl = (settings.baseUrl !== 'null') ? settings.baseUrl : '';
        ctrl.clientName = (settings.clientName !== 'null') ? settings.clientName : '';

      });

    };

    ctrl.getLocalStorageServerInfo = function () {
      ctrl.server = LocalStorageModel.getServerInfo();
      ctrl.baseUrl = (ctrl.server.baseUrl !== 'null') ? ctrl.server.baseUrl : '';
      ctrl.clientName = (ctrl.server.clientName !== 'null') ? ctrl.server.clientName : '';
    };

    ctrl.cancel = function () {
      $mdDialog.hide();
    };

    ctrl.save = function () {
      ctrl.server.baseUrl = ctrl.baseUrl;
      Auth.saveFhirSettings(ctrl.server);
      //ServerConnectionModel.update(ctrl.server);
      //LocalStorageModel.update(ctrl.server);
      $mdDialog.hide();
    };

    ctrl.getServerInfo();
    //ctrl.getLocalStorageServerInfo();

  });