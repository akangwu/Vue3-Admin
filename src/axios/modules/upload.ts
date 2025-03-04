import { Upload } from '@/axios/interface/index'
import http from '@/axios'

/**
 * @name 文件上传模块
 */
// 图片上传
export const uploadImg = (params: FormData) => {
	return http.post<Upload.ResFileUrl>('/file/upload/img', params)
}

// 视频上传
export const uploadVideo = (params: FormData) => {
	return http.post<Upload.ResFileUrl>('/file/upload/video', params)
}
