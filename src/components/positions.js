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

const GET_OPEN_TRADES = gql`
  query {
    trades(
      first: 999,
      orderBy: tradeId,
      orderDirection: desc,
      where: {
        tradeOpen: true
        exchange: "0xF2d5cBa15c8367dd016FC9c4711443e61c7d95A6"
      }
    ) {
      isLong
      assetTokenBorrowed
    }
  }
`

const YESTERDAY = moment().subtract(1, 'day').unix()

const GET_TRADES_LAST_24H = gql`
  query {
    trades(
      first: 999,
      orderBy: timestampOpen,
      orderDirection: desc,
      where: {
        exchange: "0xF2d5cBa15c8367dd016FC9c4711443e61c7d95A6",
        timestampOpen_gte: ${YESTERDAY}
      }
    ) {
      id
      isLong
      exchange
      tradeId
      tradeOpen
      timestampOpen
      timestampClose
      assetTokenBorrowed
    }
  }
`

const Positions = (props) => {
  

  
  // HANDLE PREV 24 HOUR TRADES

  const { data: prevDayTrades, loading: loadingPrevDayTrades, error: errorPrevDayTrades } = useQuery(GET_TRADES_LAST_24H, { context: { WS: false }, },)
  
  const [prevShorts, setPrevShorts] = useState([])
  const [prevLongs, setPrevLongs] = useState([])
  
  const [prevLongsTokenQty, setPrevLongsTokenQty] = useState(0)
  const [prevShortsTokenQty, setPrevShortsTokenQty] = useState(0)

  useEffect(() => {
    if (!prevDayTrades) {
      return
    }

    const filteredPrevLongs = prevDayTrades.trades.filter(t => t.isLong)
    setPrevLongs(filteredPrevLongs)
    const prevLongsAccumTokenQty = _.reduce(filteredPrevLongs, (accum, trade) => {
      return accum + Number(web3.utils.fromWei(trade.assetTokenBorrowed))
    }, 0)
    setPrevLongsTokenQty(prevLongsAccumTokenQty)

    
    const filteredPrevShorts = prevDayTrades.trades.filter(t => !t.isLong)
    setPrevShorts(filteredPrevShorts)
    const prevShortsAccumTokenQty = _.reduce(filteredPrevShorts, (accum, trade) => {
      return accum + Number(web3.utils.fromWei(trade.assetTokenBorrowed))
    }, 0)
    setPrevShortsTokenQty(prevShortsAccumTokenQty)


  }, [prevDayTrades])

  

  // HANDLE LONG/SHORT ON MARKET
  
  const { data: openTrades, loading: loadingOpenTrades, error: errorOpenTrades } = useQuery(GET_OPEN_TRADES, { context: { WS: false }, },)

  const [shorts, setShorts] = useState([])
  const [longs, setLongs] = useState([])
  
  const [longsTokenQty, setLongsTokenQty] = useState(0)
  const [avgLong, setAvgLong] = useState(0)
  const [largestLong, setLargestLong] = useState(0)

  const [shortsTokenQty, setShortsTokenQty] = useState(0)
  const [avgShort, setAvgShort] = useState(0)
  const [largestShort, setLargestShort] = useState(0)

  useEffect(() => {
    if (!openTrades) {
      return
    }
    
    // Todo: move both to a single map / reduce

    // Longs
    const filteredLongs = openTrades.trades.filter(t => t.isLong)
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
    
    // Shorts
    const filteredShorts = openTrades.trades.filter(t => !t.isLong)
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
  }, [openTrades])

  return (
    <div>
      
      <h3>Market in Last 24 Hours</h3>
      Trades opened over last 24 hours: {prevDayTrades && prevDayTrades.trades.length}
      <br/>
      {prevLongs.length} longs opened for {prevLongsTokenQty} ETH
      <br/>
      {prevShorts.length} shorts opened: {prevShortsTokenQty} ETH
      <hr/>

      <h3>Current Market Snapshot</h3>
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

export default Positions
