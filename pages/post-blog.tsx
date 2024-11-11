import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { postBlogAPI } from '~/api/postBlog'
export default function PostBlog() {
  const [form, setForm] = useState({
    title: '',
    date: '',
    summary: '',
    authors: '',
    markdownId: '',
    tags: '',
  })

  const handleSubmit = () => {
    if (!form.title) {
      toast.error('Please enter the title')

      return
    }
    // if (!form.date) {
    //   alert('Please enter the date')
    //   return
    // }
    if (!form.summary) {
      toast.error('Please enter the summary')
      return
    }
    if (!form.authors) {
      toast.error('Please enter the authors')
      return
    }
    if (!form.markdownId) {
      toast.error('Please enter the markdown')
      return
    }
    postBlogAPI
      .createBlog({
        title: form.title,
        summary: form.summary,
        authors: form.authors,
        markdownId: form.markdownId,
        tags: form.tags?.split(','),
      })
      .then((res) => {
        console.log(res)
        setForm({
          title: '',
          date: '',
          summary: '',
          authors: '',
          markdownId: '',
          tags: '',
        })
        toast.success('Blog created successfully')
      })
  }
  const handleFileChange = (e: React.ChangeEvent) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) {
      const formData = new FormData()
      formData.append('file', file)
      postBlogAPI.uploadMarkdown(formData).then((res) => {
        setForm((prevForm) => ({ ...prevForm, markdownId: res?.id }))
      })
    }
  }

  return (
    <div className="w-[800px] mx-auto mt-[20px]">
      <div className="text-3xl font-bold">Post Blog</div>

      <div className="flex mt-[40px] ">
        <div className="text-xl font-bold w-[100px]">title</div>
        <input
          type="text"
          className="w-[300px] h-[30px] border border-gray-300 leading-[20px] px-[10px] "
          placeholder="please enter the article title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
      </div>
      {/* <div className="flex mt-[40px] ">
        <div className="text-xl font-bold w-[100px]">date</div>
        <input
          type="text"
          className="w-[300px] h-[30px] border border-gray-300 leading-[20px] px-[10px] "
          placeholder="you@example.com"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />
      </div> */}
      <div className="flex mt-[40px] ">
        <div className="text-xl font-bold w-[100px]">summary</div>
        <input
          type="text"
          className="w-[300px] h-[30px] border border-gray-300 leading-[20px] px-[10px] "
          placeholder="please enter the article summary"
          value={form.summary}
          onChange={(e) => setForm({ ...form, summary: e.target.value })}
        />
      </div>
      <div className="flex mt-[40px] ">
        <div className="text-xl font-bold w-[100px]">authors</div>
        <input
          type="text"
          className="w-[300px] h-[30px] border border-gray-300 leading-[20px] px-[10px] "
          placeholder="default is Sean"
          value={form.authors}
          onChange={(e) => setForm({ ...form, authors: e.target.value })}
        />
      </div>
      <div className="flex mt-[40px] ">
        <div className="text-xl font-bold w-[100px]">Tags</div>
        <input
          type="text"
          className="w-[300px] h-[30px] border border-gray-300 leading-[20px] px-[10px] "
          placeholder="请输入tag，用逗号隔开"
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
        />
      </div>

      <div className="flex mt-[40px] ">
        <div className="text-xl font-bold w-[120px]">markdown</div>
        <input type="file" onChange={handleFileChange} />
      </div>

      <button
        className="w-[240px] h-[30px] leading-[20px] flex items-center justify-center bg-blue-500 border-none mt-[40px] text-white"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  )
}
