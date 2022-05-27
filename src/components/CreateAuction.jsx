import {useState, useEffect, useRef} from 'react'
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
    Tooltip,
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
    const myRef = useRef()
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
    const [thirdTrigger, setThirdTrigger] = useState(false)

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

    useEffect(() => {
        if(creationConfirm){
             myRef.current.scrollIntoView() 
        }
        
    }, [creationConfirm])


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
        if(!word.match("^[A-Za-z]+$")){
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
                let month = parseInt(arr1[0])
                let day = parseInt(arr1[1])
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
            </div>
            <Grid container spacing={2}>
                <Grid item xs = {1}></Grid>
                <Grid item xs = {4}>
                <Typography variant="h5">
                    Create Auction For:
                </Typography>
                    <Card sx={{ maxWidth: 345 }} variant="outlined" style={{backgroundColor: "#f5f4e4" ,borderRadius: '15px', margin: '10px'}}>
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
                    <Typography gutterBottom variant="h6" component="div">
                    </Typography>
                </Grid>
                <Grid item xs = {1}></Grid>
                <Grid item xs = {6}>
                { !txStatus ? (
                <>
                <Typography gutterBottom variant="h5" >
                Auction setup:
                </Typography>
                    <div className={classes.container}>
                    <Tooltip title="Minimum price you are willing to receive">
                    <TextField id="setPrice" label="Minimum price (eth)" variant="standard" onChange={e => ckeckPriceChanges(e.target.value)} />
                    </Tooltip>
                    <Tooltip title="Secret, we will hash your price and this to keep price private.">
                    <TextField id="standard-basic" label="Secret Word" variant="standard" onChange={e => ckeckSecretChanges(e.target.value)} />
                    </Tooltip>
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
                        <Tooltip title="When will offers end?">
                        <TextField helperText="Close offers date" id="dateOffers" label="mm/dd/yyyy hh:mm" variant="standard"  onChange={() => setCreationConfirm(false)}/>
                        </Tooltip>
                        <Tooltip title="When will reveals end?">
                        <TextField helperText="Close reveals date" id="dateReveals" label="mm/dd/yyyy hh:mm" variant="standard" onChange={() => setCreationConfirm(false)}/>
                        </Tooltip>
                    </div>
                    <div className={classes.container}>
                        <Button variant="contained" color="primary" onClick={() => {createAuction()}}>Create Auction!</Button>
                        <Button variant="text">Read the FAQ</Button>
                    </div>   
                    </>):(<></>)}             
                    <div ref={myRef}>
                       
                        {creationConfirm && !txStatus ? (
                                <>
                                <div className={classes.container}>
                                <Typography variant="h5">
                                Review auction setup:
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
                                    <ListItemText primary={`Close offers Date: ${offersTime.toString().slice(0,34)}`} />
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary={`Close reveals Date: ${revealsTime.toString().slice(0,34)}`} />
                                </ListItem>
                                </List>
                                </div>
                                <div className={classes.container}>
                                    <Button variant="contained" color="primary" onClick={() => {confirmAuction()}}>Confirm Auction Creation</Button>
                                    {isMining ? <CircularProgress size={26} /> : ""}
                                </div>  
                                </>
                                ):(<></>)}
                                <div className={classes.container}>
                                {txStatus ? (
                                    <Alert  onClose={handleCloseSnack} severity="success">
                                        Your Auction has been created at {newAuctionAddress}, approve and transfer NFT txns will appear shortly. 
                                    </Alert>
                                ):(<></>)}
                                </div>
                                
                                {txStatus && !thirdTrigger ? (
                                    <>
                                    <Typography variant="h5">
                                        Now approve your token:
                                    </Typography>
                                    <div className={classes.container}>
                                    <Approve trigger = {(set) => {setThirdTrigger(set)}} nftContract={props.nft.contract.address} nftId={parseInt(props.nft.id.tokenId)} contractAddress={newAuctionAddress}></Approve>
                                    </div>
                                    </>
                                ):(<>
                                </>)}

                                
                                {thirdTrigger ? (
                                    <>
                                    <Typography variant="h5">
                                        One last thing:
                                    </Typography>
                                    <div className={classes.container}>
                                    <Transfer auctionContract={newAuctionAddress}></Transfer>
                                    </div>  
                                    </>
                                ):(<>
                                </>)}
                               
                                
</div>
                </Grid>
            </Grid>
        </>
    )
}