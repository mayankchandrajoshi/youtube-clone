import React from 'react'
import Navbar from '../NavBar/Navbar'
import Head from 'next/head'
import { Roboto } from '@next/font/google'

type LayoutProps = {
  children?:React.ReactElement
}
const robotoFont = Roboto({weight:["400","500"],subsets:["latin"]});

const Layout:React.FC<LayoutProps> = ({children}) => {
  return (
    <div className={`${robotoFont.className}`}>
      <Head>
        <link rel="shortcut icon" href="/images/youtube_logo.png" />
      </Head>
      <Navbar children={children}/>
    </div>
  )
}

export default Layout