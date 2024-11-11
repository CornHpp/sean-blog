import { request } from './request'
import { toast } from 'react-toastify'
type Option = {
  errorName?: string
  errorFunc?: Function
}
export class Api {
  protected async get(api: string, { errorName }: Option) {
    try {
      const res = await request.get(api)
      console.log('res', res)
      if (res?.status != 200 && res?.status != 201) {
        toast.error(res?.data)
        return Promise.reject(res)
      }
      return res?.data
    } catch (error: any) {
      toast.error(error?.message || 'please log in first')
      return Promise.reject(error)
    }
  }
  protected async post(api: string, params: any, { errorName, errorFunc }: Option) {
    try {
      const res = await request.post(api, params)

      if (res?.status !== 200 && res?.status !== 201) {
        return Promise.reject(res)
      }
      return res?.data
    } catch (error: any) {
      toast.error(error?.message)
      return Promise.reject(error)
    }
  }
}
