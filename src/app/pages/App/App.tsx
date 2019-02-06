import { AppBar, IconButton, Toolbar, Tooltip, Typography, withStyles } from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router';
import { projectsLoad } from '../../actions/Projects';
import { AppBarAction, State } from '../../store/state';
import { Sidebar } from '../../ui/Sidebar/Sidebar';
import { Project } from '../Project/Project';

import IconRestore from '@material-ui/icons/Restore';
import IconSave from '@material-ui/icons/Save';

const styles = (theme: string) => ({
  main: {
    position: 'absolute',
    top: 0,
    left: 240,
    bottom: 0,
    right: 0,
    padding: 40,
    paddingTop: 100,
    background: '#fafafa',
    overflowY: 'auto'
  },
  appBar: {
    width: 'calc(100% - 240px)'
  },
  actions: {
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'flex-end'
  }
});

export interface AppProps {
  title: string;
  appBarActions: AppBarAction[];
  classes: any;
  actions: {
    projectsLoad(): void;
  };
}

// tslint:disable-next-line:variable-name
class AppBase extends React.Component<AppProps> {
  public render() {
    return <div>
      <Sidebar />
      <main className={this.props.classes.main}>
        <AppBar className={this.props.classes.appBar}>
          <Toolbar>
            <Typography variant='h6' color='inherit' noWrap>
              {this.props.title}
            </Typography>
            <div className={this.props.classes.actions}>
              {this.props.appBarActions.map((a) =>
                <Tooltip title={a.tooltip} placement='bottom'>
                  <IconButton color='inherit' onClick={a.function}>
                    {this.icon(a.icon)}
                  </IconButton>
                </Tooltip>
              )}
            </div>
          </Toolbar>
        </AppBar>
        <Switch>
          <Route path='/project/:projectID' component={Project} />
        </Switch>
      </main>
    </div>;
  }

  public componentDidMount() {
    this.props.actions.projectsLoad();
  }

  public icon(type: string) {
    switch (type) {
      case 'save':
        return <IconSave />;

      case 'refresh':
        return <IconRestore />;
    }
  }
}


// tslint:disable-next-line:variable-name
export const App = connect(
  (state: State) => ({
    title: state.App.title,
    appBarActions: state.App.actions
  }),
  (dispatch) => ({
    actions: {
      projectsLoad: () => projectsLoad()(dispatch)
    }
  })
)(
  withStyles(styles, { withTheme: true })(AppBase)
);
