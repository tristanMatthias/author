import { Card, CardContent, FormControl, TextField, withStyles } from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Dispatch } from 'redux';
import { setActions } from '../../actions/App';
import { projectSaveFile } from '../../actions/Projects';
import { AppBarAction, Project, ProjectFileData, State } from '../../store/state';


const styles = (theme: string) => ({
  card: {
    width: '100%',
    maxWidth: '800px',
  },
  input: {
    width: '100%'
  }
});

export interface ProjectEditorProps {
  project: Project;
  file: string;
  classes: any;
  actions: {
    setActions(actions: AppBarAction[]): void;
    save(repo: string, name: string, file: string, fileData: object): void;
  };
}

export interface ProjectEditorState {
  values: { [key: string]: string };
  dirtyValues: { [key: string]: string };
  refresh: boolean;
}

// tslint:disable-next-line:variable-name
class ProjectEditorBase extends React.Component<ProjectEditorProps, ProjectEditorState> {

  get file() {
    if (!this.props.project.files) return false;
    return this.props.project.files[this.props.file];
  }

  get dirty() {
    return Object.entries(this.state.dirtyValues).find(([k, v]) => {
      return this.state.values[k] !== v;
    });
  }

  constructor(props: ProjectEditorProps, state: ProjectEditorState) {
    super(props, state);

    this.state = {
      values: (this.props.project.files as ProjectFileData)[this.props.file],
      dirtyValues: (this.props.project.files as ProjectFileData)[this.props.file],
      refresh: false
    };

    this._updateActions = this._updateActions.bind(this);
  }

  public render() {
    const classes = this.props.classes;
    const file = this.file;
    if (!file) return null;

    return <Card className={classes.card} key={this.state.refresh ? '0' : '1'}>
      <CardContent>
        <FormControl className={classes.input}>
          {Object.entries(file).map(([key, value]) =>
            <TextField
              key={key}
              id={key}
              label={this._convertCase(key)}
              className={classes.input}
              defaultValue={this.state.dirtyValues[key]}
              onChange={(e: React.ChangeEvent) => this.onChange(key, e.target.value)}
              margin='normal'
            />
          )}
        </FormControl>
      </CardContent>
    </Card>;
  }

  public onChange(key: string, value: string) {
    this.setState({
      dirtyValues: { ...this.state.dirtyValues, [key]: value }
    }, this._updateActions);

  }

  private _reset() {
    this.setState({
      dirtyValues: this.state.values,
      refresh: !this.state.refresh
    }, () => {
      this.setState({
        refresh: !this.state.refresh
      });
      this._updateActions();
    });
  }

  private _save() {
    const {file} = this.props;
    const {remote, name} = this.props.project;
    const {dirtyValues} = this.state;
    this.props.actions.save(remote, name, file, dirtyValues);

    this.setState({
      values: this.state.dirtyValues
    }, this._updateActions);
  }

  private _updateActions() {
    const dirty = this.dirty;

    if (dirty) {
      this.props.actions.setActions([
        {
          icon: 'save',
          function: this._save.bind(this),
          tooltip: 'Save'
        },
        {
          icon: 'refresh',
          function: this._reset.bind(this),
          tooltip: 'Reset'
        }
      ]);
    } else {
      this.props.actions.setActions([]);
    }
  }

  private _convertCase(str: string) {
    const converted = str.replace(/([A-Z]+)/g, ' $1').replace(/([A-Z][a-z])/g, ' $1');
    return converted.charAt(0).toUpperCase() + converted.slice(1);
  }
}

// tslint:disable-next-line:variable-name
export const ProjectEditor = connect(
  (state: State) => ({}),
  (dispatch: Dispatch) => ({
    actions: {
      setActions: (actions: AppBarAction[]) => setActions(actions)(dispatch),
      save: (repo: string, name: string, file: string, fileData: object) =>
        projectSaveFile(repo, name, file, fileData)(dispatch)
    }
  }),
)(
  withRouter(
    withStyles(styles, { withTheme: true })(ProjectEditorBase)
  )
);
