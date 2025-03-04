import { reactive, computed, toRefs } from 'vue'

/**
 * @description 搜索条件参数 页面操作方法封装
 * @param {Function} api 获取表格数据 axios 方法 (必传)
 * @param {Object} initParam 获取数据初始化参数 (非必传，默认为{})
 * @param requestError
 * */
export const useSearchForm = (api, initParam = {}, isPageable = true) => {
	const state = reactive({
		// 分页数据
		pageable: {
			// 当前页数
			pageNum: 1,
			// 每页显示条数
			pageSize: 25,
			// 总条数
			total: 0
		},
		// 查询参数(只包括查询)
		searchParam: {},
		// 初始化默认的查询参数
		searchInitParam: {},
		// 总参数(包含分页和查询参数)
		totalParam: {}
	})

	/**
	 * @description 分页查询参数(只包括分页和表格字段排序,其他排序方式可自行配置)
	 * */
	const pageParam = computed({
		get: () => {
			return {
				pageNum: state.pageable.pageNum,
				pageSize: state.pageable.pageSize
			}
		},
		set: newVal => {
			console.log('我是分页更新之后的值', newVal)
		}
	})

	/**
	 * @description 获取表格数据
	 * @return void
	 * */

	/**
	 * @description 更新查询参数
	 * @return void
	 * */
	const updatedTotalParam = () => {
		state.totalParam = {}
		// 处理查询参数，可以给查询参数加自定义前缀操作
		let nowSearchParam = {}
		// 防止手动清空输入框携带参数（这里可以自定义查询参数前缀）
		for (let key in state.searchParam) {
			// * 某些情况下参数为 false/0 也应该携带参数
			if (state.searchParam[key] || state.searchParam[key] === false || state.searchParam[key] === 0) {
				nowSearchParam[key] = state.searchParam[key]
			} else {
				nowSearchParam[key] = ''
			}
		}
		Object.assign(state.totalParam, nowSearchParam, isPageable ? pageParam.value : {})
	}

	/**
	 * @description 更新分页信息
	 * @param {Object} resPageable 后台返回的分页数据
	 * @return void
	 * */
	const updatePageable = resPageable => {
		Object.assign(state.pageable, resPageable)
	}

	/**
	 * @description 表格数据查询
	 * @return void
	 * */
	const search = () => {
		state.pageable.pageNum = 1
		updatedTotalParam()
	}

	/**
	 * @description 表格数据重置
	 * @return void
	 * */
	const reset = () => {
		state.pageable.pageNum = 1
		state.searchParam = {}
		// 重置搜索表单的时，如果有默认搜索参数，则重置默认的搜索参数
		Object.keys(state.searchInitParam).forEach(key => {
			state.searchParam[key] = state.searchInitParam[key]
		})
		updatedTotalParam()
	}

	/**
	 * @description 每页条数改变
	 * @param {Number} val 当前条数
	 * @return void
	 * */
	const handleSizeChange = val => {
		state.pageable.pageNum = 1
		state.pageable.pageSize = val
	}

	/**
	 * @description 当前页改变
	 * @param {Number} val 当前页
	 * @return void
	 * */
	const handleCurrentChange = val => {
		state.pageable.pageNum = val
	}

	return {
		...toRefs(state),
		search,
		reset,
		handleSizeChange,
		handleCurrentChange,
		updatedTotalParam
	}
}
