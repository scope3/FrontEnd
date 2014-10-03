'use strict';

angular.module('lcaApp.version', [
  'lcaApp.version.interpolate-filter',
  'lcaApp.version.version-directive'
])

.value('version', '0.1');
