import React from 'react'
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';

const VideoThumbnailCard1Skeleton:React.FC<{
  avatar?:boolean
}> = ({avatar}) => {

  return (
    <Box className="flex flex-col gap-2 w-full">
        <Box className="relative w-full pt-[56.25%]">
          <Skeleton variant="rectangular" className='absolute top-0 left-0 w-full !h-full' />
        </Box>
        <Box className="flex flex-row gap-2">
          {avatar&&<Skeleton width={40} height={40}  variant="circular"/>}
          <Box className="grow flex flex-col gap-2">
              <Skeleton variant="rectangular" className='w-full' height={20}/>
              <Skeleton variant="rectangular" className='w-3/4' height={16}/>
          </Box>
        </Box>
    </Box>
  )
}

export default VideoThumbnailCard1Skeleton