'use strict';

fhirReader.controller('SettingsDialogCtrl',
  function ($mdDialog, ServerConnectionModel) {
    var ctrl = this;
    ctrl.server;
    ctrl.baseUrl;
    ctrl.connectionInfoResolved = false;

    ctrl.authServerAddress = ServerConnectionModel.authServerURL();
    ctrl.hide = function () {
      $mdDialog.hide();
    };

    ctrl.getServerInfo = function () {
      ServerConnectionModel.getServerInfo().then(function (data) {
        ctrl.server = (data !== 'null') ? data : {};
        ctrl.baseUrl = (data.baseUrl !== 'null') ? data.baseUrl : '';
        ctrl.clientName = (data.clientName !== 'null') ? data.clientName : '';
      });
    };

    ctrl.cancel = function () {
      $mdDialog.hide();
    };

    ctrl.save = function () {
      ctrl.server.baseUrl = ctrl.baseUrl;
      ServerConnectionModel.update(ctrl.server);
      $mdDialog.hide();
    };

    ctrl.getServerInfo();

  });