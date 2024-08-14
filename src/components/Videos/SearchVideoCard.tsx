import { thumbnailInterface } from '@/interfaces/video'
import formatTimeAgo from '@/utils/formatTimeAgo';
import Link from 'next/link';
import React from 'react'
import { BsDot } from 'react-icons/bs'
import numberFormatter from '../../utils/numberFormat'

type searchVideoCard = {
  data:thumbnailInterface
}

const SearchVideoCard:React.FC<searchVideoCard> = ({data}) => {
  return (
    <div className='flex flex-col lg:flex-row gap-3'>
      <Link href={`/videos/video/${data.video.id}`} className="w-full lg:w-[350px] grow-0 shrink-0">
        <img src={data.video.thumbnail} alt="" className="w-full lg:rounded-xl" />
      </Link>
      <div className="">
        <Link href={`/videos/video/${data.video.id}`} className={`text-lg line-clamp-2`}>
          {data.video.title}
        </Link>
        <div className="block text-xs text-neutral-500 font-medium mt-1">
          <span className="break-all">{numberFormatter(Number(data.video.viewCount))} views</span>
          <span className=""><BsDot className='inline'/></span>
          <span className="break-all">{formatTimeAgo(data.video.publishedAt)}</span>
        </div>
        <Link href={`/channels/${data.channel.id}`} className="text-gray-500 text-xs font-medium">
          {data.channel.name}
        </Link>
        <div className="text-gray-500 text-xs line-clamp-2 mt-2">
          {data.video.description}
        </div>
      </div>
    </div>
  )
}

export default SearchVideoCard