// 导入所需的模块和组件
import fs from 'fs'
import { MDXLayoutRenderer } from '~/components/MDXComponents'
import { PageTitle } from '~/components/PageTitle'
import { POSTS_PER_PAGE } from '~/constant'
import { getCommentConfigs } from '~/libs/comment'
import { formatSlug, getFiles } from '~/libs/files'
import { generateRss } from '~/libs/generate-rss'
import { getAllFilesFrontMatter, getFileBySlug } from '~/libs/mdx'
import type { AuthorFrontMatter, BlogProps, MdxPageLayout } from '~/types'

// 设置默认的博客文章布局
const DEFAULT_LAYOUT: MdxPageLayout = 'PostSimple'

// 生成静态页面路径
export async function getStaticPaths() {
  // 获取所有博客文件
  const posts = getFiles('blog')
  return {
    // 将每个文件路径转换为URL参数
    paths: posts.map((p: string) => ({
      params: {
        slug: formatSlug(p).split('/'),
      },
    })),
    fallback: false,
  }
}

// 获取每个页面的具体内容和属性
export async function getStaticProps({ params }: { params: { slug: string[] } }) {
  // 获取所有博客文章的前置信息
  const allPosts = getAllFilesFrontMatter('blog')
  // 找到当前文章在所有文章中的位置
  const postIndex = allPosts.findIndex((post) => formatSlug(post.slug) === params.slug.join('/'))
  // 获取上一篇和下一篇文章信息
  const prev = allPosts[postIndex + 1] || null
  const next = allPosts[postIndex - 1] || null
  // 计算当前文章所在的页码
  const page = Math.ceil((postIndex + 1) / POSTS_PER_PAGE)
  // 获取当前文章的完整内容
  console.log('params.slug', params.slug.join('/'))
  const post = await getFileBySlug('blog', params.slug.join('/'))

  // 获取文章作者信息
  const authors = post.frontMatter.authors || ['default']
  const authorDetails = await Promise.all(
    authors.map(async (author) => {
      const authorData = await getFileBySlug('authors', author)
      // eslint-disable-next-line
      return authorData.frontMatter as unknown as AuthorFrontMatter
    })
  )

  // 生成RSS订阅文件
  const rss = generateRss(allPosts)
  fs.writeFileSync('./public/feed.xml', rss)
  // 获取评论系统配置
  const commentConfig = getCommentConfigs()

  // 返回页面所需的所有属性
  return { props: { post, authorDetails, prev, next, page, commentConfig } }
}

// 博客页面的主要组件
export default function Blog(props: BlogProps) {
  // 解构获取文章内容和其他属性
  const { post, ...rest } = props
  const { mdxSource, frontMatter } = post

  return (
    <>
      {/* 如果文章不是草稿状态，则显示文章内容 */}
      {frontMatter.draft !== true ? (
        <MDXLayoutRenderer
          layout={frontMatter.layout || DEFAULT_LAYOUT}
          mdxSource={mdxSource}
          frontMatter={frontMatter}
          type="blog"
          {...rest}
        />
      ) : (
        // 如果是草稿状态，显示施工中的提示
        <div className="mt-24 text-center">
          <PageTitle>
            Under letruction{' '}
            <span role="img" aria-label="roadwork sign">
              🚧
            </span>
          </PageTitle>
        </div>
      )}
    </>
  )
}
