import { searchResultInterface } from "@/interfaces/search";
import axios from "axios";
import { useInfiniteQuery, UseInfiniteQueryResult } from "react-query";

export async function fetchSearch( query:string,order:'date'|'relevance'|"viewCount"|"rating"|null,type:"video"|"channel"|"playlist"|null,duration:"short"|"medium"|"long"|null,uploadTime:"hour"|"day"|"week"|"month"|"year"|null,pageToken?: string ): Promise<searchResultInterface> {
    try {
      const { data } = await axios.get(`/api/youtube/search?query=${query}${type?"&type="+type:""}${order?"&order="+order:""}${duration?"&duration="+duration:""}${uploadTime?"&uploadTime="+uploadTime:""}${pageToken?"&pageToken="+pageToken:""}`);
      
      return {
        data: data.data,
        nextPageToken: data.nextPageToken
      };
    } catch (error) {
      throw new Error(`Error searching : ${error}`);
    }
  };
  
export const useInfiniteSearch = ( query:string,order:'date'|'relevance'|"viewCount"|"rating"|null,type:null|"video"|"channel"|"playlist",duration:null|"short"|"medium"|"long",uploadTime:null|"hour"|"day"|"week"|"month"|"year", initialData: searchResultInterface): UseInfiniteQueryResult<searchResultInterface, Error> => {
  return useInfiniteQuery(['search',query,order,type,duration,uploadTime], ({ pageParam } : { pageParam ?: string}) => fetchSearch(query,order,type,duration,uploadTime,pageParam), {
    getNextPageParam: (lastPage) => {
      const pageToken = lastPage.nextPageToken;
      return pageToken ?? false;
    },
    initialData: { pages: [initialData], pageParams: [initialData.nextPageToken] } ,
  });
};
