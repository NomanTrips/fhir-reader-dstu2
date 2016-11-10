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
          MedicationOrder: 'medication-order.html',
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
        '<div layout="row">' +
        itemHtml +
        '<md-button class="md-icon-button" aria-label="Expand" ng-click="isShowJsonOn = !isShowJsonOn">' +
        '<md-icon md-svg-icon="expand" ng-show="!isShowJsonOn" ></md-icon>' +
        '<md-icon md-svg-icon="collapse" ng-show="isShowJsonOn"></md-icon>' +
        '</md-button>' +
        '</div>' +
        '<md-list-item  ng-show="isShowJsonOn">' +
        '<div >' +
        '<pre>' +
        '{{entry | json}}	' +
        '</pre>' +
        '</div>' +
        '</md-list-item>' +
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
        scope.isShowJsonOn = false;
        scope.message = 'Discrete';
        scope.onChange = function (state) {
          if (state == true) {
            scope.message = 'Narrative';
          } else {
            scope.message = 'Discrete';
          }

        }
        scope.showJson = function () {
          console.log('getting to show json');
          scope.isShowJsonOn = true;
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