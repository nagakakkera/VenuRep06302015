'use strict';
var constants = {baseUrl: "http://localhost:4000/"};
var app = angular.module('searchApp', ['ngSanitize', 'ui.select','daterangepicker']);

app.value("ospConstants", {
    minDateRange:  moment().startOf('year').startOf('months').startOf('day'),
    maxDateRange: moment().subtract(1,'days'),
    ranges:{
        'Year to Date': [moment().startOf('year').startOf('months').startOf('day'),moment().subtract(1,'days')],
        'This Month':[moment().startOf('month').startOf('day'),moment().subtract(1,'days')],
        'Last Month': [moment().subtract(1,'months').startOf('month'), moment().subtract(1,'months').endOf('month')]
    }
});

/**
 * AngularJS default filter with the following expression:
 * "recall in availableRecall | filter: {name: $select.search}"
 */
app.filter('propsFilter', function() {
  return function(items, props) {
    var out = [];

    if (angular.isArray(items)) {
      items.forEach(function(item) {
        var itemMatches = false;

        var keys = Object.keys(props);
        for (var i = 0; i < keys.length; i++) {
          var prop = keys[i];
          var text = props[prop].toLowerCase();
          if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
            itemMatches = true;
            break;
          }
        }

        if (itemMatches) {
          out.push(item);
        }
      });
    } else {
      // Let the output be the input untouched
      out = items;
    }

    return out;
  }
});

app.controller('SearchController', function($scope, $http, ospConstants, $filter) {

    $scope.opts = {ranges: ospConstants.ranges};
    $scope.dateRange = {
        startDate: ospConstants.minDateRange,
        endDate: ospConstants.maxDateRange
    };

    $scope.searchCriteria = {};

    $scope.searchCriteria.states = [];
    $scope.searchCriteria.recallType = {};

    $scope.availableRecall = [{name: 'Drug', code: 'drug'}, 
                            {name: 'Food', code: 'food'}, 
                            {name: 'Device', code: 'device'}];

    $scope.availableStates = [{name: 'Nationwide', code: 'Nationwide'},
                            {name: 'Alabama', code: 'AL'},
                            {name: 'Alaska', code: 'AK'},
                            {name: 'Arizona', code: 'AZ'},
                            {name: 'Arkansas', code: 'AR'},
                            {name: 'California', code: 'CA'},
                            {name: 'Colorado', code: 'CO'},
                            {name: 'Connecticut', code: 'CT'},
                            {name: 'Delaware', code: 'DE'},
                            {name: 'Florida', code: 'FL'},
                            {name: 'Georgia', code: 'GA'},
                            {name: 'Hawaii', code: 'HI'},
                            {name: 'Idaho', code: 'ID'},
                            {name: 'Illinois', code: 'IL'},
                            {name: 'Indiana', code: 'IN'},
                            {name: 'Iowa', code: 'IA'},
                            {name: 'Kansas', code: 'KS'},
                            {name: 'Kentucky', code: 'KY'},
                            {name: 'Louisiana', code: 'LA'},
                            {name: 'Maine', code: 'ME'},
                            {name: 'Maryland', code: 'MD'},
                            {name: 'Massachusetts', code: 'MA'},
                            {name: 'Michigan', code: 'MI'},
                            {name: 'Minnesota', code: 'MN'},
                            {name: 'Mississippi', code: 'MS'},
                            {name: 'Missouri', code: 'MO'},
                            {name: 'Montana', code: 'MT'},
                            {name: 'Nebraska', code: 'NE'},
                            {name: 'Nevada', code: 'NV'},
                            {name: 'New Hampshire', code: 'NH'},
                            {name: 'New Jersey', code: 'NJ'},
                            {name: 'New Mexico', code: 'NM'},
                            {name: 'New York', code: 'NY'},
                            {name: 'North Carolina', code: 'NC'},
                            {name: 'North Dakota', code: 'ND'},
                            {name: 'Ohio', code: 'OH'},
                            {name: 'Oklahoma', code: 'OK'},
                            {name: 'Oregon', code: 'OR'},
                            {name: 'Pennsylvania', code: 'PA'},
                            {name: 'Rhode Island', code: 'RI'},
                            {name: 'South Carolina', code: 'SC'},
                            {name: 'South Dakota', code: 'SD'},
                            {name: 'Tennessee', code: 'TN'},
                            {name: 'Texas', code: 'TX'},
                            {name: 'Utah', code: 'UT'},
                            {name: 'Vermont', code: 'VT'},
                            {name: 'Virginia', code: 'VA'},
                            {name: 'Washington', code: 'WA'},
                            {name: 'West Virginia', code: 'WV'},
                            {name: 'Wisconsin', code: 'WI'},
                            {name: 'Wyoming', code: 'WY'}];

$scope.searchData = function() {
    var recallType = $scope.searchCriteria.recallType.selected.code;
    var finalStateList = '';
    var from_date = $filter('date')($scope.formatDate($scope.dateRange.startDate), 'yyyy-MM-dd');
    var to_date = $filter('date')($scope.formatDate($scope.dateRange.endDate), 'yyyy-MM-dd');
    for (var i = 0; i <= $scope.searchCriteria.states.length - 1; i++) {
        finalStateList =  finalStateList + '&locations=' + $scope.searchCriteria.states[i].code;
    };
    console.log(constants.baseUrl+"recallInfo?product_type="+ recallType + finalStateList + "&["+to_date+ "+TO+"+from_date+"]");
    $http.get(constants.baseUrl+"recallInfo?product_type="+ recallType + finalStateList + "&["+to_date+ "+TO+"+from_date+"]")
        .success(function(response) {$scope.products = response;});
    };

$scope.formatDate = function(date){
          var dateOut = new Date(date);
          return dateOut;
};
});