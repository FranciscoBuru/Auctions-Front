import {useState} from 'react'
import { DAppProvider, Config, Rinkeby } from "@usedapp/core"
import { getDefaultProvider } from 'ethers'
import { Header } from "./components/Header";
import { NFTForm } from "./components/NFT-form";
import { LiveAuctions } from './components/LiveAuctions';
import { Sections } from './components/Sections';
import { FreeMint } from './components/FreeMint';
import { CreateAuction } from './components/CreateAuction';
import { AuctionInteraction } from './components/AuctionInteraction';


const config: Config = {
  readOnlyChainId: Rinkeby.chainId,
  readOnlyUrls: {
    [Rinkeby.chainId]: getDefaultProvider('rinkeby'),
  },
  notifications: {
    expirationPeriod: 1000, //ms
    checkInterval: 1000, //ms
  }
}


function App() {

  const [section, setSection] = useState(1) 
  const [auctoinData, setAuctionData] = useState("")
  const [state, setState] = useState("")
  const [auctionAddress, setAuctionAddress] = useState("")

  return (
    <DAppProvider config={config} >
        <Sections sectionChanger = {(sec) => {setSection(sec)}}></Sections>
        <Header></Header>
        {section === 1 ? (
          <NFTForm sectionChanger = {(sec) => {setSection(sec)}} setData = {(data) => {setAuctionData(data)}}></NFTForm>
        ):(
          section === 2 ? (
            <LiveAuctions sectionChanger = {(sec) => {setSection(sec)}} setData = {(data) => {setAuctionData(data)}} setState = {(st) => {setState(st)}} setAuctionAddress = {(st) => {setAuctionAddress(st)}}></LiveAuctions>
          ):(
            section === 3 ? (
              <FreeMint></FreeMint>
            ):(
              section === 4 ? (
                <CreateAuction nft={auctoinData}></CreateAuction>
              ):(
                <AuctionInteraction state ={state} nft={auctoinData} address={auctionAddress}></AuctionInteraction>
              )
              
            )
          )
        )}
    </DAppProvider>
  );
}

export default App;
