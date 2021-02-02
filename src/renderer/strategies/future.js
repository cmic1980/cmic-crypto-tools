import contract from '@/api/huobi/contract'

export default {
    test() {
        // 获取到期价格
        contract.getKline('60min', '2000', request.type2)
            .then(function (response) {
                debugger
                const expireList = [];
                const klineList = response.data;
                klineList.forEach(s => {

                });
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}