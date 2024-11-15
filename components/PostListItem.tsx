import type { MdxFrontMatter } from '~/types'
import { formatDate } from '~/utils/date'
import { Link } from './Link'
import { Tag } from './Tag'
import { useMemo } from 'react'

export function PostListItem({ frontMatter }: { frontMatter: any }) {
  let { blog_id, blog_date, blog_title, summary, blog_summary, blog_tags } = frontMatter

  const blogTags = useMemo(() => {
    if (!blog_tags) return []
    const res = blog_tags.replace(/^{\"|\"}$/g, '')?.split(',')
    return res
  }, [blog_tags])
  return (
    <li key={blog_id}>
      <article className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
        <dl>
          <dt className="sr-only">Published on</dt>
          <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
            <time dateTime={blog_date}>{formatDate(blog_date)}</time>
          </dd>
        </dl>
        <div className="space-y-3 xl:col-span-3">
          <div>
            <h3 className="text-2xl font-bold leading-8 tracking-tight">
              <Link href={`/blog/${blog_id}`} className="text-gray-900 dark:text-gray-100">
                <span data-umami-event="blog-title">{blog_title}</span>
              </Link>
            </h3>
            <div className="mt-1 flex flex-wrap">
              {blogTags?.map((tag) => <Tag key={tag} text={tag} />)}
            </div>
          </div>
          <div className="prose max-w-none text-gray-500 dark:text-gray-400">
            {blog_summary || summary}
          </div>
        </div>
      </article>
    </li>
  )
}
