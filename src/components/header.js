import React from "react"
import { Link } from "gatsby"

import { makeStyles } from '@material-ui/core/styles'
import { 
  AppBar,
  Toolbar,
  Typography,
  Button
} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    color: '#CCC',
    backgroundColor: '#15181f',
    borderBottom: '1px solid #383f4e'
  },
  menuButton: {
    paddingRight: theme.spacing(3), 
    paddingLeft: theme.spacing(3), 
    backgroundColor: '#5b7add',
  },
  menuLink: {
    color: '#FFF',
    textDecoration: 'none'
  },
  title: {
    flexGrow: 1,
  },
}));

const Header = ({ siteTitle }) => {
  const classes = useStyles();

  return (
    <AppBar position="fixed" className={classes.root}>
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          Futureswap.tools
        </Typography>

        <Button edge="end" className={classes.menuButton} aria-label="menu">
          <a className={classes.menuLink} href="https://exchange.futureswap.com/?src=0x908a57d405f15cf13365d7d5FE32fCA05e324B19" target="_blank">
            Start trading on Futureswap
          </a>
        </Button>
      </Toolbar>
    </AppBar>
  )
}

export default Header
