import {useState, useEffect} from 'react'
import { utils, getDefaultProvider } from 'ethers'
import { Contract } from '@ethersproject/contracts'
import { useContractFunction } from '@usedapp/core'
import SealedBidAuction from "../chain-info/contracts/SealedBidAuction.json"
import {CircularProgress, Button, List, ListItem, ListItemText, makeStyles, Typography} from "@material-ui/core"
import Alert from "@material-ui/lab/Alert"
import {useEthers} from "@usedapp/core"

    const useStyles = makeStyles((theme) => ({
            container:{
                padding: theme.spacing(4),
                display: "flex",
                justifyContent: "flex-start",
                gap: theme.spacing(1)
            }
        }))

export const Reinbursements = (props) => {

    const {account} = useEthers()
    const classes = useStyles()

    const auctionAbi = new utils.Interface(SealedBidAuction["abi"])
    const auctionContract = new Contract(props.address, auctionAbi, getDefaultProvider('rinkeby'))

    const { state, send } = useContractFunction(auctionContract, 'reimburseParticipant', { transactionName: 'Reinbursement' })

    const { status } = state

    const isMining = status === "Mining"
    const [txStatus, setTxStatus] = useState(false)
    const [ethToGetBack, setEthToGetBack] = useState()


    const close = () => {
        void send()
    }

    useEffect(() => {
        if (status === "Success") {
            setTxStatus(true)
        }

    }, [status])

    useEffect(() => {
       calculateReinbrsement()

    }, [])

    const calculateReinbrsement = async () => {
        let x = await auctionContract.accountToAmount(account)
        console.log(x)
        setEthToGetBack(utils.formatEther(x))
        console.log(ethToGetBack)
    }

    const handleCloseSnack = () => {
        setTxStatus(false)
    }

    

    return(
        <>
        <Typography variant="h5">
            Get your {ethToGetBack} eth deposit back. 
        </Typography>
        <div className={classes.container}>
        <Button 
            color = "secondary" 
            variant="contained" 
            size="large"
            disabled={isMining}
            onClick={() => close()}>
            {isMining ? <CircularProgress size={26} /> : ""}
            Reclaim eth
        </Button>
        </div>
        {txStatus ? (
            <Alert  onClose={handleCloseSnack} severity="success">
               Your ETH is back!
            </Alert>
        ):(<></>)}
        </>
    )
}