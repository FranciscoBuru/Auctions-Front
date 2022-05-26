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
        setActiveAuctions(auctions)
        setIndicador(true)
    }, [auctions])

    useEffect(() => {
        getAuctions()
    }, [])



    const getAuctions = async() => {
        let addresses = []
        let i = 0
        let aux = true
        let res
        console.log("Clicked!")
        console.log(factoryContract)
        while (aux){
            console.log(i)
            res = await factoryContract.sealedBidAuctionArray(i).catch(() => res = false)
            if (res){
                console.log(false)
                addresses.push(res)
            }else{
                aux = false
            }
            i = i+1
        }
        setAuctions(addresses)
    }

    return(
        <>
        <div className={classes.container}>
                <h4>Click on an auction to interact with it.</h4>
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
            <h3>Loading auctions...</h3>
        )}
        </>
    )
}