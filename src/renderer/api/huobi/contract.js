import request from '@/utils/request'

export function getInfo(data) {
    return request({
        url: 'https://api.hbdm.com/api/v1/contract_contract_info',
        method: 'get'
    })
}

