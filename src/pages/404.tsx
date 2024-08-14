import { MyContext } from '@/components/NavBar/Navbar';
import Image from 'next/image'
import React, { useContext } from 'react'

const NotFound = () => {

  const { isNavActive } = useContext(MyContext);

  return (
    <div className={`w-screen h-screen flex flex-col items-center justify-center gap-5 mx-3 md:mx-6 ${isNavActive?"ml-2 md:ml-1":"ml-3 md:ml-6"}`}>
        <div className="w-full">
            <Image src="/images/NotFound.png" alt="Not found"  width={300} height={300} className="mx-auto w-1/2 aspect-square md:w-52 md:h-52"/>
        </div>
        <p className="max-w-sm text-center text-base md:text-lg">
          This page isn&apos;t available. Sorry about that.Try searching for something else.
        </p>
    </div>
  )
}

export default NotFound