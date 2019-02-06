import { Dispatch } from 'redux';
import { AppBarAction } from '../store/state';

export const APP_TITLE_SET = 'APP_TITLE_SET';
export const APP_ACTIONS_SET = 'APP_ACTIONS_SET';

export const setTitle = (title: string) => (dispatch: Dispatch) => {
  dispatch({type:  APP_TITLE_SET, title});
};


export const setActions = (actions: AppBarAction[]) => (dispatch: Dispatch) => {
  dispatch({type:  APP_ACTIONS_SET, actions});
};
