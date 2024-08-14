import { useEffect,RefObject } from "react";

export default function OutsideClick (ref:RefObject<HTMLDivElement>,openRef:RefObject<HTMLElement>,setShow:()=>void) {
  useEffect(() => {
    function handleClickOutside(event:MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        if(!(openRef.current && openRef.current.contains(event.target as Node)) ){
          setShow();
        }
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
}