import View from './View';
import previewView from './previewView';

import icons from 'url:../../img/icons.svg';

class resultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query! Please try again';
  _message = '';

  _generateMarkup() {
    console.log('this is from resultsView file');
    console.log(this._data);

    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new resultsView();
