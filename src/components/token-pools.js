import _ from 'lodash'
import moment from 'moment'
import React, { useEffect, useState } from "react"
import { navigate } from "gatsby"
import gql from "graphql-tag"
import { useQuery } from "@apollo/react-hooks"
import web3 from 'web3'

import Layout from "./layout"
import Image from "./image"
import SEO from "./seo"


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

const prettyFromWei = (wei) => wei && Number(web3.utils.fromWei(wei))

const Pools = (props) => {
  const { data, loading, error } = useQuery(GET_TOKEN_POOLS, { context: { WS: false }, },)

  const [pools, setPools] = useState({})

  useEffect(() => {
    if (!data) {
      return
    }
    setPools(_.first(data.tokenPools))
  }, [data])

  if (loading) {
    return <div>Loading Token Pools</div>
  }

  console.log(pools)
  return (
    <div>
      <h3>Market State: Token Pools</h3>
      {pools && prettyFromWei(pools.assetTokenAvailable)} ETH still available
      <br/>
      {pools && prettyFromWei(pools.stableTokenAvailable)} DAI still available
      <hr/>
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
      <br/>
      
      
    </div>
  )
}

export default Pools
