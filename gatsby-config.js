module.exports = {
  siteMetadata: {
    title: `Futureswap.tools`,
    description: `The home of the Futureswap community.`,
    author: `@gavinmcdermott`,
  },
  plugins: [
    `gatsby-plugin-netlify`,
    `gatsby-plugin-material-ui`,
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
        // background_color: `#1c1f2f`,
        // theme_color: `#663399`,
        // display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
