// Dialog.ts
import { ElDialog } from 'element-plus'
import dialogDrag from '../../directives/modules/dialogDrag'
import { h, withDirectives } from 'vue'

const Dialog = (__props, context) => {
	return withDirectives(
		h(
			'div',
			h(
				ElDialog,
				{
					appendToBody: false,
					closeOnClickModal: false,
					...context.attrs
				},
				context.slots
			)
		),
		[[dialogDrag]]
	)
}

export default Dialog
