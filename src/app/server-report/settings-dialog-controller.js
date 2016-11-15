'use strict';

fhirReader.controller('SettingsDialogCtrl',
  function ($mdDialog, ServerConnectionModel, LocalStorageModel) {
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
      //ServerConnectionModel.update(ctrl.server);
      LocalStorageModel.update(ctrl.server);
      $mdDialog.hide();
    };

    //ctrl.getServerInfo();
    ctrl.getLocalStorageServerInfo();

  });