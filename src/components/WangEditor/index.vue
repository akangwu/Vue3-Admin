<template>
	<div :class="['editor-box', self_disabled ? 'editor-disabled' : '']">
		<Toolbar class="editor-toolbar" :editor="editorRef" :default-config="toolbarConfig" :mode="mode" v-if="!hideToolBar" />
		<Editor class="editor-content" :style="{ height }" :mode="mode" v-model="valueHtml" :default-config="editorConfig" @on-created="handleCreated" @on-blur="handleBlur" />
	</div>
</template>

<script setup>
import { nextTick, computed, inject, shallowRef, onBeforeUnmount } from 'vue'
import { IToolbarConfig, IEditorConfig } from '@wangeditor/editor'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { uploadImg, uploadVideo } from '@/axios/modules/upload'
import '@wangeditor/editor/dist/css/style.css'
import { formContextKey, formItemContextKey } from 'element-plus'

// 富文本 DOM 元素
const editorRef = shallowRef()

// 实例化编辑器
const handleCreated = editor => {
	editorRef.value = editor
}

// 接收父组件参数，并设置默认值
const props = defineProps({
	value: {
		type: String,
		default: ''
	},
	toolbarConfig: {
		type: Object,
		default: () => ({
			excludeKeys: []
		})
	},
	editorConfig: {
		type: Object,
		default: () => ({
			placeholder: '请输入内容...',
			MENU_CONF: {}
		})
	},
	height: {
		type: String,
		default: '500px'
	},
	mode: {
		type: String,
		default: 'default'
	},
	hideToolBar: {
		type: Boolean,
		default: false
	},
	disabled: {
		type: Boolean,
		default: false
	}
})

// 获取 el-form 组件上下文
const formContext = inject(formContextKey, null)
// 获取 el-form-item 组件上下文
const formItemContext = inject(formItemContextKey, null)
// 判断是否禁用上传和删除
const self_disabled = computed(() => {
	return props.disabled || (formContext && formContext.disabled)
})

// 判断当前富文本编辑器是否禁用
if (self_disabled.value) {
	nextTick(() => {
		if (editorRef.value) {
			editorRef.value.disable()
		}
	})
}

// 富文本的内容监听，触发父组件改变，实现双向数据绑定
const emit = defineEmits(['update:value', 'check-validate'])
const valueHtml = computed({
	get() {
		return props.value
	},
	set(val) {
		if (editorRef.value && editorRef.value.isEmpty()) {
			val = ''
		}
		emit('update:value', val)
	}
})

/**
 * @description 图片自定义上传
 * @param file 上传的文件
 * @param insertFn 上传成功后的回调函数（插入到富文本编辑器中）
 */
props.editorConfig.MENU_CONF['uploadImage'] = {
	async customUpload(file, insertFn) {
		if (!uploadImgValidate(file)) return
		const formData = new FormData()
		formData.append('file', file)
		try {
			const { data } = await uploadImg(formData)
			insertFn(data.fileUrl)
		} catch (error) {
			console.log(error)
		}
	}
}

// 图片上传前判断
const uploadImgValidate = file => {
	console.log(file)
	return true
}

/**
 * @description 视频自定义上传
 * @param file 上传的文件
 * @param insertFn 上传成功后的回调函数（插入到富文本编辑器中）
 */
props.editorConfig.MENU_CONF['uploadVideo'] = {
	async customUpload(file, insertFn) {
		if (!uploadVideoValidate(file)) return
		const formData = new FormData()
		formData.append('file', file)
		try {
			const { data } = await uploadVideo(formData)
			insertFn(data.fileUrl)
		} catch (error) {
			console.log(error)
		}
	}
}

// 视频上传前判断
const uploadVideoValidate = file => {
	console.log(file)
	return true
}

// 编辑框失去焦点时触发
const handleBlur = () => {
	if (formItemContext && formContext) {
		formContext.validateField([formItemContext.prop])
	}
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
	if (editorRef.value) {
		editorRef.value.destroy()
	}
})

defineExpose({
	editor: editorRef
})
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
