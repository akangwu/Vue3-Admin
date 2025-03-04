const funcs = {
	/*金额转换为千分位带两位小数点函数*/
	thousandPoint(value) {
		if (value === null || value === undefined) {
			return '0.00'
		}

		if (typeof value === 'string' && value.trim() === '') {
			return ''
		}

		let amountStr = String(value)
		let sign = ''

		// Check for sign in the string
		if (amountStr.startsWith('+') || amountStr.startsWith('-')) {
			sign = amountStr.charAt(0)
			amountStr = amountStr.substring(1)
		}

		const amount = Number(amountStr)
		if (isNaN(amount)) {
			return '0.00'
		}

		const formattedAmount = amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
		return sign + formattedAmount
	},
	/*表格内的金额格式化*/
	format(row, column, cellValue) {
		return funcs.thousandPoint(cellValue)
	},

	/* 金额带千分位保存时转换为数字 */
	moneyTransferNum(num) {
		return !num ? 0 : Number((num + '').replace(/,/g, ''))
	},

	formatOperateState(status) {
		return status === '0' || status === '' ? '未提交' : status === '5' ? '驳回' : status === '6' ? '审批完成' : status === '7' ? '退回' : '审批中'
	},

	transferName(
		key,
		list,
		showCode = true,
		codeKey = {
			code: 'code',
			name: 'name'
		}
	) {
		let { code, name } = codeKey
		let f = list.filter(i => i[code] === key)
		return f.length ? (showCode ? `[${key}]${f[0][name]}` : f[0][name]) : ''
	}
}
export default funcs
