import { playlistInterface } from '@/interfaces/playlist';
import Link from 'next/link';
import React from 'react'
import { RiPlayList2Fill } from 'react-icons/ri';
import { FaPlay } from 'react-icons/fa'

type PlaylistCard = {
  data:playlistInterface
}

const PlaylistCard:React.FC<PlaylistCard> = ({data}) => {
  return (
    <div className='flex flex-col lg:flex-row gap-3'>
        <Link href={`/playlist/${data.playlist.id}`} className="w-full lg:w-[350px] grow-0 shrink-0 relative group cursor-pointer">
            <img src={data.playlist.thumbnail} alt="" className="w-full lg:rounded-xl" />
            <div className="absolute w-1/3 right-0 top-0 bottom-0 rounded-r-xl bg-[rgba(0,0,0,0.8)] text-white flex flex-col items-center justify-center gap-1">
                <div className="text-lg">{data.playlist.videoCount}</div>
                <RiPlayList2Fill className='text-xl'/>
            </div>
            <div className="absolute top-0 right-0 left-0 bottom-0 bg-[rgba(0,0,0,0.8)] rounded-xl hidden group-hover:flex flex-row items-center justify-center gap-3 text-white">
                <FaPlay className='text-sm'/>
                <div className="uppercase text-xs font-medium">Play All</div>
            </div>
        </Link>
        <div className="flex flex-col gap-2">
            <Link href={`/channels/${data.channel.id}`} className={`text-lg`}>
                {data.playlist.name}
            </Link>
            <Link href={`/channels/${data.channel.id}`} className="text-gray-500 text-xs">
                {data.channel.name}
            </Link>
            {data.playlist.description&&<div className="text-gray-500 text-xs line-clamp-2">
                {data.playlist.description}
            </div>}
            <Link href={`/playlist/${data.playlist.id}`} className="text-gray-600 text-xs font-medium mt-1">
                VIEW FULL PLAYLIST
            </Link>
        </div>
    </div>
  )
}

export default PlaylistCard