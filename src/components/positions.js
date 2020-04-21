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
  
  const [longsTokenQty, setLongsTokenQty] = useState(0)
  const [avgLong, setAvgLong] = useState(0)
  const [largestLong, setLargestLong] = useState(0)

  const [shortsTokenQty, setShortsTokenQty] = useState(0)
  const [avgShort, setAvgShort] = useState(0)
  const [largestShort, setLargestShort] = useState(0)

  useEffect(() => {
    if (!data) {
      return
    }
    
    
    // Todo: move both to a single map / reduce
    const filteredLongs = data.trades.filter(t => t.isLong)
    setLongs(filteredLongs)
    const longsAccumTokenQty = _.reduce(filteredLongs, (accum, trade) => {
      const tradeSize = Number(web3.utils.fromWei(trade.assetTokenBorrowed))
      if (tradeSize > largestLong) {
        setLargestLong(tradeSize)
      }
      return accum + tradeSize
    }, 0)
    setLongsTokenQty(longsAccumTokenQty)
    setAvgLong(longsAccumTokenQty / filteredLongs.length)
    

    const filteredShorts = data.trades.filter(t => !t.isLong)
    setShorts(filteredShorts)
    const shortsAccumTokenQty = _.reduce(filteredShorts, (accum, trade) => {
      const tradeSize = Number(web3.utils.fromWei(trade.assetTokenBorrowed))
      if (tradeSize > largestShort) {
        setLargestShort(tradeSize)
      }
      return accum + tradeSize
    }, 0)
    setShortsTokenQty(shortsAccumTokenQty)
    setAvgShort(shortsAccumTokenQty / filteredShorts.length)

    

  }, [data])

  return (
    <div>
      <hr/>
      shorts: {shorts.length}
      <br/>
      open shorts: {shortsTokenQty} ETH
      <br/>
      avg position size: {avgShort} ETH | Biggest {largestShort} ETH
      <hr/>
      longs: {longs.length}
      <br/>
      open longs: {longsTokenQty} ETH
      <br/>
      avg position size: {avgLong} ETH | Biggest {largestLong} ETH
    </div>
  )
}

export default IndexPage
