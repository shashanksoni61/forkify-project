import View from './View';
import previewView from './previewView';
import icons from 'url:../../img/icons.svg';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet, Find a nice recipe';
  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    console.log('this log coming from bookmarksView');
    console.log(this._data);
    this._data.map(res => console.log(res));
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
  //   ${result.image}
}

export default new BookmarksView();
