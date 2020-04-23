import _ from 'lodash'
import moment from 'moment'
import BigNum from 'bignumber.js'
import numeral from 'numeral'
import React, { useEffect, useState } from "react"
import { navigate } from "gatsby"
import gql from "graphql-tag"
import { useQuery } from "@apollo/react-hooks"
import DataCard from './data-card'
import web3 from 'web3'

import { makeStyles } from '@material-ui/core/styles'
import { 
  Grid,
  Typography
} from '@material-ui/core'

import { prettyFromWei } from '../utils'

const useStyles = makeStyles((theme) => ({
  title: {
    color: '#b5b5b5',
  },
}));


const YESTERDAY = moment().subtract(1, 'day').unix()

const GET_PREV_TOKEN_POOLS = gql`
  query {
    tokenPools(
      first: 1,
      orderBy: timestamp,
      orderDirection: desc,
      where: {
        timestamp_gte: ${YESTERDAY}
      }
    ) {
      id
      reason
      exchange
      timestamp
      assetTokenAvailable
      stableTokenAvailable
      assetTokenBorrowPool
      stableTokenBorrowPool
      shortAssetBorrowPool 
      longBorrowValue      
      shortBorrowValue     
      stablePoolSharesOutstanding
      stableTokenCollateralPool 
    }
  }
`

const GET_TOKEN_POOLS = gql`
  query {
    tokenPools(
      first: 1
      orderBy: timestamp
      orderDirection: desc
    ) {
      id
      reason
      exchange
      timestamp
      assetTokenAvailable
      stableTokenAvailable
      
      assetTokenBorrowPool          # the amount of asset currently being borrowed by long trades
      stableTokenBorrowPool         # the amount of stable currently being borrowed by short trades
      
      shortAssetBorrowPool          # the asset equivalent amount of stable being borrowed by short trades
      
      longBorrowValue               # the combined value at open of outstanding long trades
      shortBorrowValue              # the combined value at open of outstanding short trades
      
      stablePoolSharesOutstanding   # the number of shares currently outstanding for the stable pool
      stableTokenCollateralPool     # the amount of collateral(stable) currently held in the contract
    }
  }
`



const Pools = (props) => {
  const classes = useStyles()
  const { data, loading, error } = useQuery(GET_TOKEN_POOLS, { context: { WS: false }, },)
  
  // TODO: Get prev day's data to compare percentages / create a handler for parsing data
  // const { data: dataPrev, loading: loadingPrev, error: errorPrev } = useQuery(GET_PREV_TOKEN_POOLS, { context: { WS: false }, },)


  const [pool, setPool] = useState({})
  const [poolComputed, setPoolComputed] = useState({})
  const [poolCardsData, setPoolCardsData] = useState({})
  

  useEffect(() => {
    if (!data) {
      return
    }

    const poolLocal = _.first(data.tokenPools)

    setPool(poolLocal)

    const assetTokenUtilization = (
      numeral(
        parseFloat(poolLocal.assetTokenBorrowPool) / (
          parseFloat(poolLocal.assetTokenAvailable) + parseFloat(poolLocal.assetTokenBorrowPool)
        )
      ).format('0%')
    )
    
    const stableTokenUtilization = (
      numeral(
        parseFloat(poolLocal.shortBorrowValue) / (
          parseFloat(poolLocal.stableTokenAvailable) + parseFloat(poolLocal.shortBorrowValue)
        )
      ).format('0%')
    )

    const assetTokenTotal = new BigNum(poolLocal.assetTokenAvailable).plus(new BigNum(poolLocal.assetTokenBorrowPool)).toFixed()
    const stableTokenTotal = new BigNum(poolLocal.stableTokenAvailable).plus(new BigNum(poolLocal.shortBorrowValue)).toFixed()

    const computed = {
      assetTokenTotal,
      stableTokenTotal,
      assetTokenUtilization,
      stableTokenUtilization
    }
    setPoolComputed(computed)

  }, [data])

  if (loading || !pool) {
    return <div>Loading Token Pools</div>
  }

  return (
    <>
      <Typography variant="h3" gutterBottom className={classes.title}>ETH-DAI Exchange</Typography>

      <Grid container spacing={2}>

        <Grid item xs={12}>
          <Typography variant="h5" className={classes.title}>Longs</Typography>
        </Grid>

        <DataCard 
          grid={12}
          title="Total ETH in Long Pool"
          data={prettyFromWei(poolComputed.assetTokenTotal)}
          unit="ETH"
          description="Total ETH available"
        />

        <DataCard 
          title="Open Longs (ETH)"
          data={prettyFromWei(pool.assetTokenBorrowPool)}
          unit="ETH"
          description="Total ETH borrowed by long positions"
        />

        <DataCard 
          title="Open Longs (DAI)"
          data={prettyFromWei(pool.longBorrowValue)}
          unit="DAI"
          description="Equivalent DAI borrowed by long positions"
        />

        <DataCard 
          title="Available Leverage (ETH)"
          data={prettyFromWei(pool.assetTokenAvailable)}
          unit="ETH"
          description="Total ETH available for long positions"
        />

        <DataCard 
          title="Long Utilization Rate (ETH)"
          data={poolComputed.assetTokenUtilization}
          description="ETH utilized in long positions"
        />





        <Grid item xs={12}>
          <Typography variant="h5" className={classes.title}>Shorts</Typography>
        </Grid>

        <DataCard 
          grid={12}
          title="Total DAI in Short Pool"
          data={prettyFromWei(poolComputed.stableTokenTotal)}
          unit="DAI"
          description="Total DAI available"
        />

        <DataCard 
          title="Open Shorts (DAI)"
          data={prettyFromWei(pool.shortBorrowValue)}
          unit="DAI"
          description="Total DAI borrowed by short positions"
        />

        <DataCard 
          title="Open Shorts (ETH)"
          data={prettyFromWei(pool.shortAssetBorrowPool)}
          unit="ETH"
          description="Equivalent ETH borrowed by short positions"
        />

        <DataCard 
          title="Available Leverage (DAI)"
          data={prettyFromWei(pool.stableTokenAvailable)}
          unit="DAI"
          description="Total DAI available for short positions"
        />

        <DataCard 
          title="Short Utilization Rate (DAI)"
          data={poolComputed.stableTokenUtilization}
          unit="DAI"
          description="the amount of stable currently being borrowed by short trades"
        />      

        <DataCard 
          grid={12}
          title="Total in Contract (DAI)"
          data={prettyFromWei(pool.stableTokenCollateralPool)}
          unit="DAI"
          description="Total collateral DAI held in contract"
        />

      </Grid>
    </>
  )
}

export default Pools
