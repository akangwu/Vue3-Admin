//const CryptoJS = require("crypto-js"); //引用AES源码js
import CryptoJS from 'crypto-js'

const key = CryptoJS.enc.Utf8.parse('1234567890123456') //十六位十六进制数作为密钥
const iv = CryptoJS.enc.Utf8.parse('1234567890123456') //十六位十六进制数作为密钥偏移量

/**
 * iv 是密钥偏移量，这个一般是接口返回的，或者前后端协定一致。
 *由于对称解密使用的算法是 AES-128-CBC算法，数据采用 PKCS#7 填充 ， 因此这里的 key 需要为16位
 */

//解密方法
export function Decrypt(word) {
	let encryptedHexStr = CryptoJS.enc.Hex.parse(word)
	let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr)
	let decrypt = CryptoJS.AES.decrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 })
	let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
	return decryptedStr.toString()
}

/**
 *加密处理
 */
export function Encrypt(params) {
	let { data, type, param, key } = params
	const result = JSON.parse(JSON.stringify(data))
	if (type === 'Base64') {
		param.forEach(ele => {
			result[ele] = btoa(result[ele])
		})
	} else {
		param.forEach(ele => {
			let data = result[ele]
			key = CryptoJS.enc.Latin1.parse(key)
			let iv = key
			// 加密
			const encrypted = CryptoJS.AES.encrypt(data, key, {
				iv: iv,
				mode: CryptoJS.mode.CFB,
				padding: CryptoJS.pad.NoPadding
			})
			result[ele] = encrypted.toString()
		})
	}
	return result
}
