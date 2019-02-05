import { Divider, Drawer, IconButton, List, ListItemIcon, ListItemText, Menu, MenuItem, withStyles } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import IconDelete from '@material-ui/icons/Delete';
import classNames from 'classnames';
import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { projectsAdd, projectsRemove } from '../../actions/Projects';
import { ModalAddProject } from '../../modals/ModalAddProject';
import { Project, Projects, State } from '../../store/state';
import { SidebarItem } from './SidebarItem';

const styles = (theme: string) => ({
  sidebar: {
    width: 240,
    display: 'block'
  }
});

export interface SidebarProps extends RouteComponentProps {
  actions: {
    projectsAdd(repo: string, name: string): void;
    projectsRemove(repo: string, name: string): void;
  };
  classes: any;
  projects: Projects;
}

export interface SidebarState {
  adding: boolean;
  contextMenuItem: any;
  contextMenuProject?: Project;
}

// tslint:disable-next-line:variable-name
class SidebarBase extends React.Component<SidebarProps, SidebarState>  {
  constructor(props: SidebarProps, state: SidebarState) {
    super(props, state);

    this.state = {
      adding: false,
      contextMenuItem: false
    };

    this.openAdd = this.openAdd.bind(this);
    this.closeDialogue = this.closeDialogue.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.removeProject = this.removeProject.bind(this);
  }


  public render() {
    const classes = this.props.classes;

    return <aside>
      <Drawer
        anchor='left'
        open={true}
        variant='persistent'
        className={classNames(classes.sidebar)}
      >
        <IconButton onClick={this.openAdd}>
          <AddIcon color='primary' fontSize='large' />
        </IconButton>
        <Divider />

        <List className={classNames(classes.sidebar)}>
          {this.props.projects.projects.map((p) =>
            <SidebarItem
              project={p}
              onContextMenu={(e) => this.rightClick(e, p)}
              key={p.name}
            />
          )}
        </List>

        {this.state.contextMenuItem
          ? <Menu id='project-menu'
            anchorEl={this.state.contextMenuItem}
            open={Boolean(this.state.contextMenuItem)}
            onClose={this.closeMenu}
          >
            <MenuItem className={classes.menuItem} onClick={() => this.removeProject()}>
              <ListItemIcon className={classes.icon}>
                <IconDelete />
              </ListItemIcon>
              <ListItemText primary='Delete' />
            </MenuItem>
          </Menu>
          : null
        }
      </Drawer>

      <ModalAddProject
        open={this.state.adding}
        close={this.closeDialogue}
      />
    </aside>;
  }

  public openAdd() {
    this.setState({
      adding: true
    });
  }

  public closeDialogue() {
    this.setState({
      adding: false
    });
  }

  public rightClick(e: MouseEvent, p: Project) {
    this.setState({
      contextMenuItem: e.target,
      contextMenuProject: p
    });
  }

  public closeMenu() {
    this.setState({
      contextMenuItem: false,
      contextMenuProject: undefined
    });
  }

  public removeProject() {
    if (!this.state.contextMenuProject) return;
    this.props.actions.projectsRemove(
      this.state.contextMenuProject.remote,
      this.state.contextMenuProject.name
    );

    this.closeMenu();
  }
}


// tslint:disable-next-line:variable-name
export const Sidebar = connect(
  (state: State) => ({
    projects: state.Projects
  }),
  (dispatch) => ({
    actions: {
      projectsAdd: (repo: string, name: string) => projectsAdd(repo, name)(dispatch),
      projectsRemove: (repo: string, name: string) => projectsRemove(repo, name)(dispatch)
    }
  })
)(
  withRouter(
  withStyles(styles, { withTheme: true })(SidebarBase)
  )
);
