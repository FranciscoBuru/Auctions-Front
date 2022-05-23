
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
        <Button variant="outlined" onClick={() => {props.sectionChanger(1)}}>My NFTs</Button>
        <Button variant="outlined" onClick={() => {props.sectionChanger(2)}}>Active Auctions</Button>
        <Button variant="outlined" onClick={() => {props.sectionChanger(3)}}>Free Mint</Button>
        </div>
        </>
    )
}