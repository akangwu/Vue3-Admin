function findMaxCountElement(nums) {
	const obj = {}
	for (const num of nums) {
		obj[num] = (obj[num] || 0) + 1
	}

	let mostElement = null
	let maxCount = 0
	for (const key in obj) {
		if (obj[key] > maxCount) {
			mostElement = key
			maxCount = obj[key]
		}
	}

	return {
		mostElement,
		maxCount
	}
}
let nums = [1, 2, 2, 3, 3, 3, 3, 3, 3]
console.log(findMaxCountElement(nums))
