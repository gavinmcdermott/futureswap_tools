module.exports = {
  siteMetadata: {
    title: `Futureswap.tools`,
    description: `Tools to for the Futureswap community`,
    author: `@gavinmcdermott`,
  },
  plugins: [
    `gatsby-plugin-netlify`,
    `gatsby-theme-material-ui`,
    `gatsby-theme-apollo`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        icon: `src/images/fs-favicon.ico`, // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
