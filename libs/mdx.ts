import fs from 'fs'
import matter from 'gray-matter'
import { bundleMDX } from 'mdx-bundler'
import path from 'path'
import readingTime from 'reading-time'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePresetMinify from 'rehype-preset-minify'
import rehypePrismPlus from 'rehype-prism-plus'
import rehypeSlug from 'rehype-slug'
import remarkGFM from 'remark-gfm'
import { visit } from 'unist-util-visit'
import { TOKEN_CLASSNAME_MAP } from '~/constant'
import type { BlogFrontMatter, MdxFileData, MdxFrontMatter, TOC, UnistNodeType } from '~/types'
import { dateSortDesc } from '~/utils/date'
import { formatSlug, getAllFilesRecursively } from './files'
import { remarkCodeBlockTitle } from './remark-code-block-title'
import { remarkImgToJsx } from './remark-img-to-jsx'
import { remarkTocHeading } from './remark-toc-heading'

/**
 * 根据给定的类型和slug获取MDX文件数据
 * @param type - 文件类型/目录名
 * @param slug - 文件slug(文件名,不含扩展名)
 * @returns 返回包含TOC、MDX源码和前置元数据的对象
 */
export async function getFileBySlug(type: string, slug: string): Promise<MdxFileData> {
  // 获取项目根目录
  const root = process.cwd()
  // 构建.mdx和.md文件的完整路径
  const mdxPath = path.join(root, 'data', type, `${slug}.mdx`)
  const mdPath = path.join(root, 'data', type, `${slug}.md`)
  // 读取文件内容,优先读取.mdx文件
  const source = fs.existsSync(mdxPath)
    ? fs.readFileSync(mdxPath, 'utf8')
    : fs.readFileSync(mdPath, 'utf8')

  /**
   * 为不同平台设置正确的esbuild可执行文件路径
   * 参考: https://github.com/kentcdodds/mdx-bundler#nextjs-esbuild-enoent
   */
  if (process.platform === 'win32') {
    process.env.ESBUILD_BINARY_PATH = path.join(
      process.cwd(),
      'node_modules',
      'esbuild',
      'esbuild.exe'
    )
  } else {
    process.env.ESBUILD_BINARY_PATH = path.join(
      process.cwd(),
      'node_modules',
      'esbuild',
      'bin',
      'esbuild'
    )
  }

  // 用于存储目录结构
  const toc: TOC[] = []

  // 使用mdx-bundler处理MDX内容
  const { frontmatter, code } = await bundleMDX<MdxFrontMatter>({
    source,
    cwd: path.join(process.cwd(), 'components'),
    // 配置esbuild选项
    esbuildOptions: (options) => {
      options.loader = {
        ...options.loader,
        '.js': 'jsx',
      }
      return options
    },
    // 配置MDX处理选项
    mdxOptions(options) {
      /**
       * 配置remark和rehype插件
       * 这是添加自定义remark/rehype插件的推荐方式
       * 参考: https://github.com/kentcdodds/mdx-bundler#mdxoptions
       */
      options.remarkPlugins = [
        ...(options.remarkPlugins || []),
        [remarkTocHeading, { exportRef: toc }],
        remarkGFM,
        remarkCodeBlockTitle,
        remarkImgToJsx,
      ]
      options.rehypePlugins = [
        ...(options.rehypePlugins || []),
        rehypeSlug,
        rehypeAutolinkHeadings,
        [rehypePrismPlus, { ignoreMissing: true }],
        rehypePresetMinify,
        // 自定义rehype插件,用于处理代码高亮的类名
        () => {
          return (tree) => {
            visit(tree, 'element', (node: UnistNodeType) => {
              const [token, type] = node.properties?.className || []
              if (token === 'token' && node.properties) {
                node.properties.className = [TOKEN_CLASSNAME_MAP[type]]
              }
            })
          }
        },
      ]
      return options
    },
  })

  // 返回处理后的MDX数据
  return {
    toc,
    mdxSource: code,
    frontMatter: {
      readingTime: readingTime(source),
      // @ts-ignore
      slug: slug || null,
      fileName: fs.existsSync(mdxPath) ? `${slug}.mdx` : `${slug}.md`,
      ...frontmatter,
    },
  }
}

export function getAllFilesFrontMatter(folder: string) {
  const root = process.cwd()
  const prefixPaths = path.join(root, 'data', folder)
  const files = getAllFilesRecursively(prefixPaths)
  const allFrontMatter: BlogFrontMatter[] = []
  files.forEach((file) => {
    // Replace is needed to work on Windows
    const fileName = file.slice(prefixPaths.length + 1).replace(/\\/g, '/')
    // Remove Unexpected File
    if (path.extname(fileName) !== '.md' && path.extname(fileName) !== '.mdx') {
      return
    }
    const source = fs.readFileSync(file, 'utf8')
    const grayMatterData = matter(source)
    const data = grayMatterData.data as BlogFrontMatter
    if (data.draft !== true) {
      allFrontMatter.push({ ...data, slug: formatSlug(fileName) })
    }
  })

  return allFrontMatter.sort((a, b) => dateSortDesc(a.date, b.date))
}
