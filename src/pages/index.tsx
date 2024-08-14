import React,{ useContext } from 'react'
import VideoCard from '@/components/Videos/VideoThumbnailCard2'
import Head from 'next/head'
import { useInfiniteHomeVideos } from '@/queries/videos/video'
import InfiniteScroll from "react-infinite-scroll-component";
import Loader1 from '@/components/Loader/Loader1';
import VideoThumbnailCard2Skeleton from '@/components/Videos/VideoThumbnailCard2Skeleton';
import { MyContext } from '@/components/NavBar/Navbar';


export default function Home () {
  const { isNavActive } = useContext(MyContext);
  const { data,status,fetchNextPage,hasNextPage } = useInfiniteHomeVideos();
  
  return (
    <>
    <Head>
      <title>YouTube</title>
    </Head>

    {
      (status==="loading"||status==="idle")&&(
        <div className={`w-screen grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-3 md:gap-y-7 mx-3 md:mx-5 mt-16 lg:mt-20 ${isNavActive?"ml-2 md:ml-[1px]":"ml-3 md:ml-5"}`}>
            {[...Array(16)].map((x, index) => (
            <VideoThumbnailCard2Skeleton key={index} avatar/>
            ))}
        </div>
      )
    }
    {status === "success" && (
      <InfiniteScroll
        dataLength={data?.pages.length * 12}
        next={fetchNextPage}
        hasMore={hasNextPage?hasNextPage:false}
        loader={<div className={`px-5 flex items-center justify-center h-16 py-4`}><Loader1/></div>}
      >
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-3 md:gap-y-7 mx-3 md:mx-5 mt-16 lg:mt-20 ${isNavActive?"ml-2 md:ml-[1px]":"ml-3 md:ml-5"}`}>
          {data?.pages.map((page,index)=>(
            <React.Fragment key={index}>
              {page.videos.map((video,index)=><VideoCard data={video} key={index}/>)}
            </React.Fragment>
          ))}
        </div>
      </InfiniteScroll>
    )}
  </>
  )
}