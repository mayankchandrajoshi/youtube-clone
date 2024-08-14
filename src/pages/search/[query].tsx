import { useInfiniteSearch } from '@/queries/seach';
import { useRouter } from 'next/router';
import React,{ useEffect, useReducer, useRef, useState,useContext } from 'react'
import { IoFilterOutline,IoFilterSharp } from 'react-icons/io5'
import { RxCross2 } from 'react-icons/rx';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loader1 from '@/components/Loader/Loader1';
import Loader2 from '@/components/Loader/Loader2';
import SearchVideoCard from '@/components/Videos/SearchVideoCard';
import ChannelCard from '@/components/Channel/ChannelCard';
import PlaylistCard from '@/components/Playlist/PlaylistCard';
import { MyContext } from '@/components/NavBar/Navbar';
import handleApiError from '@/utils/handleApiError';
import next, { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { searchResultInterface } from '@/interfaces/search';
import axios from 'axios';
import formatDuration from '@/utils/formatDuration';
import { getRFC3339DateTime } from '@/utils/getRFCFormatedTime';

type uploadDateType = 'hour'|'day'|'week'|'month'|'year'|null;
type typeType = 'video'|"channel"|"playlist"|null;
type durationType = 'short'|'medium'|'long'|null;
type sortType = 'date'|'relevance'|"viewCount"|"rating"|null


interface filterInterface {
    uploadDate: uploadDateType,
    type: typeType,
    duration: durationType,
    sort: sortType
}

type Action = 
    { type: 'uploadDate', payload: uploadDateType }| { type: 'type', payload: typeType }|{ type:'duration',payload:durationType }|{ type:'sort',payload:sortType };

const initialFilter:filterInterface = {
    uploadDate:null,
    type:null,
    duration:null,
    sort:null
}

const filterReducer =(state:filterInterface,action:Action):filterInterface => {
    switch (action.type) {
        case "uploadDate":
            if( state.type==="channel"||state.type==="playlist" ) return state;
            return { ...state,uploadDate:action.payload,type:"video" };
        case "type":
            if( (action.payload!=="video" ) && ( state.duration || state.uploadDate ) ) return state;
            return { ...state,type:action.payload };
        case "duration":
            if( state.type==="channel"||state.type==="playlist" ) return state;
            return { ...state,duration:action.payload,type:"video" };
        case "sort":
            return { ...state,sort:action.payload };
    }
    
}

const Query = ({ initialData }: { initialData: searchResultInterface }) => {

    const router = useRouter();

    const { query } = router.query as { query: string };
    
    const { isNavActive } = useContext(MyContext);

    const [ showFilter,setShowFilters ] = useState(false);
    const [ filters, dispatch] = useReducer(filterReducer, initialFilter);
    const uploadDateFilterRef = useRef<HTMLUListElement>(null);
    const typeFilterRef = useRef<HTMLUListElement>(null);
    const durationFilterRef = useRef<HTMLUListElement>(null);
    const sortFilterRef = useRef<HTMLUListElement>(null);
    
    const { data, status, fetchNextPage, hasNextPage } = useInfiniteSearch(query, filters.sort, filters.type, filters.duration, filters.uploadDate,  initialData );

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const uploadDate = searchParams.get("uploadDate");
        const type = searchParams.get("type");
        const duration = searchParams.get("duration");
        const sort = searchParams.get("sort");

        if (uploadDate === 'hour'||uploadDate ==='day'||uploadDate ==='week'||uploadDate ==='month'||uploadDate ==='year') {
            dispatch({ type: "uploadDate", payload: uploadDate });
        }
    
        if (type==='video'||type==="channel"||type==="playlist") {
            dispatch({ type: "type", payload: type });
        }

        if (duration==='short'||duration==='medium'||duration==='long') {
            dispatch({ type: "duration", payload: duration });
        }

        if (sort==='date'||sort==='relevance'||sort==="viewCount"||sort==="rating") {
            dispatch({ type: "sort", payload: sort });
        }
    }, []);

    useEffect(() => {
        if(query){
            const searchParams = new URLSearchParams();
            Object.entries(filters).forEach((entry) => {
                if (entry[1]) {
                    searchParams.append(entry[0], entry[1]);
                }
            });
            const search = searchParams.toString();
            
            router.replace(`/search/${query}?${search}`);
        }
    }, [filters,query]);

    useEffect(() => {
        const handleUploadDateClick = (e: MouseEvent) => {
            if (!(e.target instanceof Element)) return;
            if (e.target instanceof HTMLSpanElement) {
                dispatch({ type: "uploadDate", payload: (e.target.dataset.time as uploadDateType) });
            }
            if (e.target.tagName === "svg" || e.target.tagName === "path") {
                dispatch({ type: "uploadDate", payload: null });
            }
        };
    
        const handleTypeClick = (e: MouseEvent) => {
            if (!(e.target instanceof Element)) return;
            if (e.target instanceof HTMLSpanElement) {
                dispatch({ type: "type", payload: (e.target.dataset.type as typeType) });
            }
            if (e.target.tagName === "svg" || e.target.tagName === "path") {
                dispatch({ type: "type", payload: null });
            }
        };
    
        const handleDurationClick = (e: MouseEvent) => {
            if (!(e.target instanceof Element)) return;
            if (e.target instanceof HTMLSpanElement) {
                dispatch({ type: "duration", payload: (e.target.dataset.duration as durationType) });
            }
            if (e.target.tagName === "svg" || e.target.tagName === "path") {
                dispatch({ type: "duration", payload: null });
            }
        };
    
        const handleSortClick = (e: MouseEvent) => {
            if (e.target instanceof HTMLLIElement) {
                dispatch({ type: "sort", payload: (e.target.dataset.sort as sortType) });
            }
        };
    
        uploadDateFilterRef.current?.addEventListener('click', handleUploadDateClick);
        typeFilterRef.current?.addEventListener('click', handleTypeClick);
        durationFilterRef.current?.addEventListener('click', handleDurationClick);
        sortFilterRef.current?.addEventListener('click', handleSortClick);
    
        return () => {
            uploadDateFilterRef.current?.removeEventListener('click', handleUploadDateClick);
            typeFilterRef.current?.removeEventListener('click', handleTypeClick);
            durationFilterRef.current?.removeEventListener('click', handleDurationClick);
            sortFilterRef.current?.removeEventListener('click', handleSortClick);
        };
    }, []);
    

  return (
    <div className={`mt-16 md:mt-20 mb-5 w-full ${isNavActive?"mr-3 ml-1 md:mr-5":"mr-3 ml-3 md:mr-5 md:ml-5"}`}>
        <div className="max-w-6xl mx-auto w-full flex flex-col">
            <div className="flex flex-row items-center gap-2 cursor-pointer rounded-full transition-colors duration-300 hover:bg-neutral-200 active:bg-neutral-300 w-fit p-2 px-3 mb-1" onClick={()=>setShowFilters(prev=>!prev)}>
                <IoFilterOutline className={`text-xl ${showFilter?"hidden":"block"}`}/>
                <IoFilterSharp className={`text-xl ${showFilter?"block":"hidden"}`}/>
                <span className="font-medium text-sm">Filters</span>
            </div>
            <div className={`border-b border-solid grid grid-cols-1 min-[400px]:grid-cols-2 md:grid-cols-4 md:gap-5 transition-[max-height] duration-700 overflow-hidden ${showFilter?"max-h-[999px]":"max-h-0"}`}>
                <div className="pt-1 md:pt-3 md:pb-5">
                    <div className="text-xs font-medium py-3 border-b border-solid">UPLOAD DATE</div>
                    <ul className="py-3 flex flex-col gap-3 text-sm" ref={uploadDateFilterRef}>
                        <li className="flex flex-row items-center gap-2 cursor-pointer">
                            <span className={`${filters.uploadDate==="hour"?"font-medium":"font-normal"} transition-all duration-300`} data-time="hour">Last hour</span>
                            {filters.uploadDate==="hour"&&<RxCross2 className={`text-lg text-neutral-500`}/>}
                        </li>
                        <li className="flex flex-row items-center gap-2 cursor-pointer">
                            <span className={`${filters.uploadDate==="day"?"font-medium":"font-normal"} transition-all duration-300`} data-time="day">Today</span>
                            {filters.uploadDate==="day"&&<RxCross2 className={`text-lg text-neutral-500`}/>}
                        </li>
                        <li className="flex flex-row items-center gap-2 cursor-pointer">
                            <span className={`${filters.uploadDate==="week"?"font-medium":"font-normal"} transition-all duration-300`} data-time="week">This week</span>
                            {filters.uploadDate==="week"&&<RxCross2 className={`text-lg text-neutral-500`}/>}
                        </li>
                        <li className="flex flex-row items-center gap-2 cursor-pointer">
                            <span className={`${filters.uploadDate==="month"?"font-medium":"font-normal"} transition-all duration-300`} data-time="month">This month</span>
                            {filters.uploadDate==="month"&&<RxCross2 className={`text-lg text-neutral-500`}/>}
                        </li>
                        <li className="flex flex-row items-center gap-2 cursor-pointer">
                            <span className={`${filters.uploadDate==="year"?"font-medium":"font-normal"} transition-all duration-300`} data-time="year">This year</span>
                            {filters.uploadDate==="year"&&<RxCross2 className={`text-lg text-neutral-500`}/>}
                        </li>
                    </ul>
                </div>
                <div className="pt-1 md:pt-3 md:pb-5">
                    <div className="text-xs font-medium py-3 border-b border-solid">TYPE</div>
                    <ul className="py-3 flex flex-col gap-3 text-sm" ref={typeFilterRef}>
                        <li className="flex flex-row items-center gap-2 cursor-pointer">
                            <span className={`${filters.type==="video"?"font-medium":"font-normal"} transition-all duration-300`} data-type="video">Video</span>
                            {filters.type==="video"&&<RxCross2 className={`text-lg text-neutral-500`}/>}
                        </li>
                        <li className="flex flex-row items-center gap-2 cursor-pointer">
                            <span className={`${filters.type==="channel"?"font-medium":"font-normal"} transition-all duration-300`} data-type="channel">Channel</span>
                            {filters.type==="channel"&&<RxCross2 className={`text-lg text-neutral-500`}/>}
                        </li>
                        <li className="flex flex-row items-center gap-2 cursor-pointer">
                            <span className={`${filters.type==="playlist"?"font-medium":"font-normal"} transition-all duration-300`} data-type="playlist">Playlist</span>
                            {filters.type==="playlist"&&<RxCross2 className={`text-lg text-neutral-500`}/>}
                        </li>
                    </ul>
                </div>
                <div className="pt-1 md:pt-3 md:pb-5">
                    <div className="text-xs font-medium py-3 border-b border-solid">DURATION</div>
                    <ul className="py-3 flex flex-col gap-3 text-sm" ref={durationFilterRef}>
                        <li className="flex flex-row items-center gap-2 cursor-pointer">
                            <span className={`${filters.duration==="short"?"font-medium":"font-normal"} transition-all duration-300`} data-duration="short">Under 4 minutes</span>
                            {filters.duration==="short"&&<RxCross2 className={`text-lg text-neutral-500`}/>}
                        </li>
                        <li className="flex flex-row items-center gap-2 cursor-pointer">
                            <span className={`${filters.duration==="medium"?"font-medium":"font-normal"} transition-all duration-300`} data-duration="medium">4-20 minutes</span>
                            {filters.duration==="medium"&&<RxCross2 className={`text-lg text-neutral-500`}/>}
                        </li>
                        <li className="flex flex-row items-center gap-2 cursor-pointer">
                            <span className={`${filters.duration==="long"?"font-medium":"font-normal"} transition-all duration-300`} data-duration="long">Over 20 minutes</span>
                            {filters.duration==="long"&&<RxCross2 className={`text-lg text-neutral-500`}/>}
                        </li>
                    </ul>
                </div>
                <div className="pt-1 md:pt-3 md:pb-5">
                    <div className="text-xs font-medium py-3 border-b border-solid">SORT</div>
                    <ul className="py-3 flex flex-col gap-3 text-sm" ref={sortFilterRef}>
                        <li className={`${filters.sort==="relevance"||filters.sort===null?"font-medium":"font-normal"} transition-all duration-300 cursor-pointer`} data-sort="relevance">Relevance</li>
                        <li className={`${filters.sort==="date"?"font-medium":"font-normal"} transition-all duration-300 cursor-pointer`} data-sort="date">Upload date</li>
                        <li className={`${filters.sort==="viewCount"?"font-medium":"font-normal"} transition-all duration-300 cursor-pointer`} data-sort="viewCount">View count</li>
                        <li className={`${filters.sort==="rating"?"font-medium":"font-normal"} transition-all duration-300 cursor-pointer`} data-sort="rating">Rating</li>
                    </ul>
                </div>
            </div>
            <div className="">
                {
                    status=="loading"&&(
                    <div className={`w-full flex items-center justify-center h-[60vh] py-4`}><Loader2/></div>
                    )
                }
                {status === "success" && (
                    <InfiniteScroll
                    dataLength={data?.pages.flat().length ?? 0}
                    next={(fetchNextPage)}
                    hasMore={hasNextPage?hasNextPage:false}
                    loader={<div className={`pl-5 pr-16 flex items-center justify-center h-16 py-4`}><Loader1/></div>}
                    key={'infinite-scroll-2'}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-7 md:gap-4 mt-5">
                        {data?.pages.map((page,index)=>(
                            <React.Fragment key={index}>
                            {page.data.map((currentDAta,index)=>{
                                if(currentDAta.type=="video") return <SearchVideoCard data={currentDAta} key={index}/>
                                else if(currentDAta.type=="channel") return <ChannelCard data={currentDAta} key={index}/>
                                else return <PlaylistCard data={currentDAta} key={index}/>
                            })}
                            </React.Fragment>
                        ))}
                        </div>
                    </InfiniteScroll>
                    )}
            </div>
        </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
    try{
        const { query } = context.params as { query?: string };

        const { type, duration, uploadTime, order, pageToken } =  context.query as {
            type?: "video" | "channel" | "playlist",
            duration?: "short" | "medium" | "long",
            uploadTime?: "hour" | "day" | "week" | "month" | "year",
            order?: 'date' | 'relevance' | "viewCount" | "rating",
            pageToken?: string
        }

        if (!query) throw new Error("Please enter some text to search");

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

        const initialData : searchResultInterface = {
            data :  responseData,
            nextPageToken : nextPageToken
        };
  
        return {
            props: {
                initialData 
            }
        };

    } 
    catch (error) {
        const errorInfo = handleApiError(error);
        return {
            redirect: {
                destination: `/error?code=${errorInfo.code}&message=${errorInfo.message}`, 
                permanent : false
        },
      };
    }
}  

export default Query