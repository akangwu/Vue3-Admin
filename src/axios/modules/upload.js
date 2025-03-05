import http from '@/axios'

/**
 * @name 文件上传模块
 */
// 图片上传
export const uploadImg = params => {
	return http.post('/file/upload/img', params)
}

// 视频上传
export const uploadVideo = params => {
	return http.post('/file/upload/video', params)
}
