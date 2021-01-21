import axios from 'axios'

export function getInfo() {
    return axios.get('https://api.hbdm.com/api/v1/contract_contract_info');
}

