import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { getRFC3339DateTime } from '@/utils/getRFCFormatedTime';
import formatDuration from '@/utils/formatDuration';

export default async function trending (req: NextApiRequest,res: NextApiResponse) {
    try{
        const  { query,type,duration,uploadTime,order,pageToken } : { query?:string,type?:"video"|"channel"|"playlist",duration?:"short"|"medium"|"long",uploadTime?:"hour"|"day"|"week"|"month"|"year",order?:'date'|'relevance'|"viewCount"|"rating",pageToken?:string } = req.query;

        if(!query) return res.status(400).json({
            success:false,
            error:"Please Enter some text to search"
        })

        let queryStr = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${encodeURIComponent(query)}${type?"&type="+type:""}${order?"&order="+order:"&order=relevance"}${pageToken?"&pageToken="+pageToken:""}&key=${process.env.Google_Youtube_API_Key}`

        if(type==="video"||!type){
            queryStr+= `${uploadTime?"&publishedAfter="+getRFC3339DateTime(uploadTime):""}`;
            queryStr+= `${duration?"&videoDuration="+duration:""}`;
        }

        const { data : { items,nextPageToken } } = await axios.get(queryStr);

        const responseData:any = [];

        await Promise.all(items.map(async (item:any)=>{
            if(item.id.kind==="youtube#video"){
                const { data } = await axios.get(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${item.id.videoId}&key=${process.env.Google_Youtube_API_Key}`);

                responseData.push({
                    type:"video",
                    channel : {
                        id: data.items[0].snippet.channelId,
                        name: data.items[0].snippet.channelTitle
                    },
                    video : {
                        id : data.items[0].id,
                        publishedAt: data.items[0].snippet.publishedAt,
                        thumbnail : data.items[0].snippet.thumbnails.medium.url??data.items[0].snippet.thumbnails.default.url,
                        description: data.items[0].snippet.description,
                        title : data.items[0].snippet.title,
                        viewCount: data.items[0].statistics.viewCount,
                        duration:formatDuration(data.items[0].contentDetails.duration)
                      }
                })
            }
            else if(item.id.kind==="youtube#channel"){
                const { data } = await axios.get(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${item.id.channelId}&key=${process.env.Google_Youtube_API_Key}`);

                if(!data.items) return;
                
                responseData.push({
                    type:"channel",
                    channelId:data.items[0].id,
                    name:data.items[0].snippet.title,
                    description:data.items[0].snippet.description,
                    customUrl:data.items[0].snippet.customUrl,
                    avatar:data.items[0].snippet.thumbnails.high.url,
                    subscribers:Number(data.items[0].statistics.subscriberCount),
                })
            }
            else if (item.id.kind=="youtube#playlist"){
                
                const { data } = await axios.get(`https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&id=${item.id.playlistId}&key=${process.env.Google_Youtube_API_Key}`);

                responseData.push({
                    type:"playlist",
                    channel:{
                        id:data.items[0].snippet.channelId,
                        name:data.items[0].snippet.channelTitle
                    },
                    playlist:{
                        id:item.id.playlistId,
                        name:data.items[0].snippet.title,
                        description:data.items[0].snippet.description,
                        thumbnail:data.items[0].snippet.thumbnails.medium.url,
                        videoCount:data.items[0].contentDetails.itemCount
                    }
                })
            }
        }))

        res.status(200).json({
            success:true,
            data:responseData,
            nextPageToken
        })

    } catch (error) {
        res.status(400).json({
            success:false,
            error
        })
    }
}