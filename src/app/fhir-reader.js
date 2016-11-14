'use strict';

var fhirReader = angular.module('fhirReader', [
  'ui.router',
  'ngMaterial',
  'angularSpinner',
  'ngSanitize',
  'firebase',
])
  .constant('ENDPOINT_URI', 'https://fhir-reader.firebaseio.com/')
  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/server-report');

    $stateProvider
      .state('server', {
        url: '/server',
        templateUrl: 'app/server-report/server-report-mdv.html',
        controller: 'ServerReportCtrl',
        controllerAs: 'resources'
      })
      .state('patients', {
        url: '/patients/:id',
        templateUrl: 'app/patient/patient-mdv.html',
        controller: 'PatientCtrl',
        controllerAs: 'patientDetail'
      })
      ;
  })

fhirReader.config(function ($mdThemingProvider, $mdIconProvider) {
  $mdIconProvider
    .defaultIconSet("./assets/svg/avatars.svg", 128)
    .icon("menu", "./assets/svg/menu.svg", 24)
    .icon("experiment-results", "./assets/svg/experiment-results.svg", 24)
    .icon("warning", "./assets/svg/warning.svg", 24)
    .icon("hospital", "./assets/svg/hospital.svg", 24)
    .icon("syringe", "./assets/svg/syringe.svg", 24)
    .icon("heart-beats", "./assets/svg/heart-beats.svg", 24)
    .icon("pills", "./assets/svg/pills.svg", 24)
    .icon("scalpel", "./assets/svg/scalpel.svg", 24)
    .icon("microscope", "./assets/svg/microscope.svg", 24)
    .icon("pulse", "./assets/svg/pulse.svg", 24)
    .icon("list", "./assets/svg/list.svg", 24)
    .icon("settings-work-tool", "./assets/svg/settings-work-tool.svg", 24)
    .icon("expand", "./assets/svg/expand.svg", 24)
    .icon("rightarrow", "./assets/svg/rightarrow.svg", 24)
    .icon("cancel", "./assets/svg/cancel.svg", 24)
    .icon("collapse", "./assets/svg/collapse.svg", 24);

  $mdThemingProvider.theme('default')
    .primaryPalette('blue', {
      'default': '700',
      'hue-1': '50'
    })
    .accentPalette('grey', {
      'default': '700',
      'hue-1': '50'
    })
    .warnPalette('deep-orange');

  $mdThemingProvider.theme('dark-grey').backgroundPalette('grey').dark();
  $mdThemingProvider.theme('light-grey').backgroundPalette('grey', {
    'default': 'A700'
  });
  $mdThemingProvider.theme('dark-yellow').primaryPalette('yellow', {
    'default': '700'
  });


});






