import {useState, useEffect} from 'react'
import { utils, getDefaultProvider } from 'ethers'
import { Contract } from '@ethersproject/contracts'
import { useContractFunction } from '@usedapp/core'
import SealedBidAuction from "../chain-info/contracts/SealedBidAuction.json"
import {CircularProgress, Button, TextField, makeStyles} from "@material-ui/core"
import Alert from "@material-ui/lab/Alert"

    const useStyles = makeStyles((theme) => ({
            container:{
                padding: theme.spacing(4),
                display: "flex",
                justifyContent: "flex-start",
                gap: theme.spacing(1)
            }
        }))

export const MakeOffer = (props) => {

    
    const classes = useStyles()

    const auctionAbi = new utils.Interface(SealedBidAuction["abi"])
    const auctionContract = new Contract(props.address, auctionAbi, getDefaultProvider('rinkeby'))

    const { state, send } = useContractFunction(auctionContract, 'makeOffer', { transactionName: 'transferNft' })

    const { status } = state

    const isMining = status === "Mining"
    const [txStatus, setTxStatus] = useState(false)

    const [priceAlert, setPriceAlert] = useState(false)
    const [wordAlert, setWordAlert] = useState(false)
    const [amountAlert, setAmountAlert] = useState(false)
    const [minPrice, setMinPrice] = useState()
    const [secret, setSecret] = useState("")
    const [amount, setAmount] = useState()

    const transfer = () => {
        let string = utils.formatBytes32String(secret)
        let ether = utils.parseEther(String(minPrice))
        let amount2 = utils.parseEther(String(amount))
        console.log(string)
        console.log(ether.toString())
        let hash = utils.solidityKeccak256(['string','uint256'],[secret, ether.toString()])
        console.log(hash)
        void send(hash, { value: amount2.toString() })
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

    const ckeckAmountChanges = (price) =>{
        let x = parseFloat(price)
        console.log(x)
        if(isNaN(x)){
            setAmountAlert(true)
        }else{
            setAmountAlert(false)
            setAmount(x)
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
        <h2>Make Offer for NFT:</h2>
        <div className={classes.container}>
        <TextField id="setPrice" label="Offer (eth)" variant="standard" onChange={e => ckeckPriceChanges(e.target.value)} />
        </div>
        <div className={classes.container}>
        <TextField id="standard-basic" label="Secret Word" variant="standard" onChange={e => ckeckSecretChanges(e.target.value)} />
        </div>
        <div className={classes.container}>
        <TextField id="ethToSend" label="eth to send" variant="standard" onChange={e => ckeckAmountChanges(e.target.value)} />
        </div>
        <div className={classes.container}>
        <Button 
            color = "secondary" 
            variant="contained" 
            size="large"
            disabled={isMining}
            onClick={() => transfer()}>
            {isMining ? <CircularProgress size={26} /> : ""}
            Make Secret Offer
        </Button>
        </div>
        <div className={classes.container}>
            {priceAlert ? (
                <Alert severity="error">Invalid number.</Alert>
            ):(<></>)}

            {wordAlert ? (
                <Alert severity="error">Invalid word, only letters allowed.</Alert>
            ):(<></>)}
            {amountAlert ? (
                <Alert severity="error">Invalid number.</Alert>
            ):(<></>)}
        </div>
        {txStatus ? (
            <Alert  onClose={handleCloseSnack} severity="success">
               Offer made, com back to reveal it. 
            </Alert>
        ):(<></>)}
        </>
    )
}