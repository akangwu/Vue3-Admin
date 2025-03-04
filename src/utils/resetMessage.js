import { ElMessage } from 'element-plus'

let messageInstance = null

const customElMessage = options => {
	if (messageInstance) {
		messageInstance.close()
	}

	messageInstance = ElMessage(options)
}

export const msg = customElMessage
