import { thumbnailInterface } from './video'
import { channelDetailsInterface } from './channel'
import { playlistInterface } from './playlist';

interface video extends thumbnailInterface {
    type:"video",
}

interface channel extends channelDetailsInterface {
    type:"channel"
}

interface playlist extends playlistInterface {
    type:"playlist"
}

type searchData = video|channel|playlist;

export interface searchResultInterface {
    data:searchData[],
    nextPageToken?:string,
}