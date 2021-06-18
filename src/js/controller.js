import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

//  svg id not showing in dist index.html, fix later,( maunally add id in html using JS)

//document.querySelector();
//

const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2
// recipe example
// https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886
// test ids 5ed6604591c37cdc054bca3b, 5ed6604591c37cdc054bca10, 5ed6604591c37cdc054bc96e
///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return; // using guard clause to fix program if we open program without any hash

    recipeView.renderSpinner();

    //0. Result view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // 1. Loading Recipe
    await model.loadRecipe(id); // here loadRecipe(id) doesn't return anything, so we dont need to store it in any variable, but what it does is, it makes the state.racipe accessible here
    // console.log('Recipe coming from model');
    // console.log(model.state.recipe);

    // 2. Rendering Recipe
    recipeView.render(model.state.recipe);

    //3. updating bookmarksView
    bookmarksView.update(model.state.bookmarks);
  } catch (err) {
    // console.error(`${err.message} 💥 `);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1. Get search query from searchView
    const query = searchView.getQuery();
    // console.log('Query in Controller ', query);
    if (!query) return;

    //2. Load search resutlts
    await model.loadSearchResults(query);

    // 3. rendering result in console, comment it later
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());
    console.log(model.state.search.results);

    // 4. render initial pagination button
    paginationView.render(model.state.search);
  } catch (error) {
    console.log(error);
  }
};

const controlPagination = function (goToPage) {
  // 3. rendering new result
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 4. render new pagination button
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // update the recipe servings (in state)
  model.updateServings(newServings);

  // update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1. Add or remove bookmarks
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  console.log(model.state.recipe);

  // 2. Update recipe view
  recipeView.update(model.state.recipe);

  // 3. render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Uploading the recipe data
    console.log(newRecipe);
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //Render Recipe to recipeView
    recipeView.render(model.state.recipe);

    // Success Message
    addRecipeView.renderMessage();

    // Render Bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // close form windows
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💩', err);
    addRecipeView.renderError(err.message);
  }
};
// controlSearchResults();
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes); // publisher subscriber pattern
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  // controlServings();

  console.log('added this line to test git, brance new-feature');
};
init();
