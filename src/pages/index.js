import React, { useEffect, useState } from "react"
import { navigate } from "gatsby"
import gql from "graphql-tag"
import { useQuery } from "@apollo/react-hooks"
import web3 from 'web3'

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"
import Positions from "../components/positions"
import Pools from "../components/pools"


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
  return (
    <Layout>
      <SEO title="Home" />
      <Pools />
      <Positions />
    </Layout>
  )
}

export default IndexPage
