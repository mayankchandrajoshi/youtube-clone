import { thumbnailInterface } from '@/interfaces/video'
import formatTimeAgo from '@/utils/formatTimeAgo';
import { Roboto_Condensed } from '@next/font/google';
import Link from 'next/link';
import React from 'react'
import { BsDot } from 'react-icons/bs'
import numberFormatter from '../../utils/numberFormat'

const robotoFont = Roboto_Condensed({weight:"400",subsets:["latin"]});

type videoCard = {
  data:thumbnailInterface
}

const VideoCard:React.FC<videoCard> = ({data}) => {
  return (
    <div className='flex flex-col lg:flex-row gap-1 lg:gap-4'>
      <Link href={`/videos/video/${data.video.id}`} className="grow-0 shrink-0">
        <img src={data.video.thumbnail} alt="" className="aspect-video w-full lg:w-[260px] lg:rounded-md" />
      </Link>
      <div className="w-full">
        <Link href={`/videos/video/${data.video.id}`} className={`text-xl line-clamp-1 lg:line-clamp-2 ${robotoFont.className}` }>
          {data.video.title}
        </Link>
        <div className="mt-1 leading-none">
          <Link href={`/channels/${data.channel.id}`} className="text-gray-500 text-xs font-medium">
            {data.channel.name}
          </Link>
          <BsDot className="text-xs text-neutral-600 inline"/>
          <Link href={`/videos/video/${data.video.id}`}  className="text-xs text-gray-500">
            <span className="">{numberFormatter(Number(data.video.viewCount))} {data.video.duration==="LIVE"?"watching":"views"}</span>
            <BsDot className={`${data.video.duration==="LIVE"?"hidden":"inline"}`}/>
            <span className={`${data.video.duration==="LIVE"?"hidden":""}`}>{formatTimeAgo(data.video.publishedAt)}</span>
          </Link>
        </div>
        <Link href={`/videos/video/${data.video.id}`} className="break-all line-clamp-3 text-xs text-neutral-600 mt-[6px] lg:mt-2">
          {data.video.description}
        </Link>
      </div>
    </div>
  )
}

export default VideoCard