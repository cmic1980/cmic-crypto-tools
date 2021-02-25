import axios from 'axios'

export default {
    getInfo() {
        return axios.get('https://api.hbdm.com/api/v1/contract_contract_info');
    },

    getDetail(type) {
        return axios.get('https://api.hbdm.com/market/detail/merged?symbol=' + type);
    },
    
    getIndex(type) {
        return axios.get('https://api.hbdm.com/api/v1/contract_index?symbol=' + type);
    },

    getKline(period, size, type) {
        const url = v.sprintf('https://api.hbdm.com/market/history/kline?period=%s&size=%s&symbol=%s', period, size, type);
        return axios.get(url);
    }

}