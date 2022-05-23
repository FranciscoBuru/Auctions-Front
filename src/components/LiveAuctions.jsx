import {useState, useEffect} from 'react'
import {Button,  ImageList, makeStyles} from "@material-ui/core"
import AuctionFactory from "../chain-info/contracts/AuctionFactory.json"
import SealedBidAuction from "../chain-info/contracts/SealedBidAuction.json"
import { constants, utils, getDefaultProvider } from 'ethers'
import { Contract } from '@ethersproject/contracts'
import { useEthers } from '@usedapp/core'
import networkMapping from "../chain-info/deployments/map.json"
import { AuctionCard } from './AuctionCard'


const useStyles = makeStyles((theme) => ({
    container:{
        padding: theme.spacing(4),
        display: "flex",
        justifyContent: "flex-start",
        gap: theme.spacing(1)
    }
}))

export const LiveAuctions = (props) => {
    const classes = useStyles()
    const { chainId } = useEthers()
    const factoryAddress = chainId ? networkMapping[String(chainId)]["AuctionFactory"][0] : constants.AddressZero
    const factoryAbi = new utils.Interface(AuctionFactory["abi"])
    const factoryContract = new Contract(factoryAddress, factoryAbi, getDefaultProvider('rinkeby'))


    const [auctions, setAuctions] = useState([])
    const [activeAuctions, setActiveAuctions] = useState([])
    const [indicador, setIndicador] = useState(false)


    useEffect(() => {
        //Decir cuales si tienen un NFT dentro  
        const getInfo = async (auctionContract) => {
            let res = await auctionContract.auction_state()
            console.log(parseInt(res) === 0)
            if (parseInt(res) === 0){
                return false
            }else{
                return true
            }
        }
        
        console.log(auctions)
        const auctionAbi = new utils.Interface(SealedBidAuction["abi"])
        let resp = []
        for (var i = 0, len = auctions.length; i < len; i++) {
            const auctionContract = new Contract(auctions[i], auctionAbi, getDefaultProvider('rinkeby'))     
            if(getInfo(auctionContract)){
                resp.push(auctions[i])
            }
        }
        console.log(resp)
        setActiveAuctions(resp)
        setIndicador(true)
    }, [auctions])



    const getAuctions = async() => {
        let addresses = []
        let i = 0
        let aux = true
        let res
        while (aux){
            res = await factoryContract.sealedBidAuctionArray(i).catch(() => false)
            if (res){
                addresses.push(res)
            }
            i = i+1
        }
        setAuctions(addresses)
    }

    return(
        <>
        <div className={classes.container}>
            <Button onClick={() => {getAuctions()}}>Show live auctions</Button>
        </div>
        {indicador ? (
            <>
            <div className={classes.container}>
            <ImageList sx={{ width: 500, height: 450}} cols={3} rowHeight={164}>
            {activeAuctions.map(auction => {return <AuctionCard address={auction} sectionChanger = {(sec) => {props.sectionChanger(sec)}} setData = {(data) => {props.setData(data)}} setState={(sec) => {props.setState(sec)}} setAuctionAddress = {(st) => {props.setAuctionAddress(st)}} key={Math.random()}/>})}
            </ImageList>  
            </div>
            </>
        ):(
            <></>
        )}
        </>
    )
}