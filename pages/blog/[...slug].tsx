'use client'

import { useEffect, useState } from 'react'
import { postBlogAPI } from '~/api/postBlog'
import { MDXLayoutRenderer } from '~/components/MDXComponents'
import { PageTitle } from '~/components/PageTitle'
import type { BlogProps } from '~/types'
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote } from 'next-mdx-remote'
import remarkGfm from 'remark-gfm'
const DEFAULT_LAYOUT = 'PostSimple'

async function serializeMarkdown(markdownString: string) {
  if (!markdownString) return null

  return await serialize(markdownString, {
    mdxOptions: {
      remarkPlugins: [remarkGfm], // 添加 remarkGfm 支持
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

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!blogData) return <div>No blog found</div>

  const { post, ...rest } = blogData

  return (
    <>
      <div></div>

      <div className="prose">
        <MDXRemote {...blogData.mdxSource} />
      </div>
      {/* {frontMatter.draft !== true ? (
        <MDXLayoutRenderer
          layout={frontMatter.layout || DEFAULT_LAYOUT}
          mdxSource={mdxSource}
          frontMatter={frontMatter}
          type="blog"
          {...rest}
        />
      ) : (
        <div className="mt-24 text-center">
          <PageTitle>
            Under Construction{' '}
            <span role="img" aria-label="roadwork sign">
              🚧
            </span>
          </PageTitle>
        </div> */}
    </>
  )
}
