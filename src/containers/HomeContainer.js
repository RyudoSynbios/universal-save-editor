import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';

import { withStyles } from '@material-ui/core/styles';

import config from '../config';

const styles = {
  card: {
    maxWidth: 345,
  },
  media: {
    height: 200,
  },
};

const HomeContainer = ({ classes }) => (
  <div>
    {config.games.map(game => (
      <Card key={game} className={classes.card}>
        <CardMedia component={Link} to={`editor/${game}`} className={classes.media} image={`/img/home/${game}.png`} title={game} />
      </Card>
    ))}
  </div>
);
HomeContainer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HomeContainer);
