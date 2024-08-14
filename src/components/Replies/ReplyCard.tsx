import { replyInterface } from '@/interfaces/comments'
import { Roboto } from '@next/font/google';
import React from 'react'
import { BiDislike, BiLike } from 'react-icons/bi'
import parser from 'html-react-parser'
import formatTimeAgo from '@/utils/formatTimeAgo';
import Link from 'next/link';

interface replyCardProps {
    reply:replyInterface
  }

const robotoFont = Roboto({weight:["400","500","700"],subsets:["latin"]});

const ReplyCard:React.FC<replyCardProps> = ({reply}) => {

  return (
    <div className={`w-full flex flex-row gap-3 md:gap-5 ${robotoFont.className}`}>
      <Link href={`/channels/${reply.author.id}`} className="w-9 h-9 shrink-0 rounded-full">
        <img src={reply.author.picture} alt="" className="w-full h-full rounded-full" />
      </Link>
      <div className="grow flex flex-col gap-1">
        <div className="flex gap-1 justify-between items-center">
          <Link href={`/channels/${reply.author.id}`} className="text-[13px] font-medium break-all">{reply.author.name}</Link>
          <div className="text-xs text-neutral-600">{formatTimeAgo(reply.reply.publishedAt)}</div>
        </div>
        <div className="links text-sm break-all">
          {parser(reply.reply.text)}
        </div>
        <div className="flex flex-row items-center gap-5 text-neutral-500 my-3">
          <div className="flex flex-row items-center gap-2 cursor-pointer">
            <BiLike className='text-xl'/>
            <span className="text-xs">{reply.reply.likes}</span>
          </div>
          <BiDislike className='text-xl cursor-pointer'/>
        </div>
      </div>
    </div>
  )
}

export default ReplyCard