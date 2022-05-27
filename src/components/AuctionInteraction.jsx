import {useEffect, useState} from 'react'
import { 
    Button,
    Card, 
    Grid, 
    CardContent,
    CardMedia,
    Typography,
    ListItemText,  
    List,
    ListItem,  
    makeStyles} from "@material-ui/core"
import SealedBidAuction from "../chain-info/contracts/SealedBidAuction.json"
//import {formatEther, solidityKeccak256, formatBytes32String } from "@ethersproject"
import { utils, getDefaultProvider } from 'ethers'
import { Contract } from '@ethersproject/contracts'
import {CloseOffers} from "./CloseOffers"
import {MakeOffer} from "./MakeOffer"
import {RevealOffer} from "./RevealOffer"
import {CloseReveals} from "./CloseReveals"
import {OwnerCloseReveals} from "./OwnerCloseReveals"
import {WinnerRetrival} from "./WinnerRetrival"
import {Reinbursements} from "./Reinbursements"
import {AuctioneerGetPayed} from "./AuctioneerGetPayed"
import {useEthers} from "@usedapp/core"


const useStyles = makeStyles((theme) => ({
    container:{
        padding: theme.spacing(4),
        display: "flex",
        justifyContent: "flex-start",
        gap: theme.spacing(1)
    }
}))


export const AuctionInteraction = (props) => {

    const {account} = useEthers()

    const auctionAbi = new utils.Interface(SealedBidAuction["abi"])
    const auctionContract = new Contract(props.address, auctionAbi, getDefaultProvider('rinkeby'))
    //const auctionContract = 1
    const classes = useStyles()

    const [offerTime, setOfferTime] = useState()
    const [revealTime, setRevealTime] = useState()
    const [winner, setWinner] = useState()
    const [offer, setOffer] = useState()
    const [owner, setOwner] = useState()


    useEffect(() => {
        if(props.state === 4){
            getWinner()
        }
        onClickFunctionnn()
    }, [])


    const getWinner = async () => {
        let state = await auctionContract.winner();
        let ofr = await auctionContract.amount();
        setWinner(state);
        setOffer(utils.formatEther(ofr));
        
    }


    const onClickFunctionnn = async () => {
        let offerCloseTime = await auctionContract.revealTime()
        let revealCloseTime = await auctionContract.winnerTime()
        console.log(offerCloseTime.toString())
        console.log(revealCloseTime.toString())
        offerCloseTime = new Date(offerCloseTime.toString()*1000)
        revealCloseTime = new Date(revealCloseTime.toString()*1000)
        setOfferTime(offerCloseTime.toString())
        setRevealTime(revealCloseTime.toString())
        let wnr = await auctionContract.owner();
        setOwner(wnr)
      }


    return(
        
        <>
            <div className={classes.container}>
            {winner ? (
                <Typography gutterBottom variant="h4" component="div">
                    Auction winner: {winner} eth.
                </Typography>
            ):(<></>)}
            </div>
            <div className={classes.container}>
            {offer ? (
                <Typography gutterBottom variant="h4" component="div">
                    Auction winning offer: {offer}
                </Typography>
            ):(<></>)}
            </div>
            {/*<div className={classes.container}>
                <List>
                    <ListItem>
                        <ListItemText primary="Prices are in eth." />
                    </ListItem>
                    {props.state === 1 ? (
                    <>
                    <ListItem>
                         <ListItemText primary="During this state, any interested party may make a secret offer on eth. " />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="You will be able to set a price and you must choose a secret word. Do not forget them! Your offer will be hashed along with your secret word and the hash will be sent as a 'promise'"/>
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="When de auction reaches state 2 you will need to reveal your offer and the secret word, so if you forget one of them your offer will be invalid"/>
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Along with the hash you must send some quanity of eth, for the offer to be valid that amount must be at least equal to the price offer"/>
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="After a winner is chosen he/she will be able to claim the NFT. All other parties can claim back the eth they deposited in the contract"/>
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Remember, for your offer to be valid you must come back and reveal it. Please check the reveal time."/>
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="If offers are supposed to be closed but are not you will be able to close them. Same thing applies when reveals are over."/>
                    </ListItem>        
                    </>
                    ):(<></>)}
                    {props.state === 2 ? (
                    <>
                    <ListItem>
                         <ListItemText primary="The time has come! Reveal your offers" />
                    </ListItem>       
                    </>
                    ):(<></>)}
                    {props.state === 4 ? (
                    <>
                    <ListItem>
                         <ListItemText primary="This auction has ended. Check who the winner is, if it is you then get your NFT! If not, get all your eth back." />
                    </ListItem>
                    <ListItem>
                         <ListItemText primary="If you are the auctioneer just click on the 'getPayed' button. If token did not sale you will get it back" />
                    </ListItem>       
                    </>
                    ):(<></>)}
                    </List>
            </div>*/}
            <Grid container spacing={2}>
                <Grid item xs = {1}></Grid>
                <Grid item xs = {4}>
                <Typography variant="h5">
                    Active auction for:
                </Typography>
                    {props.nft ? (
                    <Card sx={{ maxWidth: 345 }} variant="outlined"  style={{backgroundColor: "#f5f4e4" ,borderRadius: '15px', margin: '10px'}}>
                        <CardMedia
                        component="img"
                        height="320"
                        image= {props.nft.metadata.image}
                        alt="nft"
                        />
                        <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                        {props.nft.title}
                        </Typography>
                        <Typography variant="body2">
                        Contract: {props.nft.contract.address}
                        </Typography>
                        <Typography variant="body2">
                        ID: {parseInt(props.nft.id.tokenId)}
                        </Typography>
                        <Typography variant="body2">
                        {props.nft.description}
                        </Typography>
                        </CardContent>
                    </Card>
                    ):(
                        <Typography variant="body2">
                        Winner Claimed Token, we have nothing to show. 
                        </Typography> 
                    )}
                    
                </Grid>
                <Grid item xs = {1}></Grid>
                <Grid item xs = {6}>
                    {props.state === 1 ? (
                        <>
                        {offerTime ? (
                            <div className={classes.container}>
                                <Typography variant="body2">
                                Offers close on: {offerTime.slice(0,34)}
                                </Typography>
                            </div>
                        ):(<></>)}
                        {account !== owner ? (
                            <MakeOffer address = {props.address}></MakeOffer>
                        ):(<></>)}
                        <CloseOffers address = {props.address}></CloseOffers>
                        </>
                    ):(<></>)}
                    {props.state === 2 ? (
                        <>
                        {revealTime ? (
                            <div className={classes.container}>
                                <Typography variant="body2">
                                Reveals close on: {revealTime.slice(0,34)}
                                </Typography>
                            </div>
                        ):(<></>)}
                        {account !== owner ? (
                            <RevealOffer address = {props.address}></RevealOffer>
                        ):(
                            <OwnerCloseReveals address = {props.address}></OwnerCloseReveals>
                        )}
                            <CloseReveals address = {props.address}></CloseReveals>
                        </>
                    ):(<></>)}
                    {props.state === 4 ? (
                        <>
                        {account === winner ? (
                            <>
                            <WinnerRetrival address = {props.address}></WinnerRetrival>
                            <Reinbursements address = {props.address}></Reinbursements>
                            </>
                        ):(<></>)}
                        {account === owner ? (
                            <AuctioneerGetPayed address = {props.address}></AuctioneerGetPayed>
                        ):(<></>)}
                        {account !== owner && account !== winner ? (
                            <Reinbursements address = {props.address}></Reinbursements>
                        ):(<></>)}
                        
                        </>
                    ):(<></>)}
                    
                </Grid>
            </Grid>
        </>
    )
}