import http from "@/axios";
import { Login } from "@/axios/interface/index";
import authButtonList from "@/assets/json/authButtonList.json";
import authMenuList from "@/routers/localRouterList.json";

/**
 * @name 登录模块
 */
// 用户登录
export const loginApi = (params: Login.ReqLoginForm) => {
  return http.post<Login.ResLogin>(PORT1 + "/login", params, { noLoading: true }); // 正常 post json 请求  ==>  application/json
  /*return http.post<Login.ResLogin>(
      `/auth/oauth/token?grant_type=password&scope=server&code=3&flag=${JSON.stringify(Date.parse(new Date()))}`,
      params,
      { noLoading: true, isLogin: true }
    ); */
  // 正常 post json 请求  ==>  application/json
  //return http.post<Login.ResLogin>(PORT1 + "/login", params, { noLoading: true }); // 正常 post json 请求  ==>  application/json
  // return http.post<Login.ResLogin>(PORT1 + `/login`, params, { noLoading: true }); // 控制当前请求不显示 loading
  // return http.post<Login.ResLogin>(PORT1 + `/login`, {}, { params }); // post 请求携带 query 参数  ==>  ?username=admin&password=123456
  // return http.post<Login.ResLogin>(PORT1 + `/login`, qs.stringify(params)); // post 请求携带表单参数  ==>  application/x-www-form-urlencoded
  // return http.get<Login.ResLogin>(PORT1 + `/login?${qs.stringify(params, { arrayFormat: "repeat" })}`); // get 请求可以携带数组等复杂参数
};

// 获取菜单列表
export const getAuthMenuListApi = () => {
  return authMenuList;
};

// 获取按钮权限
export const getAuthButtonListApi = () => {
  // 如果想让按钮权限变为本地数据，注释上一行代码，并引入本地 authButtonList.json 数据
  return authButtonList;
};
