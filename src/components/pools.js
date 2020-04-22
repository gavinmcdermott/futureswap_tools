import _ from 'lodash'
import moment from 'moment'
import React, { useEffect, useState } from "react"
import { navigate } from "gatsby"
import gql from "graphql-tag"
import { useQuery } from "@apollo/react-hooks"
import web3 from 'web3'

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"

/*
uint256 assetTokenBorrowPool; // the amount of asset currently being borrowed by long trades
uint256 longBorrowValue; // the combined value at open of outstanding long trades
uint256 shortAssetBorrowPool; // the asset equivalent amount of stable being borrowed by short trades
uint256 shortBorrowValue; // the combined value at open of outstanding short trades
uint256 stableTokenBorrowPool; // the amount of stable currently being borrowed by short trades
uint256 stableTokenCollateralPool; // the amount of collateral(stable) currently held in the contract
uint256 stablePoolSharesOutstanding; // the number of shares currently outstanding for the stable pool
*/

const GET_TOKEN_POOLS = gql`
  query {
    tokenPools(
      first:1
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


const GET_LIQUIDITY_EVENTS = gql`
  query {
    liquidityAdditions(
      first: 999,
      orderBy: timestamp,
      orderDirection: desc,
      where: {
        exchange: "0xF2d5cBa15c8367dd016FC9c4711443e61c7d95A6",
        # addedLiquidity: true
      }
    ) {
      id
      exchange
      assetTokenAmount
      stableTokenAmount
    	lstPrice
      addedLiquidity
    	timestamp
    }
  }
`

const Pools = (props) => {
  const { data, loading, error } = useQuery(GET_LIQUIDITY_EVENTS, { context: { WS: false }, },)

  const [liqAdded, setLiqAdded] = useState({})
  const [liqRemoved, setLiqRemoved] = useState({})

  useEffect(() => {
    if (!data) {
      return
    }

    const liquidityAdd = _.filter(data.liquidityAdditions, (e) => e.addedLiquidity)
    const totalAdded = _.reduce(liquidityAdd, (accum, event) => {
      return {
        assetTokenAmount: accum.assetTokenAmount + Number(web3.utils.fromWei(event.assetTokenAmount)),
        stableTokenAmount: accum.stableTokenAmount + Number(web3.utils.fromWei(event.stableTokenAmount))
      }
    }, { assetTokenAmount: 0, stableTokenAmount: 0 })
    setLiqAdded(totalAdded)
    
    

    const liquidityRemove = _.filter(data.liquidityAdditions, (e) => !e.addedLiquidity)
    const totalRemoved = _.reduce(liquidityRemove, (accum, event) => {
      return {
        assetTokenAmount: accum.assetTokenAmount + Number(web3.utils.fromWei(event.assetTokenAmount)),
        stableTokenAmount: accum.stableTokenAmount + Number(web3.utils.fromWei(event.stableTokenAmount))
      }
    }, { assetTokenAmount: 0, stableTokenAmount: 0 })
    setLiqRemoved(totalRemoved)

  }, [data])

  return (
    <div>
      
      <h3>Liquidity Events</h3>
      {data && data.liquidityAdditions.length} Liquidity Events 
      <br/>
      {data && liqAdded.assetTokenAmount - liqRemoved.assetTokenAmount} ETH in Liquidity
      <br/>
      {data && liqAdded.stableTokenAmount - liqRemoved.stableTokenAmount} DAI in Liquidity
      
    </div>
  )
}

export default Pools
