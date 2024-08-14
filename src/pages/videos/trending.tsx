import { MyContext } from '@/components/NavBar/Navbar'
import VideoCard from '@/components/Videos/VideoThumbnailCard1'
import { thumbnailInterface } from '@/interfaces/video'
import formatDuration from '@/utils/formatDuration'
import handleApiError from '@/utils/handleApiError'
import { Roboto } from '@next/font/google'
import axios from 'axios'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useContext } from 'react'
import { useState,useEffect } from 'react'

const robotoFont = Roboto({weight:["400","500"],subsets:["latin"]});

const categories : { name: string, id: string|null }[] = [
  { name: 'now', id: null },
  { name: 'music', id: '10' },
  { name: 'gaming', id: '20' },
  { name: 'films', id: '1' }
];

const Trending: React.FC<{ initialVideos: thumbnailInterface[] }> = ({ initialVideos }) => {
  
    const { isNavActive } = useContext(MyContext);
    
    const router = useRouter();

    const [ data,setData ] = useState<thumbnailInterface[]>(initialVideos);
    const [ currentCategory,setCurrentCategory ] = useState<string|null>(null);

    useEffect(()=>{
      try {
        (async()=>{
          if(currentCategory){
            const { data } = await axios.get(`/api/youtube/videos/T?categoryID=${currentCategory}`);
            setData(data.videos);
          }
          else {
            const { data } = await axios.get(`/api/youtube/videos/trending`);
            setData(data.videos);
          }
        })()
      } catch (error ) {
        const errorInfo = handleApiError(error);
        router.push({
          pathname: "/error",
          query: {
            code: errorInfo.code,
            message: errorInfo.message
          }
        });
      }
    },[currentCategory])

  return (
    <>
      <Head>
        <title>Trending - YouTube</title>
      </Head>
      <div className={`mt-20 transition-all duration-500 lg:max-w-[80%] ${isNavActive?"mr-3 ml-3 md:mr-5 md:ml-1 lg:mx-auto":"mr-3 ml-3 md:mr-5 md:ml-5 lg:mx-auto"} w-full`}>
        <div className="flex flex-row items-center gap-3 lg:gap-6 mb-4">
          <Image src='/images/trending_logo.png' alt='trending_logo' width={80} height={80} className="rounded-full  w-[60px] h-[60px] lg:w-20 lg:h-20 shrink-0"/>
          <span className={`text-[22px] lg:text-2xl ${robotoFont.className} font-normal`}>Trending</span>
        </div>
        <ul className="flex flex-row flex-wrap gap-x-7 gap-y-4 mb-3 lg:mb-6 mt-2 lg:mt-0">
          {
            categories.map((category,index)=>(
              <li className={`uppercase text-sm ${robotoFont.className} font-medium w-[90px] text-center p-2 px-5 cursor-pointer transition-all duration-500 border-b-[3px] ${category.id==currentCategory?"border-black text-black":"border-transparent text-neutral-500"}`} key={category.id} onClick={()=>setCurrentCategory(category.id)}>{category.name}</li>
            ))
          }
        </ul>
        <div className="flex flex-col gap-6 lg:gap-4 mb-5">
          {data.map((data,index)=><VideoCard data={data} key={index}/>)}
        </div>
      </div>
    </>
  )
}

export async function getStaticProps() {

  try {
    const trendingVideoQueryStr = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&chart=mostPopular&regionCode=IN&maxResults=20&key=${process.env.Google_Youtube_API_Key}`
  
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
    return {
      props: {
        initialVideos: ResponseVideos,
      },
      revalidate: 3600,
    };
    
  } catch (error) {
    const errorInfo = handleApiError(error);
    return {
      redirect: {
        destination: `/error?code=${errorInfo.code}&message=${errorInfo.message}`, 
      },
    };
  }
}

export default Trending