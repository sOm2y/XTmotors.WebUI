angular.module('xtmotorwebuiApp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('modules/app/appSetting.html',
    "<div layout=\"column\" layout-align=\"center\"> <md-card> <md-subheader class=\"md-primary\">Your Setting</md-subheader> <md-card-content layout=\"row\" layout-wrap> <md-input-container flex=\"100\" class=\"md-block\"> <label>Old Password</label> <input type=\"passowrd\" ng-model=\"password.oldPassword\"> </md-input-container> <md-input-container flex=\"100\" class=\"md-block\"> <label>New Password</label> <input type=\"passowrd\" ng-model=\"password.newPassword\"> </md-input-container> <md-input-container flex=\"100\" class=\"md-block\"> <label>Confirm Password</label> <input type=\"passowrd\" ng-model=\"password.confirmPassword\"> </md-input-container> </md-card-content> </md-card> <div layout=\"row\" layout-align=\"center\"> <md-button flex=\"25\" class=\"md-raised\" ng-click=\"backToHome()\">Cancel</md-button> <md-button flex=\"25\" class=\"md-raised md-primary\" ng-click=\"updatePassword(password)\">Update Profile</md-button> </div> </div>"
  );


  $templateCache.put('modules/app/cubeGridSpinner.html',
    "<div class=\"sk-cube-grid\"> <div class=\"sk-cube sk-cube1\"></div> <div class=\"sk-cube sk-cube2\"></div> <div class=\"sk-cube sk-cube3\"></div> <div class=\"sk-cube sk-cube4\"></div> <div class=\"sk-cube sk-cube5\"></div> <div class=\"sk-cube sk-cube6\"></div> <div class=\"sk-cube sk-cube7\"></div> <div class=\"sk-cube sk-cube8\"></div> <div class=\"sk-cube sk-cube9\"></div> </div>"
  );


  $templateCache.put('modules/app/formSearchCar.html',
    "<form class=\"navbar-form navbar-left\"> <input type=\"text\" class=\"form-control col-lg-8\" placeholder=\"Search\" ng-model=\"searchKeyword\"> </form>"
  );


  $templateCache.put('modules/app/loginModalTemplate.html',
    "<div class=\"container\"> <div layout=\"row\" layout-wrap> <div flex=\"100\" class=\"login-container\"> <img width=\"300\" src=\"images/xtmotors_logo_fixed_2.png\" alt=\"\"> </div> <div id=\"form-container\" flex=\"100\" layout=\"row\"> <form flex=\"60\" id=\"login-form\" layout=\"row\" layout-wrap> <input ng-model=\"email\" type=\"email\" placeholder=\"EMAIL\" class=\"form-control login-input\"> <input ng-model=\"password\" type=\"password\" placeholder=\"PASSWORD\" class=\"form-control login-input\"> <div flex=\"100\" layout=\"row\" layout-align=\"space-between center\"> <md-checkbox ng-model=\"rememberPassword\" aria-label=\"Remember Me?\" id=\"login-checkBox\"> <span id=\"checkbox-lable\">&nbsp; Remember Me?</span> </md-checkbox> <md-button ng-click=\"attemptLogin(email,password);LoginModalCtrl.cancel()\">Login</md-button> </div> </form> <div> </div> </div> <div class=\"version-no\">v&nbsp;0.0.1</div></div></div>"
  );


  $templateCache.put('modules/app/userProfile.html',
    "<div layout=\"column\" layout-align=\"center\"> <md-card> <md-subheader class=\"md-primary\">Your Profile</md-subheader> <md-card-content layout=\"row\" layout-wrap> <md-input-container flex=\"100\" class=\"md-block\"> <label>Email</label> <input type=\"email\" ng-model=\"profile.email\"> </md-input-container> <md-input-container flex=\"100\" class=\"md-block\"> <label>First Name</label> <input type=\"text\" ng-model=\"profile.firstName\"> </md-input-container> <md-input-container flex=\"100\" class=\"md-block\"> <label>Last Name</label> <input type=\"text\" ng-model=\"profile.lastName\"> </md-input-container> <md-input-container flex=\"100\" class=\"md-block\"> <label>Phone Number</label> <input type=\"tel\" ng-model=\"profile.phone\"> </md-input-container> </md-card-content> </md-card> <div layout=\"row\" layout-align=\"center\"> <md-button flex=\"25\" class=\"md-raised\" ng-click=\"backToHome()\">Cancel</md-button> <md-button flex=\"25\" class=\"md-raised md-primary\" ng-click=\"updateProfile(profile)\">Update Profile</md-button> </div> </div>"
  );


  $templateCache.put('modules/car/car.details.html',
    "<div ng-cloak> <!-- <md-content> --> <md-tabs md-dynamic-height md-border-bottom md-selected=\"selectedTab\"> <vehicle-summary></vehicle-summary> <!-- <import-summary></import-summary> --> <maintenance-record-list></maintenance-record-list> <!-- <contract-summary></contract-summary> --> <md-tab label=\"{{&quot;tab_upload_car_photos&quot; | translate}}\"> <md-content class=\"md-padding\"> <!-- Upload your car photos --> <h4>{{\"title_upload_car_photos\" | translate}}</h4> <br> <button ngf-select=\"uploadFiles($files)\" ngf-multiple=\"true\">{{\"selectImage\" | translate}}</button> <br> <div layout=\"row\" layout-sm=\"column\" layout-align=\"space-around\" ng-if=\"uploading\"> <md-progress-circular md-mode=\"determinate\" value=\"{{progress}}\"></md-progress-circular> <span class=\"progress\" ng-show=\"progress >= 0\"> <div style=\"width:{{progress}}%\" ng-bind=\"progress + '%'\"></div> </span> </div> <br>Images: <table> <tr ng-repeat=\"image in images\" layout-align=\"space-around center\"> <td>{{image.photoName}}</td> <td><img ng-src=\"{{image.imageUrl}}\" width=\"300\"></td> <td> <md-button class=\"md-raised md-primary\" ng-click=\"deleteImage(image.imageId)\">{{\"deleteImage\" | translate}}</md-button> </td> </tr> </table> <!-- <ul>\r" +
    "\n" +
    "              <li ng-repeat=\"f in files\" style=\"font:smaller\">\r" +
    "\n" +
    "                  {{f.name}}\r" +
    "\n" +
    "                  <img ngf-thumbnail=\"f || '/thumb.jpg'\" width=\"300\">\r" +
    "\n" +
    "              </li>\r" +
    "\n" +
    "          </ul> --> </md-content> </md-tab> </md-tabs> <!-- </md-content> --> </div> <div layout=\"row\" layout-align=\"center center\" ng-hide=\"!(selectedTab == 0)\" ng-if=\"!showMaintenanceReordDetails\"> <md-button flex=\"25\" ng-hide=\"isFromStorage || isFromConsignment\" class=\"md-raised\" ng-click=\"backToCar()\">{{\"cancel\" | translate}}</md-button> <md-button flex=\"25\" ng-show=\"isFromStorage\" class=\"md-raised\" ng-click=\"backToStorgaePage()\">Back to Storage</md-button> <md-button flex=\"25\" ng-show=\"isFromConsignment\" class=\"md-raised\" ng-click=\"backToConsigmentPage()\">Back to Consigment</md-button> <md-button flex=\"25\" class=\"md-raised md-primary\" ng-disabled=\" !(vehicleInfo.$valid)\" ng-click=\"saveCar()\">{{\"save\" | translate}}</md-button> </div>"
  );


  $templateCache.put('modules/car/car.html',
    "<div> <md-card ng-hide=\"$state.current.name === 'car.details'\"> <md-card-content> <md-table-container> <table md-table md-row-select=\"options.rowSelection\" ng-model=\"selected\" md-progress=\"promise\"> <thead md-head md-order=\"query.order\" md-on-reorder> <tr md-row> <th md-column md-order-by=\"carId\"><span>{{\"id\" | translate}}</span></th> <th md-column md-order-by=\"makerName\"><span>{{\"brand\" | translate}}</span></th> <th md-column md-order-by=\"model\" md-desc><span>{{\"model\" | translate}}</span></th> <th md-column md-numeric md-order-by=\"year\"><span>{{\"year\" | translate}}</span></th> <th md-column md-numeric md-order-by=\"odometer\"><span>{{\"odometer\" | translate}}</span></th> <th md-column md-numeric md-order-by=\"price\"><span>{{\"salePrice\" | translate}}</span></th> <th md-column md-order-by=\"arriveTime\"><span>{{\"arriveTime\" | translate}}</span></th> <th md-column md-order-by=\"carStatus\"><span>{{\"status\" | translate}}</span></th> </tr> </thead> <tbody md-body> <tr md-row md-select=\"car\" md-on-select ng-repeat=\"car in cars | filter: filter.search | orderBy: query.order | limitTo: query.limit : (query.page -1) * query.limit\"> <td ng-click=\"editCar(car)\" md-cell>{{::car.carId}} </td><td md-cell>{{::car.makerName}} </td><td md-cell>{{::car.model}}</td> <td md-cell>{{::car.year}}</td> <td md-cell>{{::car.odometer| number }}&nbsp;Km</td> <td md-cell>{{::car.total | currency}}</td> <td md-cell>{{::car.arriveTime | date : \"EEEE, dd MMMM yyyy\"}}</td> <td md-cell><span class=\"label\" ng-class=\"checkCarStatusColor(car.carStatus)\">{{::car.carStatus}}</span></td> </tr> </tbody> </table> </md-table-container> <md-table-pagination md-limit=\"query.limit\" md-page=\"query.page\" md-total=\"{{cars.length}}\" md-page-select=\"options.pageSelector\" md-boundary-links=\"options.boundaryLinks\" md-on-paginate></md-table-pagination> </md-card-content> </md-card> <div class=\"\" ui-view=\"car-details-view\"> </div> </div>"
  );


  $templateCache.put('modules/car/carFilter.html',
    "<ul class=\"nav navbar-nav navbar-right\"> <li ng-click=\"listGalleryView=!listGalleryView\" ng-show=\"$state.current.name === 'car'\"> <a href=\"\"><i ng-class=\"listGalleryView?'fa-th':'fa-list'\" class=\"fa fa-2x\"></i></a> </li> <li> <div class=\"btn-group\"> <a href=\"bootstrap-elements.html\" data-target=\"#\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\"> Cars Per Page <span class=\"caret\"></span> </a> <ul class=\"dropdown-menu\"> <li><a href=\"javascript:void(0)\" ng-click=\"itemsPerPage = 2 \">20</a></li> <li><a href=\"javascript:void(0)\" ng-click=\"itemsPerPage = 50\">50</a></li> <li><a href=\"javascript:void(0)\" ng-click=\"itemsPerPage = 100\">100</a></li> </ul> </div> </li> <li><a></a></li> </ul>"
  );


  $templateCache.put('modules/car/contractSummary.html',
    "<md-tab label=\"{{'tab_sale_info' | translate}}\"> <md-content class=\"md-padding\"> <form name=\"saleInfo\"> <div class=\"checkBox\"> {{\"carSaleQuestion\" | translate}}? &nbsp; <md-checkbox flex=\"50\" class=\"md-block\" ng-model=\"contract.paymentStatus\" aria-label=\"contract\"> {{contract.paymentStatus?('sale_sold' | translate):('sale_unSold' | translate)}} </md-checkbox> </div> <md-card-content> <div layout=\"row\" layout-wrap ng-if=\"contract.paymentStatus\"> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"contract_summary_contractNum\" | translate}}</label> <input name=\"contractNum\" required ng-model=\"contract.contractNum\"> <div ng-messages=\"saleInfo.contractNum.$error\"> <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div> </div> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"contract_summary_contractDate\" | translate}}</label> <input time=\"false\" date=\"true\" mdc-datetime-picker=\"\" type=\"text\" id=\"contractDate\" placeholder=\"Date\" ng-model=\"contract.contractDate\" class=\"md-input\"> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"contract_summary_deposit\" | translate}}</label> <input name=\"deposite\" required ng-model=\"contract.deposite\"> <div ng-messages=\"saleInfo.deposite.$error\"> <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div> </div> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"contract_summary_balance\" | translate}}</label> <input name=\"balance\" required ng-model=\"contract.balance\"> <div ng-messages=\"saleInfo.balance.$error\"> <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div> </div> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"contract_summary_price\" | translate}}</label> <input name=\"price\" required ng-model=\"contract.price\"> <div ng-messages=\"saleInfo.price.$error\"> <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div> </div> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"contract_summary_gst\" | translate}}</label> <input name=\"gst\" required ng-model=\"contract.gst\"> <div ng-messages=\"saleInfo.gst.$error\"> <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div> </div> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"contract_summary_total\" | translate}}</label> <input name=\"total\" required ng-model=\"contract.total\"> <div ng-messages=\"saleInfo.total.$error\"> <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div> </div> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"contract_summary_currency\" | translate}}</label> <input name=\"currency\" required ng-model=\"contract.currency\"> <div ng-messages=\"saleInfo.currency.$error\"> <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div> </div> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"contract_summary_description\" | translate}}</label> <input name=\"description\" ng-model=\"contract.description\"> </md-input-container> </div> </md-card-content>  </form> </md-content> <div layout=\"row\" layout-align=\"center center\"> <md-button flex=\"25\" class=\"md-raised\" ng-click=\"backToCar()\">{{\"contract_summary_cancel\" | translate}}</md-button> <md-button flex=\"25\" class=\"md-raised md-primary\" ng-disabled=\"!saleInfo.$valid\" ng-click=\"saveContract(contract)\">{{\"contract_summary_save\" | translate}}</md-button> <div ng-messages=\"saleInfo.$error\" class=\"errorMessage\"> <div ng-message=\"required\">{{\"saleInfoRequiredFieldErrorMessage\" | translate}}.</div> </div> </div> </md-tab>"
  );


  $templateCache.put('modules/car/importSummary.html',
    "<md-tab label=\"{{'tab_import_summary' | translate}}\"> <md-content class=\"md-padding\"> <form name=\"importInfo\"> <div layout=\"column\"> <div layout=\"row\"> <md-card flex=\"100\"> <md-card-content> <div layout=\"row\" layout-wrap> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"summary_import_transportationExpense\" | translate}}</label> <input name=\"transportationExpense\" required ng-model=\"importSummary.transportationExpense\"> <div ng-messages=\"importInfo.transportationExpense.$error\"> <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}</div> </div> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"summary_import_transportCompany\" | translate}}</label> <input name=\"transportCompany\" required ng-model=\"importSummary.transportCompany\"> <div ng-messages=\"importInfo.transportCompany.$error\"> <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div> </div> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"summary_import_eta\" | translate}}</label> <input time=\"false\" date=\"true\" mdc-datetime-picker=\"\" type=\"text\" id=\"eta\" placeholder=\"eta\" ng-model=\"importSummary.eta\" class=\"md-input\"> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"summary_import_checkLocation\" | translate}}</label> <input name=\"checkLocation\" required ng-model=\"importSummary.checkLocation\"> <div ng-messages=\"importInfo.checkLocation.$error\"> <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div> </div> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"summary_import_createTime\" | translate}}</label> <input time=\"false\" date=\"true\" mdc-datetime-picker=\"\" type=\"text\" id=\"creatTime\" placeholder=\"Date\" ng-model=\"importSummary.createTime\" class=\"md-input\"> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"summary_import_totalDue\" | translate}}</label> <input name=\"totalDue\" required ng-model=\"importSummary.totalDue\"> <div ng-messages=\"importInfo.totalDue.$error\"> <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div> </div> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"summary_import_quantity\" | translate}}</label> <input name=\"quantity\" required ng-model=\"importRecord.quantity\"> <div ng-messages=\"importInfo.quantity.$error\"> <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div> </div> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"summary_import_amount\" | translate}}</label> <input name=\"amount\" required ng-model=\"importRecord.amount\"> <div ng-messages=\"importInfo.amount.$error\"> <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div> </div> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"summary_import_gst\" | translate}}</label> <input name=\"gst\" required ng-model=\"importRecord.gst\"> <div ng-messages=\"importInfo.gst.$error\"> <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div> </div> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"summary_import_total\" | translate}}</label> <input name=\"total\" required ng-model=\"importRecord.total\"> <div ng-messages=\"importInfo.total.$error\"> <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div> </div> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"summary_import_paymentStatus\" | translate}}</label> <input name=\"paymentStatus\" required ng-model=\"importRecord.paymentStatus\"> <div ng-messages=\"importInfo.paymentStatus.$error\"> <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div> </div> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"summary_import_currency\" | translate}}</label> <input name=\"currency\" ng-model=\"importRecord.currency\"> </md-input-container> <md-input-container flex=\"100\" class=\"md-block\"> <label>{{\"summary_import_description\" | translate}}</label> <input md-maxlength=\"100\" name=\"description\" ng-model=\"importRecord.description\"> <div ng-messages=\"importInfo.description.$error\"> <div ng-message=\"md-maxlength\">{{\"maxLength100Error\" | translate}}.</div> </div> </md-input-container> </div> </md-card-content> </md-card> </div> </div> </form> </md-content> </md-tab>"
  );


  $templateCache.put('modules/car/maintenanceRecordDetails.html',
    "<form name=\"maintanceSummary\"> <div layout=\"row\"> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"maintenance_record_carId\" | translate}}</label> <input name=\"contractNum\" required disabled ng-model=\"maintenanceRecord.carId\" ng-readonly=\"maintenanceRecord.carId\"> <div ng-messages=\"maintanceSummary.contractNum.$error\"> <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div> </div> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"maintenance_record_currency\" | translate}}</label> <md-select ng-model=\"selectedMaintenanceCurrency\" ng-change=\"maintenanceCurrencyChanged(selectedMaintenanceCurrency)\"> <md-optgroup label=\"Currency\"> <md-option ng-repeat=\"item in carCurrency\" value=\"{{item}}\"> {{item}} </md-option> </md-optgroup></md-select> </md-input-container> <!-- <md-input-container flex=\"50\" class=\"md-block\">\r" +
    "\n" +
    "    <label>{{\"maintenance_record_currency\" | translate}}</label>\r" +
    "\n" +
    "    <input name=\"currency\" required ng-model=\"maintenanceRecord.currency\">\r" +
    "\n" +
    "    <div ng-messages=\"maintanceSummary.currency.$error\">\r" +
    "\n" +
    "      <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    </md-input-container> --> </div> <div layout=\"row\"> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"maintenance_record_projectCategory\" | translate}}</label> <input name=\"deposite\" required ng-model=\"maintenanceRecord.projectCategory\"> <div ng-messages=\"maintanceSummary.deposite.$error\"> <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div> </div> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"maintenance_record_projectName\" | translate}}</label> <input name=\"projectName\" required ng-model=\"maintenanceRecord.projectName\"> <div ng-messages=\"maintanceSummary.projectName.$error\"> <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div> </div> </md-input-container> </div> <div layout=\"row\"> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"maintenance_record_address_street\" | translate}}</label> <input name=\"street\" ng-model=\"maintenanceRecord.street\"> <div ng-messages=\"maintanceSummary.street.$error\"> <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div> </div> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"maintenance_record_address_city\" | translate}}</label> <input name=\"city\" ng-model=\"maintenanceRecord.city\"> <div ng-messages=\"maintanceSummary.city.$error\"> <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div> </div> </md-input-container> </div> <div layout=\"row\"> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"maintenance_record_totalPrice\" | translate}}</label> <input name=\"balance\" ng-model=\"maintenanceRecord.total\"> <div ng-messages=\"maintanceSummary.balance.$error\"> <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div> </div> </md-input-container> </div> <div layout=\"row\"> <md-input-container flex=\"100\" class=\"md-block\"> <label>{{\"maintenance_record_description\" | translate}}</label> <textarea ng-model=\"maintenanceRecord.description\" md-maxlength=\"150\" rows=\"5\" md-select-on-focus></textarea> </md-input-container> <!-- <md-input-container flex=\"100\" class=\"md-block\">\r" +
    "\n" +
    "    <label>{{\"maintenance_record_description\" | translate}}</label>\r" +
    "\n" +
    "    <input name=\"description\" ng-model=\"maintenanceRecord.description\">\r" +
    "\n" +
    "    <div ng-messages=\"maintanceSummary.description.$error\">\r" +
    "\n" +
    "      <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    </md-input-container>  --> </div> </form>{{\"maintenance_record_paymentStatus\" | translate}} &nbsp; <md-checkbox flex=\"50\" class=\"md-block\" ng-model=\"maintenanceRecord.paymentStatus\" aria-label=\"contract\"> {{maintenanceRecord.paymentStatus?('payment_paid' | translate):('payment_unpaid' | translate)}} </md-checkbox> <div layout=\"row\" layout-align=\"center center\"> <!-- <md-button flex=\"25\" class=\"md-raised\" ng-click=\"cancelToMaintenanceRecordList()\" ng-hide=\"saveStatus()\">{{\"maintenance_record_cancelMaintenanceRecord\" | translate}}</md-button> --> <md-button flex=\"25\" class=\"md-raised\" ng-click=\"backToMaintenanceRecordList()\">{{\"maintenance_record_backMaintenanceRecord\" | translate}}</md-button> <md-button flex=\"25\" class=\"md-raised md-primary\" ng-disabled=\"!maintanceSummary.$valid\" ng-click=\"saveMaintenance(maintenanceRecord)\">{{\"maintenance_record_saveMaintenanceRecord\" | translate}}</md-button> <!-- <div ng-messages=\"maintanceSummary.$error\" class=\"errorMessage\">\r" +
    "\n" +
    "      <div ng-message=\"required\">{{\"requiredFieldValidationErrorMessage\" | translate}}.</div>\r" +
    "\n" +
    "  </div> --> </div>"
  );


  $templateCache.put('modules/car/maintenanceRecordList.html',
    "<md-tab label=\"{{'tab_maintenance_record' | translate}}\"> <md-content class=\"md-padding\"> <div layout=\"row\" layout-align=\"center\" ng-if=\"!showMaintenanceReordDetails\"> <md-button flex=\"25\" class=\"md-raised md-primary\" ng-click=\"addMaintenanceRecord()\">{{\"maintenance_record_addMaintenanceRecord\" | translate}}</md-button> </div> <div layout=\"column\" ng-if=\"!showMaintenanceReordDetails\"> <!-- <div layout=\"row\"> --> <md-card flex=\"100\" ng-repeat=\"record in maintenanceRecords\"> <md-card-content layout=\"row\" layout-wrap> <md-list-item class=\"md-3-line\"> <md-icon class=\"md-avatar\" md-svg-icon=\"avatars:svg-1\"></md-icon> <div class=\"md-list-item-text\" layout=\"column\"> <h3 flex>{{::record.projectName}}&nbsp;{{::record.projectCategory}}</h3> <h4 flex>{{::record.description}}</h4> <h4 flex>{{::record.total | currency}}</h4> <h4 flex>{{record.paymentStatus?('payment_paid' | translate):('payment_unpaid' | translate)}}</h4> </div> <md-button class=\"md-secondary\" ng-click=\"editMaintenanceRecord(record)\">{{\"maintenance_record_editMaintenanceRecord\" | translate}}</md-button> </md-list-item> </md-card-content> </md-card> <!-- </div> --> </div> <maintenance-record-details ng-if=\"showMaintenanceReordDetails\"></maintenance-record-details> </md-content> </md-tab>"
  );


  $templateCache.put('modules/car/vehicleSummary.html',
    "<md-tab label=\"{{'tab_vehicle_summary' | translate}}\"> <div layout=\"column\"> <div layout=\"row\"> <md-card flex=\"50\"> <md-subheader class=\"md-primary\">{{\"summary_feature_title\" | translate}}</md-subheader> <md-card-content> <form layout=\"row\" layout-wrap name=\"carSummary\"> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"summary_feature_carId\" | translate}}</label> <input name=\"carId\" disabled ng-model=\"car.carId\"> <div ng-messages=\"carSummary.carId.$error\"> <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div> </div> </md-input-container> <!-- <md-input-container flex=\"50\" class=\"md-block\">\r" +
    "\n" +
    "                    <label>{{\"summary_feature_wofTime\" | translate}}</label>\r" +
    "\n" +
    "                    <input time=\"false\" date=\"true\" mdc-datetime-picker=\"\" type=\"text\" id=\"wofTime\" placeholder=\"Date\" ng-model=\"car.wofTime\" class=\" md-input\">\r" +
    "\n" +
    "                  </md-input-container> --> <md-input-container class=\"eae-form-input-required md-input-has-placeholder flex md-input-has-value\" flex=\"\"> <label>{{\"summary_feature_wofTime\" | translate}}</label> <input ng-model=\"car.wofTime\" required name=\"wofTime\" minlength=\"8\" maxlength=\"10\" placeholder=\"MM/DD/YYYY\" ng-pattern=\"/(0[1-9]|1[012])[- \\/.](0[1-9]|[12][0-9]|3[01])[- \\/.](19|20)\\d\\d/\"> <div ng-messages=\"carSummary.wofTime.$error\" ng-show=\"carSummary.wofTime.$invalid\"> Please enter a valid date (MM/DD/YYYY). </div> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"summary_feature_registerationNum\" | translate}}</label> <input name=\"registerationNum\" required md-maxlength=\"50\" ng-model=\"car.registerationNum\"> <div ng-messages=\"carSummary.registerationNum.$error\"> <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div> <div ng-message=\"md-maxlength\">The Registeration Number must be less than 50 characters long.</div> </div> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"summary_feature_warranty\" | translate}}</label> <!-- warranty-Suffix --> <input name=\"warranty\" type=\"number\" required ng-model=\"car.warranty\"> <div ng-messages=\"carSummary.warranty.$error\"> <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div> </div> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"summary_feature_odometer\" | translate}}</label> <input name=\"odometer\" type=\"number\" required ng-model=\"car.odometer\"> <div ng-messages=\"carSummary.odometer.$error\"> <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div> </div> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"summary_feature_color\" | translate}}</label> <input name=\"color\" required md-maxlength=\"20\" ng-model=\"car.color\"> <div ng-messages=\"carSummary.color.$error\"> <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div> <div ng-message=\"md-maxlength\">Color must be less than 20 characters long.</div> </div> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"summary_feature_vin\" | translate}}</label> <input name=\"vin\" required md-maxlength=\"50\" ng-model=\"car.vin\"> <div ng-messages=\"carSummary.vin.$error\"> <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div> <div ng-message=\"md-maxlength\">Vin number must be less than 50 characters long.</div> </div> </md-input-container> <!--  <md-input-container flex=\"50\" class=\"md-block\">\r" +
    "\n" +
    "                    <label>Body Type</label>\r" +
    "\n" +
    "                    <input name=\"bodyType\" required ng-model=\"vehicleModel.bodyType\">\r" +
    "\n" +
    "                    <div ng-messages=\"carSummary.bodyType.$error\">\r" +
    "\n" +
    "                      <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                  </md-input-container> --> <!-- <md-input-container flex=\"50\" class=\"md-block\">\r" +
    "\n" +
    "                    <label>{{\"summary_feature_paymentStatus\" | translate}}</label>\r" +
    "\n" +
    "                    <input name=\"paymentStatus\" required ng-model=\"car.paymentStatus\">\r" +
    "\n" +
    "                    <div ng-messages=\"carSummary.paymentStatus.$error\">\r" +
    "\n" +
    "                      <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                  </md-input-container> --> <!-- <md-input-container flex=\"50\" class=\"md-block\">\r" +
    "\n" +
    "                    <label>{{\"summary_feature_length\" | translate}}</label>\r" +
    "\n" +
    "                    <input name=\"length\" required ng-model=\"car.length\">\r" +
    "\n" +
    "                    <div ng-messages=\"carSummary.length.$error\">\r" +
    "\n" +
    "                      <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                  </md-input-container>\r" +
    "\n" +
    "                  <md-input-container flex=\"50\" class=\"md-block\">\r" +
    "\n" +
    "                    <label>{{\"summary_feature_width\" | translate}}</label>\r" +
    "\n" +
    "                    <input name=\"width\" required ng-model=\"car.width\">\r" +
    "\n" +
    "                    <div ng-messages=\"carSummary.width.$error\">\r" +
    "\n" +
    "                      <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                  </md-input-container>\r" +
    "\n" +
    "                  <md-input-container flex=\"50\" class=\"md-block\">\r" +
    "\n" +
    "                    <label>{{\"summary_feature_height\" | translate}}</label>\r" +
    "\n" +
    "                    <input name=\"height\" required ng-model=\"car.height\">\r" +
    "\n" +
    "                    <div ng-messages=\"carSummary.height.$error\">\r" +
    "\n" +
    "                      <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                  </md-input-container> --> <!-- <md-input-container flex=\"50\" class=\"md-block\">\r" +
    "\n" +
    "                    <label>{{\"summary_feature_carStatus\" | translate}}</label>\r" +
    "\n" +
    "                    <input name=\"carStatus\" required ng-model=\"car.carStatus\">\r" +
    "\n" +
    "                    <div ng-messages=\"carSummary.carStatus.$error\">\r" +
    "\n" +
    "                      <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                  </md-input-container> --> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"summary_feature_carComment\" | translate}} (Optional)</label> <input name=\"carComment\" ng-model=\"car.carComment\"> </md-input-container> <!-- <md-input-container flex=\"50\" class=\"md-block\">\r" +
    "\n" +
    "                    <label>{{\"summary_feature_price\" | translate}}</label>\r" +
    "\n" +
    "                    <input name=\"price\" required ng-model=\"car.price\">\r" +
    "\n" +
    "                    <div ng-messages=\"carSummary.price.$error\">\r" +
    "\n" +
    "                      <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                  </md-input-container> --> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"summary_feature_total\" | translate}}</label> <input name=\"total\" type=\"number\" required ng-model=\"car.total\"> <div ng-messages=\"carSummary.total.$error\"> <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div> </div> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"summary_feature_gst\" | translate}}</label> <input name=\"gst\" type=\"number\" required ng-model=\"car.gst\"> <div ng-messages=\"carSummary.gst.$error\"> <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div> </div> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"summary_feature_currency\" | translate}}</label> <md-select ng-model=\"selectedcarCurrency\" ng-change=\"currencyChanged(selectedcarCurrency)\"> <md-optgroup label=\"Currency\"> <md-option ng-repeat=\"item in carCurrency\" value=\"{{item}}\"> {{item}} </md-option> </md-optgroup></md-select> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"summary_feature_carStatus\" | translate}}</label> <md-select ng-model=\"selectedcarStatus\" ng-change=\"statusChanged(selectedcarStatus)\"> <md-optgroup label=\"Car Status\"> <md-option ng-repeat=\"item in carStatusList\" value=\"{{item}}\"> {{item}} </md-option> </md-optgroup></md-select> </md-input-container> <!-- Input for description\r" +
    "\n" +
    "                  <md-input-container flex=\"50\" class=\"md-block\">\r" +
    "\n" +
    "                    <label>{{\"summary_feature_description\" | translate}}</label>\r" +
    "\n" +
    "                    <input name=\"carDescription\" required ng-model=\"car.description\">\r" +
    "\n" +
    "                    <div ng-messages=\"carSummary.carDescription.$error\">\r" +
    "\n" +
    "                      <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                  </md-input-container> --> <!-- Textarea for description. I prefer this one--> <md-input-container flex=\"100\" class=\"md-block carDescription\"> <label>{{\"summary_feature_description\" | translate}} (Optional)</label> <textarea ng-model=\"car.description\" rows=\"5\" md-select-on-focus></textarea> </md-input-container> <!-- Text angular for description. Cannot show binded ng-model when refresh the page. \r" +
    "\n" +
    "                  <md-input-container flex=\"100\" class=\"md-block\">\r" +
    "\n" +
    "                    <label>{{\"summary_feature_description\" | translate}}</label>\r" +
    "\n" +
    "                    <text-angular flex=\"100\" ng-model=\"car.description\" ta-toolbar=\"[]\">\r" +
    "\n" +
    "                    </text-angular>\r" +
    "\n" +
    "                  </md-input-container> --> <div class=\"checkBox\" flex=\"100\" style=\"margin-top:0\"> {{\"maintenance_record_paymentStatus\" | translate}} &nbsp; <md-checkbox class=\"md-block\" ng-model=\"car.paymentStatus\" aria-label=\"paymentStatus\"> {{car.paymentStatus ?'Paid':'Unpaid'}} </md-checkbox> </div> </form> </md-card-content> </md-card> <md-card flex=\"50\"> <md-subheader class=\"md-primary\">{{\"summary_vehicleInfo_title\" | translate}}</md-subheader> <md-card-content> <form layout=\"row\" layout-wrap name=\"vehicleInfo\"> <div flex=\"100\" class=\"searchBar\" ng-if=\"isVehicleModelListLoaded\" layout=\"row\"> <span flex=\"70\"> <md-autocomplete md-selected-item=\"selectVehicle\" md-search-text=\"modelSearchText\" md-selected-item-change=\"selectedItemChange(selectVehicle)\" md-items=\"item in vehicleModelList | filter:modelSearchText\" md-item-text=\"item.makerName+' '+item.model+' '+item.year\" md-min-length=\"0\" md-max-length=\"10\" placeholder=\"{{'summary_vehicleInfo_searchText' | translate }}\" style=\"color:#333\"> <md-item-template> <span md-highlight-text=\"modelSearchText\">{{item.makerName+' '+item.model+' '+item.year}} </span> </md-item-template> </md-autocomplete> </span> <span flex=\"30\"> <md-button class=\"md-raised md-primary add-model-button\" ng-click=\"createNewVehicleModel()\">Add New Model</md-button> </span> </div> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"summary_vehicleInfo_makerName\" | translate}}</label> <input name=\"makerName\" ng-disabled=\"!newVehicleModel\" required ng-model=\"vehicleModel.makerName\"> <div ng-messages=\"vehicleInfo.makerName.$error\"> <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div> </div> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"summary_vehicleInfo_model\" | translate}}</label> <input name=\"model\" ng-disabled=\"!newVehicleModel\" required ng-model=\"vehicleModel.model\"> <div ng-messages=\"vehicleInfo.description.$error\"> <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div> </div> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"summary_vehicleInfo_year\" | translate}}</label> <input name=\"year\" type=\"number\" ng-disabled=\"!newVehicleModel\" required ng-model=\"vehicleModel.year\"> <div ng-messages=\"vehicleInfo.year.$error\"> <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div> </div> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"summary_vehicleInfo_engine\" | translate}}</label> <input name=\"engine\" ng-disabled=\"!newVehicleModel\" required ng-model=\"vehicleModel.engine\"> <div ng-messages=\"vehicleInfo.engine.$error\"> <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div> </div> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"summary_vehicleInfo_fuel\" | translate}}</label> <input name=\"fuel\" ng-disabled=\"!newVehicleModel\" required ng-model=\"vehicleModel.fuel\"> <div ng-messages=\"vehicleInfo.fuel.$error\"> <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div> </div> </md-input-container> <!-- <md-input-container flex=\"50\" class=\"md-block\">\r" +
    "\n" +
    "                    <label>{{\"summary_vehicleInfo_fuelEconomyCity\" | translate}}</label>\r" +
    "\n" +
    "                    <input name=\"fuelEconomyCity\" ng-disabled=\"!newVehicleModel\" required ng-model=\"vehicleModel.fuelEconomyCity\">\r" +
    "\n" +
    "                    <div ng-messages=\"vehicleInfo.fuelEconomyCity.$error\">\r" +
    "\n" +
    "                      <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                  </md-input-container>\r" +
    "\n" +
    "                   <md-input-container flex=\"50\" class=\"md-block\">\r" +
    "\n" +
    "                    <label>{{\"summary_vehicleInfo_fuelEconomyHwy\" | translate}}</label>\r" +
    "\n" +
    "                    <input name=\"fuelEconomyHwy\" ng-disabled=\"!newVehicleModel\" required ng-model=\"vehicleModel.fuelEconomyHwy\">\r" +
    "\n" +
    "                    <div ng-messages=\"vehicleInfo.fuelEconomyHwy.$error\">\r" +
    "\n" +
    "                      <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                  </md-input-container>\r" +
    "\n" +
    "                   <md-input-container flex=\"50\" class=\"md-block\">\r" +
    "\n" +
    "                    <label>{{\"summary_vehicleInfo_fuelEconomyMixed\" | translate}}</label>\r" +
    "\n" +
    "                    <input name=\"fuelEconomyMixed\" ng-disabled=\"!newVehicleModel\" required ng-model=\"vehicleModel.fuelEconomyMixed\">\r" +
    "\n" +
    "                    <div ng-messages=\"vehicleInfo.fuelEconomyMixed.$error\">\r" +
    "\n" +
    "                      <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                  </md-input-container> --> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"summary_vehicleInfo_origin\" | translate}}</label> <input name=\"origin\" ng-disabled=\"!newVehicleModel\" required ng-model=\"vehicleModel.origin\"> <div ng-messages=\"vehicleInfo.origin.$error\"> <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div> </div> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"summary_vehicleInfo_bodyType\" | translate}}</label> <md-select ng-disabled=\"!newVehicleModel\" ng-model=\"selectedcarBodyType\" ng-change=\"bodyTypeChanged(selectedcarBodyType)\"> <md-optgroup label=\"Body Type\"> <md-option ng-repeat=\"item in carBodyType\" value=\"{{item}}\"> {{item}} </md-option> </md-optgroup></md-select> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"summary_vehicleInfo_transmission\" | translate}}</label> <input name=\"transmission\" ng-disabled=\"!newVehicleModel\" required ng-model=\"vehicleModel.transmission\"> <div ng-messages=\"vehicleInfo.transmission.$error\"> <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div> </div> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"summary_vehicleInfo_seats\" | translate}}</label> <input name=\"seats\" type=\"number\" ng-disabled=\"!newVehicleModel\" required ng-model=\"vehicleModel.seats\"> <div ng-messages=\"vehicleInfo.seats.$error\"> <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div> </div> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"summary_vehicleInfo_doors\" | translate}}</label> <input name=\"doors\" type=\"number\" ng-disabled=\"!newVehicleModel\" required ng-model=\"vehicleModel.doors\"> <div ng-messages=\"vehicleInfo.doors.$error\"> <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div> </div> </md-input-container> <!-- <md-input-container flex=\"50\" class=\"md-block\">\r" +
    "\n" +
    "                    <label>{{\"summary_vehicleInfo_weight\" | translate}}</label>\r" +
    "\n" +
    "                    <input name=\"weight\" ng-disabled=\"!newVehicleModel\" required ng-model=\"vehicleModel.weight\">\r" +
    "\n" +
    "                    <div ng-messages=\"vehicleInfo.weight.$error\">\r" +
    "\n" +
    "                      <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                  </md-input-container> --> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"summary_vehicleInfo_driveTrain\" | translate}}</label> <input name=\"driveTrain\" ng-disabled=\"!newVehicleModel\" ng-model=\"vehicleModel.driveTrain\"> </md-input-container> </form> </md-card-content> </md-card> </div> <!-- <md-card flex=\"100\" ng-show=\"newCar\">\r" +
    "\n" +
    "              <md-subheader class=\"md-primary\">Batch Info</md-subheader>\r" +
    "\n" +
    "              <md-card-content>\r" +
    "\n" +
    "                 <div layout=\"row\">\r" +
    "\n" +
    "                  <span flex=\"80\">\r" +
    "\n" +
    "                    <md-autocomplete\r" +
    "\n" +
    "                      ng-disabled=\" !(vehicleInfo.$valid)\"\r" +
    "\n" +
    "                      md-selected-item=\"selectedImport\"\r" +
    "\n" +
    "                      md-search-text=\"importSearchText\"\r" +
    "\n" +
    "                      md-items=\"import in imports | filter:importSearchText\"\r" +
    "\n" +
    "                      md-selected-item-change=\"selectedImportChange(selectedImport)\"\r" +
    "\n" +
    "                      md-item-text=\"'Company: '+import.transportCompany+', Batch ID: '+import.batchId\"\r" +
    "\n" +
    "                      md-min-length=\"0\"\r" +
    "\n" +
    "                      md-max-length=\"10\"\r" +
    "\n" +
    "                      placeholder=\"Enter batch Id to search\" style=\"color:#333;\">\r" +
    "\n" +
    "                      <md-item-template>\r" +
    "\n" +
    "                        <span md-highlight-text=\"importSearchText\">{{'Company: '+import.transportCompany+', Batch ID: '+import.batchId}}</span>\r" +
    "\n" +
    "                      </md-item-template>\r" +
    "\n" +
    "                    </md-autocomplete>\r" +
    "\n" +
    "                  </span>\r" +
    "\n" +
    "                   <span flex=\"20\">\r" +
    "\n" +
    "                     <md-button class=\"md-raised md-primary\" ng-click=\"createBatch()\" ng-disabled=\"!(vehicleInfo.$valid)\">New batch</md-button>\r" +
    "\n" +
    "                   </span>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "              </md-card-content>\r" +
    "\n" +
    "            </md-card> --> </div> </md-tab>"
  );


  $templateCache.put('modules/consignment/consignment.details.html',
    "<div> <div layout=\"row\"> <md-card flex=\"50\"> <md-subheader class=\"md-primary\">{{\"consignment_details_transportationDetails_title\" | translate}}</md-subheader> <md-card-content> <div layout=\"row\" layout-wrap> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"batchId\" | translate}}</label> <input required ng-model=\"batch.batchId\" disabled> <div ng-messages=\"projectForm.description.$error\"> <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div> <div ng-message=\"md-maxlength\">{{\"maxLength30Error\" | translate}}.</div> </div> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"transportationExpense\" | translate}}</label> <input required ng-model=\"batch.transportationExpense\"> <div ng-messages=\"projectForm.description.$error\"> <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div> <div ng-message=\"md-maxlength\">{{\"maxLength30Error\" | translate}}.</div> </div> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"transportCompany\" | translate}}</label> <input required ng-model=\"batch.transportCompany\"> <div ng-messages=\"projectForm.description.$error\"> <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div> <div ng-message=\"md-maxlength\">{{\"maxLength30Error\" | translate}}.</div> </div> </md-input-container> </div> </md-card-content> </md-card> <md-card flex=\"50\"> <md-subheader class=\"md-primary\"> &nbsp;</md-subheader> <md-card-content> <div layout=\"row\" layout-wrap> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"consignment_details_transportationDetails_checkLocation\" | translate}}</label> <input required ng-model=\"batch.checkLocation\"> <div ng-messages=\"projectForm.description.$error\"> <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div> <div ng-message=\"md-maxlength\">{{\"maxLength30Error\" | translate}}.</div> </div> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"consignment_details_transportationDetails_totalDue\" | translate}}</label> <input required ng-model=\"batch.totalDue\"> <div ng-messages=\"projectForm.description.$error\"> <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div> <div ng-message=\"md-maxlength\">{{\"maxLength30Error\" | translate}}.</div> </div> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"consignment_details_transportationDetails_eta\" | translate}}</label> <input time=\"false\" date=\"true\" mdc-datetime-picker=\"\" type=\"text\" id=\"eta\" placeholder=\"ETA\" ng-model=\"batch.eta\" class=\"md-input\"> </md-input-container> </div> </md-card-content> </md-card> </div> <div> <md-card flex-gt-sm=\"90\" flex-gt-md=\"80\" ng-hide=\"newBatch\"> <md-card-content> <div layout=\"row\"> <span flex=\"90\"> <md-autocomplete md-selected-item=\"selectedCar\" md-search-text=\"carSearchText\" md-items=\"item in cars | filter:carSearchText\" md-selected-item-change=\"selectedItemChange(selectedCar)\" md-item-text=\"item.vin\" md-min-length=\"0\" md-max-length=\"10\" placeholder=\"Enter Vin Number to Search Cars\" style=\"color:#333\"> <md-item-template> <span md-highlight-text=\"carSearchText\">{{'Vin number: '+item.vin+', Model: '+item.makerName+' '+item.model+' '+item.year}}</span> </md-item-template> <div ng-messages=\"searchForm.autocompleteField.$error\" ng-if=\"searchForm.autocompleteField.$touched\"> <div ng-message=\"required\">You <b>must</b> Enter a vehicle ID.</div> <div ng-message=\"minlength\">Your entry is not long enough.</div> <div ng-message=\"maxlength\">Your entry is too long.</div> </div> </md-autocomplete> </span> <span flex=\"10\"> <md-button class=\"md-raised md-primary\" ng-click=\"saveCarToBatch(carToAdd)\">{{\"add\" | translate}}</md-button> </span> </div> </md-card-content> </md-card> <md-card flex-gt-sm=\"90\" flex-gt-md=\"80\" ng-repeat=\"importRecord in importRecords\"> <md-card-content layout=\"row\" layour-align=\"space-between center\"> <md-list-item class=\"md-3-line\" flex=\"80\"> <md-icon class=\"md-avatar\" md-svg-icon=\"avatars:svg-1\"></md-icon> <div class=\"md-list-item-text\" layout=\"column\"> <h3>CardId: {{::importRecord.carId}}</h3> <p>Quantity: {{::importRecord.quantity}}</p> <p>Amount: {{::importRecord.amount}}</p> </div> </md-list-item> <md-card-actions layout=\"column\" layout-align=\"end center\" flex=\"20\"> <md-button class=\"md-raised md-primary\" ng-click=\"editImportRecord(importRecord)\">{{\"viewMore\" | translate}}</md-button> <md-button class=\"md-raised md-primary\" ng-click=\"deleteImportRecord(importRecord.carId)\">{{\"delete\" | translate}}</md-button> </md-card-actions> </md-card-content> </md-card> </div> <div layout=\"row\" layout-align=\"center\"> <md-button flex=\"25\" class=\"md-raised\" ng-click=\"backToConsignment()\">{{\"cancel\" | translate}}</md-button> <md-button flex=\"25\" class=\"md-raised md-primary\" ng-click=\"saveBatch(batch)\">{{\"save\" | translate}}</md-button> </div> </div>"
  );


  $templateCache.put('modules/consignment/consignment.html',
    "<!--   <div layout=\"row\">\r" +
    "\n" +
    "    <md-card flex>\r" +
    "\n" +
    "      <md-card-content>\r" +
    "\n" +
    "        <p class=\"md-display-2 font-weight-100 margin-top-10 margin-bottom-0 ng-scope ng-isolate-scope\" count-to=\"{{countToPaid}}\" value=\"{{countFromPaid}}\" duration=\"1.5\" decimals=\"0\"></p>\r" +
    "\n" +
    "        <p class=\"md-body-2 opacity-60 margin-top-0 margin-bottom-10 ng-scope\" translate=\"\">Paid Funds</p>\r" +
    "\n" +
    "      </md-card-content>\r" +
    "\n" +
    "    </md-card>\r" +
    "\n" +
    "    <md-card flex>\r" +
    "\n" +
    "      <md-card-content>\r" +
    "\n" +
    "        <p class=\"md-display-2 font-weight-100 margin-top-10 margin-bottom-0 ng-scope ng-isolate-scope\" count-to=\"{{countToPaid}}\" value=\"{{countFromPaid}}\" duration=\"1.5\" decimals=\"0\"></p>\r" +
    "\n" +
    "        <p class=\"md-body-2 opacity-60 margin-top-0 margin-bottom-10 ng-scope\" translate=\"\">Unpaid Funds</p>\r" +
    "\n" +
    "      </md-card-content>\r" +
    "\n" +
    "    </md-card>\r" +
    "\n" +
    "    <md-card flex>\r" +
    "\n" +
    "      <md-card-content>\r" +
    "\n" +
    "        <p class=\"md-display-2 font-weight-100 margin-top-10 margin-bottom-0 ng-scope ng-isolate-scope\" count-to=\"{{countToPaid}}\" value=\"{{countFromPaid}}\" duration=\"1.5\" decimals=\"0\" options=\"{ prefix: '$' }\"></p>\r" +
    "\n" +
    "        <p class=\"md-body-2 opacity-60 margin-top-0 margin-bottom-10 ng-scope\" translate=\"\">Total Sales</p>\r" +
    "\n" +
    "      </md-card-content>\r" +
    "\n" +
    "    </md-card>\r" +
    "\n" +
    "    <md-card flex>\r" +
    "\n" +
    "      <md-card-content>\r" +
    "\n" +
    "        <p class=\"md-display-2 font-weight-100 margin-top-10 margin-bottom-0 ng-scope ng-isolate-scope\" count-to=\"{{countToPaid}}\" value=\"{{countFromPaid}}\" duration=\"1.5\" decimals=\"0\" options=\"{ prefix: '$' }\"></p>\r" +
    "\n" +
    "        <p class=\"md-body-2 opacity-60 margin-top-0 margin-bottom-10 ng-scope\" translate=\"\">Total Sales</p>\r" +
    "\n" +
    "      </md-card-content>\r" +
    "\n" +
    "    </md-card>\r" +
    "\n" +
    "  </div>\r" +
    "\n" +
    " --> <div ng-hide=\"$state.current.name === 'consignment.details'\"> <div layout=\"row\" layout-align=\"center\"> <md-button flex=\"25\" class=\"md-raised md-primary\" ng-click=\"createImport()\">{{\"addNewBatch\" | translate}}</md-button> </div> <md-card> <md-card-content> <md-table-container> <table md-table md-row-select=\"options.rowSelection\" ng-model=\"selected\" md-progress=\"promise\"> <thead md-head md-order=\"query.order\" md-on-reorder> <tr md-row> <th md-column md-order-by=\"batchId\"><span>{{\"batchId\" | translate}}</span></th> <th md-column md-order-by=\"makerName\"><span>{{\"transportCompany\" | translate}}</span></th> <th md-column md-order-by=\"model\" md-desc><span>{{\"arriveLocation\" | translate}}</span></th> <th md-column md-order-by=\"model\" md-desc><span>{{\"shippingExpense\" | translate}}</span></th> <th md-column md-numeric md-order-by=\"year\"><span>{{\"arriveTime\" | translate}}</span></th> </tr> </thead> <tbody md-body> <tr ng-click=\"editImport(import)\" md-row md-select=\"import\" md-on-select ng-repeat=\"import in imports | filter: filter.search | orderBy: query.order | limitTo: query.limit : (query.page -1) * query.limit\"> <td md-cell>{{::import.batchId}} </td><td md-cell>{{::import.transportCompany}} </td><td md-cell>{{::import.checkLocation}}</td> <td md-cell>{{::import.transportationExpense | currency}}</td> <td md-cell>{{::import.eta | amDateFormat:'dddd , Do MMMM YYYY'}}</td> </tr> </tbody> </table> </md-table-container> <md-table-pagination md-limit=\"query.limit\" md-page=\"query.page\" md-total=\"{{imports.length}}\" md-page-select=\"options.pageSelector\" md-boundary-links=\"options.boundaryLinks\" md-on-paginate></md-table-pagination> </md-card-content> </md-card> </div> <div layout=\"column\" ui-view=\"consignment-details-view\"> </div>"
  );


  $templateCache.put('modules/customer/customer.details.html',
    "<div layout=\"column\"> <div layout=\"row\"> <md-card flex=\"50\"> <md-subheader class=\"md-primary\">{{\"tab_customer_details_info\" | translate}}</md-subheader> <md-card-content> <div layout=\"row\" layout-wrap> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"tab_customer_details_customerId\" | translate}}</label> <input required ng-model=\"customer.customerId\" ng-disabled=\"!newCustomer\"> <div ng-messages=\"projectForm.description.$error\"> <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div> <div ng-message=\"md-maxlength\">{{\"maxLength30Error\" | translate}}.</div> </div> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"tab_customer_details_title\" | translate}}</label> <input required ng-model=\"customer.title\"> <div ng-messages=\"projectForm.description.$error\"> <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div> <div ng-message=\"md-maxlength\">{{\"maxLength30Error\" | translate}}.</div> </div> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"tab_customer_details_firstName\" | translate}}</label> <input required ng-model=\"customer.firstName\"> <div ng-messages=\"projectForm.description.$error\"> <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div> <div ng-message=\"md-maxlength\">{{\"maxLength30Error\" | translate}}.</div> </div> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"tab_customer_details_lastName\" | translate}}</label> <input required ng-model=\"customer.lastName\"> <div ng-messages=\"projectForm.description.$error\"> <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div> <div ng-message=\"md-maxlength\">{{\"maxLength30Error\" | translate}}.</div> </div> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"tab_customer_details_mobile\" | translate}}</label> <input required ng-model=\"customer.mobile\"> <div ng-messages=\"projectForm.description.$error\"> <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div> <div ng-message=\"md-maxlength\">{{\"maxLength30Error\" | translate}}.</div> </div> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"tab_customer_details_emailAddress\" | translate}}</label> <input required ng-model=\"customer.emailAddress\"> <div ng-messages=\"projectForm.description.$error\"> <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div> <div ng-message=\"md-maxlength\">{{\"maxLength30Error\" | translate}}.</div> </div> </md-input-container> </div> </md-card-content> </md-card> <md-card flex=\"50\"> <md-subheader class=\"md-primary\"></md-subheader> <md-card-content> <div layout=\"row\" layout-wrap> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"tab_customer_details_occupation\" | translate}}</label> <input required ng-model=\"customer.occupation\"> <div ng-messages=\"projectForm.description.$error\"> <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div> <div ng-message=\"md-maxlength\">{{\"maxLength30Error\" | translate}}.</div> </div> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"tab_customer_details_driverLicense\" | translate}}</label> <input required ng-model=\"customer.driveLicense\"> <div ng-messages=\"projectForm.description.$error\"> <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div> <div ng-message=\"md-maxlength\">{{\"maxLength30Error\" | translate}}.</div> </div> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"tab_customer_details_dob\" | translate}}</label> <input time=\"false\" date=\"true\" mdc-datetime-picker=\"\" type=\"text\" id=\"dob\" placeholder=\"DOB\" ng-model=\"customer.dob\" class=\"md-input\"> </md-input-container> </div> </md-card-content> </md-card> </div> <md-card flex=\"100\"> <md-subheader class=\"md-primary\">{{\"tab_address_info\" | translate}}</md-subheader> <md-card-content layout=\"row\" layout-wrap> <md-input-container flex=\"50\" class=\"md-block\"> <label>Street Number</label> <input type=\"text\" g-places-autocomplete ng-model=\"customer.streetNum\"> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>Street Name</label> <input type=\"text\" g-places-autocomplete ng-model=\"customer.route\"> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>Suburb</label> <input type=\"text\" g-places-autocomplete ng-model=\"customer.suburb\"> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"tab_address_city\" | translate}}</label> <input type=\"text\" ng-model=\"customer.city\"> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"tab_address_state\" | translate}}</label> <input type=\"text\" ng-model=\"customer.state\"> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"tab_address_country\" | translate}}</label> <input type=\"text\" ng-model=\"customer.country\"> </md-input-container> <!-- <md-input-container flex=\"50\" class=\"md-block\">\r" +
    "\n" +
    "          <label>{{\"tab_address_street\" | translate}}</label>\r" +
    "\n" +
    "          <input type=\"text\" g-places-autocomplete ng-model=\"customer.street\" />\r" +
    "\n" +
    "        </md-input-container> --> </md-card-content> </md-card> <div layout=\"row\" layout-align=\"center\"> <md-button flex=\"25\" class=\"md-raised\" ng-click=\"backToCustomer()\">{{\"customer_details_cancel\" | translate}}</md-button> <md-button flex=\"25\" class=\"md-raised md-primary\" ng-click=\"saveCustomer(customer)\">{{\"customer_details_save\" | translate}}</md-button> </div> </div>"
  );


  $templateCache.put('modules/customer/customer.html',
    "<div class=\"\" ui-view=\"customer-details-view\"> <md-card flex-gt-sm=\"90\" flex-gt-md=\"70\" ng-repeat=\"customer in paginatedCustomers\"> <md-card-content> <md-list-item class=\"md-3-line\"> <md-icon class=\"md-avatar\" md-svg-icon=\"avatars:svg-1\"></md-icon> <div class=\"md-list-item-text\" layout=\"column\"> <h3 ng-click=\"editCustomer(customer)\">{{::customer.firstName}}&nbsp;{{::customer.lastName}}</h3> <h4>{{::customer.emailAddress}}</h4> <p>{{::customer.mobile}}</p> </div> </md-list-item> </md-card-content> </md-card> <div layout=\"row\" layout-align=\"center\"> <pagination ng-change=\"pageChanged()\" total-items=\"totalCustomers\" items-per-page=\"customersPerPage\" ng-model=\"pagination.currentPage\" max-size=\"totalPages\" class=\"pagination-sm\" boundary-links=\"true\"> </pagination> </div> </div>"
  );


  $templateCache.put('modules/employee/employee.details.html',
    "<div layout=\"column\"> <md-tabs md-dynamic-height md-border-bottom md-selected=\"selectedTab\"> <md-tab label=\"Employee Details\"> <div layout=\"row\"> <md-card flex=\"50\"> <md-subheader class=\"md-primary\">{{\"tab_employee_details_info\" | translate}}</md-subheader> <md-card-content> <div layout=\"row\" layout-wrap> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"tab_employee_details_employeeId\" | translate}}</label> <input required ng-model=\"employee.employeeId\" ng-disabled=\"!newEmployee\"> <div ng-messages=\"projectForm.description.$error\"> <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div> <div ng-message=\"md-maxlength\">{{\"maxLength30Error\" | translate}}.</div> </div> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"tab_employee_details_title\" | translate}}</label> <input required ng-model=\"employee.title\"> <div ng-messages=\"projectForm.description.$error\"> <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div> <div ng-message=\"md-maxlength\">{{\"maxLength30Error\" | translate}}.</div> </div> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"tab_employee_details_firstName\" | translate}}</label> <input required ng-model=\"employee.firstName\"> <div ng-messages=\"projectForm.description.$error\"> <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div> <div ng-message=\"md-maxlength\">{{\"maxLength30Error\" | translate}}.</div> </div> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"tab_employee_details_lastName\" | translate}}</label> <input required ng-model=\"employee.lastName\"> <div ng-messages=\"projectForm.description.$error\"> <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div> <div ng-message=\"md-maxlength\">{{\"maxLength30Error\" | translate}}.</div> </div> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"tab_employee_details_mobile\" | translate}}</label> <input required ng-model=\"employee.mobile\"> <div ng-messages=\"projectForm.description.$error\"> <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div> <div ng-message=\"md-maxlength\">{{\"maxLength30Error\" | translate}}.</div> </div> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"tab_employee_details_emailAddress\" | translate}}</label> <input required ng-model=\"employee.emailAddress\"> <div ng-messages=\"projectForm.description.$error\"> <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div> <div ng-message=\"md-maxlength\">{{\"maxLength30Error\" | translate}}.</div> </div> </md-input-container> </div> </md-card-content> </md-card> <md-card flex=\"50\"> <md-subheader class=\"md-primary\">{{\"tab_vehicle_model_info\" | translate}}</md-subheader> <md-card-content> <div layout=\"row\" layout-wrap> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"tab_vehicle_model_irdNumber\" | translate}}</label> <input required ng-model=\"employee.irdNumber\"> <div ng-messages=\"projectForm.description.$error\"> <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div> <div ng-message=\"md-maxlength\">{{\"maxLength30Error\" | translate}}.</div> </div> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"tab_vehicle_model_discount\" | translate}} (Number between 0-1)</label> <input required ng-model=\"employee.discount\"> <div ng-messages=\"projectForm.description.$error\"> <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div> <div ng-message=\"md-maxlength\">{{\"maxLength30Error\" | translate}}.</div> </div> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>Passport Number</label> <input required ng-model=\"employee.passportNumber\"> <div ng-messages=\"projectForm.description.$error\"> <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div> <div ng-message=\"md-maxlength\">{{\"maxLength30Error\" | translate}}.</div> </div> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>Identity Number</label> <input required ng-model=\"employee.identityNumber\"> <div ng-messages=\"projectForm.description.$error\"> <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div> <div ng-message=\"md-maxlength\">{{\"maxLength30Error\" | translate}}.</div> </div> </md-input-container> </div> </md-card-content> </md-card> </div> <md-card flex=\"100\"> <md-subheader class=\"md-primary\">{{\"tab_address_info\" | translate}}</md-subheader> <md-card-content layout=\"row\" layout-wrap> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"tab_address_street\" | translate}}</label> <input type=\"text\" g-places-autocomplete ng-model=\"employee.street\"> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"tab_address_city\" | translate}}</label> <input type=\"text\" ng-model=\"employee.city\"> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"tab_address_state\" | translate}}</label> <input type=\"text\" ng-model=\"employee.state\"> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"tab_address_country\" | translate}}</label> <input type=\"text\" ng-model=\"employee.country\"> </md-input-container> </md-card-content> </md-card> <div layout=\"row\" layout-align=\"center\"> <md-button flex=\"25\" class=\"md-raised\" ng-click=\"backToEmployee()\">{{\"employee_details_cancel\" | translate}}</md-button> <md-button flex=\"25\" class=\"md-raised md-primary\" ng-click=\"saveEmployee(employee)\">{{\"employee_details_save\" | translate}}</md-button> </div> </md-tab> <!-- <md-tab label=\"Salary Details\">\r" +
    "\n" +
    "        <md-card flex=\"100\">\r" +
    "\n" +
    "          <md-card-content>\r" +
    "\n" +
    "            <div layout=\"row\" layout-wrap>\r" +
    "\n" +
    "              <md-input-container flex=\"50\" class=\"md-block\">\r" +
    "\n" +
    "                <label>Hour Rate</label>\r" +
    "\n" +
    "                <input required ng-model=\"employeeSalary.hourRate\">\r" +
    "\n" +
    "                <div ng-messages=\"projectForm.description.$error\">\r" +
    "\n" +
    "                  <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div>\r" +
    "\n" +
    "                  <div ng-message=\"md-maxlength\">{{\"maxLength30Error\" | translate}}.</div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "              </md-input-container>\r" +
    "\n" +
    "              <md-input-container flex=\"50\" class=\"md-block\">\r" +
    "\n" +
    "                <label>Work Date</label>\r" +
    "\n" +
    "                <input required ng-model=\"employeeSalary.workDate\">\r" +
    "\n" +
    "                <div ng-messages=\"projectForm.description.$error\">\r" +
    "\n" +
    "                  <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div>\r" +
    "\n" +
    "                  <div ng-message=\"md-maxlength\">{{\"maxLength30Error\" | translate}}.</div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "              </md-input-container>\r" +
    "\n" +
    "              <md-input-container flex=\"50\" class=\"md-block\">\r" +
    "\n" +
    "                <label>Work Hours</label>\r" +
    "\n" +
    "                <input required ng-model=\"employeeSalary.workHours\">\r" +
    "\n" +
    "                <div ng-messages=\"projectForm.description.$error\">\r" +
    "\n" +
    "                  <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div>\r" +
    "\n" +
    "                  <div ng-message=\"md-maxlength\">{{\"maxLength30Error\" | translate}}.</div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "              </md-input-container>\r" +
    "\n" +
    "              <md-input-container flex=\"50\" class=\"md-block\">\r" +
    "\n" +
    "                <label>Total</label>\r" +
    "\n" +
    "                <input required ng-model=\"employeeSalary.total\">\r" +
    "\n" +
    "                <div ng-messages=\"projectForm.description.$error\">\r" +
    "\n" +
    "                  <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div>\r" +
    "\n" +
    "                  <div ng-message=\"md-maxlength\">{{\"maxLength30Error\" | translate}}.</div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "              </md-input-container>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "          </md-card-content>\r" +
    "\n" +
    "        </md-card>\r" +
    "\n" +
    "    </md-tab> --> </md-tabs> </div>"
  );


  $templateCache.put('modules/employee/employee.html',
    "<div ui-view=\"employee-details-view\"> <md-card flex-gt-sm=\"90\" flex-gt-md=\"70\" ng-repeat=\"employee in paginatedEmployees\" layout-align=\"center\"> <md-card-content> <md-list-item class=\"md-3-line\"> <md-icon class=\"md-avatar\" md-svg-icon=\"avatars:svg-1\"></md-icon> <div class=\"md-list-item-text\" layout=\"column\"> <h3 ng-click=\"editEmployee(employee)\">{{::employee.firstName}}&nbsp;{{::employee.lastName}}</h3> <h4>{{::employee.emailAddress}}</h4> <p>{{::employee.mobile}}</p> </div> </md-list-item> </md-card-content> </md-card> <div layout=\"row\" layout-align=\"center\"> <pagination ng-change=\"pageChanged()\" total-items=\"totalEmployees\" items-per-page=\"employeesPerPage\" ng-model=\"pagination.currentPage\" max-size=\"totalPages\" class=\"pagination-sm\" boundary-links=\"true\"> </pagination> </div> </div>"
  );


  $templateCache.put('modules/sales/sales.details.html',
    "<div layout=\"column\"> <div layout=\"row\"> <md-card flex=\"50\"> <md-subheader class=\"md-primary\">{{\"sales_details_contractDetails\" | translate}}</md-subheader> <md-card-content> <div layout=\"row\" layout-wrap> <md-input-container flex=\"100\" class=\"md-block contractSearchContainer\"> <label>{{\"carId\" | translate}}</label> <input required disabled ng-model=\"contract.carId\"> </md-input-container> <md-autocomplete flex=\"100\" ng-disabled=\"!newContact\" md-selected-item=\"selectedCar\" md-search-text=\"carSearchText\" md-items=\"car in cars | filter:carSearchText\" md-selected-item-change=\"selectedCarChange(selectedCar)\" md-item-text=\"car.vin\" md-min-length=\"0\" md-max-length=\"10\" placeholder=\"Enter Vin number to Search Car\" class=\"autoComplete\"> <md-item-template> <span md-highlight-text=\"carSearchText\">{{'Vin number: '+car.vin+', Model: '+car.makerName+' '+car.model+' '+item.year}}</span> </md-item-template> </md-autocomplete> <md-input-container flex=\"100\" class=\"md-block contractSearchContainer\"> <label>{{\"customerId\" | translate}}</label> <input required ng-model=\"contract.customerId\"> </md-input-container> <md-autocomplete flex=\"100\" md-selected-item=\"selectedCustomer\" md-search-text=\"customerSearchText\" md-items=\"customer in customers | filter:customerSearchText\" md-selected-item-change=\"selectedCustomerChange(selectedCustomer)\" md-item-text=\"customer.firstName +' '+customer.lastName\" md-min-length=\"0\" md-max-length=\"10\" placeholder=\"Enter CustomerId to Search Customer\" class=\"autoComplete\"> <md-item-template> <span md-highlight-text=\"customerSearchText\">{{'Id: '+customer.customerId+', Name: '+customer.firstName +' '+customer.lastName}}</span> </md-item-template> </md-autocomplete> <md-input-container flex=\"100\" class=\"md-block contractSearchContainer\"> <label>{{\"employeeId\" | translate}}</label> <input required ng-model=\"contract.employeeId\"> </md-input-container> <md-autocomplete flex=\"100\" md-selected-item=\"selectedEmployee\" md-search-text=\"employeeSearchText\" md-items=\"employee in employees | filter:employeeSearchText\" md-selected-item-change=\"selectedEmployeeChange(selectedEmployee)\" md-item-text=\"employee.firstName +' '+employee.lastName\" md-min-length=\"0\" md-max-length=\"10\" placeholder=\"Enter EmployeeId to Search Employee\"> <md-item-template> <span md-highlight-text=\"employeeSearchText\">{{'Id: '+employee.employeeId+', Name: '+employee.firstName +' '+employee.lastName}}</span> </md-item-template> </md-autocomplete> </div> </md-card-content> </md-card> <md-card flex=\"50\"> <md-card-content> <div layout=\"row\" layout-wrap> <div class=\"checkBox\" flex=\"100\"> <md-checkbox class=\"md-block\" ng-model=\"contract.paymentStatus\" aria-label=\"contract\"> {{contract.paymentStatus ?'Paid' :'Unpaid'}} </md-checkbox> </div> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"contractNumber\" | translate}}</label> <input required ng-model=\"contract.contractNum\"> <div ng-messages=\"projectForm.description.$error\"> <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div> <div ng-message=\"md-maxlength\">{{\"maxLength30Error\" | translate}}.</div> </div> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"deposite\" | translate}}</label> <input required ng-model=\"contract.deposite\"> <div ng-messages=\"projectForm.description.$error\"> <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div> <div ng-message=\"md-maxlength\">{{\"maxLength30Error\" | translate}}.</div> </div> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"price\" | translate}}</label> <input required ng-model=\"contract.price\"> <div ng-messages=\"projectForm.description.$error\"> <div ng-message=\"required\">{{\"requiredFieldError\" | translate}}.</div> <div ng-message=\"md-maxlength\">{{\"maxLength30Error\" | translate}}.</div> </div> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"contractDate\" | translate}}</label> <input time=\"false\" date=\"true\" mdc-datetime-picker=\"\" type=\"text\" id=\"eta\" ng-model=\"contract.contractDate\" class=\"md-input\"> </md-input-container> <md-input-container flex=\"50\" class=\"md-block\"> <label>{{\"currency\" | translate}}</label> <md-select ng-model=\"selectedCurrency\" ng-change=\"currencyChanged(selectedCurrency)\"> <md-optgroup label=\"Currency\"> <md-option ng-repeat=\"item in salesCurrency\" value=\"{{item}}\"> {{item}} </md-option> </md-optgroup></md-select> </md-input-container> <md-input-container flex=\"100\" class=\"md-block carDescription\"> <label>{{\"description\" | translate}}</label> <textarea ng-model=\"contract.description\" md-maxlength=\"150\" rows=\"5\" md-select-on-focus></textarea> </md-input-container> </div> </md-card-content> </md-card> </div> <div layout=\"row\" layout-align=\"center\"> <md-button flex=\"25\" class=\"md-raised\" ng-click=\"backToContract()\">{{\"cancel\" | translate}}</md-button> <md-button flex=\"25\" class=\"md-raised md-primary\" ng-click=\"saveContract(contract)\">{{\"save\" | translate}}</md-button> </div> </div>"
  );


  $templateCache.put('modules/sales/sales.html',
    "<!--   <div layout=\"row\">\r" +
    "\n" +
    "    <md-card flex>\r" +
    "\n" +
    "      <md-card-content>\r" +
    "\n" +
    "        <p class=\"md-display-2 font-weight-100 margin-top-10 margin-bottom-0 ng-scope ng-isolate-scope\" count-to=\"{{countToPaid}}\" value=\"{{countFromPaid}}\" duration=\"1.5\" decimals=\"0\"></p>\r" +
    "\n" +
    "        <p class=\"md-body-2 opacity-60 margin-top-0 margin-bottom-10 ng-scope\" translate=\"\">Paid Funds</p>\r" +
    "\n" +
    "      </md-card-content>\r" +
    "\n" +
    "    </md-card>\r" +
    "\n" +
    "    <md-card flex>\r" +
    "\n" +
    "      <md-card-content>\r" +
    "\n" +
    "        <p class=\"md-display-2 font-weight-100 margin-top-10 margin-bottom-0 ng-scope ng-isolate-scope\" count-to=\"{{countToPaid}}\" value=\"{{countFromPaid}}\" duration=\"1.5\" decimals=\"0\"></p>\r" +
    "\n" +
    "        <p class=\"md-body-2 opacity-60 margin-top-0 margin-bottom-10 ng-scope\" translate=\"\">Unpaid Funds</p>\r" +
    "\n" +
    "      </md-card-content>\r" +
    "\n" +
    "    </md-card>\r" +
    "\n" +
    "    <md-card flex>\r" +
    "\n" +
    "      <md-card-content>\r" +
    "\n" +
    "        <p class=\"md-display-2 font-weight-100 margin-top-10 margin-bottom-0 ng-scope ng-isolate-scope\" count-to=\"{{countToPaid}}\" value=\"{{countFromPaid}}\" duration=\"1.5\" decimals=\"0\" options=\"{ prefix: '$' }\"></p>\r" +
    "\n" +
    "        <p class=\"md-body-2 opacity-60 margin-top-0 margin-bottom-10 ng-scope\" translate=\"\">Total Sales</p>\r" +
    "\n" +
    "      </md-card-content>\r" +
    "\n" +
    "    </md-card>\r" +
    "\n" +
    "    <md-card flex>\r" +
    "\n" +
    "      <md-card-content>\r" +
    "\n" +
    "        <p class=\"md-display-2 font-weight-100 margin-top-10 margin-bottom-0 ng-scope ng-isolate-scope\" count-to=\"{{countToPaid}}\" value=\"{{countFromPaid}}\" duration=\"1.5\" decimals=\"0\" options=\"{ prefix: '$' }\"></p>\r" +
    "\n" +
    "        <p class=\"md-body-2 opacity-60 margin-top-0 margin-bottom-10 ng-scope\" translate=\"\">Total Sales</p>\r" +
    "\n" +
    "      </md-card-content>\r" +
    "\n" +
    "    </md-card>\r" +
    "\n" +
    "  </div>\r" +
    "\n" +
    " --> <div ng-hide=\"$state.current.name === 'sales.details'\" ng-cloak> <div layout=\"row\" layout-align=\"center\"> <md-button flex=\"25\" class=\"md-raised md-primary\" ng-click=\"createNewContract()\">{{\"addNewSales\" | translate}}</md-button> </div> <md-card> <md-card-content> <md-table-container> <table md-table md-row-select=\"options.rowSelection\" ng-model=\"selected\" md-progress=\"promise\"> <thead md-head md-order=\"query.order\" md-on-reorder> <tr md-row> <th md-column md-order-by=\"batchId\"><span>{{\"carId\" | translate}}</span></th> <th md-column md-order-by=\"customerId\"><span>{{\"customerID\" | translate}}</span></th> <th md-column md-order-by=\"deposite\"><span>{{\"deposite\" | translate}}</span></th> <th md-column md-order-by=\"total\" md-desc><span>{{\"totalPrice\" | translate}}</span></th> <th md-column md-order-by=\"paymentStatus\" md-desc><span>{{\"paymentStatus\" | translate}}</span></th> <th md-column md-numeric md-order-by=\"contractDate\"><span>{{\"Date\" | translate}}</span></th> </tr> </thead> <tbody md-body> <tr ng-click=\"editContact(contract)\" md-row md-select=\"contract\" md-on-select ng-repeat=\"contract in contracts | filter: filter.search | orderBy: query.order | limitTo: query.limit : (query.page -1) * query.limit\"> <td md-cell>{{::contract.carId}} </td><td md-cell>{{::contract.customerId}} </td><td md-cell>{{::contract.deposite | currency}}</td> <td md-cell>{{::contract.total | currency}}</td> <td md-cell>{{contract.paymentStatus?'Paid':'Unpaid'}}</td> <td md-cell>{{::contract.contractDate | amDateFormat:'dddd , Do MMMM YYYY'}}</td> </tr> </tbody> </table> </md-table-container> <md-table-pagination md-limit=\"query.limit\" md-page=\"query.page\" md-total=\"{{contracts.length}}\" md-page-select=\"options.pageSelector\" md-boundary-links=\"options.boundaryLinks\" md-on-paginate></md-table-pagination> </md-card-content> </md-card> </div> <div layout=\"column\" ui-view=\"sales-details-view\"> </div>"
  );


  $templateCache.put('modules/settlement/settlement.html',
    "<div class=\"panel panel-default\"> <div class=\"panel-heading\"><b>{{\"salesSummary\" | translate}}</b></div> <div class=\"panel-body\" flex-xs=\"100\" flex-sm=\"80\" flex-gt-sm=\"60\"> <canvas id=\"bar\" class=\"chart chart-bar\" chart-data=\"contractData\" chart-labels=\"labels\"> </canvas> </div> </div> <div class=\"panel panel-default\"> <div class=\"panel-heading\"><b>{{\"importsSummary\" | translate}}</b></div> <div class=\"panel-body\" flex-xs=\"100\" flex-sm=\"80\" flex-gt-sm=\"60\"> <canvas id=\"line\" class=\"chart chart-line\" chart-data=\"importData\" chart-labels=\"labels\"> </canvas> </div> </div> <div class=\"panel panel-default\"> <div class=\"panel-heading\"><b>{{\"vehicleModelsSummary\" | translate}}</b></div> <div class=\"panel-body\" flex-xs=\"100\" flex-sm=\"80\" flex-gt-sm=\"60\"> <canvas id=\"pie\" class=\"chart chart-pie\" chart-data=\"modelData\" chart-labels=\"modelLabels\"> </canvas> </div> </div>"
  );


  $templateCache.put('modules/storage/storage.html',
    "<div> <md-card> <md-card-content> <md-subheader class=\"md-primary\">{{\"inStore\" | translate}}</md-subheader> <md-table-container> <table md-table md-row-select=\"options.rowSelection\" ng-model=\"selected\" md-progress=\"promise\"> <thead md-head md-order=\"query.order\" md-on-reorder> <tr md-row> <th md-column md-order-by=\"carId\"><span>{{\"id\" | translate}}</span></th> <th md-column md-order-by=\"makerName\"><span>{{\"brand\" | translate}}</span></th> <th md-column md-order-by=\"model\" md-desc><span>{{\"model\" | translate}}</span></th> <th md-column md-numeric md-order-by=\"year\"><span>{{\"year\" | translate}}</span></th> <th md-column md-numeric md-order-by=\"odometer\"><span>{{\"odometer\" | translate}}</span></th> <th md-column md-numeric md-order-by=\"price\"><span>{{\"salePrice\" | translate}}</span></th> <th md-column md-order-by=\"arriveTime\"><span>{{\"arriveTime\" | translate}}</span></th> <th md-column md-order-by=\"carStatus\"><span>{{\"status\" | translate}}</span></th> </tr> </thead> <tbody md-body> <tr md-row md-select=\"car\" md-on-select md-auto-select=\"options.autoSelect\" ng-repeat=\"car in inStoreList | orderBy: query.order | limitTo: query.limitForInStore: (query.pageForInStore -1) * query.limitForInStore\"> <td ng-click=\"editCar(car)\" md-cell>{{::car.carId}} </td><td md-cell>{{::car.makerName}} </td><td md-cell>{{::car.model}}</td> <td md-cell>{{::car.year}}</td> <td md-cell>{{::car.odometer| number }}&nbsp;Km</td> <td md-cell>{{::car.price | currency}}</td> <td md-cell>{{::car.arriveTime | date : \"EEEE, dd MMMM yyyy\"}}</td> <td md-cell><span class=\"label\" ng-class=\"checkCarStatusColor(car.carStatus)\">{{::car.carStatus}}</span></td> </tr> </tbody> </table> </md-table-container> <md-table-pagination md-limit=\"query.limitForInStore\" md-page=\"query.pageForInStore\" md-total=\"{{inStoreList.length}}\" md-page-select=\"options.pageSelector\" md-boundary-links=\"options.boundaryLinks\"></md-table-pagination> </md-card-content> </md-card> <md-card> <md-card-content> <md-subheader class=\"md-primary\">{{\"onTheWay\" | translate}}</md-subheader> <md-table-container> <table md-table md-row-select=\"options.rowSelection\" ng-model=\"selected\" md-progress=\"promise\"> <thead md-head md-order=\"query.order\" md-on-reorder> <tr md-row> <th md-column md-order-by=\"carId\"><span>{{\"id\" | translate}}</span></th> <th md-column md-order-by=\"makerName\"><span>{{\"brand\" | translate}}</span></th> <th md-column md-order-by=\"model\" md-desc><span>{{\"model\" | translate}}</span></th> <th md-column md-numeric md-order-by=\"year\"><span>{{\"year\" | translate}}</span></th> <th md-column md-numeric md-order-by=\"odometer\"><span>{{\"odometer\" | translate}}</span></th> <th md-column md-numeric md-order-by=\"price\"><span>{{\"salePrice\" | translate}}</span></th> <th md-column md-order-by=\"arriveTime\"><span>{{\"arriveTime\" | translate}}</span></th> <th md-column md-order-by=\"carStatus\"><span>{{\"status\" | translate}}</span></th> </tr> </thead> <tbody md-body> <tr md-row md-select=\"car\" md-on-select md-auto-select=\"options.autoSelect\" ng-repeat=\"car in onTheWayList | orderBy: query.order | limitTo: query.limitForOnTheWay : (queryC.pageForOnTheWay -1) * queryC.limitForOnTheWay\"> <td ng-click=\"editCar(car)\" md-cell>{{::car.carId}} </td><td md-cell>{{::car.makerName}} </td><td md-cell>{{::car.model}}</td> <td md-cell>{{::car.year}}</td> <td md-cell>{{::car.odometer| number }}&nbsp;Km</td> <td md-cell>{{::car.price | currency}}</td> <td md-cell>{{::car.arriveTime | date : \"EEEE, dd MMMM yyyy\"}}</td> <td md-cell><span class=\"label\" ng-class=\"checkCarStatusColor(car.carStatus)\">{{::car.carStatus}}</span></td> </tr> </tbody> </table> </md-table-container> <md-table-pagination md-limit=\"query.limitForOnTheWay\" md-page=\"query.pageForOnTheWay\" md-total=\"{{onTheWayList.length}}\" md-page-select=\"options.pageSelector\" md-boundary-links=\"options.boundaryLinks\" md-on-paginate></md-table-pagination> </md-card-content> </md-card> </div>"
  );

}]);
