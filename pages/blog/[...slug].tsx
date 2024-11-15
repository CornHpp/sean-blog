'use client'

import { useEffect, useState, useMemo } from 'react'
import { postBlogAPI } from '~/api/postBlog'
import { MDXLayoutRenderer } from '~/components/MDXComponents'
import { PageTitle } from '~/components/PageTitle'
import type { BlogProps } from '~/types'
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote } from 'next-mdx-remote'
import remarkGfm from 'remark-gfm'
import PostSimple from '~/layouts/PostSimple'
import { Tag } from '~/components/Tag'
import { formatDate } from '~/utils/date'
const DEFAULT_LAYOUT = 'PostSimple'

async function serializeMarkdown(markdownString: string) {
  if (!markdownString) return null

  return await serialize(markdownString, {
    mdxOptions: {
      remarkPlugins: [remarkGfm as any], // 添加 remarkGfm 支持
      rehypePlugins: [],
    },
  })
}

export default function Blog() {
  const [loading, setLoading] = useState(true)
  const [blogData, setBlogData] = useState<any>('')
  const [error, setError] = useState<string | null>(null)
  const fetchBlogData = async () => {
    const slug = window.location.pathname.split('/blog/')[1]
    const res = await postBlogAPI.getBlogById(slug)
    console.log(res)
    setLoading(false)
    if (res?.markdown) {
      const mdxSource = await serializeMarkdown(res.markdown)
      console.log('mdxSource', mdxSource)
      setBlogData({
        ...res,
        mdxSource,
      })
    }
  }

  useEffect(() => {
    fetchBlogData()
  }, [])

  const blogTags = useMemo(() => {
    if (!blogData?.tags) return []
    const res = blogData?.tags?.replace(/^{\"|\"}$/g, '')?.split(',')
    console.log('res', res)
    blogData.tagsList = res
    return res
  }, [blogData])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!blogData) return <div>No blog found</div>
  console.log(blogData)

  return (
    <div className="prose">
      <div className="flex items-center ">
        {blogTags.tagsList?.map((tag) => (
          <div
            key={tag}
            className="rounded-lg px-2 py-0.5 font-semibold bg-slate-100 text-gray-600 hover:text-gray-800 dark:bg-gray-700 dark:text-gray-300 text-sm mr-2 cursor-pointer"
          >
            #{tag}
          </div>
        ))}
      </div>

      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 md:text-5xl md:leading-tight mt-[10px] mb-[0px]">
        {blogData.title}
      </h1>
      <div className="text-gray-500 dark:text-gray-400 text-sm mt-2 text-[20px]  mb-[30px]">
        {formatDate(blogData.date)}
      </div>
      <div className="prose">
        <MDXRemote {...blogData.mdxSource} />
      </div>
    </div>
  )
}
