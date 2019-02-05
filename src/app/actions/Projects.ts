import { Dispatch } from 'redux';
import { data } from '../lib/data';
import { clone } from '../lib/git';
import { getStatus, remove } from '../lib/projects';
import { Project, Projects } from '../store/state';

export const PROJECTS_CREATING_START = 'PROJECTS_CREATING_START';
export const PROJECTS_CREATING_PROGRESS = 'PROJECTS_CREATING_PROGRESS';
export const PROJECTS_CREATING_ERROR = 'PROJECTS_CREATING_ERROR';
export const PROJECTS_CREATING_END = 'PROJECTS_CREATING_END';

export const PROJECTS_LOADING_START = 'PROJECTS_LOADING_START';
export const PROJECTS_LOADING_END = 'PROJECTS_LOADING_END';

export const PROJECTS_SET_STATUS = 'PROJECTS_SET_STATUS';
export const PROJECTS_REMOVE = 'PROJECTS_REMOVE';

export const DATA_KEY_PROJECTS = 'projects';


export const projectsLoad = () => async (dispatch: Dispatch) => {
  dispatch({ type: PROJECTS_LOADING_START});
  const projects = data.get(DATA_KEY_PROJECTS, []) as Project[];
  dispatch({ type: PROJECTS_LOADING_END, projects });


  await Promise.all(projects.map(async (p) => {
    const status = await getStatus(p.name);
    dispatch({ type: PROJECTS_SET_STATUS, repo: p.remote, status });
  }));
};


export const projectsAdd = (repo: string, name: string) => async (dispatch: Dispatch) => {
  dispatch({type: PROJECTS_CREATING_START, name, repo});

  try {
    await clone(repo, name, (percent) => {
      dispatch({type: PROJECTS_CREATING_PROGRESS, repo, percent});
    });
  } catch (error) {
    dispatch({ type: PROJECTS_CREATING_ERROR, repo, error });
  }

  dispatch({ type: PROJECTS_CREATING_END, repo });

  const status = await getStatus(name);
  dispatch({ type: PROJECTS_SET_STATUS, repo, status });
};


export const projectsRemove = (repo: string, name: string) => async (dispatch: Dispatch) => {
  remove(name);
  dispatch({ type: PROJECTS_REMOVE, repo });
};
