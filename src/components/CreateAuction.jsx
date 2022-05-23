import {useState, useEffect} from 'react'
import Alert from "@material-ui/lab/Alert"
import { 
    Button,
    Card, 
    Grid, 
    CardContent,
    CardMedia,
    CircularProgress,
    Typography,
    TextField,
    ListItemText,  
    List,
    ListItem,  
    makeStyles} from "@material-ui/core"
import AuctionFactory from "../chain-info/contracts/AuctionFactory.json"
import { constants, utils, getDefaultProvider } from 'ethers'
import { Contract } from '@ethersproject/contracts'
import { useEthers, useContractFunction } from '@usedapp/core'
import networkMapping from "../chain-info/deployments/map.json"
import {Approve} from "./Approve"
import {Transfer} from "./Transfer"


const useStyles = makeStyles((theme) => ({
    container:{
        padding: theme.spacing(4),
        display: "flex",
        justifyContent: "flex-start",
        gap: theme.spacing(1)
    }
}))


export const CreateAuction = (props) => {
    
    const classes = useStyles()
    const [minPrice, setMinPrice] = useState()
    const [secret, setSecret] = useState("")
    const [offersTime, setOffersTime] = useState("")
    const [revealsTime, setRevealsTime] = useState("")

    const [priceAlert, setPriceAlert] = useState(false)
    const [wordAlert, setWordAlert] = useState(false)
    const [creationConfirm, setCreationConfirm] = useState(false)


    const { chainId } = useEthers()
    const factoryAddress = chainId ? networkMapping[String(chainId)]["AuctionFactory"][0] : constants.AddressZero
    const factoryAbi = new utils.Interface(AuctionFactory["abi"])
    const factoryContract = new Contract(factoryAddress, factoryAbi, getDefaultProvider('rinkeby'))

    const { state, send } = useContractFunction(factoryContract, 'createSealedBidAuctionContract', { transactionName: 'contractCreation' })

    const { status } = state

    const isMining = status === "Mining"
    const [txStatus, setTxStatus] = useState(false)
    const [newAuctionAddress, setNewAuctionAddress] = useState("")

    const handleCloseSnack = () => {
        setTxStatus(false)
    }

    useEffect(() => {
        if (status === "Success") {
            setTxStatus(true)
        }

    }, [status])

    useEffect(() => {
        // Primero el approve

    }, [newAuctionAddress])


    const confirmAuction = async () => {
        let reveals = Math.floor(revealsTime.getTime() / 1000)
        let offers = Math.floor(offersTime.getTime() / 1000)
        let string = utils.formatBytes32String(secret)
        let ether = utils.parseEther(String(minPrice))
        console.log(string)
        console.log(ether.toString())
        let hash = utils.solidityKeccak256(['string','uint256'],[secret, ether.toString()])
        console.log(hash)
        void await send(hash, props.nft.contract.address, parseInt(props.nft.id.tokenId), offers, reveals)
        let auctionAddress = await factoryContract.getLastAddressInArray()
        setNewAuctionAddress(auctionAddress)
    }


    const ckeckPriceChanges = (price) =>{
        setCreationConfirm(false)
        let x = parseFloat(price)
        console.log(x)
        if(isNaN(x)){
            setPriceAlert(true)
        }else{
            setPriceAlert(false)
            setMinPrice(x)
        }
    }


    const ckeckSecretChanges = (word) =>{
        setCreationConfirm(false)
        if(!/^[a-zA-Z]/.test(word)){
            setWordAlert(true)
            setSecret("")
        }else{
            setWordAlert(false)
            setSecret(word)
        }
    }

    const time = (str) => {
        let arr = str.split(" ")
        console.log(arr)
        if(arr.length === 2){
            let arr1 = arr[0].split("/")
            let arr2 = arr[1].split(":")
            if(arr1.length === 3 && arr2.length === 2){
                let day = parseInt(arr1[0])
                let month = parseInt(arr1[1])
                let year = parseInt(arr1[2])
                let hour = parseInt(arr2[0])
                let min = parseInt(arr2[1])
                if(!isNaN(day) && !isNaN(month) && !isNaN(year) && !isNaN(hour) && !isNaN(min)){
                    return new Date(year, month-1, day, hour, min)
                }
            }
        }
        return 0
    }

    const createAuction =  () => {
        if(!priceAlert && !wordAlert){
            setOffersTime(time(document.getElementById("dateOffers").value))
            setRevealsTime(time(document.getElementById("dateReveals").value))
            setCreationConfirm(true)
        }
    }


    return(
        
        <>
            <div className={classes.container}>
            <Typography gutterBottom variant="h4" component="div">
                Please take the time to read the following:
            </Typography>
            </div>
            <div className={classes.container}>
                <List>
                    <ListItem>
                        <ListItemText primary="Prices are in eth." />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Minimim price will be encripted with the secret word. To reveal price you MUST remember bouth. In case you don't, the minimum price will be set to 0." />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="For the secret word we recommend not to use something trivial, but we won't stop you. Open a dictionary and choose a new one for you" />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Once the reveals date happens you will have 1 full day to reveal your minimum price. I you don't, it will be set to 0 and the auction will continue." />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="When the auction ends you will be able to retrive the price yourself. If the minimum price is not met then you will be able to get your NFT back." />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Once you start the auction there is no going back. You can not cancel it." />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Upon Auction creation you MUST transfer the token to the contract for the auction to start." />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Please follow the format specified for the dates. An example would be '23/04/2022 15:34'. Set it to your timezone, the system will convertet to UNIX time automatically. " />
                    </ListItem>
                </List>
            </div>
            <Grid container spacing={2}>
                <Grid item xs = {2}></Grid>
                <Grid item xs = {4}>
                    <h2>Create Auction For:</h2>
                    <Card sx={{ maxWidth: 345 }} variant="outlined">
                        <CardMedia
                        component="img"
                        height="320"
                        image= {props.nft.media[0].gateway}
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
                </Grid>
                <Grid item xs = {6}>
                    
                    <h2>Auction preferences:</h2>
                    <div className={classes.container}>
                    <TextField id="setPrice" label="Minimum price (eth)" variant="standard" onChange={e => ckeckPriceChanges(e.target.value)} />
                    <TextField id="standard-basic" label="Secret Word" variant="standard" onChange={e => ckeckSecretChanges(e.target.value)} />
                    </div>
                    <div className={classes.container}>
                        {priceAlert ? (
                            <Alert severity="error">Invalid number.</Alert>
                        ):(<></>)}

                        {wordAlert ? (
                            <Alert severity="error">Invalid word, only letters allowed.</Alert>
                        ):(<></>)}
                    </div>
                    <div className={classes.container}>
                        <h4>Close offers date and Time:</h4><TextField id="dateOffers" label="dd/mm/yyyy hh:mm" variant="standard"  onChange={() => setCreationConfirm(false)}/>
                        </div>
                        <div className={classes.container}>
                        <h4>Close reveals date and Time:</h4><TextField id="dateReveals" label="dd/mm/yyyy hh:mm" variant="standard" onChange={() => setCreationConfirm(false)}/>
                    </div>
                    <div className={classes.container}>
                        <Button variant="outlined" color="primary" onClick={() => {createAuction()}}>Create Auction!</Button>
                    </div>
                        {creationConfirm ? (
                            <>
                                <div className={classes.container}>
                                <Typography variant="h5">
                                Review auction preferences:
                                </Typography>
                                </div>
                                <div className={classes.container}>
                                <Typography variant="caption">
                                If times seem wrong it is because you didn't use the right format.
                                </Typography>
                                </div>
                                <div className={classes.container}>
                                <List>
                                <ListItem>
                                    <ListItemText primary={`Price in eth: ${minPrice}`}/>
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary={`Secret word: ${secret}`}/>
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary={`Close offers Date: ${offersTime}`} />
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary={`Close reveals Date: ${revealsTime}`} />
                                </ListItem>
                                </List>
                                </div>
                                <div className={classes.container}>
                                    <Button variant="contained" color="primary" onClick={() => {confirmAuction()}}>Confirm Auction Creation</Button>
                                    {isMining ? <CircularProgress size={26} /> : ""}
                                </div>
                                <div className={classes.container}>
                                {txStatus ? (
                                    <Alert  onClose={handleCloseSnack} severity="success">
                                        Your Auction has been created, approve and transfer NFT txns will appear shortly. 
                                    </Alert>
                                ):(<></>)}
                                </div>
                                <div className={classes.container}>
                                {newAuctionAddress === "" ? (
                                    <></>
                                ):(<>
                                    <Approve nftContract={props.nft.contract.address} nftId={parseInt(props.nft.id.tokenId)} contractAddress={newAuctionAddress}></Approve>
                                </>)}
                                </div>
                                <div className={classes.container}>
                                {newAuctionAddress === "" ? (
                                    <></>
                                ):(<>
                                    <Transfer auctionContract={newAuctionAddress}></Transfer>
                                </>)}
                                </div>
                            </>
                        ):(<></>)}

                </Grid>
            </Grid>
        </>
    )
}