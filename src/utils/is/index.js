function is(val, type) {
	return Object.prototype.toString.call(val) === `[object ${type}]`
}

function isFunction(val) {
	return is(val, 'Function')
}

const isDef = val => {
	return typeof val !== 'undefined'
}

const isUnDef = val => {
	return !isDef(val)
}

const isObject = val => {
	return val !== null && is(val, 'Object')
}

function isDate(val) {
	return is(val, 'Date')
}

function isNumber(val) {
	return is(val, 'Number')
}

function isAsyncFunction(val) {
	return is(val, 'AsyncFunction')
}

function isPromise(val) {
	return is(val, 'Promise') && isObject(val) && isFunction(val.then) && isFunction(val.catch)
}

function isString(val) {
	return is(val, 'String')
}

function isBoolean(val) {
	return is(val, 'Boolean')
}

function isArray(val) {
	return val && Array.isArray(val)
}

const isClient = () => {
	return typeof window !== 'undefined'
}

const isWindow = val => {
	return typeof window !== 'undefined' && is(val, 'Window')
}

const isElement = val => {
	return isObject(val) && !!val.tagName
}

function isNull(val) {
	return val === null
}

function isNullOrUnDef(val) {
	return isUnDef(val) || isNull(val)
}

const isHexColor = str => {
	return /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(str)
}
