'use strict';

fhirReader.controller('PatientCtrl',
  function ($stateParams, FhirModel) {
    var ctrl = this;
    var section = '';

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
          ctrl.allergyEntries = entries;
        });

      FhirModel.fhirSearchById($stateParams.id, 'Encounter')
        .then(function (entries) {
          ctrl.encounterEntries = entries;
        });

      FhirModel.fhirSearchById($stateParams.id, 'Immunization')
        .then(function (entries) {
          ctrl.immunizationEntries = entries;
        });

      FhirModel.fhirSearchById($stateParams.id, 'Condition')
        .then(function (entries) {
          ctrl.conditionEntries = entries;
        });

      FhirModel.fhirSearchById($stateParams.id, 'Procedure')
        .then(function (entries) {
          ctrl.procedureEntries = entries;
        });

      FhirModel.fhirGetById($stateParams.id, 'Patient')
        .then(function (patient) {
          ctrl.patient = patient;
        });

      FhirModel.fhirSearchById($stateParams.id, 'MedicationPrescription')
        .then(function (entries) {
          ctrl.prescriptions = entries;

          angular.forEach(ctrl.prescriptions, function (value, key) {
            var medicationRef = value.resource.medication.reference;
            var slashIndex = medicationRef.indexOf("/");
            var medicationId = medicationRef.substring((slashIndex + 1), medicationRef.length);

            FhirModel.fhirGetById(medicationId, 'Medication')
              .then(function (med) {
                value.medication = med;
              });

          });

        });

      FhirModel.fhirSearchById($stateParams.id, 'DiagnosticReport')
        .then(function (entries) {
          ctrl.diagnosticReportEntries = entries;
        });

      FhirModel.fhirSearchById($stateParams.id, 'Observation')
        .then(function (entries) {
          ctrl.observationEntries = entries;
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

