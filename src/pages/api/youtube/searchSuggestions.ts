import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function trending (req: NextApiRequest,res: NextApiResponse) {
    try {
        const { query } : { query?:string } =  req.query;

        if(!query) return res.status(400).json({
            success:false,
            error:"Please Enter some text to search"
        })

        const { data:{ items } } = await axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(query)}&type=video&key=${process.env.Google_Youtube_API_Key}&fields=items(snippet(title))`)


        res.status(200).json({
            success:true,
            items:items.map((item:any)=>item.snippet.title)
        })

    } catch (error) {
        res.status(400).json({
            success:false,
            error
        })
    }
}