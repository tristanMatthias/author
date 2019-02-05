export interface State {
  App: App;
  Projects: Projects;
}

export interface App {
  title: string;
}

export interface Projects {
  projects: Project[];
  loadingAll: boolean;
}

export enum ProjectState {
  'loading',
  'validating',
  'synced',
  'error',
  'outOfSync' = 'out-of-sync',
}

export interface Project {
  name: string;
  uri: string;
  remote: string;
  error: string | null;
  loading: boolean;
  state: ProjectState;
  downloadPercent?: number;
  behind?: number;
  ahead?: number;
}
