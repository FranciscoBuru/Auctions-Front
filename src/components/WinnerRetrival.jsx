import {useState, useEffect} from 'react'
import { utils, getDefaultProvider } from 'ethers'
import { Contract } from '@ethersproject/contracts'
import { useContractFunction } from '@usedapp/core'
import SealedBidAuction from "../chain-info/contracts/SealedBidAuction.json"
import {CircularProgress, Button, List, ListItem, ListItemText, makeStyles, Typography} from "@material-ui/core"
import Alert from "@material-ui/lab/Alert"

    const useStyles = makeStyles((theme) => ({
            container:{
                padding: theme.spacing(4),
                display: "flex",
                justifyContent: "flex-start",
                gap: theme.spacing(1)
            }
        }))

export const WinnerRetrival = (props) => {

    
    const classes = useStyles()

    const auctionAbi = new utils.Interface(SealedBidAuction["abi"])
    const auctionContract = new Contract(props.address, auctionAbi, getDefaultProvider('rinkeby'))

    const { state, send } = useContractFunction(auctionContract, 'winnerRetrivesToken', { transactionName: 'transferNft' })

    const { status } = state

    const isMining = status === "Mining"
    const [txStatus, setTxStatus] = useState(false)


    const close = () => {
        void send()
    }

    useEffect(() => {
        if (status === "Success") {
            setTxStatus(true)
        }

    }, [status])

    const handleCloseSnack = () => {
        setTxStatus(false)
    }

    

    return(
        <>
        <Typography variant="h5">
           Winner! Get your NFT!:
        </Typography>
        <div className={classes.container}>
        <Button 
            color = "secondary" 
            variant="contained" 
            size="large"
            disabled={isMining}
            onClick={() => close()}>
            {isMining ? <CircularProgress size={26} /> : ""}
            Claim NFT
        </Button>
        </div>
        {txStatus ? (
            <Alert  onClose={handleCloseSnack} severity="success">
               NFT Claimed!
            </Alert>
        ):(<></>)}
        <Typography variant="h5">
          And also your leftover eth from your deposit, if there is any.
        </Typography>
        </>
    )
}