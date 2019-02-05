import { number } from 'prop-types';
import { AnyAction } from 'redux';

// tslint:disable-next-line match-default-export-name
import immutable from 'seamless-immutable';
import {
  DATA_KEY_PROJECTS,
  PROJECTS_CREATING_END,
  PROJECTS_CREATING_ERROR,
  PROJECTS_CREATING_PROGRESS,
  PROJECTS_CREATING_START,
  PROJECTS_LOADING_END,
  PROJECTS_LOADING_START,
  PROJECTS_REMOVE,
  PROJECTS_SET_STATUS
} from '../actions/Projects';
import { data } from '../lib/data';
import { Project, Projects as StateProjects, ProjectState } from '../store/state';


const intitialState = immutable.from<StateProjects>({
  loadingAll: false,
  projects: [],
});


// tslint:disable-next-line variable-name
export const Projects = (state = intitialState, action: AnyAction) => {
  let updated = state;
  let project: Project | null = null;
  let projectIndex: number | null = null;

  if (action.repo) {
    project = updated.projects.find((p) => p.remote === action.repo);
    projectIndex = updated.projects.indexOf(project);
  }

  const updateProject = (p: Partial<Project>) => {
    updated = updated.setIn(
      ['projects', projectIndex.toString()],
      ({ ...project, ...p })
    );

    data.set(DATA_KEY_PROJECTS, updated.projects);

    return updated;
  };

  switch (action.type) {
    case PROJECTS_LOADING_START:
      return state.setIn(['projects', 'loadingAll'], true);
    case PROJECTS_LOADING_END:
      return updated.merge({
        loadingAll: false,
        projects: action.projects
      });


    case PROJECTS_CREATING_START:
      const _project: Project = {
        name: action.name,
        remote: action.repo,
        uri: action.name.replace(/[\s]/, '-'),
        loading: true,
        state: ProjectState.loading,
        downloadPercent: 0,
        error: null
      };
      updated = state.merge({
        projects: [...state.projects.asMutable(), _project]
      });
      data.set(DATA_KEY_PROJECTS, updated.projects);
      return updated;


    case PROJECTS_CREATING_PROGRESS:
      updated = updated.setIn(
        ['projects', projectIndex.toString(), 'downloadPercent'],
        action.percent
      );

      return updated;


    case PROJECTS_CREATING_ERROR:
      return updateProject({
        loading: false,
        state: ProjectState.error,
        error: 'Already'
      });


    case PROJECTS_CREATING_END:
      return updateProject({
        downloadPercent: 100,
        loading: false,
        state: ProjectState.synced
      });


    case PROJECTS_SET_STATUS:
      const status = action.status;
      if (!status.error) status.error = false;
      return updateProject({
        ...action.status
      });


    case PROJECTS_REMOVE:
      updated = updated.set(
        'projects',
        updated.projects.filter((p) => p.remote !== action.repo)
      );
      data.set(DATA_KEY_PROJECTS, updated.projects);
      return updated;


    default:
      return state;
  }
};
