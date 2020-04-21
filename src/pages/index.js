import React, { useEffect, useState } from "react"
import { navigate } from "gatsby"
import gql from "graphql-tag"
import { useQuery } from "@apollo/react-hooks"
import web3 from 'web3'

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"
import Positions from "../components/positions"


// const INITIAL_STATE = {
//   trades: [],
//   status: 'IDLE'
// }

// const reducer = (state, action) => {
//   switch (action.type) {
//     case 'updateTransactions':
//       return { ...state, [action.field]: action.value }
//       break;
//     default:
//       console.error('Invalid case!')
//   }
// }




const GET_OPEN_TRADES = gql`
  query {
    trades(
      first: 500,
      orderBy: tradeId,
      orderDirection: desc,
      where: {
        tradeOpen: true
        exchange: "0xF2d5cBa15c8367dd016FC9c4711443e61c7d95A6"
      }
    ) {
      id
      exchange
      tradeId
      tradeOpen
      isLong
      stablePrice
      assetPrice
      leverage
      assetTokenBorrowed
    }
  }
`

const IndexPage = props => {
  const { data, loading, error } = useQuery(GET_OPEN_TRADES, { context: { WS: false }, },)

  return (
    <Layout>
      <SEO title="Home" />
      {/* {data && data.trades ? JSON.stringify(data.trades) : loading ? "Loading..." : error && error.message} */}
      <Positions data={data} />
    </Layout>
  )
}

export default IndexPage
