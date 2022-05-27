import {useState, useEffect} from 'react'
import {TextField, Button,  Typography, ImageList , makeStyles} from "@material-ui/core"
import {NFTCard} from "./NftCard"
import {useEthers} from "@usedapp/core"

const useStyles = makeStyles((theme) => ({
    container:{
        padding: theme.spacing(4),
        display: "flex",
        gap: theme.spacing(1)
    }
}))


export const NFTForm = (props) => {

    const classes = useStyles()
    const [nfts, setNfts] = useState()
    const {account} = useEthers()

    const theme = {
        spacing: 8,
      }
  
    const fetchNFTs = async (wallet) => {
      let nfts
      console.log()
      nfts = await fetch(`https://eth-rinkeby.alchemyapi.io/v2/ZYsupiPu2rnvt3564piMlnA2dImfRsDv/getNFTs?owner=${wallet}`)
        .then(data => data.json())
      if (nfts) setNfts(nfts.ownedNfts)
      console.log(nfts.ownedNfts)
    }

    useEffect(() => {
        fetchNFTs(account);
    }, [account])


    return(
        <>
            <div className={classes.container}>
                <Typography gutterBottom variant="h5" component="div">
                    Click on a token to auction it. 
                </Typography>
            </div>
            <div className={classes.container}>
            <ImageList sx={{ width: 500, height: 450}} cols={3} rowHeight={164}>
                {nfts && nfts.map(nft => {return <NFTCard nft={nft} sectionChanger = {(sec) => {props.sectionChanger(sec)}} setData = {(data) => {props.setData(data)}} key={nft.contract.address + nft.id.tokenId}/>})}
            </ImageList>  
            </div>
        </>
    )
}