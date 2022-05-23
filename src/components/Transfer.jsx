import {useState, useEffect} from 'react'
import { utils, getDefaultProvider } from 'ethers'
import { Contract } from '@ethersproject/contracts'
import { useContractFunction } from '@usedapp/core'
import SealedBidAuction from "../chain-info/contracts/SealedBidAuction.json"
import {CircularProgress, Button} from "@material-ui/core"
import Alert from "@material-ui/lab/Alert"



export const Transfer = (props) => {

    const auctionAbi = new utils.Interface(SealedBidAuction["abi"])
    const auctionContract = new Contract(props.auctionContract, auctionAbi, getDefaultProvider('rinkeby'))

    const { state, send } = useContractFunction(auctionContract, 'transferAssetToContract', { transactionName: 'transferNft' })

    const { status } = state

    const isMining = status === "Mining"
    const [txStatus, setTxStatus] = useState(false)

    const transfer = () => {
        void send()
    }

    const handleCloseSnack = () => {
        setTxStatus(false)
    }

    useEffect(() => {
        if (status === "Success") {
            setTxStatus(true)
        }

    }, [status])

    return(
        <>
        <Button 
            color = "secondary" 
            variant="contained" 
            size="large"
            disabled={isMining}
            onClick={() => transfer()}>
            {isMining ? <CircularProgress size={26} /> : ""}
            Deposit Token to Auction
        </Button>
        {txStatus ? (
            <Alert  onClose={handleCloseSnack} severity="success">
               Token deposited
            </Alert>
        ):(<></>)}
        </>
    )
}