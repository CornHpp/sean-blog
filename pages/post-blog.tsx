import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
export default function PostBlog() {
  const [form, setForm] = useState({
    title: '',
    date: '',
    summary: '',
    authors: '',
    markdown: '',
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
    if (!form.markdown) {
      toast.error('Please enter the markdown')
      return
    }
    console.log(form)
    axios
      .post('/api/blog/createBlog', {
        title: form.title,
        summary: form.summary,
        authors: form.authors,
        markdown: form.markdown,
      })
      .then((res) => {
        console.log(res)
        setForm({
          title: '',
          date: '',
          summary: '',
          authors: '',
          markdown: '',
        })
        toast.success('Blog created successfully')
      })
  }
  const handleFileChange = (e: React.ChangeEvent) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) {
      const formData = new FormData()
      formData.append('file', file)
      axios
        .post('/api/upload/markdown', formData)
        .then((res) => {
          console.log(res)
          // Update the form state with the uploaded markdown content
          console.log(res.data.file)
          setForm((prevForm) => ({ ...prevForm, markdown: res.data.file }))
        })
        .catch((error) => {
          console.error('Error uploading file:', error)
        })
    }
  }
  const getAllMarkdown = () => {
    axios
      .get('https://1111-4dcei80av-onlyheartt9s-projects.vercel.app/api/blog/test')
      .then((res) => {
        console.log(res)
      })
  }

  useEffect(() => {
    getAllMarkdown()
  }, [])

  return (
    <div className="w-[800px] mx-auto mt-[20px]">
      <div className="text-3xl font-bold">Post Blog</div>

      <div className="flex mt-[40px] ">
        <div className="text-xl font-bold w-[100px]">title</div>
        <input
          type="text"
          className="w-[300px] h-[30px] border border-gray-300 leading-[20px] px-[10px] "
          placeholder="you@example.com"
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
          placeholder="summary"
          value={form.summary}
          onChange={(e) => setForm({ ...form, summary: e.target.value })}
        />
      </div>
      <div className="flex mt-[40px] ">
        <div className="text-xl font-bold w-[100px]">authors</div>
        <input
          type="text"
          className="w-[300px] h-[30px] border border-gray-300 leading-[20px] px-[10px] "
          placeholder="authors"
          value={form.authors}
          onChange={(e) => setForm({ ...form, authors: e.target.value })}
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
