import { createApp } from 'vue'
import auth from './modules/auth'
import copy from './modules/copy'
import waterMarker from './modules/waterMarker'
import draggable from './modules/draggable'
import debounceD from './modules/debounce'
const directivesList = {
	auth,
	copy,
	waterMarker,
	draggable,
	debounce: debounceD
}

const directives = {
	install: function (app) {
		Object.keys(directivesList).forEach(key => {
			app.directive(key, directivesList[key])
		})
	}
}

export default directives
