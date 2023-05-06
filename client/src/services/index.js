import axios from "axios";

import { customOSHeader } from "../utils/helpers/index";

import { config } from "../config";
import { mainApiAfterEach, mainApiBeforeEach } from "./api-interceptor";

const API_GLOBAL_TIMEOUT = 10000;

axios.defaults.params = {};
axios.defaults.params["courseType"] = "MATH";

const createHttpInstance = () => {
    const memo = new Map();

    return (
        baseURL,
        timeout = API_GLOBAL_TIMEOUT,
        isFormData = false,
        hideHeaders = false,
        thirdPartyHeaders = {}
    ) => {
        if (memo.has(baseURL)) return memo.get(baseURL);

        const formDataHeader = isFormData
            ? { "Content-Type": "multipart/form-data" }
            : {};

        const headers = hideHeaders
            ? {}
            : thirdPartyHeaders.hasOwnProperty("Authorization")
                ? { ...thirdPartyHeaders }
                : {
                    "client-id": config.clientId,
                    "Client-Type": "web",
                    "os-type": customOSHeader(),
                    ...formDataHeader,
                    // "f84cfd2c7797e1de3a721cbb427e18f8" to set token cookie from server
                };

        const axiosConfig = {
            baseURL,
            timeout,
            headers,
            // withCredentials: true
        };
        const _instance = axios.create(axiosConfig);

        memo.set(baseURL, _instance);
        return _instance;
    };
};

/**
 * Add interceptor to axios object.
 *
 * @param {AxiosInstance} httpInstance Instance of axios object.
 * @param {CallableFunction} requestInterceptorFn Function to be call before each request gone.
 * @param {CallableFunction} responseInterceptorFn Function to be call after each request come.
 */
const addInterceptor = (
    httpInstance,
    requestInterceptorFn,
    responseInterceptorFn
) => {
    httpInstance.interceptors.request.use(requestInterceptorFn);
    httpInstance.interceptors.response.use(responseInterceptorFn);
};

const httpInstance = createHttpInstance();
export const api = () => httpInstance(config.apiUrl);
export const apiBYJU = () => httpInstance(config.apiBYJUUrl, null, null, true);
export const marketPlaceApi = (marketPlaceHeaders) => httpInstance(config.marketPlaceApiUrl, null, false, false, marketPlaceHeaders);
export const apiFormData = () => httpInstance(config.apiUrl, null, true);
addInterceptor(api(), mainApiBeforeEach, mainApiAfterEach);

export const GET = async (url, data = {}, isByjuAPI = false, isMarketPlaceAPI = false, marketPlaceHeaders = {}) => {
    const { cancelToken, ...payload } = data || {};
    const response = await (isByjuAPI ? apiBYJU() : isMarketPlaceAPI ? marketPlaceApi(marketPlaceHeaders) : api()).get(url, {
        params: payload,
        cancelToken: cancelToken?.token,
    });
    return response;
};

export const POST = async (
    url,
    data,
    options = {},
    isByjuAPI = false,
    isMarketPlaceAPI = false,
    marketPlaceHeaders = {}
) => {
    const response = await (isByjuAPI
        ? apiBYJU()
        : isMarketPlaceAPI
            ? marketPlaceApi(marketPlaceHeaders)
            : api()
    ).post(url, data, {
        cancelToken: data?.cancelToken?.token,
        ...options,
    });
    return response;
};

export const POST_FORMDATA = async (url, data, options = {}) => {
    const response = await apiFormData().post(url, data, {
        cancelToken: data?.cancelToken?.token,
        ...options,
    });
    return response;
};

export const PUT = async (url, data) => {
    const { cancelToken, ...payload } = data || {};
    const response = await api().put(url, payload, {
        cancelToken: cancelToken?.token,
    });
    return response;
};

export const DELETE = async (url, data) => {
    const { cancelToken, ...payload } = data || {};
    const response = await api().delete(url, {
        params: payload,
        cancelToken: cancelToken?.token,
    });
    return response;
};
