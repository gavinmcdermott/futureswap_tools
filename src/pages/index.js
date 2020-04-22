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






const IndexPage = props => {
  // const { data, loading, error } = useQuery(GET_OPEN_TRADES, { context: { WS: false }, },)

  return (
    <Layout>
      <SEO title="Home" />
      <Positions />
    </Layout>
  )
}

export default IndexPage
