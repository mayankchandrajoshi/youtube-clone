import { Skeleton } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'

const RelatedVideoCardSkeleton = () => {
  return (
    <Box className="flex flex-col xl:flex-row gap-2 w-full">
        <Box className="relative pt-[56.25%] h-0 xl:pt-0 w-full xl:w-[165px] xl:h-[94px] grow-0 shrink-0">
          <Skeleton variant="rectangular" className='absolute top-0 left-0 w-full !h-full' />
        </Box>
        <Box className="flex flex-col gap-2 w-full">
            <Skeleton variant="rectangular" className='w-full !h-5 xl:!h-12'/>
            <Skeleton variant="rectangular" className='w-3/4' height={10}/>
            <Box className="flex flex-row gap-1 w-full">
              <Skeleton variant="rectangular" className='w-[45%]' height={10}/>
              <Skeleton variant="rectangular" className='w-[45%]' height={10}/>
            </Box>
        </Box>
    </Box>
  )
}

export default RelatedVideoCardSkeleton