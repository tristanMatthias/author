import fs from 'fs';
import path from 'path';
import rimraf from 'rimraf';
import { ProjectState } from '../store/state';
import { gitPath } from './data';
import { remoteDiff } from './git';

export class ProjectNotFound extends Error {
  public name = 'ProjectNotFound';
  public message = 'Project cannot be found';
}

export type ProjectStatus = ProjectStatusError | ProjectStatusOutOfSync | ProjectStatusSynced;

export interface ProjectStatusError {
  state: ProjectState.error;
  error: string;
}

export interface ProjectStatusOutOfSync {
  state: ProjectState.outOfSync;
  behind: number;
  ahead: number;
}

export interface ProjectStatusSynced {
  state: ProjectState.synced;
}

export const getStatus = async (project: string): Promise<ProjectStatus> => {
  const dir = path.resolve(gitPath, project);

  // If the project doesn't exist on the file system, throw not found error
  try {
    fs.statSync(dir);
  } catch (e) {
    return {
      state: ProjectState.error,
      error: 'Project could not be found'
    };
  }

  // Try load the 'author.json' file at project root
  try {
    fs.statSync(path.resolve(dir, 'author.json'));
  } catch (e) {
    return {
      state: ProjectState.error,
      error: 'Project does not contain an \'author.json\' file'
    };
  }

  const diff = await remoteDiff(project);
  if (diff.ahead || diff.behind) {
    return {
      state: ProjectState.outOfSync,
      ...diff
    };
  }

  return {state: ProjectState.synced};
};


export const remove = async (project: string) => {
  const dir = path.resolve(gitPath, project);
  rimraf.sync(dir);
};
