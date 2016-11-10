'use strict';

fhirReader.controller('PatientCtrl',
  function ($stateParams, FhirModel, $interval) {
    var ctrl = this;
    var section = '';
    ctrl.loadingBarIncrement = 30;
    ctrl.showChildren = false;

    ctrl.getSelectedSection = function () {
      return ctrl.section;
    };

    ctrl.setSelectedSection = function (section) {
      ctrl.section = section;
    };

    ctrl.getPatientDetails = function () {

      FhirModel.fhirSearchById($stateParams.id, 'AllergyIntolerance')
        .then(function (entries) {
          //console.log(entries);
          ctrl.allergyEntries = entries.entry;
          ctrl.loadingBarIncrement += 10;
        });

      FhirModel.fhirSearchById($stateParams.id, 'Encounter')
        .then(function (entries) {
          ctrl.encounterEntries = entries.entry;
          ctrl.loadingBarIncrement += 10;
        });

      FhirModel.fhirSearchById($stateParams.id, 'Immunization')
        .then(function (entries) {
          ctrl.immunizationEntries = entries.entry;
          ctrl.loadingBarIncrement += 10;
        });

      FhirModel.fhirSearchById($stateParams.id, 'Condition')
        .then(function (entries) {
          ctrl.conditionEntries = entries.entry;
          ctrl.loadingBarIncrement += 10;
        });

      FhirModel.fhirSearchById($stateParams.id, 'Procedure')
        .then(function (entries) {
          ctrl.procedureEntries = entries.entry;
          ctrl.loadingBarIncrement += 10;
        });

      FhirModel.fhirGetById($stateParams.id, 'Patient')
        .then(function (patient) {
          ctrl.patient = patient;
          ctrl.loadingBarIncrement += 10;
        });

      FhirModel.fhirSearchById($stateParams.id, 'MedicationOrder')
        .then(function (entries) {
          ctrl.medOrders = entries.entry;
          ctrl.loadingBarIncrement += 10;

          angular.forEach(ctrl.medOrders, function (value, key) {
            if (value.resource.medicationReference != undefined) {
              var medicationRef = value.resource.medicationReference.reference;
              var slashIndex = medicationRef.indexOf("/");
              var medicationId = medicationRef.substring((slashIndex + 1), medicationRef.length);

              FhirModel.fhirGetById(medicationId, 'Medication')
                .then(function (med) {
                  value.medication = med;
                });
            }
          });

        });

      FhirModel.fhirSearchById($stateParams.id, 'DiagnosticReport')
        .then(function (entries) {
          ctrl.diagnosticReportEntries = entries.entry;
          ctrl.loadingBarIncrement += 10;
        });

      FhirModel.fhirSearchById($stateParams.id, 'Observation')
        .then(function (entries) {
          ctrl.observationEntries = entries.entry;
          ctrl.loadingBarIncrement += 10;
        });
    }

    if (!FhirModel.isConnectionInfoResolved()) {
      FhirModel.initConnectionInfo().then(function () {
        ctrl.getPatientDetails();
      });
    } else {
      ctrl.getPatientDetails();
    };

  });

