var _openTabPage = parent._openTabPage;
documentReady(function () {
    var MainContent = React.createClass({
        logSub: function () {
            var username = this.refs.login_username.getVal()
            var password = this.refs.login_password.getVal()
            var respassword = this.refs.login_repassword.getVal()
            if (!username && !password) {
                layer.msg("用户名或密码不能为空", { time: 2000 });
                return
            }
            if(password !== respassword){
                layer.msg("两次密码输入不一致", { time: 2000 });
                return
            }
            var data = {
                phone: username,
                password: password,
                type : 1,
            }
            var loadIndex = _load()
            var that = this
            ajaxPost("/user/addUser", data, true, function (a) {
                if (loadIndex > -1) layer.close(loadIndex);
                if (a.status == 'success') {
                    layer.msg('注册成功',{time:2000})
                    window.location.href = './login.html'
                } else {
                    if (a.msg) {
                        layer.msg(a.msg, { time: 2000 });
                    } else {
                        layer.msg("登录失败失败，请重新尝试", { time: 2000 });
                    }
                }
            })
        },

        toLogin:function(){
            window.location.href='./login.html'
        },
        render: function () {
            return (
                <div className="login_warp" id="curr_content">
                    <div className="login_header">
                        快聘招聘系统
                       </div>
                    <div className="login_box_warp">
                        <div className="login_box registe_box">
                            <div className="login_title">快聘系统</div>
                            <div className="login_form clear">
                                <PopPageInput name="用户名:" ref="login_username" />
                                <PopPageInput type="password" name="密码:" ref="login_password"/>
                                <PopPageInput type="password" name="确认密码:" ref="login_repassword" />
                            </div>
                            <div className="login_sub">
                                <div className="login_btn" onClick={this.logSub}>注册</div>
                            </div>
                            <div className="login_reg" onClick={this.toLogin}>登陆</div>
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
        render: function () {
            return (
                <div className="pop_page_attr left">
                    <div className="pop_page_attr_name left">{this.props.name}</div>
                    <input type={this.props.type || 'text'} ref="input" className="left" style={{ width: this.props.width || '200px' }} />
                </div>
            )
        }
    })
    ReactDOM.render(<MainContent />, document.getElementById("curr_content"));
});