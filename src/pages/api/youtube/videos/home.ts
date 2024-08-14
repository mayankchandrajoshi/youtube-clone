// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { thumbnailInterface, videoInterface } from '@/interfaces/video';
import formatDuration from '@/utils/formatDuration';
import type { NextApiRequest, NextApiResponse } from 'next'
const axios = require("axios");

export default async function trending (req: NextApiRequest,res: NextApiResponse) {
  try {    
    const { pageToken }:{ pageToken?:string } = req.query;
  
    const { data:{ items,nextPageToken } } = await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&chart=mostPopular&order=viewCount&regionCode=IN&maxResults=12&key=${process.env.Google_Youtube_API_Key}${pageToken?"&pageToken="+pageToken:""}`)

    const ResponseVideos:thumbnailInterface[] = [];

    for (let i = 0; i < items.length; i++) {
      const channelId = items[i].snippet.channelId;
      
      const { data } = await axios.get(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${process.env.Google_Youtube_API_Key}`);
      
      ResponseVideos.push({
        channel : {
          id: items[i].snippet.channelId,
          name: items[i].snippet.channelTitle,
          thumbnail: data.items[0].snippet.thumbnails.medium.url??data.items[0].snippet.thumbnails.default.url,
        },
        video : {
          id : items[i].id,
          publishedAt: items[i].snippet.publishedAt,
          thumbnail : items[i].snippet.thumbnails.medium.url??items[i].snippet.thumbnails.default.url,
          description: items[i].snippet.description,
          title : items[i].snippet.title,
          viewCount: items[i].statistics.viewCount,
          duration:formatDuration(items[i].contentDetails.duration)
        }
      })
    };
    
    const videos :videoInterface = {
      videos:ResponseVideos,
      nextPageToken : nextPageToken
    }

    res.status(200).json({
      success:true,
      videos
     })
    } catch (error) {
      res.status(400).json({
        success:false,
        error
    })
  }
}