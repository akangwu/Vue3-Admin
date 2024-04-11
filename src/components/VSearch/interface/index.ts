export type SearchType = "input" | "date" | "dateRange" | "select" | "radioGroup" | "moneyRange";

export interface SearchColumnProps {
  htmlType: SearchType; // 当前项搜索框的类型
  label: ""; // 搜索汉字展示
  ruleId: ""; // 给后台的搜索字段
  type?: string; // 搜索项参数:日期参数
  format?: string; // 日期格式化
  valueFormat?: string; // 日期格式化
  hide?: false; // 日期格式化
  list?: [label: string, value: string, disabled?: false]; // 下拉列表数据
  search: {
    clear?: boolean; //是否有清空按钮
    filter?: boolean; //是否可以过滤数据
    span?: number; //占几行默认是1，可以是1，2，3
    offset?: number; // 搜索字段左侧偏移列数
    disabled?: boolean; //是否禁用
  };
}
