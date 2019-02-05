import { CircularProgress, Divider, ListItem, ListItemText, Tooltip } from '@material-ui/core';
import IconTick from '@material-ui/icons/Check';
import IconError from '@material-ui/icons/Error';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Project, ProjectState } from '../../store/state';


export interface SidebarItemProps extends RouteComponentProps {
  project: Project;
  onContextMenu(e: React.MouseEvent): void;
}


class SidebarItemBase extends React.Component<SidebarItemProps> {
  constructor(props, state) {
    super(props, state);
    this.onClick = this.onClick.bind(this);
  }
  public render() {
    const p = this.props.project;

    return <>
      <ListItem
        button
        onClick={this.onClick}
        onContextMenu={this.props.onContextMenu}
      >
        <ListItemText primary={p.name} />
        {this.status}
      </ListItem>
      <Divider />
    </>;
  }


  get status() {
    const p = this.props.project;

    switch (p.state) {
      case ProjectState.error:
        return <Tooltip title={p.error} placement='right'>
          <div>
            <IconError color='error' />
          </div>
        </Tooltip>;


      case ProjectState.loading:
        return <CircularProgress
          variant='static'
          value={p.downloadPercent} size={20}
        />;


      case ProjectState.synced:
      default:
        return <Tooltip title='Project is up to date' placement='right'>
          <div>
            <IconTick color='disabled' />
          </div>
        </Tooltip>;
    }
  }

  public onClick() {
    this.props.history.push(`/project/${this.props.project.name}`);
  }
}

// tslint:disable-next-line:variable-name
export const SidebarItem = withRouter(SidebarItemBase);
