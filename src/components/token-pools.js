import _ from 'lodash'
import moment from 'moment'
import React, { useEffect, useState } from "react"
import { navigate } from "gatsby"
import gql from "graphql-tag"
import { useQuery } from "@apollo/react-hooks"
import DataCard from './data-card'

import { makeStyles } from '@material-ui/core/styles'
import { 
  Grid,
  Typography
} from '@material-ui/core'

import { prettyFromWei } from '../utils'

const useStyles = makeStyles((theme) => ({
  // root: {
  //   border: `1px solid #EFEFEF`,
  //   borderRadius: theme.spacing(1),
  // },
}));




const GET_TOKEN_POOLS = gql`
  query {
    tokenPools(
      first:1
      orderBy:timestamp
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

  const [pool, setPool] = useState({})
  const [poolCardsData, setPoolCardsData] = useState({})
  

  useEffect(() => {
    if (!data) {
      return
    }
    setPool(_.first(data.tokenPools))
  }, [data])

  if (loading || !pool) {
    return <div>Loading Token Pools</div>
  }

  

  return (
    <>
      <Typography variant="h3" gutterBottom>ETH-DAI Exchange</Typography>

      <Grid container spacing={2}>
        <Grid item xs={4}>
          <DataCard 
            title="ETH Available"
            data={prettyFromWei(pool.assetTokenAvailable)}
            unit="ETH"
            description="ETH available for longs"
          />
        </Grid>
        <Grid item xs={4}>
          <DataCard 
            title="DAI Available"
            data={prettyFromWei(pool.stableTokenAvailable)}
            unit="DAI"
            description="DAI available for shorts"
          />
        </Grid>
        <Grid item xs={4}>
          <DataCard 
            title="ETH Long"
            data={prettyFromWei(pool.assetTokenBorrowPool)}
            unit="ETH"
            description="ETH borrowed by the longs"
          />
        </Grid>
        <Grid item xs={4}>
          <DataCard 
            title="DAI Shorts"
            data={prettyFromWei(pool.stableTokenBorrowPool)}
            unit="DAI"
            description="DAI borrowed by the shorts"
          />
        </Grid>
        <Grid item xs={4}>
          <DataCard 
            title="DAI equiv ETH"
            data={prettyFromWei(pool.shortAssetBorrowPool)}
            unit="DAI"
            description="Equivalent ETH borrowed by shorts"
          />
        </Grid>
        <Grid item xs={4}>
          <DataCard 
            title="DAI Longs"
            data={prettyFromWei(pool.longBorrowValue)}
            unit="DAI"
            description="Combined value of all open longs"
          />
        </Grid>
        <Grid item xs={4}>
          <DataCard 
            title="DAI Shorts"
            data={prettyFromWei(pool.shortBorrowValue)}
            unit="DAI"
            description="Combined value of all open shorts"
          />
        </Grid>
        <Grid item xs={4}>
          <DataCard 
            title="DAI Total in Contract"
            data={prettyFromWei(pool.stableTokenCollateralPool)}
            unit="DAI"
            description="Amount of stable held in contract"
          />
        </Grid>
      </Grid>


      {/* {pools && prettyFromWei(pools.stableTokenAvailable)} DAI still available */}
      {/* <hr/>
      {pools && prettyFromWei(pools.assetTokenBorrowPool)} ETH : being borrowed by the longs
      <br/>
      {pools && prettyFromWei(pools.stableTokenBorrowPool)} DAI : being borrowed by the shorts
      <br/>
      {pools && prettyFromWei(pools.shortAssetBorrowPool)} ETH : equiv ETH being borrowed by the shorts
      <br/>
      {pools && prettyFromWei(pools.longBorrowValue)} DAI : combined value of all open longs
      <br/>
      {pools && prettyFromWei(pools.shortBorrowValue)} DAI : combined value of all open shorts
      <br/>
      {pools && prettyFromWei(pools.stableTokenCollateralPool)} DAI : amount of stable held in contract
      <br/> */}
      
      
    </>
  )
}

export default Pools
