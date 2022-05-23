import { useEffect, useState } from "react"
import { useEthers, useContractFunction } from "@usedapp/core"
import { constants, utils } from "ethers"
import CollectibleCreator from "../chain-info/contracts/CollectibleCreator.json"
import ERC20 from "../chain-info/contracts/MockERC20.json"
import { Contract } from "@ethersproject/contracts"
import networkMapping from "../chain-info/deployments/map.json"

export const useStakeTokens = (tokenAddress) => {
    // address
    // abi
    // chainId
    const METADATA = "https://ipfs.io/ipfs/QmR6xprTY253fDPM423C5t3EjdTVXuqPDXjPJhpp7v7gQc"
    const { chainId } = useEthers()
    const { abi } = CollectibleCreator
    const collectibleCreatorAddress = chainId ? networkMapping[String(chainId)]["CollectibleCreator"][0] : constants.AddressZero
    const tokenFarmInterface = new utils.Interface(abi)
    const tokenFarmContract = new Contract(collectibleCreatorAddress, tokenFarmInterface)

    // mint
    const { send: createNft, state: mintNewNFT } =
        useContractFunction(tokenFarmContract, "createCollectible", {
            transactionName: "Create NFT",
        })



    const [state, setState] = useState(mintNewNFT)

    useEffect(() => {
        if (mintNewNFT.status === "Success") {
            setState(mintNewNFT)
        }else{

        }
    }, [mintNewNFT])

    return { createNft, state }
}