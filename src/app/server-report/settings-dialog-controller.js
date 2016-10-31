'use strict';

fhirReader.controller('SettingsDialogCtrl',
  function ($mdDialog, ServerConnectionModel) {
    var ctrl = this;
    ctrl.server;
    ctrl.baseUrl;
    ctrl.connectionInfoResolved = false;

    ctrl.authServerAddress = ServerConnectionModel.authServerURL();
    ctrl.ClientName = ServerConnectionModel.clientName();
    ctrl.hide = function () {
      $mdDialog.hide();
    };

    ctrl.getServerInfo = function () {
      ServerConnectionModel.getServerInfo().then(function (data) {
        ctrl.server = (data !== 'null') ? data : {};
        ctrl.baseUrl = (data.baseUrl !== 'null') ? data.baseUrl : '';
      });
    };

    ctrl.cancel = function () {
      $mdDialog.cancel();
    };

    ctrl.answer = function (answer) {
      ctrl.server.baseUrl = ctrl.baseUrl;
      ServerConnectionModel.update(ctrl.server);
      $mdDialog.hide(answer);
    };

    ctrl.getServerInfo();

  });