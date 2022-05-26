import {Button,Card,CardActions, CardContent,CardMedia,Typography,CardActionArea,  ImageList ,ImageListItem ,  makeStyles} from "@material-ui/core"

export const NFTCard = ({ nft, setData, sectionChanger}) => {
    
    const onClickFunction = () => {
      setData(nft)
      sectionChanger(4)
    }


    return(
        
        <>
        <ImageListItem>
        <Card sx={{ maxWidth: 345 }} style={{backgroundColor: "#f5f4e4" ,borderRadius: '15px', margin: '10px'}}>
          <CardActionArea onClick={() => {onClickFunction()}}>
            <CardMedia
              component="img"
              height="320"
              image= {nft.media[0].gateway}
              alt="nft"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
              {nft.title}
              </Typography>
              <Typography variant="caption">
              {nft.contract.address}
              </Typography>
              <Typography variant="body2">
              {nft.description}
              </Typography>
            </CardContent>
      </CardActionArea>
      </Card>
      </ImageListItem>
      </>
    )
}


  