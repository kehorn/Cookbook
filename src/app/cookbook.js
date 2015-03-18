(function() {
	"use strict"; //  Safe wrapper for use strict.

	// declare our app module and its dependencies
	var cb = angular.module('cookbookApp', ['ngRoute', 'LineSplitterCustomFilterModule']);

	// configure the app
	cb.config(['$routeProvider', function($routeProvider) {

		$routeProvider.when('/', {
			templateUrl: '/app/recipeList/recipesList.html',
			controller: 'RecipeListController'
		})
			.when('/recipe/:recipeId', {
			controller: 'RecipeViewController',
			templateUrl: '/app/recipe/recipe.html'
		})
			.otherwise({
			redirectTo: '/'
		});

	}]);


	// Controller for the recipes list page.
	cb.controller('HeadingController', ['$scope', 'CookbookInfoService', function($scope, CookbookInfoService) {
		$scope.pageTitle = 'Recipes';  // TODO:
		CookbookInfoService.getCookbookInfo()
			.then(function(info) {
			$scope.info = info;
		});

	}]);

	// Controller for the recipes list page.
	cb.controller('RecipeListController', ['$scope', 'RecipeListService', function($scope, RecipeListService) {

		RecipeListService.getRecipes()
			.then(function(recipes) {
			$scope.recipes = recipes;
		});

	}]);

	// Controller for the recipe view page.
	cb.controller('RecipeViewController', ['$scope', '$routeParams', 'RecipeListService', function($scope, $routeParams, RecipeListService) {

		$scope.recipeId = $routeParams.recipeId;
		$scope.editMode = false;
		$scope.categories = RecipeListService.getCategories();

		RecipeListService.getRecipeById($scope.recipeId)
			.then(function(recipe) {
			var categoryItem, categoryName;
			$scope.recipe = recipe;

			categoryItem = _.findWhere($scope.categories, {
				value: recipe.category
			});
			categoryName = categoryItem && categoryItem.name;
			$scope.recipe.categoryName = categoryName;
		});

		$scope.toggleEdit = function() {
			$scope.editMode = !$scope.editMode;
		}

	}]);

	// A service for getting the user info.
	cb.factory('CookbookInfoService', ['$http', '$q', function($http, $q) {

		return {
			getCookbookInfo: function() {
				return $http.get('/api/get_cookbook_info.json')
					.then(function(response) {
					if (response.data) {
						return response.data;
					} else {
						return $q.reject('No data in response.');
					}
				}, function(response) {
					return $q.reject('Server or connection error.');
				});
			}
		};

	}]);



	// A service for getting recipes.
	cb.factory('RecipeListService', ['$http', '$q', function($http, $q) {

		// Recipe data structures
		var recipe_list = [],
			recipe_by_id = {},
			categories_list = [];

		function loadRecipes(recipes) {
			recipe_list = [];
			angular.forEach(recipes, function(recipe) {
				recipe_list.push(recipe);
				if (typeof recipe.recipeId !== 'undefined') {
					recipe_by_id[recipe.recipeId] = recipe;
				}
			});
		}

		function fetchRecipeList() {
			return $http.get('/api/get_recipes.json')
				.then(function(response) {
				if (response.data && response.data.recipes) {
					loadRecipes(response.data.recipes);
					return response.data.recipes;
				} else {
					return $q.reject('No data in response.');
				}
			}, function(response) {
				return $q.reject('Server or connection error.');
			});
		}
		
		
		function loadCategories(categories) {
			categories_list = [];
			angular.forEach(categories, function(categoryItem) {
				categories_list.push(categoryItem);
			});
		}

		function fetchCategories() {
			return $http.get('/api/get_categories.json')
				.then(function(response) {
				if (response.data && response.data.categories) {
					loadCategories(response.data.categories);
					return response.data.categories;
				} else {
					return $q.reject('No data in response.');
				}
			}, function(response) {
				return $q.reject('Server or connection error.');
			});
		}

		return {

			getRecipeById: function(recipeId) {
				var deferred = $q.defer();

				if (recipe_by_id.hasOwnProperty(recipeId)) {
					deferred.resolve(recipe_by_id[recipeId]);
				} else {
					fetchRecipeList()
						.then(function(recipes) {
						deferred.resolve(recipe_by_id[recipeId]);
					}, function(msg) {
						deferred.reject(msg);
					});
				}

				return deferred.promise;
			},

			getRecipes: function() {
				var deferred = $q.defer();

				if (recipe_list.length) {
					deferred.resolve(recipe_list);
				} else {
					fetchRecipeList()
						.then(function(recipes) {
						deferred.resolve(recipes);
					}, function(msg) {
						deferred.reject(msg);
					});
				}

				return deferred.promise;
			},

			getCategories: function() {
				/*var deferred = $q.defer();

				if (categories_list.length) {
					deferred.resolve(categories_list);
				} else {
					fetchCategories()
						.then(function(categories) {
						deferred.resolve(categories);
					}, function(msg) {
						deferred.reject(msg);
					});
				}

				return deferred.promise;*/
				
				var categories = [
					{"name":"Beef", "value":"5"},
					{"name":"Chicken", "value":"3"},
					{"name":"Desserts", "value":"7"},
					{"name":"Drinks", "value":"8"},
					{"name":"Fish", "value":"12"},
					{"name":"Other", "value":"10"},
					{"name":"Pasta", "value":"6"},
					{"name":"Pizza", "value":"15"},
					{"name":"Pork", "value":"13"},
					{"name":"Potatoes", "value":"14"},
					{"name":"Salads", "value":"2"},
					{"name":"Soup", "value":"1"},
					{"name":"Spices", "value":"11"},
					{"name":"Turkey", "value":"4"},
					{"name":"Vegetarian", "value":"9"}
				];
				return categories;
			}
		}


	}]);


	angular.module('LineSplitterCustomFilterModule', [])
		.filter('newlines', function() {
		return function(text) {
			var ret = text || '';
			return ret.split(/\n/g);
		};
	});



}()); /* End use strict. */