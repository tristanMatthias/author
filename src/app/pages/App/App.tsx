import { AppBar, Toolbar, Typography, withStyles } from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router';
import { projectsLoad } from '../../actions/Projects';
import { State } from '../../store/state';
import { Sidebar } from '../../ui/Sidebar/Sidebar';
import { Project } from '../Project/Project';

const styles = (theme: string) => ({
  main: {
    position: 'absolute',
    top: 0,
    left: 240,
    bottom: 0,
    right: 0,
    padding: 40,
    paddingTop: 100,
    background: '#fafafa'
  },
  appBar: {
    width: 'calc(100% - 240px)'
  }
});

export interface AppProps {
  title: string;
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
            <Typography  variant='h6' color='inherit' noWrap>
              {this.props.title}
            </Typography>
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
}


// tslint:disable-next-line:variable-name
export const App = connect(
  (state: State) => ({
    title: state.App.title
  }),
  (dispatch) => ({
    actions: {
      projectsLoad: () => projectsLoad()(dispatch)
    }
  })
)(
  withStyles(styles, {withTheme: true})(AppBase)
);
