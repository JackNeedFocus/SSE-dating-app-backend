'use strict';

const Controller = require('egg').Controller;

class LoginController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'hi, egg';
  }

  async usernamePasswordCheck() {
    const { ctx } = this;
    const { username, password } = ctx.request.body;
    // TODO: first check the existence of the username (service.user.getUserByUsername)
    // TODO: found the user, then verify the password
    const result = await ctx.service.login.usernamePasswordCheck(username);
    if(result === null){
      ctx.status = 404
      ctx.message = 'user not existed'
    }
    else{
      if(result.password === password){
        ctx.status = 200
        ctx.message = 'login successfully'
        ctx.body = {
          _uid : result._uid,
          username : result.username,
          mobile_number :result.mobile_number,
          email : result.email
        }
        ctx.session.user_info = {
          login_status : "0",
          _uid : result._uid,
          username : result.username,
          mobile_number :result.mobile_number,
          email : result.email
        }

        const arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        let str = '';//定义空的字符串，作为最终的结果接收它
        for (let i = 0; i < 6; i++) {
          const num = Math.round(Math.random() * 9);//0-15的随机数
          str += arr[num];//通过产生的随机数来获取数组中的内容
        }
        const time = new Date();
        ctx.session.verification_code = {
          code : str,
          created_at: time
        }
        console.log(ctx.session.verification_code.code)
      }
      else {
        ctx.status = 400
        ctx.message = 'password wrong'
      }
    }
  }

  async verificationCheck(){
    const { ctx } = this;
    const { code } = ctx.request.body;
    if(ctx.session.verification_code.code === code){
      ctx.status = 200
      ctx.message = "verification successfully"
      ctx.session.user_info.login_status = "1"
    }
    else{
      ctx.status = 400
      ctx.message = "verification code wrong"
    }
  }

  async addUser() {
    const { ctx } = this;
    const { name } = ctx.request.body;
    try {
      const result = await ctx.service.home.addUser(name);
      ctx.body = {
        code: 200,
        msg: 'new user adding succeeded',
        data: result,
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: 'new user adding failed',
        data: null,
      };
    }
  }
}

module.exports = LoginController;
