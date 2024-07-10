export namespace unitExpensesMake {
  export interface column1 {
    docNum: string;
    operateState: string;
    applyDate: string;
    insuranceName: string;
    useDate: string;
    totalAmount: string;
    agencyName: string;
    createName: string;
    operation: string;
  }
  export interface column2 {
    docNum: string;
    operateState: string;
    applyDate: string;
    insuranceName: string;
    useDate: string;
    totalAmount: string;
    agencyName: string;
    createName: string;
    backStatus: string;
    backReason: string;
    operation: string;
  }
  export interface column3 {
    docNum: string;
    operateState: string;
    collectFlag: string;
    applyDate: string;
    useDate: string;
    agencyName: string;
    insuranceName: string;
    totalAmount: string;
    createName: string;
    operation: string;
  }
  export interface column4 {
    docNum: string;
    operateState: string;
    allocateFlag: string;
    applyDate: string;
    useDate: string;
    agencyName: string;
    insuranceName: string;
    totalAmount: string;
    createName: string;
    operation: string;
  }
  export interface columnAdd {
    businessItemCode: string;
    accountName: string;
    accountNo: string;
    accountBank: string;
    monthPayAmount: string;
    prePeriodUseAmount: string;
    prePeriodRequestAmount: string;
    coefficient: string;
    budgetAmount: string;
    monthAmount: string;
    afterRequestBalAmount: string;
    remark: string;
  }

  export interface columnComputed {
    name: string;
    key: number;
  }
}
