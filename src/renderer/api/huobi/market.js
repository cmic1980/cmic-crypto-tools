import axios from 'axios'
export default {
    getDetail(type) {
        return axios.get('https://api.huobi.pro/market/detail/merged?symbol=' + type);
    }
}