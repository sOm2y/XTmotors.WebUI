(function() {
  'use strict';

  angular
    .module('xtmotorsWebUi')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
