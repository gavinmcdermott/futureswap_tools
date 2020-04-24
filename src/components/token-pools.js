import _ from 'lodash'
import moment from 'moment'
import numeral from 'numeral'
import React, { useEffect, useState } from "react"
import { navigate } from "gatsby"
import gql from "graphql-tag"
import { useQuery } from "@apollo/react-hooks"
import DataCard from './data-card'
import web3 from 'web3'

import BigNumber from 'bignumber.js'

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

const PREV_DAY = moment().subtract(1, 'day').unix()
// const PREV_WEEK = moment().subtract(7, 'day').unix()

const buildQuery = (timestamp) => {
  const GET_CURRENT_TOKEN_POOLS = gql`
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

  const GET_PREV_TOKEN_POOLS = gql`
    query {
      tokenPools(
        first: 1,
        orderBy: timestamp,
        orderDirection: asc,
        where: {
          timestamp_gte: ${timestamp}
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

  if (timestamp) {
    return GET_PREV_TOKEN_POOLS
  }
  return GET_CURRENT_TOKEN_POOLS
}


const formatAndSetComputedData = ({ data, setComputedData }) => {

  if (!data) {
    throw new Error('Missing TokenPool data')
  }
  if (!setComputedData) {
    throw new Error('Missing function (setComputedData) to set TokenPool data')
  }
  
  const totalAssetPool = new BigNumber(data.assetTokenAvailable).plus(new BigNumber(data.assetTokenBorrowPool))
  const assetTokenUtilization = new BigNumber(data.assetTokenBorrowPool)
    .dividedBy(totalAssetPool)
    .multipliedBy(new BigNumber(100))
    .toFormat(0)
  
  const totalStablePool = new BigNumber(data.stableTokenAvailable).plus(new BigNumber(data.shortBorrowValue))
  const stableTokenUtilization = new BigNumber(data.shortBorrowValue)
    .dividedBy(totalStablePool)
    .multipliedBy(new BigNumber(100))
    .toFormat(0)

  const assetTokenTotal = new BigNumber(data.assetTokenAvailable).plus(new BigNumber(data.assetTokenBorrowPool)).toFixed()
  const stableTokenTotal = new BigNumber(data.stableTokenAvailable).plus(new BigNumber(data.shortBorrowValue)).toFixed()

  const computed = {
    assetTokenTotal,
    stableTokenTotal,
    assetTokenUtilization,
    stableTokenUtilization
  }
  setComputedData(computed)

}


const Pools = (props) => {
  const classes = useStyles()
  const { data: dataCurrent, loading: loadingCurrent, error: errorCurrent } = useQuery(buildQuery(), { context: { WS: false }, },)
  const { data: dataPrevDay, loading: loadingPrevDay, error: errorPrevDay } = useQuery(buildQuery(PREV_DAY), { context: { WS: false }, },)
  
  const [current, setCurrent] = useState({})
  const [currentComputed, setCurrentComputed] = useState({})
  
  const [prevDay, setPrevDay] = useState({})
  const [prevDayComputed, setPrevDayComputed] = useState({})

  
  useEffect(() => {
    if (!dataCurrent) {
      return
    }
    const currentLocal = _.first(dataCurrent.tokenPools)
    setCurrent(currentLocal)

    formatAndSetComputedData({ 
      data: currentLocal,  
      setComputedData: setCurrentComputed 
    })
  }, [dataCurrent])


  useEffect(() => {
    if (!dataPrevDay || !_.isEmpty(prevDay)) {
      return
    }
    const prevDayLocal = _.first(dataPrevDay.tokenPools)
    setPrevDay(prevDayLocal)

    formatAndSetComputedData({ 
      data: prevDayLocal,  
      setComputedData: setPrevDayComputed 
    })
  }, [dataPrevDay])



  if (loadingCurrent || loadingPrevDay) {
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
          title="Total ETH in Long Pool"
          data={prettyFromWei(currentComputed.assetTokenTotal)}
          unit="ETH"
          description="Total ETH available"
        />

        <DataCard 
          title="24 Hour Change"
          data={
            new BigNumber(currentComputed.assetTokenTotal)
              .minus(new BigNumber(prevDayComputed.assetTokenTotal))
              .dividedBy(new BigNumber(prevDayComputed.assetTokenTotal))
              .multipliedBy(new BigNumber(100))
              .toFormat(2)
          }
          unit="%"
          description="Pct. change in ETH available for longs over prev 24 hours"
        />

        <DataCard 
          title="Open Longs (ETH)"
          data={prettyFromWei(current.assetTokenBorrowPool)}
          unit="ETH"
          description="Total ETH borrowed by long positions"
        />

        <DataCard 
          title="Open Longs (DAI)"
          data={prettyFromWei(current.longBorrowValue)}
          unit="DAI"
          description="Equivalent DAI borrowed by long positions"
        />

        <DataCard 
          title="Available Leverage (ETH)"
          data={prettyFromWei(current.assetTokenAvailable)}
          unit="ETH"
          description="Total ETH available for long positions"
        />

        <DataCard 
          title="Long Utilization Rate (ETH)"
          data={currentComputed.assetTokenUtilization}
          unit="%"
          description="ETH utilized in long positions"
        />





        <Grid item xs={12}>
          <Typography variant="h5" className={classes.title}>Shorts</Typography>
        </Grid>

        <DataCard 
          grid={12}
          title="Total DAI in Short Pool"
          data={prettyFromWei(currentComputed.stableTokenTotal)}
          unit="DAI"
          description="Total DAI available"
        />

        <DataCard 
          title="Open Shorts (DAI)"
          data={prettyFromWei(current.shortBorrowValue)}
          unit="DAI"
          description="Total DAI borrowed by short positions"
        />

        <DataCard 
          title="Open Shorts (ETH)"
          data={prettyFromWei(current.shortAssetBorrowPool)}
          unit="ETH"
          description="Equivalent ETH borrowed by short positions"
        />

        <DataCard 
          title="Available Leverage (DAI)"
          data={prettyFromWei(current.stableTokenAvailable)}
          unit="DAI"
          description="Total DAI available for short positions"
        />

        <DataCard 
          title="Short Utilization Rate (DAI)"
          data={currentComputed.stableTokenUtilization}
          unit="%"
          description="the amount of stable currently being borrowed by short trades"
        />      

        <DataCard 
          grid={12}
          title="Total in Contract (DAI)"
          data={prettyFromWei(current.stableTokenCollateralPool)}
          unit="DAI"
          description="Total collateral DAI held in contract"
        />

      </Grid>
    </>
  )
}

export default Pools
