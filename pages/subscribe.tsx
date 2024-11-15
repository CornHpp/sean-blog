import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { postBlogAPI } from '~/api/postBlog'
export default function Subscribe() {
  const [email, setEmail] = useState('')

  const handleSubmit = () => {
    if (!email) {
      toast.error('Please enter your email')
      return
    }
    if (!email.includes('@')) {
      toast.error('Please enter a valid email')
      return
    }
    postBlogAPI.subscribe({ email }).then((res) => {
      setEmail('')
      toast.success('Subscribed successfully')
    })
  }

  return (
    <div className="w-[800px] mx-auto mt-[20px]">
      <div className="text-3xl font-bold">Subscribe</div>
      <div className="text-xl mt-[30px]">
        You can subscribe to AVC by email and have the posts delivered to you within an hour of
        posting.
      </div>
      <div className="mt-[40px]  border-t-[1px] border-gray-600"></div>

      <div className="flex flex-col mt-[40px]">
        <div className="text-xl font-bold">Via Email</div>
        <div className="text-xl mt-[20px] flex items-center">
          <input
            type="text"
            className="w-[300px] h-[30px] border border-gray-300 leading-[20px] px-[10px] "
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            className="w-[240px] h-[30px] leading-[20px] flex items-center justify-center bg-blue-500 border-none ml-[20px] text-white"
            onClick={handleSubmit}
          >
            Subscribe
          </button>
        </div>
      </div>
    </div>
  )
}
