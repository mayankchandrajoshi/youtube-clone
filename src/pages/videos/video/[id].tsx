import React,{ useState,useEffect,useMemo,useContext, useRef, MouseEvent } from 'react'
import { videoDetailsInterface } from '@/interfaces/video';
import axios from 'axios';
import ReactPlayer from 'react-player/lazy'
import { Roboto } from '@next/font/google';
import { BiLike,BiDislike, BiDotsHorizontalRounded } from 'react-icons/bi'
import { RiShareForwardLine } from 'react-icons/ri';
import { BsFilterLeft } from 'react-icons/bs'
import Image from 'next/image'
import stringToHTMLParser from '@/utils/stringToHTMLParser';
import { useInfiniteRelatedVideos } from '@/queries/videos/video';
import Loader1 from '@/components/Loader/Loader1';
import Loader2 from '@/components/Loader/Loader2';
import RelatedVideoCard from '@/components/Videos/RelatedVideoCard';
import { useInfiniteComments } from '@/queries/comments/comments';
import CommentCard from '@/components/Comments/CommentCard';
import Link from 'next/link';
import RelatedVideoCardSkeleton from '@/components/Videos/RelatedVideoCardSkeletion';
import { MyContext } from '@/components/NavBar/Navbar';
import numberFormat from './../../../utils/numberFormat'; 
import styles from './[id].module.css';
import { useInView } from 'react-intersection-observer';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { TfiDownload } from 'react-icons/tfi'
import { HiOutlineScissors } from 'react-icons/hi'
import { MdPlaylistAdd } from 'react-icons/md'
import { BsFlag } from 'react-icons/bs'
import OutsideClick from '@/utils/OutSideClick';
import handleApiError from '@/utils/handleApiError';

const robotoFont = Roboto({weight:["400","500"],subsets:["latin"]});

const VideoDetails:React.FC<{videoData:videoDetailsInterface}> = ({ videoData }) => {
  
  const { isNavActive } = useContext(MyContext);

  const descriptionDivRef = useRef<HTMLDivElement >(null);
  const moreOptionRef = useRef<HTMLDivElement>(null);
  const moreOptionButtonRef = useRef<HTMLButtonElement>(null);

  const [ isShowDescription ,setIsShowDescription ] = useState(false);
  const [ isShowSortFilter ,setIsShowSortFilter ] = useState(false);
  const [ order,setOrder ] = useState<'time'|'relevance'>('relevance');
  const [ isShowComments,setShowComments ] = useState(true);
  const [ isClientSide,setIsClientSide ] = useState(false);
  const [ isShowMoreOptionsYCoord,setIsShowMoreOptionsYCoord ] = useState<-1|0|1>(0);
  const [ isShowMoreOptionsXCoord,setIsShowMoreOptionsXCoord ] = useState<-1|1>(-1);

  const { data,status,fetchNextPage,hasNextPage ,isFetchingNextPage} = useInfiniteRelatedVideos(videoData.id,10);
  const { data: commentsData, status: commentsStatus, fetchNextPage: fetchNextCommentsPage, hasNextPage: commentsHasNextPage,isFetchingNextPage:isFetchingNextCommentPage } = useInfiniteComments(videoData.id, order);

  const memoizedComments = useMemo(() => {
      if (!commentsData) return [];
      return commentsData.pages.flatMap(page => page.comments);
  }, [commentsData]);

  const { ref:commentsRef } = useInView({
    threshold: 0,
    rootMargin: '150px',
    triggerOnce: false,
    skip: !hasNextPage || isFetchingNextCommentPage,
    onChange: (inView) => inView && fetchNextCommentsPage(),
  });

  const { ref:relatedVideosRef } = useInView({
    threshold: 0,
    rootMargin: '150px',
    triggerOnce: false,
    skip: !hasNextPage || isFetchingNextPage,
    onChange: (inView) => inView && fetchNextPage(),
  });

  useEffect(()=>{
    setIsClientSide(true);
  },[])

  OutsideClick(moreOptionRef,moreOptionButtonRef,()=>{
    setIsShowMoreOptionsYCoord(0);
    document.body.style.overflow = 'visible';
  });

  const showMoreOptions = (e:MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if(isShowMoreOptionsYCoord!=0){
      setIsShowMoreOptionsYCoord(0);
      document.body.style.overflow = 'visible';
      return;
    }

    document.body.style.overflow = 'hidden';

    
    if( e.currentTarget.getBoundingClientRect().top<=window.innerHeight/2 ){
      setIsShowMoreOptionsYCoord(1);
    }
    else {
      setIsShowMoreOptionsYCoord(-1);
    }

    const parentTarget = e.currentTarget.closest("#video-data-parent");

    if(!parentTarget) return;
    
    if(window.innerWidth-parentTarget.getBoundingClientRect().right<=170){
      setIsShowMoreOptionsXCoord(-1);
    }
    else{
      setIsShowMoreOptionsXCoord(1);
    }

  }

  useEffect(() => {
    const handleResize = () => {
      setIsShowMoreOptionsYCoord(0);
    };
  
    window.addEventListener('resize', handleResize);
  
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); 

  return (
    <div className={`pt-16 lg:pt-20 pb-5 grid grid-cols-1 xl:grid-cols-[4fr_2fr] 2xl:grid-cols-[1fr_370px] gap-x-5 max-w-[1350px] overx ${isNavActive?"pr-3 pl-1 md:pr-5 md:pl-0 lg:pl-1":"pr-3 pl-3 md:pr-5 md:pl-5 lg:pl-8"}} mx-auto `}>
      <div className="">
        <div className="aspect-video w-full">
          {isClientSide&&<ReactPlayer url={`https://www.youtube.com/watch?v=${videoData.id}`} width='100%' height='100%' controls={true} playing={true}/>}
        </div>
        <div className="py-3">
          <div className="">
            <h2 className={`text-black ${robotoFont.className} font-medium text-lg md:text-xl`}>{videoData.video.title}</h2>
          </div>
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-y-3 my-2" id="video-data-parent">
            <div className="flex flex-row justify-between items-center gap-3 flex-wrap min-[300px]:flex-nowrap">
              <div className="flex flex-row gap-3 items-center">
                <Link href={`/channels/${videoData?.channel.channelId}`} className="shrink-0">
                  <img src={videoData?.channel.channelAvatar} alt="" className="w-10 h-10 rounded-full" />
                </Link>
                <div className="flex flex-row md:flex-col items-center md:items-start gap-2 md:gap-0">
                  <Link href={`/channels/${videoData?.channel.channelId}`} className="min-w-[40px]">
                    <div className={`${robotoFont.className} font-medium text-sm md:text-base line-clamp-1`}>{videoData?.channel.channelTitle}</div>
                  </Link>
                  <div className={`text-[11px] md:text-xs ${robotoFont.className} font-normal text-neutral-500 shrink-0`}>
                    <span className="">{numberFormat(Number(videoData?.channel.subscribers))} </span>
                    <span className="hidden md:inline">subscribers</span>
                  </div>
                </div>
              </div>
              <div className="w-full min-[300px]:w-fit">
                <button className={`w-full bg-black text-white py-2 px-4 rounded-full ${robotoFont.className} text-sm font-medium text-center`}>Subscribe</button>
              </div>
            </div>
            <div className={'flex flex-row items-center gap-4 '+styles.scrollableInteractionBar} >
              <div className="flex flex-row items-center bg-neutral-100 rounded-full">
                <div className="flex flex-row items-center gap-1 p-2 px-4 rounded-l-full border-r border-gray-200 hover:bg-neutral-200 transition-colors duration-300">
                  <BiLike className='text-2xl'/>
                  <h1 className="text-sm font-medium">{numberFormat(Number(videoData?.statistics.likeCount))}</h1>
                </div>
                <div className="p-2 px-4 rounded-r-full hover:bg-neutral-200 transition-colors duration-300">
                  <BiDislike className='text-2xl'/>
                </div>
              </div>
              <div className="flex flex-row items-center bg-neutral-100 hover:bg-neutral-200 transition-colors duration-300 rounded-full p-2 px-3 gap-2">
                <RiShareForwardLine className='text-2xl'/>
                <h2 className="font-medium text-sm">Share</h2>
              </div>
              <div className=''>  
                <button type="button" className="bg-neutral-100 hover:bg-neutral-200 transition-colors duration-300 rounded-full p-2" onClick={showMoreOptions} ref={moreOptionButtonRef}>
                  <BiDotsHorizontalRounded className='text-2xl'/>
                </button>
                <div className={`z-50 absolute py-2 bg-white rounded-xl shadow-md ${isShowMoreOptionsYCoord==0?'hidden':isShowMoreOptionsYCoord==-1?'top-[-170px]':'bottom-[-170px]'} ${isShowMoreOptionsXCoord==-1?'right-0':'-right-[128px]'}`} ref={moreOptionRef}>
                  <button type="button" className="w-full pl-5 pr-10 flex flex-row items-center gap-6 py-2 hover:bg-neutral-200">
                    <div className="">
                      <TfiDownload className='text-lg'/>
                    </div>
                    <div className="text-sm">Download</div>
                  </button>
                  <button type="button" className="w-full pl-5 pr-10 flex flex-row items-center gap-5 py-2 hover:bg-neutral-200">
                    <div className="">
                      <HiOutlineScissors className='text-2xl'/>
                    </div>
                    <div className="text-sm">Clip</div>
                  </button>
                  <button type="button" className="w-full pl-5 pr-10 flex flex-row items-center gap-5 py-2 hover:bg-neutral-200">
                    <div className="">
                      <MdPlaylistAdd className='text-2xl'/>
                    </div>
                    <div className="text-sm">Save</div>
                  </button>
                  <button type="button" className="w-full pl-5 pr-10 flex flex-row items-center gap-6 py-2 hover:bg-neutral-200">
                    <div className="">
                      <BsFlag className='text-xl'/>
                    </div>
                    <div className="text-sm">Report</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-neutral-200 p-3 md:p-4 rounded-lg  break-all" ref={descriptionDivRef}>
            <div className="flex flex-row gap-x-2 items-center flex-wrap">
              <h2 className={`${robotoFont.className} font-medium text-sm whitespace-nowrap`}>{numberFormat(parseInt(videoData.statistics.viewCount))} views</h2>
              <h2 className={`${robotoFont.className} font-medium text-sm whitespace-nowrap`}>Published on {videoData?.video.publishedAt?new Date(videoData.video.publishedAt).toDateString():""}</h2>
              <div className="flex flex-row gap-1">
                {
                  videoData?.video.tags.map((subtitle,index)=>{
                    if(index<3)return <span className={`${robotoFont.className} text-blue-700 text-sm font-medium`} key={index}>{stringToHTMLParser('#'+subtitle.replace(/ /g, ''))} </span>
                  })
                }
              </div>
            </div>
            <div className="">
              {isShowDescription?<div className=''>
                <p className={`text-sm ${robotoFont.className}`}>{stringToHTMLParser(videoData?.video.description)}</p>
                <button className={`text-sm ${robotoFont.className} font-medium`} onClick={()=>{
                    setIsShowDescription(false);
                    if(descriptionDivRef.current){
                      window.scrollX = descriptionDivRef.current.getBoundingClientRect().top;
                    }
                  }}>Show less</button>
              </div>:<div className='relative'>
                <p className={`line-clamp-2 text-sm ${robotoFont.className}`}>{stringToHTMLParser(videoData?.video.description)}</p>
                <button className={`text-sm ${robotoFont.className} font-medium absolute bottom-0 right-0 bg-neutral-200 px-1`} onClick={(()=>setIsShowDescription(true))}>Show more</button>
              </div>}
            </div>
          </div>
          <div className="flex flex-row gap-5 xl:hidden my-3">
            <button onClick={()=>setShowComments(true)} className={`${!isShowComments?"bg-neutral-200 text-black":"bg-black text-white shadow-lg"} rounded-lg p-2 px-3 text-sm cursor-pointer transition-all duration-300`}>
              Comments
            </button>
            <button onClick={()=>setShowComments(false)} className={`${isShowComments?"bg-neutral-200 text-black":"bg-black text-white shadow-lg"} rounded-lg p-2 px-3 text-sm cursor-pointer transition-all duration-300`}>
              Related Video
            </button>
          </div>
          <div className={`${isShowComments?"block":"hidden xl:block"}`}>
            <div className="my-4 flex flex-row items-center gap-6">
              <div className={`${robotoFont.className} text-sm sm:text-md md:text-lg`}>
                {videoData?.statistics.commentCount} Comments
              </div>
              <div className="relative">
                <div className="flex flex-row items-center gap-2 cursor-pointer" onClick={()=>setIsShowSortFilter(prev=>!prev)}>
                  <BsFilterLeft className="text-3xl"/>
                  <div className={`text-sm ${robotoFont.className} font-medium`}>SortBy</div>
                </div>
                <ul className={`absolute top-full left-0 rounded-sm shadow-sm shadow-neutral-400 mt-3 origin-top transition-all duration-300 ${isShowSortFilter?"scale-100":"scale-0"}`} onClick={()=>setIsShowSortFilter(false)}>
                  <li className={`whitespace-nowrap p-4 text-sm rounded-t-sm cursor-pointer ${robotoFont.className} ${order=="relevance"?"bg-neutral-300":"bg-neutral-100"}`} onClick={()=>setOrder("relevance")}>Top comments</li>
                  <li className={`whitespace-nowrap p-4 text-sm rounded-b-sm cursor-pointer ${robotoFont.className} ${order=="time"?"bg-neutral-300":"bg-neutral-100"}`} onClick={()=>setOrder("time")}>Newest First</li>
                </ul>
              </div>
            </div>
            <div className="flex flex-row gap-3 md:gap-5">
              <div className="w-12 h-12 rounded-full shrink-0">
                <Image src='/images/profile_pic.jpg' width={50} height={50} alt="profile_picture" className='w-full h-full rounded-full shrink-0'/>
              </div>
              <div className="grow">
                <div className="border-solid border-b-2 border-black pb-2">
                  <input type="text" className="w-full border-none outline-none text-sm" placeholder='Add a comment...'/>
                </div>
                <div className="flex flex-row gap-1 justify-end mt-2">
                  <button className={`p-2 px-4 text-sm font-medium rounded-full transition-colors duration-500 bg-neutral-100 hover:bg-neutral-200 ${robotoFont.className}`}>
                    Cancel
                  </button>
                  <button className={`p-2 px-4 text-sm font-medium rounded-full transition-colors duration-500 bg-neutral-100 text-gray-500 hover:bg-blue-600 hover:text-white ${robotoFont.className}`}>
                    Comment
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              {
                  (commentsStatus=="loading")&&(
                  <div className={`w-full flex items-center justify-center h-[60vh] py-4`}><Loader2/></div>
                  )
              }
              {commentsStatus === "success" && (
                <div className="">
                  <div className="flex flex-col gap-5 mt-3">
                    {memoizedComments.map((comment) => (
                        <div className="" key={comment.comment.id}>
                            <CommentCard comment={comment}/>
                        </div>
                    ))}
                  </div>
                  <div ref={commentsRef}>
                    {commentsHasNextPage ? <div className={`pl-5 pr-16 flex items-center justify-center h-16 py-4`}><Loader1/></div> : <></>}
                  </div>
                </div>
                )}
            </div>
            </div>
          </div>
      </div>
    <div  className={`${!isShowComments?"block":"hidden xl:block"}`}>
        {
          (status=="loading")&&(
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-x-2 gap-y-6 md:gap-y-4 xl:gap-y-5">
              {[...Array(16)].map((x, index) => (
                <RelatedVideoCardSkeleton key={index} />
              ))}
            </div>
          )
        }
        {status === "success" && (
          <div className="">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-x-2 gap-y-6 md:gap-y-4 xl:gap-y-5">
              {data?.pages.map((page,index)=>(
                <React.Fragment key={index}>
                  {page.videos.map((video,index)=><RelatedVideoCard data={video} key={index}/>)}
                </React.Fragment>
              ))}
            </div>
            <div ref={relatedVideosRef} >
              {hasNextPage ? <div className={`pl-5 pr-16 flex items-center justify-center h-16 py-4`}><Loader1/></div> : <></>}
            </div>
          </div>
        )}
      </div>
  </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  let fetchedVideoData: videoDetailsInterface ;

  try {
    const videoId = context.params?.id as string;
    
    const { data:videoResponse } =  await axios.get(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${process.env.Google_Youtube_API_Key}`);
    

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
  
    fetchedVideoData = videoDetails;

    return {
      props: {
        videoData: fetchedVideoData
      }
    };

  } catch (error) {
    const errorInfo = handleApiError(error);
    return {
      redirect: {
        destination: `/error?code=${errorInfo.code}&message=${errorInfo.message}`, 
        permanent : false
      },
    };
  }
}

export default VideoDetails;