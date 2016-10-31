'use strict'

fhirReader.directive('resourceItem',
  function ($http, $templateCache, $compile, $sanitize) {
    var getTemplate = function (contentType) {
      var templateLoader,
        baseUrl = 'app/patient/',
        templateMap = {
          AllergyIntolerance: 'allergy.html',
          Encounter: 'encounter.html',
          Condition: 'condition.html',
          Procedure: 'procedure.html',
          MedicationPrescription: 'prescription.html',
          Patient: 'patient.html',
          Immunization: 'immunization.html',
          DiagnosticReport: 'diagnosticreport.html',
          Observation: 'observation.html',
        };

      var templateUrl = baseUrl + templateMap[contentType];
      templateLoader = $http.get(templateUrl, { cache: $templateCache });

      return templateLoader;

    }

    var insertIntoItemHtml = function (itemHtml) {
      return '<div class="md-list-item-text" layout="column">' +
        itemHtml +
        '<md-divider ng-hide="last"></md-divider>' +
        '</div>'

    }
    return {
      // can be used as attribute or element
      restrict: 'AE',
      scope: {
        resource: '=',
        entry: '=',
        last: '='
      },
      link: function (scope, element, attrs) {
        scope.isNarrativeViewOn = false;
        scope.message = 'Discrete';
        scope.onChange = function (state) {
          if (state == true) {
            scope.message = 'Narrative';
          } else {
            scope.message = 'Discrete';
          }

        }
        var loader = getTemplate(scope.resource);
        var promise = loader.success(function (html) {
          html = insertIntoItemHtml(html);
          element.html(html);
        }).then(function (response) {
          element.replaceWith($compile(element.html())(scope));
        });
      },
    };

  });