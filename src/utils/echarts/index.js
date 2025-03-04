// * Echarts 按需引入
const echarts = require('echarts/core')
const {
	BarChart,
	// 系列类型的定义后缀都为 SeriesOption
	BarSeriesOption,
	LineChart,
	LineSeriesOption
} = require('echarts/charts')
const { LegendComponent } = require('echarts/components')
const {
	TitleComponent,
	// 组件类型的定义后缀都为 ComponentOption
	TitleComponentOption,
	TooltipComponent,
	TooltipComponentOption,
	GridComponent,
	GridComponentOption,
	// 数据集组件
	DatasetComponent,
	DatasetComponentOption,
	// 内置数据转换器组件 (filter, sort)
	TransformComponent
} = require('echarts/components')
const { LabelLayout, UniversalTransition } = require('echarts/features')
const { CanvasRenderer } = require('echarts/renderers')

// 注册必须的组件
echarts.use([
	LegendComponent,
	TitleComponent,
	TooltipComponent,
	GridComponent,
	DatasetComponent,
	TransformComponent,
	BarChart,
	LineChart,
	LabelLayout,
	UniversalTransition,
	CanvasRenderer
])

module.exports = echarts
