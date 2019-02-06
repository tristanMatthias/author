import { Dispatch } from 'redux';
import { data } from '../lib/data';
import { clone } from '../lib/git';
import { getStatus, loadAuthorFiles, remove, saveFile } from '../lib/projects';
import { Project, Projects } from '../store/state';

export const PROJECTS_CREATING_START = 'PROJECTS_CREATING_START';
export const PROJECTS_CREATING_PROGRESS = 'PROJECTS_CREATING_PROGRESS';
export const PROJECTS_ERROR_SET = 'PROJECTS_ERROR_SET';
export const PROJECTS_CREATING_END = 'PROJECTS_CREATING_END';

export const PROJECTS_LOADING_START = 'PROJECTS_LOADING_START';
export const PROJECTS_LOADING_END = 'PROJECTS_LOADING_END';

export const PROJECTS_SET_STATUS = 'PROJECTS_SET_STATUS';
export const PROJECTS_REMOVE = 'PROJECTS_REMOVE';

export const PROJECTS_FILES_SET = 'PROJECTS_FILES_SET';

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
    dispatch({ type: PROJECTS_ERROR_SET, repo, error: error.message });
  }

  dispatch({ type: PROJECTS_CREATING_END, repo });

  const status = await getStatus(name);
  dispatch({ type: PROJECTS_SET_STATUS, repo, status });
};


export const projectsRemove = (repo: string, name: string) => async (dispatch: Dispatch) => {
  remove(name);
  dispatch({ type: PROJECTS_REMOVE, repo });
};


export const projectLoadFiles = (repo: string, name: string) => async (dispatch: Dispatch) => {
  try {
    const files = await loadAuthorFiles(name);
    dispatch({ type: PROJECTS_FILES_SET, repo, files });

  } catch (error) {
    dispatch({ type: PROJECTS_ERROR_SET, repo, error: error.message });
  }
};

export const projectSaveFile = (repo: string, name: string, file: string, fileData: object) =>
  async (dispatch: Dispatch) => {
    await saveFile(name, file, fileData);
  };
