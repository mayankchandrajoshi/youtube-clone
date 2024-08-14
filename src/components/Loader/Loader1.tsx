import React from 'react'

const Loader = () => {
  return (
    <div className='grow shrink flex justify-center items-center aspect-square h-full'>
      <img src="/Images/Loader1.gif" alt="" className='h-full aspect-square animate-[rotate180_1s_linear_infinite]'/>
    </div>
  )
}

export default Loader