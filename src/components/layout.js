import React from "react"
import PropTypes from "prop-types"

import { makeStyles } from '@material-ui/core/styles';
import { Container } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  main: {
    paddingTop: theme.spacing(12),
    color: '#FEFEFE',
  },
}));

import Header from "./header"

const Layout = ({ children }) => {
  const classes = useStyles();
  return (
    <>
      <Header />
      <Container maxWidth="lg" className={classes.main}>
        {children}
      </Container>
    </>

  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
