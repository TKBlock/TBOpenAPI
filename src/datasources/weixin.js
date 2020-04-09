const { RESTDataSource } = require('apollo-datasource-rest');

class WeixinAPI extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = 'https://api.weixin.qq.com/';
        this.secretKey = ''; //input secret key
    }

    async registerUser({appid, code}) {
        const res = await this.get('sns/oauth2/access_token', {
            appid,
            secret: this.secretKey,
            code,
            grant_type: 'authorization_code'
        })


        console.log(JSON.parse(res).access_token);
        return JSON.parse(res);
    }



}

module.exports = WeixinAPI;