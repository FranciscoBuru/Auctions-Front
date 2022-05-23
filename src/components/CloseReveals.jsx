import {useState, useEffect} from 'react'
import { utils, getDefaultProvider } from 'ethers'
import { Contract } from '@ethersproject/contracts'
import { useContractFunction } from '@usedapp/core'
import SealedBidAuction from "../chain-info/contracts/SealedBidAuction.json"
import {CircularProgress, Button, List, ListItem, ListItemText, makeStyles} from "@material-ui/core"
import Alert from "@material-ui/lab/Alert"

    const useStyles = makeStyles((theme) => ({
            container:{
                padding: theme.spacing(4),
                display: "flex",
                justifyContent: "flex-start",
                gap: theme.spacing(1)
            }
        }))

export const CloseReveals = (props) => {

    
    const classes = useStyles()

    const auctionAbi = new utils.Interface(SealedBidAuction["abi"])
    const auctionContract = new Contract(props.address, auctionAbi, getDefaultProvider('rinkeby'))

    const { state, send } = useContractFunction(auctionContract, 'closeReveals', { transactionName: 'transferNft' })

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
        <h2>Close Reveals:</h2>
        <div className={classes.container}>
            <List>
                <ListItem>
                    <ListItemText primary="If the reveal period is over you can change it to the next, This method will work only if the auctioneer has not revealed his minimim price and 5 seconds have gone by since the time he had. Closing this period will calculate the winner. If you can run this then the minimum price will be set to 0! Beat the auctioneer." />
                </ListItem>
            </List>
        </div>
        <div className={classes.container}>
        <Button 
            color = "secondary" 
            variant="contained" 
            size="large"
            disabled={isMining}
            onClick={() => close()}>
            {isMining ? <CircularProgress size={26} /> : ""}
            Close Reveals
        </Button>
        </div>
        {txStatus ? (
            <Alert  onClose={handleCloseSnack} severity="success">
               Reveals Closed, reload auction.
            </Alert>
        ):(<></>)}
        </>
    )
}