import React from 'react'

import { Hypnosis } from 'react-cssfx-loading'

const Loader = () => {
  return (
    <div className='flex flex-col' >
        <Hypnosis color="#0000FF" width={"100px"} height={"100px"} duration='3s' />
        <p className='text-center' >
            Loading...
        </p>
    </div>
  )
}

export default Loader
