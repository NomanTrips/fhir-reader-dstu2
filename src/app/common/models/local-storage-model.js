'use strict';

fhirReader.service('LocalStorageModel', function ($localStorage) {
    var service = this;
    service.$storage = $localStorage;

    service.create = function () {
        service.$storage.serverInfo = {
            baseUrL: "",
            clientName: "",
            authServerURL: "",
            clientSecret: ""
        }
    }
    //console.log('creating local store');


    return {
        getServerInfo: function () {
            if (service.$storage.serverInfo == undefined) {
                service.create();
            }
            return service.$storage.serverInfo;
        },
        update: function (serverInfo) {
            service.$storage.serverInfo = serverInfo;
            return service.$storage.serverInfo;
        }
    }

});