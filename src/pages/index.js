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
import TokenPools from "../components/token-pools"

const IndexPage = props => {
  return (
    <Layout>
      <SEO title="Home" />
      <TokenPools />
      
      <br/>
      <br/>
      <br/>
      TODO NOTE: the rest below here is still being calculated
      <br/>
      <hr/>
      {/* <Pools /> */}
      <Positions />
    </Layout>
  )
}

export default IndexPage
