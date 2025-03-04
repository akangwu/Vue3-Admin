<template>
	<div class="upload-box">
		<el-upload
			action="#"
			:id="uuid"
			:class="['upload', self_disabled ? 'disabled' : '', drag ? 'no-border' : '']"
			:multiple="false"
			:disabled="self_disabled"
			:show-file-list="false"
			:http-request="handleHttpUpload"
			:before-upload="beforeUpload"
			:on-success="uploadSuccess"
			:on-error="uploadError"
			:drag="drag"
			:accept="fileType.join(',')"
		>
			<template v-if="imageUrl">
				<img :src="imageUrl" class="upload-image" />
				<div class="upload-handle" @click.stop>
					<div class="handle-icon" @click="editImg" v-if="!self_disabled">
						<el-icon>
							<Edit />
						</el-icon>
						<span>编辑</span>
					</div>
					<div class="handle-icon" @click="imgViewVisible = true">
						<el-icon>
							<ZoomIn />
						</el-icon>
						<span>查看</span>
					</div>
					<div class="handle-icon" @click="deleteImg" v-if="!self_disabled">
						<el-icon>
							<Delete />
						</el-icon>
						<span>删除</span>
					</div>
				</div>
			</template>
			<template v-else>
				<div class="upload-empty">
					<slot name="empty">
						<el-icon>
							<Plus />
						</el-icon>
						<!-- <span>请上传图片</span> -->
					</slot>
				</div>
			</template>
		</el-upload>
		<div class="el-upload__tip">
			<slot name="tip" />
		</div>
		<el-image-viewer v-if="imgViewVisible" @close="imgViewVisible = false" :url-list="[imageUrl]" />
	</div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import { generateUUID } from '@/utils'
import { uploadImg } from '@/axios/modules/upload'
import { ElNotification, formContextKey, formItemContextKey } from 'element-plus'
import type { UploadProps, UploadRequestOptions } from 'element-plus'

const props = withDefaults(
	defineProps({
		imageUrl: '',
		api: null,
		drag: true,
		disabled: false,
		fileSize: 5,
		fileType: () => ['image/jpeg', 'image/png', 'image/gif'],
		height: 150px,
		width: 150px,
		borderRadius: 8px
	}),
	{
		imageUrl: '',
		drag: true,
		disabled: false,
		fileSize: 5,
		fileType: () => ['image/jpeg', 'image/png', 'image/gif'],
		height: '150px',
		width: '150px',
		borderRadius: '8px'
	}
)

const uuid = ref('id-' + generateUUID())
const imgViewVisible = ref(false)
const formContext = inject(formContextKey, null)
const formItemContext = inject(formItemContextKey, null)
const self_disabled = computed(() => props.disabled || (formContext && formContext.disabled))

const emit = defineEmits(['update:imageUrl'])

const handleHttpUpload = async options => {
	const formData = new FormData()
	formData.append('file', options.file)
	try {
		const api = props.api || uploadImg
		const { data } = await api(formData)
		emit('update:imageUrl', data.fileUrl)
		if (formItemContext && formContext) {
			formContext.validateField([formItemContext.prop])
		}
	} catch (error) {
		options.onError(error)
	}
}

const deleteImg = () => {
	emit('update:imageUrl', '')
}

const editImg = () => {
	const dom = document.querySelector(`#${uuid.value} .el-upload__input`)
	if (dom) {
		dom.dispatchEvent(new MouseEvent('click'))
	}
}

const beforeUpload = rawFile => {
	const imgSize = rawFile.size / 1024 / 1024 < props.fileSize
	const imgType = props.fileType.includes(rawFile.type)
	if (!imgType) {
		ElNotification({
			title: '温馨提示',
			message: '上传图片不符合所需的格式！',
			type: 'warning'
		})
	}
	if (!imgSize) {
		setTimeout(() => {
			ElNotification({
				title: '温馨提示',
				message: `上传图片大小不能超过 ${props.fileSize}M！`,
				type: 'warning'
			})
		}, 0)
	}
	return imgType && imgSize
}

const uploadSuccess = () => {
	ElNotification({
		title: '温馨提示',
		message: '图片上传成功！',
		type: 'success'
	})
}

const uploadError = () => {
	ElNotification({
		title: '温馨提示',
		message: '图片上传失败，请您重新上传！',
		type: 'error'
	})
}
</script>

<style scoped lang="scss">
.is-error {
	.upload {
		:deep(.el-upload),
		:deep(.el-upload-dragger) {
			border: 1px dashed var(--el-color-danger) !important;

			&:hover {
				border-color: var(--el-color-primary) !important;
			}
		}
	}
}

:deep(.disabled) {
	.el-upload,
	.el-upload-dragger {
		cursor: not-allowed !important;
		background: var(--el-disabled-bg-color);
		border: 1px dashed var(--el-border-color-darker) !important;

		&:hover {
			border: 1px dashed var(--el-border-color-darker) !important;
		}
	}
}

.upload-box {
	.no-border {
		:deep(.el-upload) {
			border: none !important;
		}
	}

	:deep(.upload) {
		.el-upload {
			position: relative;
			display: flex;
			align-items: center;
			justify-content: center;
			width: v-bind(width);
			height: v-bind(height);
			overflow: hidden;
			border: 1px dashed var(--el-border-color-darker);
			border-radius: v-bind(borderRadius);
			transition: var(--el-transition-duration-fast);

			&:hover {
				border-color: var(--el-color-primary);

				.upload-handle {
					opacity: 1;
				}
			}

			.el-upload-dragger {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 100%;
				height: 100%;
				padding: 0;
				overflow: hidden;
				background-color: transparent;
				border: 1px dashed var(--el-border-color-darker);
				border-radius: v-bind(borderRadius);

				&:hover {
					border: 1px dashed var(--el-color-primary);
				}
			}

			.el-upload-dragger.is-dragover {
				background-color: var(--el-color-primary-light-9);
				border: 2px dashed var(--el-color-primary) !important;
			}

			.upload-image {
				width: 100%;
				height: 100%;
				object-fit: contain;
			}

			.upload-empty {
				position: relative;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				font-size: 12px;
				line-height: 30px;
				color: var(--el-color-info);

				.el-icon {
					font-size: 28px;
					color: var(--el-text-color-secondary);
				}
			}

			.upload-handle {
				position: absolute;
				top: 0;
				right: 0;
				box-sizing: border-box;
				display: flex;
				align-items: center;
				justify-content: center;
				width: 100%;
				height: 100%;
				cursor: pointer;
				background: rgb(0 0 0 / 60%);
				opacity: 0;
				transition: var(--el-transition-duration-fast);

				.handle-icon {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					padding: 0 6%;
					color: aliceblue;

					.el-icon {
						margin-bottom: 40%;
						font-size: 130%;
						line-height: 130%;
					}

					span {
						font-size: 85%;
						line-height: 85%;
					}
				}
			}
		}
	}

	.el-upload__tip {
		line-height: 18px;
		text-align: center;
	}
}
</style>
