const funcs = {
  /*金额转换为千分位带两位小数点函数*/
  thousandPoint(num: string): string {
    if (num && num !== 0 && !isNaN(num)) {
      let older = true; //是否大于0
      num = funcs.moneyTransferNum(num);
      if (num < 0) {
        older = false;
      }
      num = Math.abs(num).toFixed(2);
      num = (num + "").replace(/\$|\,/g, "");
      if ("" == num || isNaN(num)) {
        return "Not a Number ! ";
      }
      let sign = num.indexOf("-") > 0 ? "-" : "";
      let cents = num.indexOf(".") > 0 ? num.substr(num.indexOf(".")) : "";
      cents = cents.length > 1 ? cents : ""; //注意：这里如果是使用change方法不断的调用，小数是输入不了的
      num = num.indexOf(".") > 0 ? num.substring(0, num.indexOf(".")) : num;
      if ("" == cents) {
        if (num.length > 1 && "0" == num.substr(0, 1)) {
          return "Not a Number ! ";
        }
      } else {
        if (num.length > 1 && "0" == num.substr(0, 1)) {
          return "Not a Number ! ";
        }
      }
      for (let i: number = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
        num = num.substring(0, num.length - (4 * i + 3)) + "," + num.substring(num.length - (4 * i + 3));
      }
      return (!older ? "-" : "") + sign + num + cents;
    } else if (num === 0) {
      return "0.00";
    } else if (isNaN(parseFloat(num))) {
      return "";
    }
  },

  /*表格内的金额格式化*/
  format(row: any, column: any, cellValue: any) {
    return funcs.thousandPoint(cellValue);
  },

  /* 金额带千分位保存时转换为数字 */
  moneyTransferNum(num: number): number {
    return !num ? 0 : Number((num + "").replace(/,/g, ""));
  },

  formatOperateState(row, column, status): string {
    return status === "0" || status === ""
      ? "未提交"
      : status === "5"
      ? "驳回"
      : status === "6"
      ? "审批完成"
      : status === "7"
      ? "退回"
      : "审批中";
  }
};
export default funcs;
