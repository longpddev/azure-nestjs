import React from 'react'
import {useStore} from '../stores'
import { clsx } from 'clsx'
import { LoadingOutlined } from '@ant-design/icons'
const Overlay = () => {
  const status = useStore(state => state.status);
  return (
    <div className={clsx('bg-white inset-0 w-full h-full bg-opacity-50 flex items-center justify-center z-[1000]', {
      'hidden': status !== 'loading',
      'fixed cursor-not-allowed': status === 'loading'
    })}><LoadingOutlined className='text-4xl flex w-min h-min' /></div>
  )
}

export default Overlay