import numeral from 'numeral'
import web3 from 'web3'

export const prettyFromWei = (wei) => wei && numeral(web3.utils.fromWei(wei)).format('0,0.00')