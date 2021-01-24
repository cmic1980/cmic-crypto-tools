import axios from 'axios'

export default {
    getInfo() {
        return axios.get('https://api.hbdm.com/api/v1/contract_contract_info');
    },

    getDetail(id) {
        return axios.get('https://api.hbdm.com/market/detail/merged?symbol=' + id);
    }
}