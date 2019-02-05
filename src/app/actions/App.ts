import { Dispatch } from 'redux';

export const APP_TITLE_SET = 'APP_TITLE_SET';

export const setTitle = (title: string) => (dispatch: Dispatch) => {
  dispatch({type:  APP_TITLE_SET, title});
};
