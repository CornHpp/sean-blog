// 物品相关接口
import { Api } from './api'

class PostBlogAPI extends Api {
  async uploadMarkdown(params: any) {
    return this.post(`/upload/markdownv2`, params, {
      errorName: 'uploadMarkdown',
    })
  }
  async test() {
    return this.get(`/blog/test`, {
      errorName: 'test',
    })
  }
  async createBlog(params: any) {
    return this.post(`/blog/createBlog`, params, {
      errorName: 'createBlog',
    })
  }

  async subscribe(params: any) {
    return this.post(`/mailer/subscribe`, params, {
      errorName: 'subscribe',
    })
  }
  //getallblogs
  async getAllBlogs() {
    return this.get(`/blog/getBlog`, {
      errorName: 'getAllBlogs',
    })
  }
  async getBlogById(id: string) {
    return this.get(`/blog/getBlog?id=${id}`, {
      errorName: 'getBlogById',
    })
  }
}

export const postBlogAPI = new PostBlogAPI()
