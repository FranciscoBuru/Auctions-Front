
import {Button,  makeStyles} from "@material-ui/core"

const useStyles = makeStyles((theme) => ({
    container:{
        padding: theme.spacing(4),
        display: "flex",
        justifyContent: "flex-start",
        gap: theme.spacing(1)
    }
}))

export const Sections = (props) => {

    const classes = useStyles()

    return(
        <>
        <div className={classes.container}>
        {props.section === 1 || props.section === 4 ? (
            <>
            <Button variant="contained" color="primary" onClick={() => {props.sectionChanger(1)}}>My NFTs</Button>
            <Button variant="outlined" onClick={() => {props.sectionChanger(2)}}>Live Auctions</Button>
            <Button variant="outlined" onClick={() => {props.sectionChanger(3)}}>Free Mint</Button>
            </>
        ):(<></>)}
        {props.section === 2 || props.section === 5 ? (
            <>
            <Button variant="outlined" onClick={() => {props.sectionChanger(1)}}>My NFTs</Button>
            <Button variant="contained" color="primary" onClick={() => {props.sectionChanger(2)}}>Live Auctions</Button>
            <Button variant="outlined" onClick={() => {props.sectionChanger(3)}}>Free Mint</Button>
            </>
        ):(<></>)}
        {props.section === 3 ? (
            <>
            <Button variant="outlined" onClick={() => {props.sectionChanger(1)}}>My NFTs</Button>
            <Button variant="outlined" onClick={() => {props.sectionChanger(2)}}>Live Auctions</Button>
            <Button variant="contained" color="primary" onClick={() => {props.sectionChanger(3)}}>Free Mint</Button>
            </>
        ):(<></>)}
        </div>
        </>
    )
}