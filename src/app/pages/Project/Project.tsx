import { Card, CardContent, Typography } from '@material-ui/core';
import IconError from '@material-ui/icons/Error';
import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { Dispatch } from 'redux';
import { setTitle } from '../../actions/App';
import { Project as StateProject, State } from '../../store/state';

export interface ProjectProps extends RouteComponentProps<{ projectID: string }> {
  projects: StateProject[];
  actions: {
    setTitle(title: string): void;
  };
}
// tslint:disable-next-line:variable-name
class ProjectBase extends React.Component<ProjectProps> {
  get uri() {
    return this.props.match.params.projectID;
  }
  get project() {
    return this.props.projects.find((p) => p.uri === this.uri);
  }
  public componentDidMount() {
    this.props.actions.setTitle(this.uri);
  }
  public render() {
    const project = this.project;
    let error;
    if (!project) error = 'Project not found';
    else error = project.error;

    return <>
      {error
        ? <Card>
          <CardContent>
            <IconError color='error' fontSize='large' />
            <Typography variant='h6' color='error'>{error}</Typography>
          </CardContent>
        </Card>
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
      setTitle: (title: string) => setTitle(title)(dispatch)
    }
  }),
)(withRouter(ProjectBase));
