// 防抖函数
function debounce(func, wait = 500) {
	let timeout;
	return function (...args) {
		const context = this;
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			console.log('ssss'); // 这里会输出
			func.apply(context, args);
		}, wait);
	};
}

// 创建指令
const createDirective = (strategy) => ({
	mounted(el, binding) {
		const wait = parseInt(binding.arg, 10) || 500; // 默认等待时间为500ms
		const eventMap = new Map();

		// 获取Vue绑定的事件处理器
		const vei = el.__vue_event_handlers || (el.__vue_event_handlers = {});

		Object.entries(vei).forEach(([eventName, originalHandler]) => {
			// 创建包装函数
			const wrappedHandler = strategy === 'debounce'
				? debounce(originalHandler.value, wait)
				: throttle(originalHandler.value, wait);

			// 替换原始处理器
			const originalListener = originalHandler.value;
			eventMap.set(eventName, { originalListener, wrappedHandler });

			// 更新Vue事件绑定
			originalHandler.value = wrappedHandler;

			// 同步更新DOM监听器
			const domEventName = eventName.toLowerCase();
			el.removeEventListener(domEventName, originalListener);
			el.addEventListener(domEventName, wrappedHandler);
		});

		el[`__vue_${strategy}_handlers`] = eventMap;
	},

	updated(el, binding) {
		const newWait = parseInt(binding.arg, 10) || 500;
		const oldWait = parseInt(binding.oldValue?.arg, 10) || 500;
		const eventMap = el[`__vue_${strategy}_handlers`];

		if (newWait !== oldWait && eventMap) {
			eventMap.forEach((handler, eventName) => {
				// 移除旧监听器
				el.removeEventListener(eventName.toLowerCase(), handler.wrappedHandler);

				// 创建新包装函数
				const newWrapped = strategy === 'debounce'
					? debounce(handler.originalListener, newWait)
					: throttle(handler.originalListener, newWait);

				// 更新绑定
				const vei = el.__vue_event_handlers;
				if (vei?.[eventName]) {
					vei[eventName].value = newWrapped;
				}

				// 添加新监听器
				el.addEventListener(eventName.toLowerCase(), newWrapped);
				handler.wrappedHandler = newWrapped;
			});
		}
	},

	beforeUnmount(el) {
		const eventMap = el[`__vue_${strategy}_handlers`];
		if (eventMap) {
			eventMap.forEach((handler, eventName) => {
				// 恢复原始监听器
				const vei = el.__vue_event_handlers;
				if (vei?.[eventName]) {
					vei[eventName].value = handler.originalListener;
				}
				// 移除包装监听器
				el.removeEventListener(eventName.toLowerCase(), handler.wrappedHandler);
			});
			delete el[`__vue_${strategy}_handlers`];
		}
	}
});

// 创建防抖指令
const debounceD = createDirective('debounce');
export default debounceD;
