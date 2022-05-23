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

export const AuctioneerGetPayed = (props) => {

    
    const classes = useStyles()

    const auctionAbi = new utils.Interface(SealedBidAuction["abi"])
    const auctionContract = new Contract(props.address, auctionAbi, getDefaultProvider('rinkeby'))

    const { state, send } = useContractFunction(auctionContract, 'ownerGetsPayed', { transactionName: 'OwnerGetsPayed' })

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
        <h2>Auctioneer, get payed:</h2>
        <div className={classes.container}>
            <List>
                <ListItem>
                    <ListItemText primary="If you created this auction then click the next button to get payed. If the NFT did not sell you will get it back. We hope you liked our auctions!" />
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
            Get payed / reclaim token
        </Button>
        </div>
        {txStatus ? (
            <Alert  onClose={handleCloseSnack} severity="success">
               Transaction finalized
            </Alert>
        ):(<></>)}
        </>
    )
}