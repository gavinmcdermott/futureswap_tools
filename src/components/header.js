/** @jsx jsx */
import { Styled, jsx } from "theme-ui"
import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"

const Logos = () => {
  return (
    <div>
      These will be the links
    </div>
  )
}

const Header = ({ siteTitle }) => (
  <Styled.div as="header">
    <Logos />
    <Styled.div sx={{ mb: 4, mx: `auto`, maxWidth: `container`, px: 3 }}>
      <Styled.h1>
        <Link to="/">
          {siteTitle}
        </Link>
      </Styled.h1>
    </Styled.div>
  </Styled.div>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
