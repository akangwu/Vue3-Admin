const funcs = {
  /*金额转换为千分位带两位小数点函数*/
  thousandPoint(value: any): string {
    if (value === null || value === undefined) {
      return "0.00";
    }

    if (typeof value === "string" && value.trim() === "") {
      return "";
    }

    let amountStr: string = String(value);
    let sign: string = "";

    // Check for sign in the string
    if (amountStr.startsWith("+") || amountStr.startsWith("-")) {
      sign = amountStr.charAt(0);
      amountStr = amountStr.substring(1);
    }

    const amount: number = Number(amountStr);
    if (isNaN(amount)) {
      return "0.00";
    }

    const formattedAmount: string = amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return sign + formattedAmount;
  },
  /*表格内的金额格式化*/
  format(row: any, column: any, cellValue: any): string {
    return funcs.thousandPoint(cellValue);
  },

  /* 金额带千分位保存时转换为数字 */
  moneyTransferNum(num: number): number {
    return !num ? 0 : Number((num + "").replace(/,/g, ""));
  },

  formatOperateState(status: string): string {
    return status === "0" || status === ""
      ? "未提交"
      : status === "5"
      ? "驳回"
      : status === "6"
      ? "审批完成"
      : status === "7"
      ? "退回"
      : "审批中";
  },

  transferName(
    key: string,
    list: Array<{ [x: string]: string }>,
    codeKey: { code: string; name: string } = {
      code: "code",
      name: "name"
    },
    showCode: boolean = true
  ): string {
    let { code, name } = codeKey;
    let f = list.filter((i: { [x: string]: string }) => i[code] === key);
    return f.length ? (showCode ? `[${key}]${f[0][name]}` : f[0][name]) : "";
  }
};
export default funcs;
