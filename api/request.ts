import axios from 'axios'
import { toast } from 'react-toastify'

//https://infomon-api-staging-v2.azurewebsites.net
// https://infomon-api-prod.azurewebsites.net
export const baseURL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000/api/'
    : 'https://infomon-api-staging-v2.azurewebsites.net/api'

export const request = axios.create({
  baseURL,
})

// @TODO: 处理 401/403 的 Case，清除无效的 token
request.interceptors.request.use(
  async (config: any) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
request.interceptors.response.use(
  (res: any) => {
    const code = res?.status
    if (code !== 200 && code !== 201) {
      // 这里返回一个 rejected 的 Promise，从而触发 catch 块
      return Promise.reject(res)
    }
    return Promise.resolve(res)
  },
  (error) => {
    console.log('error', error)

    toast.error(error?.message)

    return Promise.reject(error) // 或者返回一些默认值
  }
)

export default request