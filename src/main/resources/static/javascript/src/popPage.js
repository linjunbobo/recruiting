var _openPage;
var PopPageWarp = React.createClass({
    componentDidMount: function () {
        _openPage = this.openPage;
    },
    openPage: function (type, data, fun) {
        this.refs[type].openPage(data, fun);
    },
    render: function () {
        return (
            <div className="pop_page_warp">
                <UserPopPage ref="user_pop_page"/>
                <NewJobPopPage ref="new_job_pop"/>
            </div>
        )
    }
});

var UserPopPage = React.createClass({
    openPage: function (data, fun) {
        var that = this;
        if (fun)
            this.refresh = fun;
        this.data = data
        if (data.userId) {//具体报修
            this.refs.user_pop_username.setVal(data.phone)
            this.refs.user_pop_password.setVal(data.password)
            this.refs.user_pop_type.setVal(data.type - 1)
        } else {//模糊报修（新建）
            this.refs.user_pop_username.setVal('')
            this.refs.user_pop_password.setVal('')
            this.refs.user_pop_type.setVal('')
        }


        var that = this;
        this.layIndex = _openPageFun("#user_pop_page", ["450px", "409px"], "编辑用户", function () {
            that.closePage();
        });
    },
    closePage: function () {
        layer.close(this.layIndex);
    },
    sureBtn: function () {
        var that = this
        if (this.data.userId) {//具体
            var data = {
                userId: this.data.userId,
                password: this.refs.user_pop_password.getVal(),
                phone:  this.refs.user_pop_username.getVal(),
                type: parseInt(this.refs.user_pop_type.getVal()) + 1,
            }
            if (!data.password || !data.phone || (!data.type && data.type !== 0)) {
                layer.msg('请填写必要信息', { time: 2000 })
                return
            }
            layer.confirm("确认修改信息?", function (index) {
                layer.close(index);
                var layLoad = _load()
                ajax3('PUT','user/updateUser', data, true, function (a) {
                    _handAjax(a, "修改失败，请重新尝试", layLoad, function () {
                        layer.close(that.layIndex);
                        layer.msg("修改成功", { time: 2000 });
                        that.refresh && that.refresh();
                    })
                })
            })
        } else {//新建
            var data = {
                password: this.refs.user_pop_password.getVal(),
                phone:  this.refs.user_pop_username.getVal(),
                type: parseInt(this.refs.user_pop_type.getVal()) + 1,
            }
            if (!data.password || !data.phone || (!data.type && data.type !== 0)) {
                layer.msg('请填写必要信息', { time: 2000 })
                return
            }
            layer.confirm("确认新建用户?", function (index) {
                layer.close(index);
                var layLoad = _load()
                ajaxPost('user/addUser', data, true, function (a) {
                    _handAjax(a, "新建失败，请重新尝试", layLoad, function () {
                        layer.close(that.layIndex);
                        layer.msg("新建成功", { time: 2000 });
                        that.refresh && that.refresh();
                    })
                })
            })
        }
    },
    seleType:function(){

    },
    render: function () {
        return (
            <div className="pop_page" id="user_pop_page" style={{ width: 450, height: 361 }}>
                <div className="pop_page_content clear" style={{ paddingTop: 34 }}>
                    <PopPageInput name="账号:" ref="user_pop_username" isNeed="true" width="215"/>
                    <PopPageInput name="密码:" ref="user_pop_password" isNeed="true" width="215" />
                    <div className={"pop_page_attr left"}>
                        <div className="pop_page_attr_name left">
                            <span className="pop_page_attr_necessary">*</span>
                            用户身份:
                        </div>
                        <Selepicker ref="user_pop_type" attr="" handSele={this.seleType} data={['求职者','职位提供者','系统管理员']} width="215px" height="30px" />
                    </div>
                </div>
                <div className="pop_page_bottom clear">
                    <div className="handle_btn pop_page_btn_s" onClick={this.sureBtn}>保存</div>
                    <div className="handle_btn pop_page_btn_q" onClick={this.closePage}>取消</div>
                </div>
            </div>
        )
    }
});
var NewJobPopPage = React.createClass({
    openPage: function (data, fun) {
        var that = this;
        if (fun)
            this.refresh = fun;
        this.data = data
        // if (data.assetId) {//具体报修
        //     this.refs.repair_asset_name.setVal(data.assetName)
        // } else {//模糊报修（新建）
        //     this.refs.repair_asset_name.setVal('')
        // }
        // this.refs.repair_asset_location.setVal('')
        // this.refs.repair_asset_phone.setVal('')
        // $("#repair_asset_txt").val('')
        this.refs.new_job_name.setVal('')
        this.refs.new_job_department.setVal('')
        this.refs.new_job_money.setVal('')
        this.refs.new_job_location.setVal('')
        this.refs.new_job_year.setVal('')
        this.refs.new_job_edu.setVal('')
        $('#new_job_task').val('')
        $('#new_job_demand').val('')

        var that = this;
        this.layIndex = _openPageFun("#new_job_pop_page", ["480px", "719px"], "新建职位", function () {
            that.closePage();
        });
    },
    closePage: function () {
        layer.close(this.layIndex);
    },
    sureBtn: function () {
        var that = this
        if (this.data.jobInfoId) {//具体
            var data = {
                userId: this.refs.user_pop_username.getVal(),
                password: this.refs.user_pop_password.getVal(),
                phone:  this.refs.user_pop_phone.getVal(),
                type: this.refs.user_pop_type.getVal(),
            }
            if (!data.userId|| !data.password || !data.phone || !data.type) {
                layer.msg('请填写必要信息', { time: 2000 })
                return
            }
            layer.confirm("确认修改信息?", function (index) {
                layer.close(index);
                var layLoad = _load()
                ajax3('PUT','user/updateUser', data, true, function (a) {
                    _handAjax(a, "修改失败，请重新尝试", layLoad, function () {
                        layer.close(that.layIndex);
                        layer.msg("修改成功", { time: 2000 });
                        that.refresh && that.refresh();
                    })
                })
            })
        } else {//新建
            var data = {
                position: this.refs.new_job_name.getVal(),
                company: this.refs.new_job_department.getVal(),
                salary:  this.refs.new_job_money.getVal(),
                place: this.refs.new_job_location.getVal(),
                workAge: this.refs.new_job_year.getVal(),
                education: this.refs.new_job_edu.getVal(),
                responsibility: $('#new_job_task').val(),
                requirement: $('#new_job_demand').val(),
            }
            if (!data.position|| !data.company || !data.salary || !data.place || !data.workAge || !data.education || !data.responsibility || !data.requirement) {
                layer.msg('请填写必要信息', { time: 2000 })
                return
            }
            layer.confirm("确认新建岗位?", function (index) {
                layer.close(index);
                var layLoad = _load()
                ajaxPost('jobInfo/addJobInfo', data, true, function (a) {
                    _handAjax(a, "新建失败，请重新尝试", layLoad, function () {
                        layer.close(that.layIndex);
                        layer.msg("新建成功", { time: 2000 });
                        that.refresh && that.refresh();
                    })
                })
            })
        }
    },
    render: function () {
        return (
            <div className="pop_page" id="new_job_pop_page" style={{ width: 480, height: 671 }}>
                <div className="pop_page_content clear" style={{ paddingTop: 34 }}>
                    <PopPageInput name="职位名称:" ref="new_job_name" isNeed="true"/>
                    <PopPageInput name="所属部门:" ref="new_job_department" isNeed="true" />
                    <PopPageInput name="薪资范围:" ref="new_job_money" isNeed="true" />
                    <PopPageInput name="工作地点:" ref="new_job_location" isNeed="true"/>
                    <PopPageInput name="工作年限:" ref="new_job_year" isNeed="true" />
                    <PopPageInput name="学历要求:" ref="new_job_edu" isNeed="true" />
                    <div className="pop_page_attr left" style={{marginTop:'15px'}}>
                        <div className="pop_page_attr_name left">
                            <span className="pop_page_attr_necessary">*</span>
                            岗位职责:
                        </div>
                        <textarea className="left" maxLength="120" id="new_job_task"></textarea>
                    </div>
                    <div className="pop_page_attr left">
                        <div className="pop_page_attr_name left">
                            <span className="pop_page_attr_necessary">*</span>
                            任职要求:
                        </div>
                        <textarea className="left" maxLength="120" id="new_job_demand"></textarea>
                    </div>
                </div>
                <div className="pop_page_bottom clear">
                    <div className="handle_btn pop_page_btn_s" onClick={this.sureBtn}>新建</div>
                    <div className="handle_btn pop_page_btn_q" onClick={this.closePage}>取消</div>
                </div>
            </div>
        )
    }
});
var PopPageInput = React.createClass({
    setVal: function (t) {
        this.refs.input.value = t;
    },
    getVal: function (errorText) {
        var value = this.refs.input.value;
        if (_isRightText(value)) {
            return value;
        }
        if (errorText) {
            layer.msg(errorText + "不能为空", { time: 2000 });
        }
        return "";
    },
    clearVal: function () {
        this.refs.input.value = "";
    },
    render: function () {
        var cla = this.props.className || "";
        var isNeed = this.props.isNeed || false//是否必填
        return (
            <div className={"pop_page_attr left " + cla}>
                <div className="pop_page_attr_name left">
                    <span className="pop_page_attr_necessary" style={{ display: isNeed ? 'inline' : 'none' }}>*</span>
                    {this.props.name}
                </div>
                <input type="text" ref="input" className="left" disabled={this.props.disabled || false} maxLength={this.props.maxLength || 30} placeholder={this.props.placeholder || ''} style={{width:this.props.width || '255px'}}/>
            </div>
        )
    }
});
//详细信息
var PopPageDetail = React.createClass({
    render: function () {
        return (
            <div className={"pop_page_attr left " + this.props.className || ''} style={{ marginBottom: '10px' }}>
                <div className="pop_page_attr_name left">{this.props.name + ':'}</div>
                {/* <input type="text" ref="input" className="left" maxLength={this.props.maxLength || 30}/> */}
                <div className="pop_page_attr_value left oneline" title={this.props.value}>{this.props.value || ''}</div>
            </div>)
    }
});
