import {useState} from 'react'
import {Button,  Container} from "@material-ui/core"



export const Sections = (props) => {

    return(
        <>
        <Button variant="outlined" onClick={() => {props.sectionChanger(1)}}>My NFTs</Button>
        <Button variant="outlined" onClick={() => {props.sectionChanger(2)}}>Active Auctions</Button>
        <Button variant="outlined" onClick={() => {props.sectionChanger(3)}}>Free Mint</Button>
        
        </>
    )
}