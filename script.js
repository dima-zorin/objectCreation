var n = 0;

angular.module('MyApp', ['ngMaterial', 'ngTagsInput', 'ui.router'])
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('index', {
        url: "/index",
        templateUrl: "index.html"
      })
      .state('showOne', {
        url: "/showone",
        templateUrl: "showone.html"
      });
    $urlRouterProvider.otherwise('/index');
  })
  .controller('MainController', ['$scope', function($scope) {
    $scope.elementsList = [];
    $scope.selectedElement = [];
    $scope.currentPage = 0;
    $scope.perPageLimiter = 2;

    $scope.addElement = function() {
      if ($scope.myForm.$valid === false) {
        alert("ноуп");
      } else {
        n += 1;
        var newElement = {
          id: n,
          name: $scope.name,
          address: $scope.address,
          category: $scope.category,
          dscrptn: $scope.dscrptn,
          tagsS: $scope.tagsS
        };
        $scope.elementsList.push(newElement);
        localStorage.setItem('elementsList', JSON.stringify($scope.elementsList));
        $scope.pagesS();

        myForm.reset();
        $scope.tagsS = undefined;
        $scope.name = undefined;
        $scope.dscrptn = undefined;
        $scope.address = undefined;
        $scope.category = undefined;
        $scope.myForm.$valid = false;
      }
    };

    $scope.deleteItem = function(N) {
      for (var i = 0; i < $scope.elementsList.length; i++) {
        if (N.element.id != $scope.elementsList[i].id) {
          continue;
        } else {
          $scope.elementsList.splice(i, 1);
        }
      }

      localStorage.setItem('elementsList', JSON.stringify($scope.elementsList));
      $scope.pagesS();
    };

    $scope.drawBorder = function(I) {
      var myBorder = (I == $scope.currentPage) ? 'selectedCell' : '';
      return myBorder;
    };

    $scope.editItem = function(N) {
      $scope.editedElement = {
        id: N.element.id,
        name: N.element.name,
        address: N.element.address,
        category: N.element.category,
        dscrptn: N.element.dscrptn,
        tagsS: N.element.tagsS
      };

      console.log(document.querySelector("#myFormEdit"));

      angular.element(document.querySelector("#edited")).css("visibility", "visible");
    };

    $scope.closeEdit = function() {
      angular.element(document.querySelector("#edited")).css("visibility", "hidden");
    };

    $scope.saveEdit = function(N) {
      console.log(N);
      if ((document.querySelector("#myFormEdit")[2]).value.length === 0 || (document.querySelector("#myFormEdit")[4]).value.length === 0 || (document.querySelector("#myFormEdit")[3]).value.length === 0) {
        alert("ноуп");
      } else {
        for (var i = 0; i < $scope.elementsList.length; i++) {
          if (N.editedElement.id != $scope.elementsList[i].id) {
            continue;
          } else {
            if ($scope.editedElement.name === (document.querySelector("#myFormEdit")[2]).value) {
              $scope.elementsList[i].name = $scope.editedElement.name;
            } else {
              $scope.elementsList[i].name = $scope.nameUpd;
            }
            if ($scope.editedElement.address === (document.querySelector("#myFormEdit")[4]).value) {
              $scope.elementsList[i].address = $scope.editedElement.address;
            } else {
              $scope.elementsList[i].address = $scope.addressUpd;
            }
            $scope.elementsList[i].category = $scope.categoryUpd;
            if ($scope.editedElement.dscrptn === (document.querySelector("#myFormEdit")[3]).value) {
              $scope.elementsList[i].dscrptn = $scope.editedElement.dscrptn;
            } else {
              $scope.elementsList[i].dscrptn = $scope.dscrptnUpd;
            }
            $scope.elementsList[i].tagsS = $scope.editedElement.tagsS;

            if ($scope.selectedElement === undefined) {

            } else if ($scope.selectedElement.id === $scope.editedElement.id) {
              $scope.selectedElement.name = $scope.elementsList[i].name;
              $scope.selectedElement.address = $scope.elementsList[i].address;
              $scope.selectedElement.category = $scope.elementsList[i].category;
              $scope.selectedElement.dscrptn = $scope.elementsList[i].dscrptn;

              if ($scope.elementsList[i].tagsS === undefined) {

              } else {
                $scope.selectedElement.tagsS = [];
                for (var t = 0; t < $scope.elementsList[i].tagsS.length; t++) {
                  if (t == $scope.elementsList[i].tagsS.length - 1) {
                    $scope.selectedElement.tagsS += $scope.elementsList[i].tagsS[t].text;
                  } else {
                    $scope.selectedElement.tagsS += $scope.elementsList[i].tagsS[t].text + ', ';
                  }
                }
              }
            }
            myFormEdit.reset();
            $scope.categoryUpd = undefined;
            angular.element(document.querySelector("#edited")).css("visibility", "hidden");
          }
        }
      }
    };

    $scope.selectPage = function(K) {
      $scope.currentPage = K.pagesNumber - 1;
    };

    $scope.openItem = function(N) {
      $scope.selectedElementTags = [];

      if (N.element.tagsS === undefined) {

      } else {
        for (var i = 0; i < N.element.tagsS.length; i++) {
          if (i == N.element.tagsS.length - 1) {
            $scope.selectedElementTags += N.element.tagsS[i].text;
          } else {
            $scope.selectedElementTags += N.element.tagsS[i].text + ', ';
          }
        }
      }

      $scope.selectedElement = {
        id: N.element.id,
        name: N.element.name,
        address: N.element.address,
        category: N.element.category,
        dscrptn: N.element.dscrptn,
        tagsS: $scope.selectedElementTags
      };
    };

    $scope.pagesS = function() {
      setTimeout($scope.pages, 100);
    };

    $scope.pages = function() {
      $scope.pagesCounter = [];
      var k = 0;

      for (var i = 0; i < $scope.filteredElementsList.length; i += $scope.perPageLimiter) {
        k += 1;
        $scope.pagesCounter.push(k);
      }
      $scope.currentPage = 0;
    };
  }])
  .filter('startFrom', function() {
    return function(input, start) {
      start = +start;
      return input.slice(start);
    };
  });