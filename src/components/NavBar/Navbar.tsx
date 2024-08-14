import React, { ChangeEvent, createContext, FormEvent, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { RxHamburgerMenu,RxCross1 } from 'react-icons/rx'
import { RiVideoAddLine } from 'react-icons/ri'
import { BsBell } from 'react-icons/bs'
import { HiMicrophone } from 'react-icons/hi2'
import { IoIosSearch, IoMdArrowBack } from 'react-icons/io'
import { Roboto_Condensed } from '@next/font/google'
import Link from 'next/link'
import { SiHotjar } from 'react-icons/si'
import { AiFillHome } from 'react-icons/ai'
import { RiSlideshow3Line } from 'react-icons/ri'
import { useRouter } from 'next/router'
import axios from 'axios'
import parser from 'html-react-parser'
import { FiArrowUpLeft } from 'react-icons/fi'
import OutsideClick from '@/utils/OutSideClick'

type childrenProps = {
  children?:React.ReactNode
}

export const MyContext = createContext({isNavActive:false});

const robotoFont = Roboto_Condensed({weight:"700",subsets:["latin"]});

const Navbar:React.FC<childrenProps> = ({children}) => {

  const router = useRouter();

  const { query } = router.query;
  
  const searchDivRef = useRef<HTMLDivElement>(null);
  const searchOpenDivRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionListRef = useRef<HTMLUListElement>(null);

  const [ isFocused , setIsFocused ] = useState(false);
  const [ isNavActive, setIsNavActive ] = useState(false);
  const [ searchSuggestions,setSearchSuggestions ] = useState<string[]>([]);
  const [ searchQuery,setSearchQuery ] = useState('');
  const [ isDrawerOpen, setIsDrawerOpen ] = useState(false);
  const [ activeOptionIndex, setActiveOptionIndex] = useState(-1);
  const [ showSearchBar, setshowSearchBar] = useState(false);
  const [ tempSearchQuery,setTempSearchQuery ] = useState("");
  const [ isQueryChanged ,setIsQueryChanged ] = useState(false);
  const [ isLargeScreen,setIsLargeScreen ] = useState(true);


  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth > 904); 
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  OutsideClick(searchDivRef,searchOpenDivRef,()=>{
    setIsFocused(false);
    setIsDrawerOpen(false);
    setshowSearchBar(false);
  });
  
  const formatRegularExpression = (s:string) =>{
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  useEffect(()=>{
    if(query&& typeof query == 'string'){
      setSearchQuery(query);
      setTempSearchQuery(query);
      setIsQueryChanged(true);
    }
  },[query])

  useEffect(() => {
    const handleKeyUp = (event:KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDrawerOpen(false);
      }
    };

    const handleKeyDown = (event:KeyboardEvent) => {

      if(!isFocused) return;

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        if(activeOptionIndex!==-1){
          if(activeOptionIndex!==searchSuggestions.length-1){
            setActiveOptionIndex((prevIndex) => (prevIndex + 1));
            setSearchQuery(searchSuggestions[activeOptionIndex+1]);
          }
          else {
            setActiveOptionIndex(-1);
            setSearchQuery(tempSearchQuery);
            setIsQueryChanged(false);
          }
        }
        else {
          if(searchSuggestions.length>0) {
            setActiveOptionIndex(0);
            setSearchQuery(searchSuggestions[0]);
          }
        }
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        if(activeOptionIndex!==-1){
          if(activeOptionIndex!==0){
            setActiveOptionIndex((prevIndex) => prevIndex -1 );
            setSearchQuery(searchSuggestions[activeOptionIndex-1]);
          }
          else{ 
            setActiveOptionIndex(-1); 
            setSearchQuery(tempSearchQuery);
            setIsQueryChanged(false);
          }
        }
        else {
          if(searchSuggestions.length>0) {
            setActiveOptionIndex(searchSuggestions.length - 1);
            setSearchQuery(searchSuggestions[searchSuggestions.length - 1]);
          }
        }
      } else if (event.key === 'Enter') {
        if(activeOptionIndex>=0) {
          setSearchQuery(searchSuggestions[activeOptionIndex]);
          setTempSearchQuery(searchSuggestions[activeOptionIndex]);
          setActiveOptionIndex(-1);
          setIsQueryChanged(true);
        };
        setIsDrawerOpen(false);
      }
    };

    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('keydown',handleKeyDown);

    return () => {
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('keydown',handleKeyDown);
    };
  }, [activeOptionIndex,searchSuggestions,isFocused]);

  useEffect(() => {
    if(activeOptionIndex!==-1||!isQueryChanged) return;
    
    if(!searchQuery) {
      setSearchSuggestions([]);return;
    };

    const timerId = setTimeout(async() => {
      const { data }  = await axios.get(`/api/youtube/searchSuggestions?query=${searchQuery}`);
      setSearchSuggestions(data.items);
    }, 200);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchQuery,activeOptionIndex,isQueryChanged]);


  useEffect(()=>{

    if(suggestionListRef.current){
      suggestionListRef.current.addEventListener("click",(e:MouseEvent)=>{
        if(!(e.target instanceof Element)||!searchInputRef.current) return;
        

        if( e.target instanceof HTMLDivElement&&e.target.id=="arrowUp"){
          const suggestion = e.target.dataset.suggestion;
          if(suggestion){
            setSearchQuery(suggestion);
            setActiveOptionIndex(-1);
          }
          return;
        }

        let closesDivParent = e.target.closest('#arrowUp');
        
        if (closesDivParent&&(closesDivParent instanceof HTMLDivElement)){
          const suggestion = closesDivParent.getAttribute("data-suggestion");
          if(suggestion){
            setSearchQuery(suggestion);
            setActiveOptionIndex(-1);
          }
          return;
        }

        if(e.target instanceof HTMLLIElement ){
          const suggestion = e.target.dataset.suggestion;
          if(suggestion){
            setSearchQuery(suggestion);
            setIsFocused(false);
            setIsDrawerOpen(false);
            searchInputRef.current.blur();
            setActiveOptionIndex(-1);
            setshowSearchBar(false);
            router.push(`/search/${suggestion}`);
            return;
          }
        }

        closesDivParent = e.target.closest('li');
        
        if (closesDivParent&&(closesDivParent instanceof HTMLLIElement)){
          const suggestion = closesDivParent.getAttribute("data-suggestion");
          if(suggestion){
            setSearchQuery(suggestion);
            setIsFocused(false);
            setIsDrawerOpen(false);
            searchInputRef.current.blur();
            setActiveOptionIndex(-1);
            setshowSearchBar(false);
            router.push(`/search/${suggestion}`);
          }
          return;
        }
      })
    }
  },[suggestionListRef.current,isLargeScreen,isFocused])

  const handleButtonClick = (href:string) => {
    if (router.asPath !== href) {
      router.push(href);
    }
  };

  const isActive = (href:string):boolean => {
    return router.pathname === href ? true : false;
  };

  const handleSearch = (e:FormEvent<HTMLFormElement>) =>{
    e.preventDefault();
    if(!searchQuery) return;
    
    setIsFocused(false);
    setIsDrawerOpen(false);
    searchInputRef.current?.blur();
    setActiveOptionIndex(-1);
    setshowSearchBar(false);
    router.push(`/search/${searchQuery}`);
  }
  
  const handleSearchQueryChange = (e:ChangeEvent<HTMLInputElement>) =>{

    if(!isDrawerOpen) setIsDrawerOpen(true);
    if(!isFocused) setIsFocused(true);
    
    setSearchQuery(e.target.value);
    setTempSearchQuery(e.target.value);
    
    if(activeOptionIndex!=-1) setActiveOptionIndex(-1);
    if(!isQueryChanged) setIsQueryChanged(true);
  }

  // lg:px-7 
  return (
    <>
      <div className="flex flex-row items-center justify-between px-3 py-3 md:px-5 lg:py-2 fixed top-0 left-0 right-0 bg-white z-40">
        <div className="flex flex-row gap-4 md:gap-7 items-center">
          <div className="cursor-pointer" onClick={()=>setIsNavActive(prev=>!prev)}>
            <RxHamburgerMenu className='text-2xl'/>
          </div>
          <Link href='/' className="flex flex-row items-center gap-1">
            <Image src='/images/youtube_logo.png' width={40} height={40} alt="youtube_logo" className='h-5 w-7 shrink-0'/>
            <span className={`${robotoFont.className} font-sans text-xl hidden lg:block`}>YouTube</span>
          </Link>
        </div>
        {isLargeScreen&&<div className={`flex-row items-center gap-5  ${isFocused?"ml-0":"ml-10"} hidden lg:flex`} ref={searchDivRef}>
          <form className="flex flex-row items-center border border-solid border-gray-300 rounded-full" onSubmit={handleSearch}>
            <div className={`relative flex flex-row rounded-l-full items-center border ${isFocused?"border-slate-500":"border-gray-300"}`}>
              <div className={`px-4 py-2 ${isFocused?"block pr-0":"hidden"}`}>
                <IoIosSearch className='text-2xl text-gray-400'/>
              </div>
              <input type="text" className={`outline-none p-[7px] w-[35vw] rounded-full px-5 text-[17px]`} value={searchQuery} onFocus={()=>{setIsFocused(true);setIsDrawerOpen(true)}} onChange={handleSearchQueryChange} ref={searchInputRef}/>
              <button className="" type="button"  onClick={()=>setSearchQuery("")}>
                <RxCross1 className='text-2xl pr-2'/>
              </button>                
              {(isDrawerOpen&&searchSuggestions.length>=1&&isFocused)&&<ul className="absolute top-full w-full mt-3 py-3 pb-7 bg-white rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.2)] cursor-text" ref={suggestionListRef}>
                {
                  searchSuggestions.map((suggestion,index)=>(
                    <li className={`flex flex-row items-center gap-3 p-[5px] px-4 hover:bg-neutral-100 cursor-default ${index===activeOptionIndex?"bg-neutral-100":"bg-white"}`} key={index} data-suggestion={suggestion}>
                      <IoIosSearch className='text-xl shrink-0 text-neutral-500'/>
                      <div className="line-clamp-1 lowercase">
                        {parser(suggestion.replace(new RegExp(`^(${formatRegularExpression(searchQuery)})`, 'i'), (match) => `<span className="font-medium">${match}</span>`))}
                      </div>
                    </li>
                  ))
                }
              </ul>}
            </div>
            <button type='submit' className="px-5 pl-5 py-2 border border-gray-300 rounded-r-full bg-gray-100">
              <IoIosSearch className='text-2xl'/>
            </button>
          </form>
          <div className="">
            <HiMicrophone className='text-xl'/>
          </div>
        </div>}
        <div className="flex flex-row gap-7 items-center">
          <div className="hidden lg:block">
            <RiVideoAddLine className='text-2xl text-gray-500'/>
          </div>
          <div className="hidden lg:block">
            <BsBell className='text-xl'/>
          </div>
          <div className="lg:hidden" ref={searchOpenDivRef} onClick={()=>{
            setshowSearchBar(true);
            setIsNavActive(false);
            setTimeout(()=>{
              searchInputRef.current?.focus();
            },0);
          }}>
            <IoIosSearch className='text-2xl'/>
          </div>
          <div className="">
            <Image src='/images/profile_pic.jpg' width={40} height={40} alt="profile_picture" className='w-8 h-8 rounded-full shrink-0'/>
          </div>
        </div>
        {!isLargeScreen&&<div className={`absolute top-0 left-0 w-full bg-white ${showSearchBar?"flex shadow-[0_0_0_100000px_rgba(0,0,0,.25)]":"hidden"} flex-col gap-2 lg:hidden`} ref={searchDivRef}>
          <div className="w-full flex flex-row items-center gap-3 p-[10px] px-3">
            <div className="" onClick={()=>setshowSearchBar(false)}>
              <IoMdArrowBack className='text-2xl'/>
            </div>
            <form className="grow flex flex-row items-center rounded-full bg-gray-100" onSubmit={handleSearch}>
              <input type="text" className={`outline-none w-full p-[5px] rounded-full pl-5 pr-2 text-base bg-gray-100 placeholder:text-neutral-600`} placeholder="Search Youtube" value={searchQuery} onFocus={()=>{setIsFocused(true);setIsDrawerOpen(true)}} onChange={handleSearchQueryChange} ref={searchInputRef}/>
              <button type='submit' className={`px-3 py-1`}>
                <IoIosSearch className='text-2xl'/>
              </button>
            </form>
            <div className="rounded-full bg-gray-100 p-[6px]">
              <HiMicrophone className='text-xl rounded-full'/>
            </div>
          </div>
          {(isDrawerOpen&&searchSuggestions.length>=1&&isFocused)&&<ul className="w-full flex flex-col bg-white cursor-text" ref={suggestionListRef}>
            {
              searchSuggestions.map((suggestion,index)=>(
                <li className={`flex flex-row items-center justify-between pl-2 border-b border-b-solid border-b-neutral-200 hover:bg-neutral-100 ${index===activeOptionIndex?"bg-neutral-100":"bg-white"} overflow-hidden`} key={index} data-suggestion={suggestion}>
                  <div className="line-clamp-1 max-h-[24px] p-0 lowercase text-sm overflow-hidden font-medium flex flex-row">
                    {parser(suggestion.replace(new RegExp(`^(${formatRegularExpression(searchQuery)})`, 'i'), (match) => `<span className="font-normal">${match}</span>`))}
                  </div>
                  <div id='arrowUp' className='shrink-0 p-[6px] bg-gray-100' data-suggestion={suggestion}>
                    <FiArrowUpLeft className='text-2xl text-neutral-500'/>
                  </div>
                </li>
              ))
            }
          </ul>}
        </div>}
      </div>
      <div className="w-full flex">
        <div className={`relative grow-0 shrink-0 overflow-hidden transition-all duration-300 ${isNavActive?"w-12 md:w-[72px] lg:w-[73px]":"w-0"}`}>
          <div className={`grow-0 shrink-0 text-center overflow-hidden transition-all duration-300 flex flex-col gap-7 mt-7 pt-8 fixed top-6 left-0 h-screen z-40 bg-white ${isNavActive?"w-12 md:w-[73px] lg:w-[72px]":"w-0"}`}>
          <Link href='/' className="" >
            <AiFillHome className={`text-xl md:text-2xl mx-auto transition-colors duration-300 cursor-pointer ${isActive('/')?"text-black":"text-neutral-500"}`}/>
            <span className={`text-[10px] md:text-xs transition-colors duration-300 cursor-pointer ${isActive("/")?"text-black":"text-neutral-500"}`}>Home</span>
          </Link>
          <button onClick={()=>handleButtonClick("/videos/shorts")} className="">
            <RiSlideshow3Line className={`text-xl md:text-2xl mx-auto transition-colors duration-300 cursor-pointer ${isActive("/videos/shorts")?"text-black":"text-neutral-500"}`}/>
            <span className={`text-[10px] md:text-xs transition-colors duration-300 cursor-pointer ${isActive("/videos/shorts")?"text-black":"text-neutral-500"}`}>Shorts</span>
          </button>
          <Link href='/videos/trending' className="">
            <SiHotjar className={`text-xl md:text-2xl mx-auto transition-colors duration-300 cursor-pointer ${isActive("/videos/trending")?"text-black":"text-neutral-500"}`}/>
            <span className={`text-[10px] md:text-xs transition-colors duration-300 cursor-pointer ${isActive("/videos/trending")?"text-black":"text-neutral-500"}`}>Trending</span>
          </Link>
          </div>
        </div>
        <MyContext.Provider value={{ isNavActive }}>
          {children}
        </MyContext.Provider>
      </div>
    </>
  )
}

export default Navbar