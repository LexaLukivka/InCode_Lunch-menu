/* eslint-disable no-mixed-operators */
import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Checkbox from '@material-ui/core/Checkbox'
import TextField from '@material-ui/core/es/TextField/TextField'
import EnhancedTableToolbar from './Table/EnhancedTableToolbar'
import EnhancedTableHead from './Table/EnhancedTableHead'
import ModalScene from '../../container/ModalScene'
import { changeBalance, createDataAdmin } from '../../redux/actions/loadDishes.action'

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    marginRight: 300,
  },
  table: {
    minWidth: 350,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
})

class TableUsers extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      order: 'asc',
      orderBy: 'money',
      selected: [],
      data: [].sort((a, b) => (a.balance < b.balance ? -1 : 1)),
      page: 0,
      rowsPerPage: 5,
    }
  }

  componentWillMount() {
    this.props.dispatch(createDataAdmin())
    console.log(this.props.values[0])
    this.setState({
      data: this.props.values[0],
    })
  }

  handleRequestSort = (event, property) => {
    const orderBy = property
    let order = 'desc'

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc'
    }

    const data =
      order === 'desc'
        ? this.props.users.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
        : this.props.users.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1))

    this.setState({ data, order, orderBy })
  }

  handleSelectAllClick = (event, checked) => {
    if (checked) {
      this.setState({ selected: this.state.data.map(n => n.id) })
      return
    }
    this.setState({ selected: [] })
  }

  handleClick = (event, id) => {
    const { selected } = this.state
    const selectedIndex = selected.indexOf(id)
    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      )
    }

    this.setState({ selected: newSelected })
  }

  handleChangePage = (event, page) => {
    this.setState({ page })
  }

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.user })
  }

  handleChange = (event) => {
    console.log(event.target.value)
    this.props.dispatch(changeBalance(event.target.value))
  }

  isSelected = id => this.state.selected.indexOf(id) !== -1

  render() {
    const { classes, users, values } = this.props
    const usersLength = users.map(v => v.length)
    const { data, order, orderBy, selected, rowsPerPage, page } = this.state

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, usersLength[0] - page * rowsPerPage)
    return (
      <div>
        <Paper className={classes.root}>
          <EnhancedTableToolbar numSelected={selected.length} />
          <div className={classes.tableWrapper}>
            <Table className={classes.table} aria-labelledby="tableTitle">
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={this.handleSelectAllClick}
                onRequestSort={this.handleRequestSort}
                rowCount={usersLength[0]}
              />
              <TableBody>
                {users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(value => value.map(v => {
                  const isSelected = this.isSelected(value.id)
                  return (
                    <TableRow
                      hover
                      onClick={event => this.handleClick(event, v.id)}
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={v.id}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox checked={isSelected} />
                      </TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        {v.email}
                      </TableCell>
                      <TableCell numeric>
                        <TextField
                          fullWidth
                          id="required"
                          label="Баланс"
                          defaultValue={v.balance}
                          onChange={this.handleChange.bind(this)}
                          type="number"
                          margin="normal"
                        />
                      </TableCell>
                    </TableRow>
                  )
                }))}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 49 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <TablePagination
            component="div"
            count={usersLength[0]}
            rowsPerPage={rowsPerPage}
            page={page}
            backIconButtonProps={{
              'aria-label': 'Previous Page',
            }}
            nextIconButtonProps={{
              'aria-label': 'Next Page',
            }}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        </Paper>

        <ModalScene />
      </div>
    )
  }
}

TableUsers.propTypes = {
  classes: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  users: PropTypes.array,
}
TableUsers.defaultProps = {
  users: '',
}

const mapStateToProps = (store) => ({
  users: store.loadDishes.users,
})

export default connect(mapStateToProps)(withStyles(styles)(TableUsers))
