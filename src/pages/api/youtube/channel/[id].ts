import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { thumbnailInterface } from '@/interfaces/video';
import formatDuration from '@/utils/formatDuration';


export default async function channelDetails (req: NextApiRequest,res: NextApiResponse) {

    const { id } : {id?:string} = req.query;
    
    if(!id){
      return res.status(400).json({
        success:false,
        error:"Invalid parameters"
      })
    }

    try {
      const { data } = await axios.get(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings&id=${id}&key=${process.env.Google_Youtube_API_Key}`);

      const { data : { items } } = await axios.get(`https://www.googleapis.com/youtube/v3/search?part=id,snippet&channelId=${id}&type=video&order=viewCount&maxResults=20&key=${process.env.Google_Youtube_API_Key}`);

      const ResponseVideos:thumbnailInterface[] = [];

      for ( let i=0;i<items.length;i++){
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

      res.status(200).json({
          success:true,
          channel:{
              name:data.items[0].snippet.title,
              customUrl:data.items[0].snippet.customUrl,
              avatar:data.items[0].snippet.thumbnails.high.url,
              subscribers:Number(data.items[0].statistics.subscriberCount),
              banner:data.items[0].brandingSettings.image?.bannerExternalUrl
          },
          videos : ResponseVideos
      })
    } catch (error) {
        res.status(400).json({
            success:false,
            error
        })
    }
}