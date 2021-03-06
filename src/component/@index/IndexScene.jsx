import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import Grid from '@material-ui/core/es/Grid/Grid'
import Header from '../Header/Header'
import IndexBody from './IndexBody'
import { loadModalData, showStatistics } from '../../redux/actions/load.action'
import Cache from '../../services/Cache'

class IndexScene extends React.Component {
  componentWillMount() {
    if (Cache.get('user')) {
      if (!Cache.get('user').authorization) {
        this.props.history.push('/signUp')
      }
    } else this.props.history.push('/signUp')

    this.props.dispatch(showStatistics())
    this.props.dispatch(loadModalData())
  }

  render() {
    return (
      <Grid container justify="center">
        <Header />
        <IndexBody />
      </Grid>
    )
  }
}

IndexScene.propTypes = {
  history: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
}

export default connect()(withRouter(IndexScene))
