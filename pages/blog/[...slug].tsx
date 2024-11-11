'use client'

import { useEffect, useState } from 'react'
import { postBlogAPI } from '~/api/postBlog'
import { MDXLayoutRenderer } from '~/components/MDXComponents'
import { PageTitle } from '~/components/PageTitle'
import type { BlogProps } from '~/types'

const DEFAULT_LAYOUT = 'PostSimple'

export default function Blog() {
  const [loading, setLoading] = useState(true)
  const [blogData, setBlogData] = useState<BlogProps | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fetchBlogData = async () => {
    const slug = window.location.pathname.split('/blog/')[1]
    console.log('slug', slug)
    postBlogAPI.getBlogById(slug).then((res) => {
      console.log('res', res)
      setBlogData(res)
      setLoading(false)
    })
  }

  useEffect(() => {
    fetchBlogData()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!blogData) return <div>No blog found</div>

  const { post, ...rest } = blogData
  const { mdxSource, frontMatter } = post

  return (
    <>
      {frontMatter.draft !== true ? (
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
        </div>
      )}
    </>
  )
}
