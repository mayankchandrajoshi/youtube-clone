import { MyContext } from '@/components/NavBar/Navbar';
import { MdReportGmailerrorred } from "react-icons/md";
import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react'

const Error = () => {

  const { isNavActive } = useContext(MyContext);
  const router  = useRouter();

  const { code,message } = router.query as { code: string ,message : string };

  return (
    <div className={`w-screen h-screen flex flex-col items-center justify-center gap-5 mx-3 md:mx-6 ${isNavActive?"ml-2 md:ml-1":"ml-3 md:ml-6"}`}>
        <div className="w-full">
            <MdReportGmailerrorred className='mx-auto text-[200px] text-red-800'/>
        </div>
        <p className="max-w-sm text-center font-bold text-4sxl md:text-5xl">
          {code?code:500}
        </p>
        <p className="max-w-sm text-center text-lg md:text-xl">
          {message?message:"Unknown Error"}
        </p>
    </div>
  )
}

export default Error