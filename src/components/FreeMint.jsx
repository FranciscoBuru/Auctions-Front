import {useState, useEffect} from 'react'
import { constants, utils } from 'ethers'
import { Contract } from '@ethersproject/contracts'
import { DAppProvider, useEthers, useContractFunction } from '@usedapp/core'
import CollectibleCreator from "../chain-info/contracts/CollectibleCreator.json"
import networkMapping from "../chain-info/deployments/map.json"
import {Button, Snackbar, CircularProgress, ImageList , makeStyles} from "@material-ui/core"
import Alert from "@material-ui/lab/Alert"


const useStyles = makeStyles((theme) => ({
    container:{
        padding: theme.spacing(4),
        display: "flex",
        justifyContent: "center",
        gap: theme.spacing(1)
    }
}))


export const FreeMint = () => {

    const classes = useStyles()

    const METADATA = "https://ipfs.io/ipfs/QmYHT7H8GdCaPzViFfAwGoK3spbq8bEkqAB9kMzNhhLeUe"
    const { chainId } = useEthers()
    const { abi } = CollectibleCreator
    const collectibleCreatorAddress = chainId ? networkMapping[String(chainId)]["CollectibleCreator"][0] : constants.AddressZero
    const tokenFarmInterface = new utils.Interface(abi)
    const tokenFarmContract = new Contract(collectibleCreatorAddress, tokenFarmInterface)

    const { state, send } = useContractFunction(tokenFarmContract, 'createCollectible', { transactionName: 'Wrap' })

    const { status } = state

    const isMining = status === "Mining"
    const [txStatus, setTxStatus] = useState(false)

    const mint = () => {
        void send(METADATA)
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
        <div className={classes.container}>
        <Button 
            color = "secondary" 
            variant="contained" 
            size="large"
            disabled={isMining}
            onClick={() => mint()}>
                {isMining ? <CircularProgress size={26} /> : "Mint new NFT"}
        </Button>
        </div>
        <div className={classes.container}>
        <p>Status: {status}</p>
        </div>
        <div className={classes.container}>
        {txStatus ? (
            <Alert  onClose={handleCloseSnack} severity="success">
                Your NFT has been minted! see it in https://testnets.opensea.io
            </Alert>
        ):(<></>)}
        </div>
        </>
    )
}