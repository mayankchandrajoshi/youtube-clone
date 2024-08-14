import type { NextApiRequest, NextApiResponse } from 'next'
const axios = require("axios");

export default async function videoDetail (req: NextApiRequest,res: NextApiResponse) {
    try {
        const { id,order,pageToken }:{id?:string,order?:'time'|'relevance',pageToken?:string} = req.query; 
    
        const { data } = await axios.get(`https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${id}${order?'&order='+order:"&order=relevance"}&maxResults=5${pageToken?'&pageToken='+pageToken:''}&key=${process.env.Google_Youtube_API_Key}`);
    
        res.status(200).json({
            comments:data.items.map((item:any)=>{
                return {
                    comment:{
                        id:item.id,
                        text:item.snippet.topLevelComment.snippet.textDisplay,
                        likes:item.snippet.topLevelComment.snippet.likeCount,
                        totalReplies:item.snippet.totalReplyCount,
                        publishedAt:item.snippet.topLevelComment.snippet.publishedAt,
                        updatedAt:item.snippet.topLevelComment.snippet.updatedAt,
                    },
                    author:{
                        id:item.snippet.topLevelComment.snippet.authorChannelId.value,
                        name:item.snippet.topLevelComment.snippet.authorDisplayName,
                        picture:item.snippet.topLevelComment.snippet.authorProfileImageUrl,
                    },
                }
            }),
            nextPageToken:data.nextPageToken,
            isDisabled:false
        })
    } 
    catch (error:any) {
        if(error.response.data.error.code==403&&error.response.data.error.errors[0].reason=="commentsDisabled"){
            return res.status(400).json({
                comments:[],
                nextPageToken:undefined,
                isDisabled:true
            })
        }
        res.status(400).json({
            success:false,
            error
        })
    }
}