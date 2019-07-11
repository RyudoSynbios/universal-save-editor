import React, { Component } from 'react';
import PropTypes from 'prop-types';

import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import blue from '@material-ui/core/colors/blue';

import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';

import { withStyles } from '@material-ui/core/styles';

import HexEditor from '../utils/hexEditor';

import config from '../games/AGB_A2CP_EUR';

const styles = theme => ({
  root: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    marginLeft: 'auto',
    marginRight: 'auto',
    width: 900,
  },
  toolbar: {
    display: 'flex',
    color: '#ffffff',
    backgroundColor: blue[700],
  },
  avatar: {
    marginLeft: -12,
    marginRight: 12,
  },
  title: {
    flex: 1,
  },
  saveIcon: {
    marginRight: -12,
  },
  content: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
  }),
  hidden: {
    display: 'none',
  },
  category: {
    '&:not(:first-child)': {
      marginTop: 12,
      paddingTop: 12,
      borderTop: '1px solid rgba(0, 0, 0, 0.12)',
    },
  },
  fields: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  tab: {
    marginTop: 16,
    width: '100%',
  },
  tabContent: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    flexBasis: '25%',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
});

class EditorContainer extends Component {
  constructor() {
    super();
    this.state = {
      save: {},
      saveLoaded: false,
      snackbar: {
        open: false,
        message: '',
      },
      tabs: {},
    };
    this.onLoad = this.onLoad.bind(this);
    this.onUpload = this.onUpload.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
  }

  componentDidMount() {
    document.getElementById('file').addEventListener('change', this.onUpload);
  }

  componentWillUnmount() {
    document.getElementById('file').removeEventListener('change', this.onUpload);
  }

  onLoad() {
    if (config.informations.checkFile) {
      try {
        config.informations.checkFile.forEach((value, index) => {
          if (this.saveFile.readByte(0x0 + 0x1 * index, 8, 'number') !== value) {
            throw new Error('Unexcepted file.');
          }
        });
      } catch (error) {
        this.setState({
          snackbar: {
            open: true,
            message: error.message,
          },
        });
        return;
      }
    }

    const values = {};
    Object.keys(config.sections).forEach((section) => {
      if (config.sections[section].tabs) {
        Object.keys(config.sections[section].tabs).forEach((tab) => {
          if (config.sections[section].tabs[tab].values) {
            Object.keys(config.sections[section].tabs[tab].values).forEach((value) => {
              values[`${section}_${tab}_${value}`] = this.saveFile.readByte(
                config.sections[section].tabs[tab].values[value].offset,
                config.sections[section].tabs[tab].values[value].octets,
                config.sections[section].tabs[tab].values[value].type,
              );
            });
          } else {
            Object.keys(config.sections[section].tabs[tab].list.names).forEach((name, index) => {
              values[`${section}_${tab}_${name.toLowerCase()}`] = this.saveFile.readByte(
                config.sections[section].tabs[tab].list.offset + config.sections[section].tabs[tab].list.octets / 8 * index,
                config.sections[section].tabs[tab].list.octets,
                config.sections[section].tabs[tab].list.type,
              );
            });
          }
        });
      } else if (config.sections[section].values) {
        Object.keys(config.sections[section].values).forEach((value) => {
          values[`${section}_${value}`] = this.saveFile.readByte(
            config.sections[section].values[value].offset,
            config.sections[section].values[value].octets,
            config.sections[section].values[value].type,
          );
        });
      } else {
        Object.keys(config.sections[section].list.names).forEach((name, index) => {
          values[`${section}_${name.toLowerCase()}`] = this.saveFile.readByte(
            config.sections[section].list.offset + config.sections[section].list.octets / 8 * index,
            config.sections[section].list.octets,
            config.sections[section].list.type,
          );
        });
      }
    });

    this.setState({
      save: values,
      saveLoaded: true,
    });
  }

  onUpload(e) {
    this.saveFile = new HexEditor(e.target.files[0], this.onLoad);
  }

  handleInputChange(event) {
    this.setState({
      save: {
        ...this.state.save,
        [event.target.name]: event.target.value,
      },
    });
  }

  handleSave() {
    Object.keys(config.sections).forEach((section) => {
      if (config.sections[section].tabs) {
        Object.keys(config.sections[section].tabs).forEach((tab) => {
          if (config.sections[section].tabs[tab].values) {
            Object.keys(config.sections[section].tabs[tab].values).forEach((value) => {
              this.saveFile.writeByte(
                config.sections[section].tabs[tab].values[value].offset,
                this.state.save[`${section}_${tab}_${value}`],
                config.sections[section].tabs[tab].values[value].octets,
                config.sections[section].tabs[tab].values[value].type,
              );
            });
          } else {
            Object.keys(config.sections[section].tabs[tab].list.names).forEach((name, index) => {
              this.saveFile.writeByte(
                config.sections[section].tabs[tab].list.offset + config.sections[section].tabs[tab].list.octets / 8 * index,
                this.state.save[`${section}_${tab}_${name.toLowerCase()}`],
                config.sections[section].tabs[tab].list.octets,
                config.sections[section].tabs[tab].list.type,
              );
            });
          }
        });
      } else if (config.sections[section].values) {
        Object.keys(config.sections[section].values).forEach((value) => {
          this.saveFile.writeByte(
            config.sections[section].values[value].offset,
            this.state.save[`${section}_${value}`],
            config.sections[section].values[value].octets,
            config.sections[section].values[value].type,
          );
        });
      } else {
        Object.keys(config.sections[section].list.names).forEach((name, index) => {
          this.saveFile.writeByte(
            config.sections[section].list.offset + config.sections[section].list.octets / 8 * index,
            this.state.save[`${section}_${name.toLowerCase()}`],
            config.sections[section].list.octets,
            config.sections[section].list.type,
          );
        });
      }
    });
    this.saveFile.save();
  }

  handleSnackbarClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({
      snackbar: {
        open: false,
        message: '',
      },
    });
  }

  handleTabChange(name, event, value) {
    this.setState({
      tabs: {
        [name]: value,
      },
    });
  }

  render() {
    const { classes } = this.props;
    const { save, saveLoaded } = this.state;

    return (
      <div>
        <Paper className={classes.root}>
          <Toolbar className={classes.toolbar}>
            <Avatar src={`/img/icons/${config.informations.id}.png`} className={classes.avatar} />
            <Typography color="inherit" component="div" variant="h6" className={classes.title}>
              {config.informations.name}
            </Typography>
            {saveLoaded ? (
              <IconButton color="inherit" className={classes.saveIcon} onClick={this.handleSave}>
                <SaveIcon />
              </IconButton>
            ) : null}
          </Toolbar>
          <div className={classes.content}>
            <div className={saveLoaded ? classes.hidden : null}>
              <input id="file" type="file" />
            </div>
            <div className={!saveLoaded ? classes.hidden : null}>
              {Object.keys(config.sections).map(section => (
                <div key={section} className={classes.category}>
                  <Typography component="div" variant="h6">{config.sections[section].name}</Typography>
                  <div className={classes.fields}>
                    {config.sections[section].tabs ? (
                      <div className={classes.tab}>
                        <AppBar position="static" color="default" elevation={1}>
                          <Tabs
                            value={this.state.tabs[section] || 0}
                            onChange={this.handleTabChange.bind(this, section)}
                            indicatorColor="primary"
                            textColor="primary"
                          >
                            {Object.keys(config.sections[section].tabs).map(tab => <Tab key={tab} label={config.sections[section].tabs[tab].name} />)}
                          </Tabs>
                        </AppBar>
                        {Object.keys(config.sections[section].tabs).map((tab, index) =>
                            ((!this.state.tabs[section] && index === 0) || this.state.tabs[section] === index) && (
                              <div key={tab} className={classes.tabContent}>
                                {config.sections[section].tabs[tab].values
                                  ? Object.keys(config.sections[section].tabs[tab].values)
                                      .filter(value => !config.sections[section].tabs[tab].values[value].hidden)
                                      .map(value => (
                                        <div key={value} className={classes.textField}>
                                          <TextField
                                            name={`${section}_${tab}_${value}`}
                                            label={config.sections[section].tabs[tab].values[value].name}
                                            value={save[`${section}_${tab}_${value}`] !== undefined ? save[`${section}_${tab}_${value}`] : ''}
                                            onChange={this.handleInputChange}
                                            type={config.sections[section].tabs[tab].values[value].type}
                                            InputProps={{ inputProps: config.sections[section].tabs[tab].values[value].inputProps }}
                                            fullWidth
                                            margin="normal"
                                          />
                                        </div>
                                      ))
                                  : Object.keys(config.sections[section].tabs[tab].list.names).map(name => (
                                    <div key={name.toLowerCase()} className={classes.textField}>
                                      <TextField
                                        name={`${section}_${tab}_${name.toLowerCase()}`}
                                        label={config.sections[section].tabs[tab].list.names[name]}
                                        value={save[`${section}_${tab}_${name}`] !== undefined ? save[`${section}_${tab}_${name}`] : ''}
                                        onChange={this.handleInputChange}
                                        type={config.sections[section].tabs[tab].list.type}
                                        InputProps={{ inputProps: config.sections[section].tabs[tab].list.inputProps }}
                                        fullWidth
                                        margin="normal"
                                      />
                                    </div>
                                    ))}
                              </div>
                            ))}
                      </div>
                    ) : config.sections[section].values ? (
                      Object.keys(config.sections[section].values)
                        .filter(value => !config.sections[section].values[value].hidden)
                        .map(value => (
                          <div key={value} className={classes.textField}>
                            <TextField
                              name={`${section}_${value}`}
                              label={config.sections[section].values[value].name}
                              value={save[`${section}_${value}`] !== undefined ? save[`${section}_${value}`] : ''}
                              onChange={this.handleInputChange}
                              type={config.sections[section].values[value].type}
                              InputProps={{ inputProps: config.sections[section].values[value].inputProps }}
                              fullWidth
                              margin="normal"
                            />
                          </div>
                        ))
                    ) : (
                      Object.keys(config.sections[section].list.names).map(name => (
                        <div key={name.toLowerCase()} className={classes.textField}>
                          <TextField
                            name={`${section}_${name.toLowerCase()}`}
                            label={config.sections[section].list.names[name]}
                            value={save[`${section}_${name}`] !== undefined ? save[`${section}_${name}`] : ''}
                            onChange={this.handleInputChange}
                            type={config.sections[section].list.type}
                            InputProps={{ inputProps: config.sections[section].list.inputProps }}
                            fullWidth
                            margin="normal"
                          />
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Paper>
        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={this.state.snackbar.open}
          autoHideDuration={6000}
          onClose={this.handleSnackbarClose}
          message={<span>{this.state.snackbar.message}</span>}
          action={[
            <IconButton key="close" aria-label="Close" color="inherit" onClick={this.handleSnackbarClose}>
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </div>
    );
  }
}

EditorContainer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EditorContainer);
