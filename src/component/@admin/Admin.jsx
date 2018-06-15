/* eslint-disable function-paren-newline */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/es/Grid/Grid'
import Container from '../Container'
import CardsAdmin from './CardsAdmin'
import TableUsers from './TableUsers'
import SelectControl from './SelectControl'

const styles = {}

const Admin = ({ dishes, checked, classes }) =>
  <Container>
    <SelectControl />
    <div className={classes.root}>
      <Grid container>
        {checked ?
          dishes.map((dish, index) =>
            <Grid key={index} item>
              <CardsAdmin />
            </Grid>)
          :
          <TableUsers />
        }
      </Grid>
    </div>
  </Container>

Admin.propTypes = {
  classes: PropTypes.object.isRequired,
  dishes: PropTypes.array.isRequired,
  checked: PropTypes.bool.isRequired,
}

const mapStateToProps = (store) => ({
  dishes: store.loadDishes.dishes,
  checked: store.selectControl.checked,
})

export default connect(mapStateToProps)(withStyles(styles)(Admin))
