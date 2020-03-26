var _openTabPage = parent._openTabPage;
documentReady(function () {
    var MainContent = React.createClass({
        logSub: function () {
            var username = this.refs.login_username.getVal()
            var password = this.refs.login_password.getVal()
            if (!username && !password) {
                layer.msg("用户名或密码不能为空", { time: 2000 });
                return
            }
            // var data = new FormData()
            // data.append('username',username)
            // data.append('password',password)
            var data = {
                phone: username,
                password: password
            }
            var loadIndex = layer.load(1)
            var that = this
            ajaxLogin("user/login", data, true, function (a) {
                if (loadIndex > -1) layer.close(loadIndex);
                if (a.status == 0) {
                    if(a.data.status == 'success'){
                        // console.log('userLogin',a)
                        // ajaxGet("user/getLoginInfo", {}, true, function (b) {
                        //     console.log('userInfo',b)
                        //     // if (loadIndex > -1) layer.close(loadIndex);
                        //     // if (b.status == 0) {
                        //     //     _setCookie("userID", b.data.userId);
                        //     //     return
                        //     //     window.location.href = '../../index.html'
                        //     // } else {
                        //     //     if (b.msg) {
                        //     //         layer.msg(b.msg, { time: 2000 });
                        //     //     } else {
                        //     //         layer.msg("登录失败失败，请重新尝试", { time: 2000 });
                        //     //     }
                        //     // }
                        // })
                        _setCookie("userID", a.data.userId);
                        _setCookie("userType", a.data.type);
                        _setCookie("userName", a.data.userName);
                        _userID = a.data.userId
                        _userType = a.data.type
                        layer.msg('登陆成功', { time: 2000 });
                        window.location.href = '../../index.html'
                    }else{
                        layer.msg(a.data.msg, { time: 2000 });
                    }
                } else {
                    if (a.msg) {
                        layer.msg(a.msg, { time: 2000 });
                    } else {
                        layer.msg("登录失败失败，请重新尝试", { time: 2000 });
                    }
                }
            })
        },
        toReg:function(){
            window.location.href='./registe.html'
        },
        render: function () {
            return (
                <div className="login_warp" id="curr_content">
                    <div className="login_header">
                        快聘招聘系统
                       </div>
                    <div className="login_box_warp">
                        <div className="login_box">
                            <div className="login_title">快聘系统</div>
                            <div className="login_form clear">
                                <PopPageInput name="用户名:" ref="login_username" enterLogin={this.logSub} />
                                <PopPageInput type="password" name="密码:" ref="login_password" enterLogin={this.logSub} />
                            </div>
                            <div className="login_sub">
                                <div className="login_btn" onClick={this.logSub}>登录</div>
                            </div>
                            <div className="login_reg" onClick={this.toReg}>注册</div>
                        </div>
                    </div>
                    <div className="login_footer">
                        吴坚斌 版权所有
                       </div>
                </div>
            )
        }
    })

    var PopPageInput = React.createClass({
        setVal: function (t) {
            this.refs.input.value = t;
        },
        getVal: function () {
            return this.refs.input.value;
        },
        clearVal: function () {
            this.refs.input.value = "";
        },
        inputKeydown: function (e) {
            var code = e.keyCode;
            if (code == 13) {
                this.props.enterLogin && this.props.enterLogin()
            }
        },
        render: function () {
            return (
                <div className="pop_page_attr left">
                    <div className="pop_page_attr_name left">{this.props.name}</div>
                    <input type={this.props.type || 'text'} ref="input" className="left" onKeyDown={this.inputKeydown} style={{ width: this.props.width || '200px' }} />
                </div>
            )
        }
    })
    ReactDOM.render(<MainContent />, document.getElementById("curr_content"));
});