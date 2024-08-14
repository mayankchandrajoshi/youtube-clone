import { ErrorInterface, isErrorInterface } from '@/interfaces/error';
import { thumbnailInterface } from '@/interfaces/video';
import formatDuration from '@/utils/formatDuration';
import type { NextApiRequest, NextApiResponse } from 'next'
const axios = require("axios");

interface ResponseData {
  success: boolean;
  videos?: thumbnailInterface[];
  error?: ErrorInterface; 
}

export default async function trendingVideos(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  try {    
    const { categoryID }:{ categoryID?:"10"|"20"|"1" } = req.query;

    let trendingVideoQueryStr = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&chart=mostPopular&regionCode=IN&maxResults=20&key=${process.env.Google_Youtube_API_Key}`

    if(categoryID){
      trendingVideoQueryStr+=`&videoCategoryId=${categoryID}`
    };
  
    const { data:{ items } } = await axios.get(trendingVideoQueryStr)

    const ResponseVideos:thumbnailInterface[] = items.map((item:any)=>({
      channel : {
        id: item.snippet.channelId,
        name: item.snippet.channelTitle,
      },
      video : {
        id : item.id,
        publishedAt: item.snippet.publishedAt,
        thumbnail : item.snippet.thumbnails.medium.url,
        description: item.snippet.description,
        title : item.snippet.title,
        viewCount: item.statistics.viewCount,
        duration:formatDuration(item.contentDetails.duration)
      }
    }));
    

    res.status(200).json({
      success:true,
      videos:ResponseVideos
     })
    } catch (error) {
      if (isErrorInterface(error)) {
        res.status(error.code).json({
          success:false,
          ...error
        })
      } else {
          res.status(400).json({
            success:false,
            error : {
              code: 500,
              message : " Unknown Error",
              errors : [
                {
                  message : "UnKnown Error",
                  domain : "youtube.video",
                  reason : "unknownReason"
                }
              ]
            }
        })
      }
  }
}