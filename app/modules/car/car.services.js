angular.module('car.services', [])
    .service('getImportInfo', ['xtmotorsAPIService',
    	function(xtmotorsAPIService){
	        return {
	            importSummary: xtmotorsAPIService.query({ section: 'Import' }).$promise,
	            importRecord: xtmotorsAPIService.query({ section: 'ImportRecords' }).$promise
	        };
        
    }]);