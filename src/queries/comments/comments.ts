import axios from 'axios'
import { useInfiniteQuery, UseInfiniteQueryResult } from "react-query";
import { commentsInterface, repliesInterface } from '@/interfaces/comments';

const API_ENDPOINT = '/api/youtube/videos/video/comments'

export async function fetchComments(id:string,order:'time'|'relevance',pageToken?: string): Promise<commentsInterface> {
  try {
    const { data } = await axios.get(`${API_ENDPOINT}/${id}?order=${order}${pageToken?'&pageToken='+pageToken:""}`);

    return {
      comments: data.comments,
      nextPageToken: data.nextPageToken,
      isDisabled:data.isDisabled
    };
  } catch (error) {
    throw new Error(`Error fetching comments: ${error}`);
  }
};

export const useInfiniteComments = (id:string,order:'time'|'relevance'): UseInfiniteQueryResult<commentsInterface, Error> => {
  return useInfiniteQuery([ 'comments',id,order ], ({ pageParam }:{ pageParam?:string }) => fetchComments(id,order,pageParam), {
    getNextPageParam: (lastPage) => {
      const pageToken = lastPage.nextPageToken;
      return pageToken ?? false;
    },
  });
};


export async function fetchReplies(id:string,pageToken?: string): Promise<repliesInterface> {
    try {
      const { data } = await axios.get(`${API_ENDPOINT}/replies/${id}${pageToken?'?pageToken='+pageToken:""}`);
      
      return {
        replies: data.replies,
        nextPageToken: data.nextPageToken,
      };
    } catch (error) {
      throw new Error(`Error fetching replies: ${error}`);
    }
  };
  
  export const useInfiniteReplies = ( id:string,isFetchReplies:boolean ): UseInfiniteQueryResult<repliesInterface, Error> => {
    return useInfiniteQuery([ 'replies',id ], ({ pageParam } : { pageParam?:string }) => fetchReplies(id,pageParam), {
      getNextPageParam: (lastPage) => {
        const pageToken = lastPage.nextPageToken;
        return pageToken ?? false;
      },
      enabled:isFetchReplies
    });
};