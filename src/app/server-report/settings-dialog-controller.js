'use strict';

fhirReader.controller('SettingsDialogCtrl',
  function ($mdDialog, ServerConnection) {
    var ctrl = this;
    ctrl.server;
    ctrl.baseUrl;
    ctrl.connectionInfoResolved = false;

    ctrl.hide = function () {
      $mdDialog.hide();
    };

    ctrl.cancel = function () {
      $mdDialog.hide();
    };

    ctrl.save = function () {
      ctrl.server.baseUrl = ctrl.baseUrl;
      ServerConnection.updateServerInfo(ctrl.server);
      $mdDialog.hide();
    };

    ServerConnection.initServerInfo().then(function () {
      ctrl.server = ServerConnection.getServer();
      ctrl.baseUrl = ServerConnection.getBaseUrl();
      ctrl.clientName = ServerConnection.getClientName();
    })

  });