import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Card, { CardMedia } from 'material-ui/Card';

import { withStyles } from 'material-ui/styles';

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
      <Card className={classes.card}>
        <CardMedia component={Link} to={`editor/${game}`} className={classes.media} image={`/img/home/${game}.png`} title={game} />
      </Card>
    ))}
  </div>
);
HomeContainer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HomeContainer);
