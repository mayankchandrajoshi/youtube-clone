import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { thumbnailInterface } from '@/interfaces/video';
import formatDuration from '@/utils/formatDuration';


export default async function channelVideos (req: NextApiRequest,res: NextApiResponse) {

    const { id ,pageToken,order }:{ id?:string,pageToken?:string,order?:"viewCount"|"date" } = req.query;

    if(!id||!order){
        return res.status(400).json({
            success:false,
            error:"Invalid parameters"
        })
    }
    

    try {
        const { data } = await axios.get(`https://www.googleapis.com/youtube/v3/search?part=id,snippet&channelId=${id}&type=video&order=${order}&maxResults=12${pageToken?"&pageToken="+pageToken:""}&key=${process.env.Google_Youtube_API_Key}`);

        const ResponseVideos:thumbnailInterface[] = [];

        for ( let i=0;i<data.items.length;i++){
            const { data:videoDetails } = await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${data.items[i].id.videoId}&key=${process.env.Google_Youtube_API_Key}`);

            ResponseVideos.push({
            channel : {
                id: data.items[i].snippet.channelId,
                name: data.items[i].snippet.channelTitle,
            },
            video : {
                id : data.items[i].id.videoId,
                publishedAt: data.items[i].snippet.publishedAt,
                thumbnail : data.items[i].snippet.thumbnails.medium.url,
                description: data.items[i].snippet.description,
                title : data.items[i].snippet.title,
                viewCount: videoDetails.items[0].statistics.viewCount,
                duration:formatDuration(videoDetails.items[0].contentDetails.duration)
            }
            })
        }

        res.status(200).json({
            success:true,
            videos : ResponseVideos,
            nextPageToken:data.nextPageToken
        })
    } catch (error) {
        res.status(400).json({
            success:false,
            error
        })
    }
}