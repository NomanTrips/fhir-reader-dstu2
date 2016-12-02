'use strict';

fhirReader.controller('PatientCtrl',
  function ($stateParams, FhirModel, $interval, $location, $anchorScroll, ServerConnection) {
    var ctrl = this;
    var section = '';
    ctrl.loadingBarIncrement = 30;
    ctrl.showChildren = false;
    ctrl.connected = false;

    ctrl.sections = [
      { name: "Patient Information" },
    ];

    ctrl.scrollToSection = function (section) {
      var old = $location.hash();
      $location.hash(section);
      $anchorScroll();
      $location.hash(old);
    };

    ctrl.getPatientDetails = function () {

      FhirModel.fhirSearchById($stateParams.id, 'AllergyIntolerance')
        .then(function (entries) {
          ctrl.allergyEntries = entries.entry;
          if (ctrl.allergyEntries != undefined) {
            ctrl.sections.push('Allergy Intolerances');
          }
        }).catch(function (error) {

        }).finally(function () {
          ctrl.loadingBarIncrement += 10;
        });

      FhirModel.fhirSearchById($stateParams.id, 'Encounter')
        .then(function (entries) {
          ctrl.encounterEntries = entries.entry;
          if (ctrl.encounterEntries != undefined) {
            ctrl.sections.push({ name: "Encounters" });
          }
        }).catch(function (error) {

        }).finally(function () {
          ctrl.loadingBarIncrement += 10;
        });

      FhirModel.fhirSearchById($stateParams.id, 'Immunization')
        .then(function (entries) {
          ctrl.immunizationEntries = entries.entry;
          if (ctrl.immunizationEntries != undefined) {
            ctrl.sections.push({ name: "Immunizations" });
          }
        }).catch(function (error) {

        }).finally(function () {
          ctrl.loadingBarIncrement += 10;
        });

      FhirModel.fhirSearchById($stateParams.id, 'Condition')
        .then(function (entries) {
          ctrl.conditionEntries = entries.entry;
          if (ctrl.conditionEntries != undefined) {
            ctrl.sections.push({ name: "Conditions" });
          }
        }).catch(function (error) {

        }).finally(function () {
          ctrl.loadingBarIncrement += 10;
        });

      FhirModel.fhirSearchById($stateParams.id, 'Procedure')
        .then(function (entries) {
          ctrl.procedureEntries = entries.entry;
          if (ctrl.procedureEntries != undefined) {
            ctrl.sections.push({ name: "Procedures" });
          }
        }).catch(function (error) {

        }).finally(function () {
          ctrl.loadingBarIncrement += 10;
        });

      FhirModel.fhirGetById($stateParams.id, 'Patient')
        .then(function (patient) {
          ctrl.patient = patient;
        }).catch(function (error) {

        }).finally(function () {
          ctrl.loadingBarIncrement += 10;
        });

      FhirModel.fhirSearchById($stateParams.id, 'MedicationOrder')
        .then(function (entries) {
          ctrl.medOrders = entries.entry;
          if (ctrl.medOrders != undefined) {
            ctrl.sections.push({ name: "Medication orders" });
          }

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

        }).catch(function (error) {

        }).finally(function () {
          ctrl.loadingBarIncrement += 10;
        });

      FhirModel.fhirSearchById($stateParams.id, 'DiagnosticReport')
        .then(function (entries) {
          ctrl.diagnosticReportEntries = entries.entry;
          if (ctrl.diagnosticReportEntries != undefined) {
            ctrl.sections.push({ name: "Diagnostic Reports" });
          }
        }).catch(function (error) {

        }).finally(function () {
          ctrl.loadingBarIncrement += 10;
        });

      FhirModel.fhirSearchById($stateParams.id, 'Observation')
        .then(function (entries) {
          ctrl.observationEntries = entries.entry;
          if (ctrl.observationEntries != undefined) {
            ctrl.sections.push({ name: "Observations" });
          }
        }).catch(function (error) {

        }).finally(function () {
          ctrl.loadingBarIncrement += 10;
        });
    }

    ServerConnection.initServerInfo().then(function () {

      if (ServerConnection.getBaseUrl() != undefined && ServerConnection.getBaseUrl() != '') {
        ctrl.connected = true;
        ctrl.getPatientDetails();
      } else {
        ctrl.connected = false;
        ctrl.loadingBarIncrement = 110;
      }

    })

  });

