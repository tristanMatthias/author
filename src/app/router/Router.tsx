import * as React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { App } from '../pages/App/App';
import { Project } from '../pages/Project/Project';

// // @ts-ignore
// @connect(
//   (state: State) => ({
//     loggedIn: state.Auth.loggedIn,
//     verified: state.Auth.verified,
//     token: state.Auth.token,
//     me: state.Me
//   }),
//   ((dispatch) => ({
//     actions: {
//       logout: () => logout()(dispatch),
//       verify: () => verify()(dispatch),
//       getMe: () => getMe()(dispatch)
//     }
//   }))
// )
export class Router extends React.Component {
  public render() {
    return <HashRouter>
      <Switch>
        <Route path='/' component={App} />
      </Switch>
    </HashRouter>;
  }
}
