import { Card, CardContent, FormControl, InputLabel, Select, Typography, withStyles } from '@material-ui/core';
import IconError from '@material-ui/icons/Error';
import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { Dispatch } from 'redux';
import { setTitle } from '../../actions/App';
import { projectLoadFiles } from '../../actions/Projects';
import { Project as StateProject, State } from '../../store/state';
import { ProjectEditor } from './ProjectEditor';


const styles = (theme: string) => ({
  select: {
    width: '100%',
    maxWidth: '800px',
    minWidth: '200px',
    marginBottom: '20px'
  },
  errorImage: {
    verticalAlign: 'middle'
  },
  errorHeading: {
    display: 'inline-block',
    marginLeft: '20px',
    verticalAlign: 'middle'
  }
});

export interface ProjectProps extends RouteComponentProps<{ projectID: string }> {
  projects: StateProject[];
  classes: any;
  actions: {
    setTitle(title: string): void;
    projectLoadFiles(repo: string, name: string): void;
  };
}

export interface ProjectState {
  selectedFile: null | string;
  initialLoad: boolean;
}

// tslint:disable-next-line:variable-name
class ProjectBase extends React.Component<ProjectProps, ProjectState> {

  constructor(props: ProjectProps, state: ProjectState) {
    super(props, state);

    this.state = {
      selectedFile: null,
      initialLoad: false
    };
  }

  get uri() {
    return this.props.match.params.projectID;
  }
  get project() {
    return this.props.projects.find((p) => p.uri === this.uri);
  }

  public componentDidMount() {
    this.props.actions.setTitle(this.uri);
  }

  public componentWillReceiveProps(p: ProjectProps) {
    const project = this.project;
    // Load the project files if not loaded

    if (project && !project.error && !this.state.initialLoad) {
      this.props.actions.projectLoadFiles(project.remote, project.name);
      this.setState({initialLoad: true});
    }

    if (this.uri !== p.match.params.projectID) {
      this.props.actions.setTitle(p.match.params.projectID);
    }

  }

  public render() {
    const project = this.project;
    let error;
    const classes = this.props.classes;

    if (!project) error = 'Project not found';
    else error = project.error;


    if (error) {
      return <Card>
        <CardContent>
          <IconError color='error' fontSize='large' className={classes.errorImage} />
          <Typography variant='h6' color='error' className={classes.errorHeading}>{error}</Typography>
        </CardContent>
      </Card>;
    }

    if (!Object.entries(project.files).length) {
      return <Card>
        <CardContent>
          <Typography
            variant='h6'
            className={classes.errorHeading}
          >Project has no editable files</Typography>
        </CardContent>
      </Card>;
    }

    return <>
      <FormControl className={classes.select}>
        <InputLabel htmlFor='project-file'>Content JSON file</InputLabel>
        <Select
          native
          inputProps={{
            id: 'project-file',
          }}
          onChange={(e) => this.setState({selectedFile: e.target.value})}
        >
          {Object.keys(project.files).map((k) =>
            <option value={k} key={k} aria-selected>{k}</option>
          )}
        </Select>
      </FormControl>

      {this.state.selectedFile
        ? <ProjectEditor
          project={project}
          file={this.state.selectedFile}
          key={this.state.selectedFile}
        />
        : null
      }
    </>;
  }
}

// tslint:disable-next-line:variable-name
export const Project = connect(
  (state: State) => ({
    projects: state.Projects.projects
  }),
  (dispatch: Dispatch) => ({
    actions: {
      setTitle: (title: string) => setTitle(title)(dispatch),
      projectLoadFiles: (repo: string, name: string) => projectLoadFiles(repo, name)(dispatch)
    }
  }),
)(
  withRouter(
    withStyles(styles, { withTheme: true })(ProjectBase)
  )
);
