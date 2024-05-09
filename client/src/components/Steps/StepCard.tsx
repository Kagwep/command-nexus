import React from 'react'
import { BsWallet2, BsSaveFill } from 'react-icons/bs'
import { RiGalleryFill } from 'react-icons/ri'
import { IconBaseProps } from 'react-icons/lib'


interface ExtendedIconProps extends IconBaseProps {
  className?: string;
}

interface StepCardProps {
  title:string;
  desc: string;
   icon: string;
}

type Props = ExtendedIconProps | StepCardProps;

const StepCard:React.FC<Props> = (props) => {

  const { title, desc, icon } = props as StepCardProps;
  

  return (
    <>
      <div className='border border-slate-800 px-8 py-10 group hover:bg-emerald-900 duration-500 ease-in-out rounded-2xl'>
        <div className='flex items-center flex-col space-y-4 '>
          <div className='relative'>
            {/* Hexagon */}
            <div className='w-24 h-24 bg-hexagon opacity-5 group-hover:opacity-10 duration-500 ease-in-out'></div>
            {/* Wallet Icon */}
            <div className='absolute top-8 right-8'>
              {icon === '1' && (
                <BsWallet2
                  size={28}
                  className='text-emerald-600 opacity-100 group-hover:text-white duration-500 ease-in-out' 
                />
              )}
              {icon === '2' && (
                <RiGalleryFill
                  size={28}
                  className='text-emerald-600 opacity-100 group-hover:text-white duration-500 ease-in-out'
                />
              )}
              {icon === '3' && (
                <BsSaveFill
                  size={28}
                  className='text-emerald-600 opacity-100 group-hover:text-white duration-500 ease-in-out'
                />
              )}
            </div>
          </div>
          {/* Content */}
          <h1 className='font-medium text-3xl'>{title}</h1>
          <h1 className='max-w-xs text-center text-slate-400 group-hover:text-white/50 text-2xl'>
            {desc}
          </h1>
        </div>
      </div>
    </>
  )
}

export default StepCard
