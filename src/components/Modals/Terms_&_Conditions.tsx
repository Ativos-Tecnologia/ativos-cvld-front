"use client";

import React from 'react'
import { BiX } from 'react-icons/bi';

const Terms = ({ state, setState }: {
  state: boolean;
  setState: (state: boolean) => void;
}) => {

  return (
    <div className={`${state ? 'opacity-100 visible' : 'opacity-0 invisible'} 
      fixed top-0 left-0 flex items-center justify-center w-screen h-screen z-1 bg-black/50 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 transition-all duration-300 ease-in-out`}>
      <div className='relative w-11/12 xsm:w-100 sm:w-150 h-fit rounded-lg bg-white p-10 border border-stroke dark:border-strokedark dark:bg-boxdark'>
        <span className='absolute top-4 right-4 cursor-pointer'>
          <BiX style={{ width: '26px', height: '26px', fill: '#BAC1CB' }} onClick={() => setState(false)} />
        </span>
        <h2 className='text-graydark font-bold text-xl text-center mb-4 dark:text-white'>
          Termos e condições
        </h2>
        <div className='h-100 overflow-y-auto'>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Odio dolorem nesciunt quisquam similique unde aliquid ut. Earum ea in cupiditate culpa nobis excepturi ducimus, adipisci voluptas iusto similique, quos id. Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem ipsam dolor error laboriosam omnis quas illum reiciendis, voluptatibus vel, rerum et asperiores adipisci. Placeat, repellendus mollitia. Quidem ab totam tenetur?
          </p>
          &nbsp;
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quis doloribus consequatur maxime distinctio nihil. Eius nisi ratione enim molestiae doloribus blanditiis, et suscipit vitae facere deserunt, assumenda accusamus, repudiandae cupiditate!
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Perspiciatis reprehenderit nisi enim quo inventore, illum accusamus tenetur autem quam culpa consequatur maxime error pariatur ut laboriosam amet praesentium excepturi nostrum.
          </p>
        </div>

      </div>
    </div>
  )
}

export default Terms
