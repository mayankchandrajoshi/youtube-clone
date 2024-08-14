import type { NextApiRequest, NextApiResponse } from 'next'
const axios = require("axios");
import { videoDetailsInterface } from '@/interfaces/video';

export default async function videoDetail (req: NextApiRequest,res: NextApiResponse) {
  try {
    const { id } = req.query;
    
    const { data:videoResponse } =  await axios.get(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${id}&key=${process.env.Google_Youtube_API_Key}`);

    const {data:channelResponse} = await axios.get(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${videoResponse.items[0].snippet.channelId}&key=${process.env.Google_Youtube_API_Key}`);
    
    const videoDetails:videoDetailsInterface ={
      id: videoResponse.items[0].id,
      video: {
        publishedAt: videoResponse.items[0].snippet.publishedAt,
        title: videoResponse.items[0].snippet.title,
        description: videoResponse.items[0].snippet.description,
        thumbnail: videoResponse.items[0].snippet.thumbnails.default.url,
        tags: videoResponse.items[0].snippet.tags?videoResponse.items[0].snippet.tags:[],
        categoryId: videoResponse.items[0].snippet.categoryId
      },
      statistics: {
        viewCount: videoResponse.items[0].statistics.viewCount,
        likeCount: videoResponse.items[0].statistics.likeCount,
        commentCount: videoResponse.items[0].statistics.commentCount,
      },
      channel : {
        channelId:videoResponse.items[0].snippet.channelId,
        channelAvatar:channelResponse.items[0].snippet.thumbnails.default.url,
        channelTitle :channelResponse.items[0].snippet.title,
        subscribers :channelResponse.items[0].statistics.subscriberCount
    }
  };

    res.status(200).json({
      success:true,
      videoDetails
      })
    } catch (error) {
      res.status(400).json({
        success:false,
        error
    })
  }
}