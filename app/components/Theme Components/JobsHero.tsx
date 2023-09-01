"use client"

import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

interface JobsHeroProps {
    title: string;
    subtitle: string;
    classname: string;
  }

  const JobsHero: React.FC<JobsHeroProps> = ({ title, subtitle, classname}) => {
    return(
        <>
        
        <div className={classname}>
            <div className="relative flex flex-col justify-end gap-4 w-11/12 lg:w-8/12 min-h-[30vh] m-auto ">
              <div className="flex flex-col justify-center items-center min-h-[30vh] w-full">
                <h1 className="text-6xl lg:text-8xl font-black tracking-tighter">{title}</h1>
                <h2 className="text-sm lg:text-md font-bold tracking-widest text-center uppercase">{subtitle}</h2>
              </div>
            </div>             
        </div>
        </>
    )
}

export default JobsHero;