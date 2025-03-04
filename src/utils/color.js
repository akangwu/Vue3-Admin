import { ElMessage } from 'element-plus'

/**
 * Converts a hex color string to an RGB array.
 * @param {string} str - The hex color string.
 * @returns {Array<number>|void} - The RGB array or a warning message.
 */
export const hexToRgb = str => {
	let hexs = ''
	const reg = /^\#?[0-9A-Fa-f]{6}$/
	if (!reg.test(str)) return ElMessage.warning('输入错误的hex')
	str = str.replace('#', '')
	hexs = str.match(/../g)
	for (let i = 0; i < 3; i++) hexs[i] = parseInt(hexs[i], 16)
	return hexs
}

/**
 * Converts an RGB array to a hex color string.
 * @param {number} r - The red component.
 * @param {number} g - The green component.
 * @param {number} b - The blue component.
 * @returns {string|void} - The hex color string or a warning message.
 */
export const rgbToHex = (r, g, b) => {
	const reg = /^\d{1,3}$/
	if (!reg.test(r) || !reg.test(g) || !reg.test(b)) return ElMessage.warning('输入错误的rgb颜色值')
	let hexs = [r.toString(16), g.toString(16), b.toString(16)]
	for (let i = 0; i < 3; i++) if (hexs[i].length === 1) hexs[i] = `0${hexs[i]}`
	return `#${hexs.join('')}`
}

/**
 * Generates a darker color based on the given hex color and level.
 * @param {string} color - The hex color string.
 * @param {number} level - The level of darkness (0 to 1).
 * @returns {string|void} - The darker hex color string or a warning message.
 */
export const getDarkColor = (color, level) => {
	const reg = /^\#?[0-9A-Fa-f]{6}$/
	if (!reg.test(color)) return ElMessage.warning('输入错误的hex颜色值')
	const rgb = hexToRgb(color)
	for (let i = 0; i < 3; i++) rgb[i] = Math.round(20.5 * level + rgb[i] * (1 - level))
	return rgbToHex(rgb[0], rgb[1], rgb[2])
}

/**
 * Generates a lighter color based on the given hex color and level.
 * @param {string} color - The hex color string.
 * @param {number} level - The level of lightness (0 to 1).
 * @returns {string|void} - The lighter hex color string or a warning message.
 */
export const getLightColor = (color, level) => {
	const reg = /^\#?[0-9A-Fa-f]{6}$/
	if (!reg.test(color)) return ElMessage.warning('输入错误的hex颜色值')
	const rgb = hexToRgb(color)
	for (let i = 0; i < 3; i++) rgb[i] = Math.round(255 * level + rgb[i] * (1 - level))
	return rgbToHex(rgb[0], rgb[1], rgb[2])
}
