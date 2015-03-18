'use strict';
 
describe('HeadingController', function(){
    var scope, $httpBackend,
		testData = {
			pageTitle: 'Recipes',
			cookbookInfoService: {
				"username": "Bob", 
				"description": "Bananas"
			}
		};
 
    //  Mock application to allow us to inject our own dependencies.
    beforeEach(angular.mock.module('cookbookApp'));
	
    //  Mock the controller for the same reason and include $rootScope and $controller.
    beforeEach(angular.mock.inject(function($rootScope, $controller, CookbookInfoService, _$httpBackend_){	
        $httpBackend = _$httpBackend_;
        $httpBackend.whenGET('/api/get_cookbook_info.json').respond(testData.cookbookInfoService);

        //  Create an empty scope.
        scope = $rootScope.$new();
        //  Declare the controller and inject our empty scope.
        $controller('HeadingController', {$scope: scope});
    }));
	
    // Begin tests below.
	
	it('Sanity', function(){
        expect(2+2).toBe(4);
    });
	
	it('should have variable pageTitle.', function(){
        expect(scope.pageTitle).toBe(testData.pageTitle);
		expect(scope.pageTitle).toBeDefined(testData.pageTitle);
    });
	
	it('should have pulled from info service.', function(){
		$httpBackend.flush(); 
		//dump(scope.info);
        expect(scope.info.username).toBe(testData.cookbookInfoService.username);   
		expect(scope.info.description).toBe(testData.cookbookInfoService.description);		
    });	
	
});


describe('RecipeListController', function(){
    var scope, $httpBackend,
		testData = {			
			recipeListService: {
				"recipes": [
					{
						"author": "Karen",
						"category": "10",
						"cooktime": "20 minutes",
						"date": "01/19/2009",
						"servings": "4",
						"title": "Dream Beans",
						"instructions":"Cook onion in olive oil in a heavy saucepan over moderately low heat, stirring until softened, 4 to 5 minutes.\nAdd chipotle and cook, stirring for 2 minutes.\nAdd beans, water, and orange juice, bring to a simmer, and simmer, mashing beans about 8 times with a potato masher, until slightly thickened, about 20 minutes. \nStir in salt.",
						"ingredients": "1 canned chipotle chile in adobe, minced (not one can – one chile)\n1 small onion, minced\n2 teaspoons olive oil\n2 15 oz. cans black beans, drained and rinsed\n¾  cup water\n½ cup fresh orange juice\n½ tsp. Salt",
						"notes": "The original recipe calls for 1 cup of water, but I think they are too runny that way, so I use ¾ cup.  I also use pasteurized orange juice lots of times because I don’t have fresh oranges around, and I can’t tell the difference.",
						"recipeId": "cb6"
					},
					{
						"author": "Alisa",
						"category": "Soup",
						"cooktime": "",
						"date": "11/24/2012",
						"servings": "",
						"title": "Pasta Fagiole",
						"recipeId": "cb2"
					}
				]	
			}
		};
 
    //  Mock application to allow us to inject our own dependencies.
    beforeEach(angular.mock.module('cookbookApp'));
	
    //  Mock the controller for the same reason and include $rootScope and $controller.
    beforeEach(angular.mock.inject(function($rootScope, $controller, RecipeListService, _$httpBackend_){	
        $httpBackend = _$httpBackend_;
        $httpBackend.whenGET('/api/get_recipes.json').respond(testData.recipeListService);

        //  Create an empty scope.
        scope = $rootScope.$new();
        //  Declare the controller and inject our empty scope.
        $controller('RecipeListController', {$scope: scope});
    }));
	
    // Begin tests below.
	
	it('should have pulled from RecipeListService.', function(){
		$httpBackend.flush(); 
		
		//dump(scope.recipes);
        expect(scope.recipes.length).toBe(testData.recipeListService.recipes.length);   
		expect(scope.recipes[0].author).toBe(testData.recipeListService.recipes[0].author);		
		expect(true).toBe(true);	
    });	
	
});