import {useState, useEffect} from 'react'
import { utils, getDefaultProvider } from 'ethers'
import { Contract } from '@ethersproject/contracts'
import { useContractFunction } from '@usedapp/core'
import IERC721 from "../chain-info/contracts/IERC721.json"
import {CircularProgress, Button} from "@material-ui/core"
import Alert from "@material-ui/lab/Alert"



export const Approve = (props) => {

    const tokenAbi = new utils.Interface(IERC721["abi"])
    const tokenContract = new Contract(props.nftContract, tokenAbi, getDefaultProvider('rinkeby'))

    const { state, send } = useContractFunction(tokenContract, 'approve', { transactionName: 'approve' })

    const { status } = state

    const isMining = status === "Mining"
    const [txStatus, setTxStatus] = useState(false)

    const approve = () => {
        void send(props.contractAddress, props.nftId)
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
            onClick={() => approve()}>
            {isMining ? <CircularProgress size={26} /> : ""}
            Approve Token
        </Button>
        {txStatus ? (
            <Alert  onClose={handleCloseSnack} severity="success">
                Approved Token transfer.
            </Alert>
        ):(<></>)}
        </>
    )
}