import React from 'react'

export default function Hero() {
  return (
    <div className='flex flex-col lg:flex-row items-center justify-between gap-8 px-4 text-5xl py-12'>
      <div className='flex flex-col items-start justify-center w-full'>
        <h1 className=' font-bold  text-gray-800 dark:text-gray-200'>Hi, There!</h1>
        <h2 className=' my-5'> I'm <span className=' font-semibold text-orange-500'>Mohammed Parves</span></h2>
        <p className=' text-gray-600 dark:text-gray-400 '>Typewriter</p>
      </div>
      <div className='flex items-center justify-ceter w-full'>
        <img className='w-64 h-64 md:w-full  md:h-full object-contain' src="https://res.cloudinary.com/ddbqfnyfc/image/upload/v1747771857/business-man-illustration_cw8jhi.png" alt="" />
      </div>
    </div>
  )
}
