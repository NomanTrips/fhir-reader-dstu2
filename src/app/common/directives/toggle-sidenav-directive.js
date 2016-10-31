'use strict'

fhirReader.directive('toggleSidenav',
  function ($mdSidenav) {
    return {
      restrict: 'AE',
      scope: {
      },
      // which markup this directive generates
      template: '<md-button ng-click="toggleSideNav()" hide-gt-sm class="md-icon-button md-primary" aria-label="ToggleSidenav">' +
      '<md-icon md-svg-icon="menu"></md-icon>' +
      '</md-button>',

      link: function (scope, element, attrs) {

        scope.toggleSideNav = function () {
          $mdSidenav('left').toggle();
        };

      }
    };

  });