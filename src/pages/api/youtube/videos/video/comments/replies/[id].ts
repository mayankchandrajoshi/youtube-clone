import type { NextApiRequest, NextApiResponse } from 'next'
const axios = require("axios");

export default async function videoDetail (req: NextApiRequest,res: NextApiResponse) {
  try {
    const { id,pageToken }:{id?:string,pageToken?:string} = req.query; 

    const { data } = await axios.get(`https://www.googleapis.com/youtube/v3/comments?part=snippet&parentId=${id}${pageToken?'&pageToken='+pageToken:''}&maxResults=5&key=${process.env.Google_Youtube_API_Key}`);

    res.status(200).json({
        replies:data.items.map((item:any)=>{
          return {
              reply:{
                  id:item.id,
                  text:item.snippet.textDisplay,
                  likes:item.snippet.likeCount,
                  publishedAt:item.snippet.publishedAt,
                  updatedAt:item.snippet.updatedAt,
              },
              author:{
                  id:item.snippet.authorChannelId.value,
                  name:item.snippet.authorDisplayName,
                  picture:item.snippet.authorProfileImageUrl,
              },
          }
      }),
      nextPageToken:data.nextPageToken,
    })
  } 
  catch (error) {
      res.status(400).json({
          success:false,
          error
      })
  }
}