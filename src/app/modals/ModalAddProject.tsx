import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@material-ui/core';
import React, { ChangeEvent, Dispatch } from 'react';
import { connect } from 'react-redux';
import { projectsAdd } from '../actions/Projects';
import { State } from '../store/state';

export interface ModalAddProjectProps {
  open: boolean;
  actions?: {
    projectsAdd(repo: string, name: string): void;
  };

  close(): void;
}

export interface ModalAddProjectState {
  repo?: string;
  name?: string;
}

class ModalAddProjectBase extends React.Component<ModalAddProjectProps, ModalAddProjectState> {

  public render() {
    const {open, close} = this.props;
    return <Dialog
      open={open}
      onClose={close}
      aria-labelledby='form-dialog-title'
    >
      <DialogTitle id='form-dialog-title'>Add a Bitbucket project</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Add a url to a Origin Bitbucket project you'd like to work on
              </DialogContentText>
        <TextField
          autoFocus
          margin='dense'
          id='name'
          label='Project name'
          type='text'
          fullWidth
          onChange={this.onChange.bind(this)}
        />
        <TextField
          margin='dense'
          id='repo'
          label='Bitbucket project url'
          type='text'
          fullWidth
          onChange={this.onChange.bind(this)}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={close} color='default'>
          Cancel
        </Button>
        <Button onClick={this.add.bind(this)} color='primary'>
          Add
        </Button>
      </DialogActions>

    </Dialog>;
  }

  public add() {
    this.props.actions.projectsAdd(
      this.state.repo,
      this.state.name
    );
    this.props.close();
  }

  public onChange(e: ChangeEvent<HTMLInputElement>) {
    this.setState({ [e.target.id]: e.target.value });
  }
}


// tslint:disable-next-line:variable-name
export const ModalAddProject = connect(
  (state: State) => ({
    projects: state.Projects
  }),
  (dispatch: Dispatch<any>) => ({
    actions: {
      projectsAdd: (repo: string, name: string) => projectsAdd(repo, name)(dispatch)
    }
  })
)(ModalAddProjectBase);
