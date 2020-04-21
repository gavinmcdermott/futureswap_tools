import React, { useEffect, useState } from "react"
import { navigate } from "gatsby"
import gql from "graphql-tag"
import { useQuery } from "@apollo/react-hooks"
import web3 from 'web3'

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"


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




const GET_LAST_TRADE = gql`
  query {
    trades(
      first: 5,
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
      stablePrice
      assetPrice
      isLong
    }
  }
`

const IndexPage = props => {
  const { data, loading, error } = useQuery(GET_LAST_TRADE, { context: { WS: false }, },)
  const [shorts, setShorts] = useState([])
  const [longs, setLongs] = useState([])

  useEffect(() => {
    if (!data) {
      return
    }
    
    setLongs(data.trades.filter(t => t.isLong))
    setShorts(data.trades.filter(t => !t.isLong))

  }, [data])

  return (
    <Layout>
      <SEO title="Home" />
      {data && data.trades ? JSON.stringify(data.trades) : loading ? "Loading..." : error && error.message}
      <hr/>
      {JSON.stringify(longs)}
      <hr/>
      {JSON.stringify(shorts)}
    </Layout>
  )
}

export default IndexPage
