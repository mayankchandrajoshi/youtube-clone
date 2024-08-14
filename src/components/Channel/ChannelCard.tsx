import { channelDetailsInterface } from '@/interfaces/channel'
import Link from 'next/link';
import React from 'react'
import { BsDot } from 'react-icons/bs'
import numberFormatter from '../../utils/numberFormat'

type searchVideoCard = {
  data:channelDetailsInterface
}

const ChannelCard:React.FC<searchVideoCard> = ({data}) => {
  return (
    <div className='flex flex-col lg:flex-row gap-3 md:my-auto lg:my-0'>
        <Link href={`/channels/${data.channelId}`} className="lg:w-[350px] flex justify-center items-center grow-0 shrink-0">
          <div className="w-[130px] h-[130px] grow-0">
            <img src={data.avatar} alt="" className="w-full h-full rounded-full object-cover object-center" />
          </div>
        </Link>
        <div className="flex flex-col lg:flex-row gap-5 grow justify-between lg:justify-between lg:gap-5">
          <Link href={`/channels/${data.channelId}`} className="flex flex-col items-center lg:items-start gap-2 lg:gap-2">
              <div className={`text-lg line-clamp-2`}>{data.name}</div>
              <div className="block text-xs text-neutral-500 font-medium">
                <span  className="capitalize break-all">{data.customUrl}</span>
                <span className=""><BsDot className='inline'/></span>
                <span className="lg:inline break-all">{numberFormatter(data.subscribers)} subscribers</span>
              </div>
              <div className="line-clamp-2 break-all min-h-[32px] text-gray-500 text-xs lg:line-clamp-2">{data.description}</div>
          </Link>
          <div className="w-auto lg:w-auto p-2 px-4 text-sm font-medium bg-black text-white rounded-full cursor-pointer md:mt-auto lg:my-auto  text-center">Subscribe</div>
        </div>
    </div>
  )
}

export default ChannelCard