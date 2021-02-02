import axios from 'axios'
export default {
    getDetail(type) {
        return axios.get('https://api.huobi.pro/market/detail/merged?symbol=' + type);
    },
    getKline(period, size, type) {
        const url = v.sprintf('https://api.huobi.pro/market/history/kline?period=%s&size=%s&symbol=%s', period, size, type);
        return axios.get(url);
    }
}