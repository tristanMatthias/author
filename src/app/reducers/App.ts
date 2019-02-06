import { AnyAction } from 'redux';
// tslint:disable-next-line match-default-export-name
import immutable from 'seamless-immutable';
import { APP_ACTIONS_SET, APP_TITLE_SET } from '../actions/App';
import { App as AppState } from '../store/state';


const intitialState = immutable.from<AppState>({
  title: 'Author',
  actions: []
});


// tslint:disable-next-line variable-name
export const App = (state = intitialState, action: AnyAction) => {
  switch (action.type) {
    case APP_TITLE_SET:
      return state.setIn(['title'], action.title);
    case APP_ACTIONS_SET:
      return state.setIn(['actions'], action.actions);

    default:
      return state;
  }
};
