import React from 'react'
import { thumbnailInterface } from '@/interfaces/video'
import Link from 'next/link'
import { Roboto, Roboto_Condensed } from '@next/font/google'
import numberFormatter from '../../utils/numberFormat'
import formatTimeAgo from '@/utils/formatTimeAgo'
import { BsDot } from 'react-icons/bs'
import { CiStreamOn } from "react-icons/ci";

interface videoCard {
  data:thumbnailInterface
}

const robotoCondensedFont = Roboto_Condensed({weight:"700",subsets:["latin"]});
const robotoFont = Roboto({weight:["400","500","700"],subsets:["cyrillic-ext"]});

const VideoCard:React.FC<videoCard> = ({data}) => {
  return (
    <div className="">
      <Link href={`/videos/video/${data.video.id}`} className="relative">
        <img src={data.video.thumbnail} alt={data.video.title} className="w-full aspect-video rounded-lg md:rounded-xl "/>
        {
          data.video.duration == "LIVE"?<div className={`${robotoCondensedFont.className} flex flex-row items-center gap-1 absolute bottom-2 right-2 px-1 py-0 rounded-[4px] bg-red-600 text-white text-[13px] `}>
            <CiStreamOn size="1.3em"/><span>{data.video.duration}</span>
          </div>:<span className={`${robotoCondensedFont.className} absolute bottom-2 right-2 px-1 py-0 rounded-[4px] font-medium bg-black text-white text-[13px]`}>{data.video.duration}</span>
        }
      </Link>
      <div className="mt-2 flex flex-row gap-3">
        {
          data.channel.thumbnail&&<Link href={`/channels/${data.channel.id}`} className="w-9 h-9 shrink-0 grow-0">
          <img src={data.channel.thumbnail} alt="" className="w-full h-full rounded-full mt-1" />
        </Link>
        }
        <div className={`${robotoFont.className}`}>
          <Link href={`/videos/video/${data.video.id}`} className="text-black font-bold leading-5 line-clamp-2 text-sm">{data.video.title}</Link>
          <Link href={`/channels/${data.channel.id}`} className="mt-5 text-neutral-500 text-[11px] md:text-xs font-medium">
            {data.channel.name}
          </Link>
          <Link href={`/videos/video/${data.video.id}`} className="block text-[11px] md:text-xs text-neutral-500 font-medium">
            {
              data.video.duration === "LIVE"?<>
                <span className="">{numberFormatter(Number(data.video.viewCount))} watching</span>
                <div className="flex flex-row justify-start mt-1">
                  <div className={`${robotoCondensedFont.className} flex flex-row items-center gap-1 px-1 py-0 rounded-[4px] bg-red-600 text-white text-[13px] `}><CiStreamOn size="1.3em"/><span>{data.video.duration}</span></div>
                </div>
              </>:<>
                <span className="">{numberFormatter(Number(data.video.viewCount))} views</span>
                <span className=""><BsDot className='inline'/></span>
                <span className="">{formatTimeAgo(data.video.publishedAt)}</span>
              </>
            }
          </Link>
        </div>
      </div>
    </div>
  )
}

export default VideoCard