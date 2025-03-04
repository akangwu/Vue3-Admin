export const localGet = key => {
	const value = window.localStorage.getItem(key)
	try {
		return JSON.parse(window.localStorage.getItem(key))
	} catch (error) {
		return value
	}
}

export const localSet = (key, value) => {
	window.localStorage.setItem(key, JSON.stringify(value))
}

export const localRemove = key => {
	window.localStorage.removeItem(key)
}

export const localClear = () => {
	window.localStorage.clear()
}

export const isType = val => {
	if (val === null) return 'null'
	if (typeof val !== 'object') return typeof val
	else return Object.prototype.toString.call(val).slice(8, -1).toLocaleLowerCase()
}

export const generateUUID = () => {
	let uuid = ''
	for (let i = 0; i < 32; i++) {
		let random = (Math.random() * 16) | 0
		if (i === 8 || i === 12 || i === 16 || i === 20) uuid += '-'
		uuid += (i === 12 ? 4 : i === 16 ? (random & 3) | 8 : random).toString(16)
	}
	return uuid
}

export const isObjectValueEqual = (a, b) => {
	if (!a || !b) return false
	let aProps = Object.getOwnPropertyNames(a)
	let bProps = Object.getOwnPropertyNames(b)
	if (aProps.length !== bProps.length) return false
	for (let i = 0; i < aProps.length; i++) {
		let propName = aProps[i]
		let propA = a[propName]
		let propB = b[propName]
		if (!b.hasOwnProperty(propName)) return false
		if (propA instanceof Object) {
			if (!isObjectValueEqual(propA, propB)) return false
		} else if (propA !== propB) {
			return false
		}
	}
	return true
}

export const randomNum = (min, max) => {
	let num = Math.floor(Math.random() * (max - min) + min) // 修正了随机数范围
	return num
}

export const getTimeState = () => {
	let timeNow = new Date()
	let hours = timeNow.getHours()
	if (hours >= 6 && hours <= 10) return '早上好 ⛅'
	if (hours >= 10 && hours <= 14) return '中午好 🌞'
	if (hours >= 14 && hours <= 18) return '下午好 🌞'
	if (hours >= 18 && hours <= 24) return '晚上好 🌛'
	if (hours >= 0 && hours <= 6) return '凌晨好 🌛'
}

export const getBrowserLang = () => {
	let browserLang = navigator.language ? navigator.language : navigator.browserLanguage
	let defaultBrowserLang = ''
	if (['cn', 'zh', 'zh-cn'].includes(browserLang.toLowerCase())) {
		defaultBrowserLang = 'zh'
	} else {
		defaultBrowserLang = 'en'
	}
	return defaultBrowserLang
}

export const getFlatMenuList = menuList => {
	let newMenuList = JSON.parse(JSON.stringify(menuList))
	return newMenuList.flatMap(item => [item, ...(item.children ? getFlatMenuList(item.children) : [])])
}

export const getShowMenuList = menuList => {
	let newMenuList = JSON.parse(JSON.stringify(menuList))
	return newMenuList.filter(item => {
		if (item.children?.length) item.children = getShowMenuList(item.children)
		return !item.meta?.isHide
	})
}

export const getAllBreadcrumbList = (menuList, parent = [], result = {}) => {
	for (const item of menuList) {
		result[item.path] = [...parent, item]
		if (item.children) getAllBreadcrumbList(item.children, result[item.path], result)
	}
	return result
}

export const getMenuListPath = (menuList, menuPathArr = []) => {
	for (const item of menuList) {
		if (typeof item === 'object' && item.path) menuPathArr.push(item.path)
		if (item.children?.length) getMenuListPath(item.children, menuPathArr)
	}
	return menuPathArr
}

export const findMenuByPath = (menuList, path) => {
	for (const item of menuList) {
		if (item.path === path) return item
		if (item.children) {
			const res = findMenuByPath(item.children, path)
			if (res) return res
		}
	}
	return null
}

export const getKeepAliveRouterName = (menuList, keepAliveNameArr = []) => {
	menuList.forEach(item => {
		if (item.meta.isKeepAlive && item.name) keepAliveNameArr.push(item.name)
		if (item.children?.length) getKeepAliveRouterName(item.children, keepAliveNameArr)
	})
	return keepAliveNameArr
}

export const formatTableColumn = (row, col, callValue) => {
	// 如果当前值为数组，使用 / 拼接（根据需求自定义）
	if (Array.isArray(callValue)) return callValue.length ? callValue.join(' / ') : '--'
	return callValue ?? '--'
}

export const findItemNested = (enumData, callValue, value, children) => {
	return enumData.reduce((accumulator, current) => {
		if (accumulator) return accumulator
		if (current[value] === callValue) return current
		if (current[children]) return findItemNested(current[children], callValue, value, children)
	}, null)
}
