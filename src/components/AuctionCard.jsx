import {useState, useEffect} from 'react'
import {utils, getDefaultProvider } from 'ethers'
import { Contract } from '@ethersproject/contracts'
import SealedBidAuction from "../chain-info/contracts/SealedBidAuction.json"
import {Button,Card, CardContent,CardMedia,Typography,CardActionArea ,ImageListItem} from "@material-ui/core"




export const AuctionCard = (props) => {

    const auctionAbi = new utils.Interface(SealedBidAuction["abi"])
    const auctionContract = new Contract(props.address, auctionAbi, getDefaultProvider('rinkeby'))
    

    //const { state, send } = useContractFunction(auctionContract, 'transferAssetToContract', { transactionName: 'transferNft' })

    //const { status } = state

    //const isMining = status === "Mining"
    //const [txStatus, setTxStatus] = useState(false)

    const [token, setToken] = useState("")
    const [auctionState, setAuctionState] = useState("")
    const [imageUrl, setImageUrl] = useState("")

    const getImage = async () => {
        //let tokenAddress = await auctionContract.parentNFT()
        //let tokenId = await auctionContract.tokenId()
        //const tokenAbi = new utils.Interface(IERC721Metadata["abi"])
        //const tokenContract = new Contract(tokenAddress, tokenAbi, getDefaultProvider('rinkeby'))
        //let uri = await tokenContract.tokenURI(parseInt(tokenId))
        let state = await auctionContract.auction_state()
        setAuctionState(state)
        let nfts
        if(state !== 0){
            nfts = await fetch(`https://eth-rinkeby.alchemyapi.io/v2/ZYsupiPu2rnvt3564piMlnA2dImfRsDv/getNFTs?owner=${props.address}`)
            .then(data => data.json())
            setToken(nfts.ownedNfts[0])
            setImageUrl(nfts.ownedNfts[0].metadata.image)
        }
    }

    useEffect(() => {
      getImage()
    }, [])

    const onClickFunction = () => {
        props.setData(token)
        props.setState(auctionState)
        props.setAuctionAddress(props.address)
        props.sectionChanger(5)
      }
    
    return(
        <>
        <ImageListItem>
        <Card sx={{ maxWidth: 345 }} variant="outlined">
          <CardActionArea onClick={() => {onClickFunction()}}>
          {imageUrl ? (
              <CardMedia
              component="img"
              height="320"
              image= {imageUrl}
              alt="nft"
            />
          ):(   
            <></>
          )}
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
              Auction address {props.address.slice(0,8)}...{props.address.slice(39,42)}
              </Typography>
              {auctionState ? (
                  <Typography gutterBottom variant="caption" component="div">
                  State: {auctionState}
                  </Typography>
              ):(<></>)}
            </CardContent>
      </CardActionArea>
      </Card>
      </ImageListItem>
        </>
    )
}