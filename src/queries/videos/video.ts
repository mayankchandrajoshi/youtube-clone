import axios from 'axios'
import { thumbnailInterface, videoInterface } from '@/interfaces/video'
import { useInfiniteQuery, UseInfiniteQueryResult } from "react-query";

const API_ENDPOINT = '/api/youtube/videos'

export async function fetchHomeVideos(pageToken?: string): Promise<videoInterface> {
  try {
    const { data } = await axios.get(`${API_ENDPOINT}/home${pageToken?"?pageToken="+pageToken:""}`);
    
    return {
      nextPageToken: data.videos.nextPageToken,
      videos: data.videos.videos
    };
  } catch (error) {
    throw new Error(`Error fetching videos: ${error}`);
  }
};

export const useInfiniteHomeVideos = (): UseInfiniteQueryResult<videoInterface, Error> => {
  return useInfiniteQuery(['home-videos'], ({ pageParam } : { pageParam ?: string }) => fetchHomeVideos(pageParam), {
    getNextPageParam: (lastPage) => {
      const pageToken = lastPage.nextPageToken;
      return pageToken ?? false;
    },
  });
};

export async function fetchRelatedVideos( id:string,maxResults:number ): Promise<{ videos : thumbnailInterface[] ,maxResults:number|null}> {
  try {
    const { data } = await axios.get(`${API_ENDPOINT}/related?id=${id}&maxResults=${maxResults}`);
    
    return {
      videos: data.videos,
      maxResults:data.maxResults
    };
  } catch (error) {
    throw new Error(`Error fetching videos: ${error}`);
  }
};


export const useInfiniteRelatedVideos = (id:string, maxResults: number): UseInfiniteQueryResult<{ videos : thumbnailInterface[],maxResults:number}, Error> => {
  return useInfiniteQuery( ['related-videos',id,maxResults], ({ pageParam=10 } : { pageParam?:number}) => fetchRelatedVideos(id,pageParam ), {
    getNextPageParam: (lastMaxResult) => {
      if(lastMaxResult.maxResults){
        const maxResults = lastMaxResult.maxResults+10;
        return maxResults;
      }
      return false;
    },
    enabled: !!id ,
  });
};

export async function fetchChannelVideos( id:string,order:"date"|"viewCount",pageToken?: string ): Promise<videoInterface> {
  try {
    const { data } = await axios.get(`${API_ENDPOINT}/channel/${id}?order=${order}${pageToken?'&pageToken='+pageToken:""}`);
    
    return {
      nextPageToken: data.nextPageToken,
      videos: data.videos
    };
  } catch (error) {
    throw new Error(`Error fetching videos: ${error}`);
  }
};

export const useInfiniteChannelVideos = ( id:string , order:"date"|"viewCount"): UseInfiniteQueryResult<videoInterface, Error> => {
  return useInfiniteQuery(['channel-videos',id,order], ({ pageParam } : { pageParam ?: string}) => fetchChannelVideos(id,order,pageParam), {
    getNextPageParam: (lastPage) => {
      const pageToken = lastPage.nextPageToken;
      return pageToken ?? false;
    },
  });
};