import { commentInterface } from '@/interfaces/comments'
import React, { memo, useState } from 'react'
import parser from 'html-react-parser'
import { BiDislike, BiLike } from 'react-icons/bi'
import { GoTriangleDown, GoTriangleUp } from 'react-icons/go'
import { Roboto } from '@next/font/google'
import formatTimeAgo from '@/utils/formatTimeAgo'
import { useInfiniteReplies } from '@/queries/comments/comments'
import ReplyCard from '../Replies/ReplyCard'
import InfiniteScroll from 'react-infinite-scroll-component'
import Loader1 from '../Loader/Loader1'
import Loader2 from '../Loader/Loader2'
import Link from 'next/link'

interface commentCardProps {
  comment:commentInterface
}

const robotoFont = Roboto({weight:["400","500","700"],subsets:["latin"]});

const CommentCard:React.FC<commentCardProps> = ({ comment }) => {

  const [ showReplies,setShowReplies ] = useState(false);

  const { data,status,fetchNextPage,hasNextPage } = useInfiniteReplies(comment.comment.id,showReplies);

  return (
    <div className={`w-full flex flex-row gap-3 md:gap-5 ${robotoFont.className}`}>
      <Link href={`/channels/${comment.author.id}`} className="w-11 h-11 shrink-0 rounded-full">
        <img src={comment.author.picture} alt="" className="w-full h-full rounded-full" />
      </Link>
      <div className="grow flex flex-col gap-1">
        <div className="flex gap-1 justify-between items-center">
          <Link href={`/channels/${comment.author.id}`} className="text-[13px] font-medium break-all">{comment.author.name}</Link>
          <div className="text-xs text-neutral-600">{formatTimeAgo(comment.comment.publishedAt)}</div>
        </div> 
        <div className="links text-sm break-all">
          {parser(comment.comment.text)}
        </div>
        <div className="flex flex-row items-center gap-5 text-neutral-500 my-1">
          <div className="flex flex-row items-center gap-2 cursor-pointer">
            <BiLike className='text-xl'/>
            <span className="text-xs">{comment.comment.likes}</span>
          </div>
          <BiDislike className='text-xl cursor-pointer'/>
        </div>
        {comment.comment.totalReplies>0?<>
          <div className="w-fit text-blue-600 hover:bg-blue-100 p-2 px-3 rounded-full cursor-pointer" onClick={()=>setShowReplies(prev=>!prev)}>
            <div className="flex flex-row items-center gap-2">
              {
                showReplies?<GoTriangleUp/>:<GoTriangleDown/>
              }
              <span className="text-sm font-bold">{comment.comment.totalReplies} replies</span>
            </div>
          </div>
          <div className={`${showReplies?"block":"hidden"}`}>
            {
              status=="loading"&&(
                <div className={`w-full flex items-center justify-center h-[60vh] py-4`}><Loader2/></div>
              )
            }
            {(status === "success" && showReplies) && (
              <InfiniteScroll
                  dataLength={data?.pages.length* 5}
                  next={fetchNextPage}
                  hasMore={hasNextPage?hasNextPage:false}
                  loader={<div className={`pl-5 pr-16 flex items-center justify-center h-16 py-4`}><Loader1/></div>}
                  scrollThreshold={0}
                >
                  <div className="flex flex-col gap-1 mt-2">
                    {data?.pages.map((page,index)=>(
                      <React.Fragment key={index}>
                        {page.replies.map((reply,index)=><ReplyCard reply={reply} key={index}/>)}
                      </React.Fragment>
                    ))}
                  </div>
              </InfiniteScroll>
            )}
          </div>
        </>:<></>}
      </div>
    </div>
  )
}

export default memo(CommentCard)