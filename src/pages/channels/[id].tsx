import VideoCard from '@/components/Videos/VideoThumbnailCard2';
import { channelDetailsInterface } from '@/interfaces/channel';
import { useInfiniteChannelVideos } from '@/queries/videos/video';
import numberFormat from '@/utils/numberFormat';
import { Roboto } from '@next/font/google';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component';
import { thumbnailInterface } from '../../interfaces/video'
import Loader1 from '@/components/Loader/Loader1';
import { useMemo,useContext } from 'react'
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import VideoThumbnailCard1Skeleton from '@/components/Videos/VideoThumbnailCard2Skeleton';
import { MyContext } from '@/components/NavBar/Navbar';

const robotoFont = Roboto({weight:["400","500"],subsets:["latin"]});

const ChannelDetails = () => {

  const router = useRouter();
  const { id } = router.query as { id : string};

  const { isNavActive } = useContext(MyContext);

  const [ currentDisplay,setCurrentDisplay ] =  useState<"Home"|"Videos">("Home");
  const [ order,setOrder ] = useState<"date"|"viewCount">("date")
  const [ channelDetails,setChannelDetails ] = useState<channelDetailsInterface>();
  const [ channelHomeVideos,setChannelHomeVideos ] = useState<thumbnailInterface[]>([]);
  const { data,status,fetchNextPage,hasNextPage,isFetchingNextPage } = useInfiniteChannelVideos(id,order);

  const memoizedVideos = useMemo(() => {
    if (!data) return [];
    return data.pages.flatMap(page => page.videos);
  }, [data]);

  useEffect(() => {
    if(router.isReady){
      (async()=>{
        const { data } = await axios.get(`/api/youtube/channel/${id}`);
        setChannelDetails(data.channel)
        setChannelHomeVideos(data.videos);
      })()
    }
  }, [id,router.isReady])

  if(!router.isReady||!channelDetails){
    return (
      <div className={`mb-5 mt-16 w-full ${isNavActive?"mr-4 ml-1 md:mr-5 md:ml-0":"mr-4 ml-4 md:mr-5 md:ml-5"}`}>
        <Skeleton className="w-full !h-20 md:!h-64 leading-none" variant='rectangular'/>
        <Box className="md:mx-8 lg:mx-16 mt-5 flex flex-col md:flex-row items-center justify-between" >
          <Box className="flex flex-col md:flex-row items-center gap-5">
            <Skeleton className='w-16 !h-16' variant="circular"/>
            <Box className="flex flex-col items-center md:items-start">
              <Skeleton variant='rectangular' height={25} style={{marginBottom:7}} className="w-24 md:w-64"/>
              <Box className="flex flex-row md:flex-col gap-3">
                <Skeleton variant='rectangular' height={15} style={{marginBottom:7}} className="w-24 md:w-60"/>
                <Skeleton variant='rectangular' height={15} style={{marginBottom:7}} className="w-24 md:w-60"/>
              </Box>
            </Box>
          </Box>
          <Skeleton className="w-full md:w-28 !h-9 rounded-full" variant="rounded"/>
        </Box>
        <Box className="md:mx-16 my-1 md:my-2">
          <Box className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-y-7 lg:ml-5 mt-10">
            {[...Array(16)].map((x, index) => (
              <VideoThumbnailCard1Skeleton key={index}/>
              ))}
          </Box>
        </Box>
      </div>
    )
  }
  
  return (
    <div className={`mt-16 mb-5 w-full ${robotoFont.className} ${isNavActive?"mr-4 ml-1 md:mr-5 md:ml-0":"mr-4 ml-4 md:mr-5 md:ml-5"}`}>
      {channelDetails?.banner&&<div className="w-full aspect-[30/7] md:aspect-auto md:h-40 lg:h-60">
        <img src={channelDetails.banner} alt="" className="w-full h-full object-cover object-center" />
      </div>}
      <div className="md:px-8 lg:px-16 pt-5 border-b border-solid border-neutral-200">
        <div className="">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-5">
              <img src={channelDetails?.avatar} alt="" className="w-16 md:w-20 aspect-square rounded-full" />
              <div className="">
                <div className="text-2xl text-center md:text-start font-bold">{channelDetails?.name}</div>
                <div className="flex flex-row justify-center gap-2 my-2 md:my-0 md:block">
                  <div className="text-[13px] md:text-sm font-medium md:font-normal text-neutral-600 uppercase">{channelDetails?.customUrl}</div>
                  <div className="text-[13px] md:text-sm text-neutral-600">{numberFormat(channelDetails?.subscribers)} subscribers</div>
                </div>
              </div>
            </div>
            <div className="w-full md:w-fit p-2 px-4 text-sm font-medium bg-black text-center text-white rounded-full cursor-pointer">Subscribe</div>
          </div>
        </div>
        <div className="flex flex-row mt-3">
        <div className={`uppercase text-sm font-medium p-3 px-7 cursor-pointer border-b-[3px] border-solid transition-all duration-500 ${currentDisplay=="Home"?"border-b-black text-black":"border-b-transparent text-neutral-400"}`} onClick={()=>setCurrentDisplay("Home")}>Home</div>
        <div className={`uppercase text-sm font-medium p-3 px-7 cursor-pointer border-b-[3px] border-solid transition-all duration-500 ${currentDisplay=="Videos"?"border-b-black text-black":"border-b-transparent text-neutral-400"}`} onClick={()=>setCurrentDisplay("Videos")}>Videos</div>
      </div>
      </div>
      {
        currentDisplay==="Home"&&<div className="md:px-16 py-2">
        <h1 className="font-medium mb-5 mt-2">
          Videos
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-3 md:gap-y-7">
          {
            channelHomeVideos.map((video,index)=>(
              <VideoCard data ={video} key={index}/>
            ))
          }
        </div>
      </div>
      }
      {
        currentDisplay==="Videos"&&<div className="md:px-16 py-4">
          <div className="flex flex-row gap-5 mb-4">
            <div className={`text-sm p-2 px-3 font-medium rounded-md cursor-pointer ${order==="date"?"bg-black text-white":"bg-neutral-100 text-black"}`} onClick={()=>setOrder("date")}>
              Latest
            </div>
            <div className={`text-sm p-2 px-3 font-medium rounded-md cursor-pointer ${order==="viewCount"?"bg-black text-white":"bg-neutral-100 text-black"}`} onClick={()=>setOrder("viewCount")}>
              Popular
            </div>
          </div>
          <div className="flex flex-col">
              {
                  status=="loading"&&(
                    <Box className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-y-7 lg:ml-5">
                      {[...Array(16)].map((x, index) => (
                        <VideoThumbnailCard1Skeleton key={index}/>
                      ))}
                    </Box>
                  )
              }
              {status === "success" && (
                  <InfiniteScroll
                      dataLength={data?.pages.flat().length ?? 0}
                      next={fetchNextPage}
                      hasMore={hasNextPage?hasNextPage:false}
                      loader={<div className={`pl-5 pr-16 flex items-center justify-center h-16 py-4`}><Loader1/></div>}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                      {
                        memoizedVideos.map((video,index)=>(
                          <VideoCard data ={video} key={index}/>
                        ))
                      }
                    </div>
                  </InfiniteScroll>
                )}
        </div>
      </div>
      }
    </div>
  
  )
}

export default ChannelDetails