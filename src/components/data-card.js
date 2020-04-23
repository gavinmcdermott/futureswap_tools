import React from "react"

import { makeStyles } from '@material-ui/core/styles'
import { 
  Grid,
  Box,
  Typography
} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    border: `1px solid #31355a`,
    borderRadius: theme.spacing(1),
  },
  title: {
    color: '#b5b5b5',
  },
  main: {
    color: '#5b7add',
  },
  description: {
    color: '#757575',
  }
}));

// #e82268 = red
// #03cfac = green

const DataCard = (props) => {
  const classes = useStyles()
  return (
    <>
      <Grid item xs={props.grid || 12} sm={props.grid || 6}>
        <Box p={2} className={classes.root}>
          <Typography variant="body1" gutterBottom className={classes.title}>
            {props.title}
          </Typography>
          <Typography variant="h4" className={classes.main}>
            {props.data} {props.unit}
          </Typography>
          {
            props.description &&
              <Typography variant="body2" gutterBottom className={classes.description}>
                {props.description}
              </Typography>
          }
        </Box>
      </Grid>
    </>
  )
}

export default DataCard
