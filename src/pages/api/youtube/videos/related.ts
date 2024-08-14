// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { thumbnailInterface, videoInterface } from '@/interfaces/video';
import formatDuration from '@/utils/formatDuration';
import type { NextApiRequest, NextApiResponse } from 'next'
const axios = require("axios");

export default async function trending (req: NextApiRequest,res: NextApiResponse) {
  try {

    const { id ,maxResults }:{ id?:string,maxResults?:number } = req.query;

    if(!id){
      res.status(400).json({
        success:false,
        error:"Invalid parameter"
      })
    }

    if(maxResults){
      // const { data:{ items } } = await axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&relatedToVideoId=${id}&maxResults=${maxResults}&type=video&key=${process.env.Google_Youtube_API_Key}`);

      const { data:{ items } } = await axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${maxResults}&type=video&key=${process.env.Google_Youtube_API_Key}`);
      
      const ResponseVideos:thumbnailInterface[] = [];

      for ( let i=maxResults-10;i<items.length;i++){
        const { data } = await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${items[i].id.videoId}&key=${process.env.Google_Youtube_API_Key}`);

        ResponseVideos.push({
          channel : {
            id: items[i].snippet.channelId,
            name: items[i].snippet.channelTitle,
          },
          video : {
            id : items[i].id.videoId,
            publishedAt: items[i].snippet.publishedAt,
            thumbnail : items[i].snippet.thumbnails.medium.url,
            description: items[i].snippet.description,
            title : items[i].snippet.title,
            viewCount: data.items[0].statistics.viewCount,
            duration:formatDuration(data.items[0].contentDetails.duration)
          }
        })
      }

      return res.status(200).json({
        success:true,
        videos:ResponseVideos,
        maxResults:Number(maxResults<50?maxResults:null)
      })
    }
    return res.status(200).json({
      success:true,
      videos:[],
      maxResults:null
    })
  } catch (error) {
    res.status(400).json({
      success:false,
      error
    })
  }
}