import React from "react"

import { makeStyles } from '@material-ui/core/styles'
import { 
  Box,
  Typography
} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    // width: '100%',
    // display: 'flex',
    // flexDirection: 'column',
    border: `1px solid #EFEFEF`,
    borderRadius: theme.spacing(1),
  },
}));

const DataCard = (props) => {
  const classes = useStyles()
  return (
    <Box p={2} className={classes.root}>
      <Typography variant="h6" gutterBottom>{props.title}</Typography>
      <Typography variant="h5">
        {props.data} {props.unit}
      </Typography>
      {
        props.description
          ?
            <Typography variant="body2" gutterBottom>
              {props.description}
            </Typography>
          : null
      }
    </Box>
  )
}

export default DataCard
