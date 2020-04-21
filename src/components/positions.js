import _ from 'lodash'
import React, { useEffect, useState } from "react"
import { navigate } from "gatsby"
import gql from "graphql-tag"
import { useQuery } from "@apollo/react-hooks"
import web3 from 'web3'

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"


// const GET_LAST_TRADE = gql`
//   query {
//     trades(
//       first: 5,
//       orderBy: tradeId,
//       orderDirection: desc,
//       where: {
//         tradeOpen: true
//         exchange: "0xF2d5cBa15c8367dd016FC9c4711443e61c7d95A6"
//       }
//     ) {
//       id
//       exchange
//       tradeId
//       tradeOpen
//       stablePrice
//       assetPrice
//       isLong
//     }
//   }
// `

const IndexPage = ({ data }) => {
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
    <div>
      <hr/>
      {/* {JSON.stringify(longs)}
      <hr/>
      {JSON.stringify(shorts)} */}
      shorts: {shorts.length}
      <br/>
      open shorts: {
        shorts && _.reduce(shorts, (accum, trade) => {
          console.log(trade.assetTokenBorrowed)
          return accum + Number(web3.utils.fromWei(trade.assetTokenBorrowed))
        }, 0)
      }
      <hr/>
      longs: {longs.length}
      <br/>
      open longs: {
        longs && _.reduce(longs, (accum, trade) => {
          // console.log(trade.assetTokenBorrowed)
          return accum + Number(web3.utils.fromWei(trade.assetTokenBorrowed))
        }, 0)
      }
    
    </div>
  )
}

export default IndexPage
