import { thumbnailInterface } from '@/interfaces/video'
import formatTimeAgo from '@/utils/formatTimeAgo';
import { Roboto } from '@next/font/google';
import Link from 'next/link';
import React from 'react'
import { BsDot } from 'react-icons/bs'
import numberFormatter from '../../utils/numberFormat'

const robotoFont = Roboto({weight:"500",subsets:["latin"]});

type videoCard = {
  data:thumbnailInterface
}

const VideoCard:React.FC<videoCard> = ({data}) => {
  return (
    <div className='flex flex-col xl:flex-row gap-2'>
      <div className="w-full aspect-video xl:aspect-auto xl:w-[165px] xl:h-[94px] grow-0 shrink-0">
        <img src={data.video.thumbnail} alt="" className="w-full h-full object-cover object-center rounded-md" />
      </div>
      <div className="flex flex-col gap-[2px]">
        <div className={`text-sm font-medium line-clamp-2 leading-relaxed ${robotoFont.className}` }>
          {data.video.title}
        </div>
        <Link href={`/channel/${data.channel.id}`} className="text-gray-500 text-xs font-medium block leading-relaxed">
          {data.channel.name}
        </Link>
        <div className="text-xs text-gray-500">
          <span className="">{numberFormatter(Number(data.video.viewCount))} views</span>
          <BsDot className='inline'/>
          <span className="">{formatTimeAgo(data.video.publishedAt)}</span>
        </div>
      </div>
    </div>
  )
} 

export default VideoCard