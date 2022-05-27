import {useState, useEffect} from 'react'
import { utils, getDefaultProvider } from 'ethers'
import { Contract } from '@ethersproject/contracts'
import { useContractFunction } from '@usedapp/core'
import SealedBidAuction from "../chain-info/contracts/SealedBidAuction.json"
import {CircularProgress, Button, TextField, makeStyles, Typography} from "@material-ui/core"
import Alert from "@material-ui/lab/Alert"

    const useStyles = makeStyles((theme) => ({
            container:{
                padding: theme.spacing(4),
                display: "flex",
                justifyContent: "flex-start",
                gap: theme.spacing(1)
            }
        }))

export const RevealOffer = (props) => {

    
    const classes = useStyles()

    const auctionAbi = new utils.Interface(SealedBidAuction["abi"])
    const auctionContract = new Contract(props.address, auctionAbi, getDefaultProvider('rinkeby'))

    const { state, send } = useContractFunction(auctionContract, 'revealOffer', { transactionName: 'revealOffer' })

    const { status } = state

    const isMining = status === "Mining"
    const [txStatus, setTxStatus] = useState(false)

    const [priceAlert, setPriceAlert] = useState(false)
    const [wordAlert, setWordAlert] = useState(false)
    const [minPrice, setMinPrice] = useState()
    const [secret, setSecret] = useState("")


    const reveal = () => {
        let ether = utils.parseEther(String(minPrice))
        void send(secret, ether)
    }

    const handleCloseSnack = () => {
        setTxStatus(false)
    }

    useEffect(() => {
        if (status === "Success") {
            setTxStatus(true)
        }

    }, [status])

    const ckeckPriceChanges = (price) =>{
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
        if(!/^[a-zA-Z]/.test(word)){
            setWordAlert(true)
            setSecret("")
        }else{
            setWordAlert(false)
            setSecret(word)
        }
    }

    return(
        <>
        <Typography variant="h5">
            Reveal offer:
        </Typography>
        <div className={classes.container}>
        <TextField id="setPrice" label="Offer (eth)" variant="standard" onChange={e => ckeckPriceChanges(e.target.value)} />
        </div>
        <div className={classes.container}>
        <TextField id="standard-basic" label="Secret Word" variant="standard" onChange={e => ckeckSecretChanges(e.target.value)} />
        </div>
        <div className={classes.container}>
        <Button 
            color = "secondary" 
            variant="contained" 
            size="large"
            disabled={isMining}
            onClick={() => reveal()}>
            {isMining ? <CircularProgress size={26} /> : ""}
            Reveal Offer
        </Button>
        </div>
        <div className={classes.container}>
            {priceAlert ? (
                <Alert severity="error">Invalid number.</Alert>
            ):(<></>)}

            {wordAlert ? (
                <Alert severity="error">Invalid word, only letters allowed.</Alert>
            ):(<></>)}
        </div>
        {txStatus ? (
            <Alert  onClose={handleCloseSnack} severity="success">
               Offer Revealed
            </Alert>
        ):(<></>)}
        </>
    )
}