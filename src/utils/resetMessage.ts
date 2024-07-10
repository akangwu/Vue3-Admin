//import { App } from "vue";
import { ElMessage } from "element-plus";

let messageInstance: any = null;

const customElMessage = (options: Parameters<typeof ElMessage>[0]): void => {
  if (messageInstance) {
    messageInstance.close();
  }

  //@ts-expect-error
  messageInstance = ElMessage(options);
};

export const msg = customElMessage;
