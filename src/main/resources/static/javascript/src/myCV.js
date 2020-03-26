var _openTabPage = parent._openTabPage;
documentReady(function() {
    var UploadImgMixin = {
        maxSize: '10mb',
        mimeTypes: [{ title: '图片文件', extensions: 'jpg,jpeg,png,tiff,jfif' }],
        initUpload: function (id, dropId) {
            var that = this;
            id = id || that.props.id;
            var uploader = new plupload.Uploader({
                runtimes: 'html5,flash',
                browse_button: id,
                drop_element: dropId || (id + "_drop"),
                // chunk_size: '4mb', //大文件分段
                max_file_size: that.maxSize,
                url: _address + 'file/upload',
                max_retries: 0,            //当发生plupload.HTTP_E重试次数
                multi_selection: false,    //不允许选择多个文件
                mutipart: true,
                chunk_size: '4mb',
                flash_swf_url: 'javascript/plupload/Moxie.swf',
                silverlight_xap_url: 'javascript/plupload/Moxie.xap',
                filters: {
                    // prevent_duplicates: true,  //不允许上传重复文件
                    mime_types: that.mimeTypes
                },
                preinit: {
                    Init: function (up, info) {
                        if (!(up.runtime == "flash" || up.runtime == "html5")) {
                            layer.msg('请安装flash插件', { time: 2000 });
                        }
                    },
                    UploadFile: function (up, file) {
                        up.settings.multipart_params = { schoolId: that.schoolId };
                    }
                },
                init: {
                    Refresh: function (up) { },
                    BeforeUpload: function (up, file) { },
                    StateChanged: function (up) { },
                    QueueChanged: function (up) { },
                    UploadProgress: function (up, file) {
                        if (that.progressUpload) {
                            that.progressUpload(up, file);
                        }
                    },
                    FilesAdded: function (up, files) {
                        that.loadIndex = layer.load(1);
                        up.start();
                    },
                    FilesRemoved: function (up, files) {
    
                    },
                    FileUploaded: function (up, file, info) {//文件上传结束之后返回
                        layer.close(that.loadIndex);
                        // console.log(info);
                        that.complateUpload(info);
                    },
                    UploadComplete: function (up, file) {
    
                    },
                    ChunkUploaded: function (up, file, info) {
    
                    },
                    Error: function (up, args) {
                        layer.close(that.loadIndex);
                        switch (args.code) {
                            case -100: layer.msg('一般性错误', { time: 2000 }); break;
                            case -200: layer.msg('网络错误', { time: 2000 }); break;
                            case -300: layer.msg('文件不可读', { time: 2000 }); break;
                            case -400: layer.msg('安全性太高，读取失败', { time: 2000 }); break;
                            case -500: layer.msg('上传模块初始化出错', { time: 2000 }); break;
                            case -600: layer.msg('文件太大', { time: 2000 }); break;
                            case -601: layer.msg('文件类型不支持', { time: 2000 }); break;
                            case -602: layer.msg('文件有重复', { time: 2000 }); break;
                            case -700: layer.msg('文件格式错误', { time: 2000 }); break;
                            case -701: layer.msg('内存发生错误', { time: 2000 }); break;
                            case -702: layer.msg('错误:  文件太大，超过了限定', { time: 2000 }); break;
                        }
                    }
                }
            });
            uploader.init();
            this.uploader = uploader;
        },
        uploadLogo: function (id, url, icon) {
            if (!this.uploader) {
                this.initUpload(id, id);
            }
        },
        complateUpload: function (info) {
            if (info.status == 200) {
                if (typeof (info.response) == "string") {
                    var response = JSON.parse(info.response);
                    this.uploadSucCallback(response.data)
                } else {
                    layer.msg("图片上传失败", { time: 2000 });
                    return;
                }
            } else {
                layer.msg("图片上传失败", { time: 2000 });
                return;
            }
        },
        progressUpload: function (up, file) {
            var files = up.files;
            var crFiles = files[files.length - 1];
            if (crFiles.status == 5) {
                text = "图片上传成功";
            } else {
                text = "图片正在上传中，已上传 " + crFiles.percent + "%";
            }
            // this.setState({ msg: text });
        },
    };
    // 包裹
    var MainContent = React.createClass({
        getInitialState:function(){
            return {
                choIndex : 0
            }
        },
        choTap:function(choIndex){
            this.setState({choIndex:choIndex})
        },
        toCV:function(){
            this.choTap(0)
            this.refs.show_mycv.loadUserCV()
        },
        toEditCV:function(){
            this.choTap(1)
            this.refs.edit_mycv.loadUserCV()
        },
        render: function() {
            var choIndex = this.state.choIndex
            var style = [{display:'none'},{display:'none'}]
            style[choIndex].display = 'block'
            return (
                <div id="curr_content" className="clear">
                    <MyCV ref="show_mycv" style={style[0]} handleCV={this.toEditCV}/>
                    <MyCVEdit ref="edit_mycv" style={style[1]} handleEdit={this.toCV}/>
                </div>
            )
        }
    });

    //个人简历界面
    var MyCV = React.createClass({
        getInitialState:function(){
            return {
                data : {
                    name : '',
                    birthday : '',
                    phone : '',
                    email : '',
                    evaluation : '',
                    honor:'',
                    resumeeducationList:[
                        {
                            school:'',
                            profession:'',
                            time:'',
                        }
                    ],
                    resumeworkList : [
                        {
                            company : '',
                            work : '',
                            position : '',
                            time : '',
                        }
                    ],
                }
            }
        },
        componentDidMount:function(){
            this.loadUserCV()
        },
        loadUserCV:function(){
            var that = this, loadIndex = layer.load(1);
            ajaxGet("resume/getResumeByUserId", {userId:_userID}, true, function(a) {
                layer.close(loadIndex);
                if (a.status == 0) {
                    if(a.data){
                        var data = a.data
                        data.resumeeducationList = data.resumeeducationList || [{
                            school:'',
                            profession:'',
                            time:'',
                        }]
                        data.resumeworkList = data.resumeworkList || []
                        that.setState({
                            data : data
                        })
                    }
                } else if(a.status == 1) {
                    that.props.handleCV()
                    layer.msg('无简历信息,请填写', { time: 2000 });
                } else{
                    layer.msg(a.msg, { time: 2000 });
                }
            })
        },
        editCV:function(){
            this.props.handleCV()
        },
        render:function(){
            var that = this
            var data = this.state.data
            var resumeeducationList = data.resumeeducationList || [{
                school:'',
                profession:'',
                time:'',
            }]
            var resumeworkList = data.resumeworkList || []
            var image_url = data.picture || ''
            var image_style = {backgroundImage:'url("'+(_address.substr(0,_address.length-1)+image_url)+'")'}
            return (
                <div className="my_vs" style={this.props.style}>
                    {/* 头部信息 */}
                    <div className="my_cv_h">
                        <div className="my_cv_h_img" onClick={this.uploadUserImg} id="uploadUserImg" style={image_style}></div>
                        <div className="my_cv_h_t">
                            <div className="my_cv_h_t_name">{data.name}</div>
                            <div className="my_cv_h_t_age">{data.birth && data.birth.substr(0,10)}</div>
                        </div>
                        <div className="my_cv_h_m">{data.phone}</div>
                        <div className="my_cv_h_b">{data.email}</div>
                    </div>
                    {/* 教育背景 */}
                    <div>
                        <div className="my_cv_block">
                            <div className="my_cv_b_title">教育背景</div>
                            {
                                resumeeducationList.map(function(o, i){
                                    return <MyCVInfoEDUItem data={o} index={i} key={'my_cv_edu_item'+i}/>
                                })
                            }
                        </div>
                        
                    </div>
                    {/* 工作经历 */}
                    <div>
                        <div className="my_cv_block">
                            <div className="my_cv_b_title">工作经历</div>
                            {
                                resumeworkList.map(function(o, i){
                                    return <MyCVInfoJobItem data={o} index={i} key={'my_cv_work_item'+i}/>
                                })
                            }
                        </div>
                    </div>
                    {/* 所获荣誉 */}
                    <div>
                        <div className="my_cv_block">
                            <div className="my_cv_b_title">所获荣誉</div>
                            <div className="my_cv_b_item my_cv_b_reward_item">
                                {data.honor}
                            </div>
                        </div>
                    </div>
                    {/* 自我评价 */}
                    <div>
                        <div className="my_cv_block">
                            <div className="my_cv_b_title">自我评价</div>
                            <div className="my_cv_b_item clear">
                                <div className="my_cv_b_evaluate">{data.evaluation}</div>
                            </div>
                        </div>
                    </div>
                    {/* 修改按钮 */}
                    <div className="my_cv_handle">
                        <div className="line_handle_btn detail" onClick={this.editCV}>编辑</div>
                    </div>
                </div>
            )
        }
    })
    var MyCVInfoEDUItem = React.createClass({
        render:function(){
            var data = this.props.data
            // var time = data.startTime.substr+'~'+data.endTime
            return (
                <div className="my_cv_b_item my_cv_b_edu">
                    <MyCVInfoDetail attr="毕业时间" value={data.time || ''}/>
                    <MyCVInfoDetail attr="毕业院校" value={data.school || ''}/>
                    <MyCVInfoDetail attr="修习专业" value={data.profession || ''}/>
                </div>
            )
        }
    })
    var MyCVInfoJobItem = React.createClass({
        render:function(){
            var data = this.props.data
            return (
                <div className="my_cv_b_item my_cv_b_job">
                    <div className="my_cv_b_i_company">
                        <div className="my_cv_b_i_c_name">{data.company || ''}</div>
                        <div className="my_cv_b_i_c_time">{data.time || ''}</div>
                    </div>
                    <MyCVInfoDetail attr="职位" value={data.position}/>
                    <div className="cv_info_item clear">
                        <div className="cv_info_item_attr left">负责工作</div>
                        <div className="cv_info_item_value left">{data.work || ''}</div>
                    </div>
                </div>
            )
        }
    })
    var MyCVInfoDetail = React.createClass({
        render:function(){
            return (
                <div className="cv_info_item clear">
                    <div className="cv_info_item_attr left">{this.props.attr}</div>
                    <div className="cv_info_item_value left">{this.props.value}</div>
                </div>
            )
        }
    })
    var MyCVInfoInput = React.createClass({
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
        render:function(){
            return (
                <div className="cv_info_item clear">
                    <div className="cv_info_item_attr left">{this.props.attr}</div>
                    <input type="text" maxLength="10" ref="input" className="active_input left" disabled={this.props.disabled || false} maxLength={this.props.maxLength || 30} placeholder={this.props.placeholder || ''} style={{width:this.props.width || '215px'}}/>
                </div>
            )
        }
    })
    var MyCVInfoInputs = React.createClass({
        setVal1: function (t) {
            this.refs.input1.value = t;
        },
        setVal2: function (t) {
            this.refs.input2.value = t;
        },
        getVal1: function (errorText) {
            var value = this.refs.input1.value;
            if (_isRightText(value)) {
                return value;
            }
            if (errorText) {
                layer.msg(errorText + "不能为空", { time: 2000 });
            }
            return "";
        },
        getVal2: function (errorText) {
            var value = this.refs.input2.value;
            if (_isRightText(value)) {
                return value;
            }
            if (errorText) {
                layer.msg(errorText + "不能为空", { time: 2000 });
            }
            return "";
        },
        clearVal1: function () {
            this.refs.input1.value = "";
        },
        clearVal2: function () {
            this.refs.input2.value = "";
        },
        render:function(){
            return (
                <div className="cv_info_item clear">
                    <div className="left">
                        <div className="left" style={{width:'100px'}}>{this.props.attr1}</div>
                        <input type="text" ref="input1" maxLength="20" className="active_input left" disabled={this.props.disabled || false} maxLength={this.props.maxLength || 30} placeholder={this.props.placeholder || ''} style={{width:this.props.width || '215px'}}/>
                    </div>
                    <div className="left" style={{marginLeft:'30px'}}>
                        <div className="left" style={{width:'100px'}}>{this.props.attr2}</div>
                        <input type="text" ref="input2" maxLength="20" className="active_input left" disabled={this.props.disabled || false} maxLength={this.props.maxLength || 30} placeholder={this.props.placeholder || ''} style={{width:this.props.width || '215px'}}/>
                    </div>
                </div>
            )
        }
    })
    //编辑简历页面
    var MyCVEdit = React.createClass({
        mixins:[UploadImgMixin],
        getInitialState:function(){
            return {
                data : {
                    name : '',
                    birthday : '',
                    phone : '',
                    email : '',
                    evaluation : '',
                    honor:'',
                    resumeeducationList:[
                        {
                            school:'',
                            profession:'',
                            time:'',
                        }
                    ],
                    resumeworkList : [],
                    resumeBaseInfoId : 0,
                }
            }
        },
        
        componentDidMount:function(){
            this.loadUserCV()
            this.uploadUserImg()
        },
        loadUserCV:function(){
            var that = this, loadIndex = layer.load(1);
            ajaxGet("resume/getResumeByUserId", {userId:_userID}, true, function(a) {
                layer.close(loadIndex);
                if (a.status == 0 && a.data) {
                    if(a.data){
                        var data = a.data
                        data.resumeeducationList = data.resumeeducationList || [{
                            school:'',
                            profession:'',
                            time:'',
                        }]
                        data.resumeworkList = data.resumeworkList || []
                        that.setState({
                            data : data
                        })
                        that.refs.cv_name.value = data.name
                        that.refs.cv_birthday.value = data.birth.substr(0,10)
                        that.refs.cv_phone.value = data.phone
                        that.refs.cv_email.value = data.email
                        $('#cv_edit_info_reward').val(data.honor)
                        $('#cv_edit_info_evaluate').val(data.evaluation)
                        var edus = data.resumeeducationList
                        var works = data.resumeworkList
                        for(var i=0; i<edus.length; i++){
                            that.refs['edu_item'+i].setData(edus[i])
                        }
                        for(var i=0; i<works.length; i++){
                            that.refs['work_item'+i].setData(works[i])
                        }
                    }
                } else if(a.status == 1) {
                    layer.msg('无简历信息,请填写', { time: 2000 });
                } else {
                    layer.msg(a.msg, { time: 2000 });
                }
            })
        },
        addEdu:function(){
            var data = this.state.data
            data.resumeeducationList.push({
                endTime: "",
                school: "",
                startTime: "",
                time:'',
            })
            this.setState({
                data
            })
        },
        addWork:function(){
            var data = this.state.data
            data.resumeworkList.push({
                company: "",
                endTime: "",
                position: "",
                startTime: "",
                work: "",
                time:'',
            })
            this.setState({
                data
            })
        },
        delEDU:function(data,index){
            var data = this.state.data
            data.resumeeducationList.splice(index,1)
            this.setState({
                data
            })
        },
        delWork:function(data,index){
            var data = this.state.data
            data.resumeworkList.splice(index,1)
            this.setState({
                data
            })
        },
        saveCV:function(){
            var name = this.refs.cv_name.value
            var birthday = this.refs.cv_birthday.value
            var phone = this.refs.cv_phone.value
            var email = this.refs.cv_email.value
            var evaluation = $('#cv_edit_info_reward').val()
            var honor = $('#cv_edit_info_reward').val()
            var picture = this.state.data.picture
            var resumeeducationList = []
            var resumeworkList = []

            var educatins = this.state.data.resumeeducationList
            var works = this.state.data.resumeworkList
            console.log(educatins)
            console.log(works)
            for(var i=0; i<educatins.length; i++){
                resumeeducationList.push(this.refs['edu_item'+i].getData())
            }   

            for(var i=0; i<works.length; i++){
                resumeworkList.push(this.refs['work_item'+i].getData())
            }
            
            var data = {
                name : name,
                birth : birthday,
                phone : phone,
                email : email,
                honor : honor,
                picture:picture,
                evaluation : evaluation,
                resumeeducationList : resumeeducationList,
                resumeworkList : resumeworkList,
                resumeBaseInfoId : this.state.data.resumeBaseInfoId,
                userId:_userID
            }
            console.log(JSON.stringify(data))
            var layLoad = _load(),that=this
            if(data.resumeBaseInfoId == 0){
                ajaxPost('resume/addResume', data, true, function (a) {
                    layer.close(layLoad);
                    if (a.status == 'success') {
                        layer.msg("保存成功", { time: 2000 });
                        that.props.handleEdit()
                    } else
                        layer.msg(a.msg || "保存失败，请重新尝试", {time: 2000});
                })
            }else{
                ajaxPost('resume/updateResume', data, true, function (a) {
                    layer.close(layLoad);
                    if (a.status == 'success') {
                        layer.msg("保存成功", { time: 2000 });
                        that.props.handleEdit()
                    } else
                        layer.msg(a.msg || "保存失败，请重新尝试", {time: 2000});
                })
            }
        },  
    
        uploadUserImg: function () {
            this.uploadLogo("upload_user_img");
        },
        uploadSucCallback:function(result){
            var data = this.state.data
            data.picture =  result.src
            this.setState({data:data})
        },
        render:function(){
            var that = this
            var data = this.state.data
            var resumeeducationList = data.resumeeducationList || [{
                school:'',
                profession:'',
                time:'',
            }]
            var resumeworkList = data.resumeworkList || []
            var image_url = data.picture || ''
            var image_style = {backgroundImage:'url("'+(_address.substr(0,_address.length-1)+image_url)+'")',cursor:'pointer'}
            console.log(image_style)
            return (
                <div className="my_vs" style={this.props.style}>
                    {/* 头部信息 */}
                    <div className="my_cv_h">
                        <div className="my_cv_h_img" onClick={this.uploadUserImg} id="upload_user_img" style={image_style}></div>

                        <div className="my_cv_h_input">
                            <input type="text" ref="cv_name" maxLength="5" className="cv_header_input active_input" placeholder="姓名"/>
                        </div>
                        <div className="my_cv_h_input">
                            <input type="text" ref="cv_birthday" maxLength="10" className="cv_header_input active_input" placeholder="生日(2020-01-02)"/>
                        </div>
                        <div className="my_cv_h_input">
                            <input type="text" ref="cv_phone" maxLength="11" className="cv_header_input active_input" placeholder="电话号码"/>
                        </div>
                        <div className="my_cv_h_input">
                            <input type="text" ref="cv_email" maxLength="20" className="cv_header_input active_input" placeholder="邮箱"/>
                        </div>
                    </div>
                    {/* 教育背景 */}
                    <div>
                        <div className="my_cv_block">
                            <div className="my_cv_b_title">教育背景</div>
                            {
                                resumeeducationList.map(function(o,i){
                                    return <MyCVInfoEDUEditItem ref={'edu_item'+i} data={o} index={i} handleDel={that.delEDU} key={'my_cv_edu_edit_item'+i}/>
                                })
                            }
                            <div className="my_cv_edit_handle_add">
                                <div className="line_handle_btn" onClick={this.addEdu}>+添加教育背景</div>
                            </div>
                        </div>
                    </div>
                    {/* 工作经历 */}
                    <div>
                        <div className="my_cv_block">
                            <div className="my_cv_b_title">工作经历</div>
                            {
                                resumeworkList.map(function(o,i){
                                    return <MyCVInfoJobEditItem ref={'work_item'+i} data={o} index={i} handleDel={that.delWork} key={'my_cv_work_edit_item'+i}/>
                                })
                            }
                            <div className="my_cv_edit_handle_add">
                                <div className="line_handle_btn" onClick={this.addWork}>+添加工作经历</div>
                            </div>
                        </div>
                    </div>
                    {/* 所获荣誉 */}
                    <div>
                        <div className="my_cv_block">
                            <div className="my_cv_b_title">所获荣誉</div>
                            <div className="my_cv_b_item clear">
                                <textarea maxLength="300" className="cv_info_evaluate_area" id="cv_edit_info_reward"></textarea>
                            </div>
                        </div>
                    </div>
                    {/* 自我评价 */}
                    <div>
                        <div className="my_cv_block">
                            <div className="my_cv_b_title">自我评价</div>
                            <div className="my_cv_b_item clear">
                                <textarea maxLength="300" className="cv_info_evaluate_area" id="cv_edit_info_evaluate"></textarea>
                            </div>
                        </div>
                    </div>
                    {/* 修改按钮 */}
                    <div className="my_cv_handle">
                        <div className="line_handle_btn detail" onClick={this.saveCV}>保存</div>
                    </div>
                </div>
            )
        }
    })
    var MyCVInfoEDUEditItem = React.createClass({
        delEDU:function(){
            this.props.handleDel(this.props.data,this.props.index)
        },
        getData:function(){
            var edu_time = this.refs.edu_time.getVal()
            var edu_school = this.refs.edu_school.getVal()
            var edu_major = this.refs.edu_major.getVal()
            var data = this.props.data
            data.profession = edu_major
            data.school = edu_school
            data.startTime = ''
            data.endTime = ''
            data.time = edu_time
            return data
        },
        setData:function(){
            var data = this.props.data
            this.refs.edu_time.setVal(data.time || '')
            this.refs.edu_school.setVal(data.school || '')
            this.refs.edu_major.setVal(data.profession || '')
        },
        render:function(){
            var data = this.props.data
            return (
                <div className="my_cv_b_item my_cv_b_edu">
                    <MyCVInfoInput ref="edu_time" attr="毕业时间" value={data.time || ''} />
                    <MyCVInfoInput ref="edu_school" attr="毕业院校" value={data.school || ''} />
                    <MyCVInfoInput ref="edu_major" attr="修习专业" value={data.profession || ''} />
                    {
                        this.props.index == 0 ? null : (
                            <div className="my_cv_b_item_del">
                                <div className="line_handle_btn detail" onClick={this.delEDU}>删除</div>
                            </div>
                        )
                    }
                </div>
            )
        }
    })
    var MyCVInfoJobEditItem = React.createClass({
        delWork:function(){
            this.props.handleDel(this.props.data,this.props.index)
        },
        getData:function(){
            var job_place = this.refs.job_place_time.getVal1()
            var job_time = this.refs.job_place_time.getVal2()
            var job_name = this.refs.job_name.getVal()
            var job_content = $('#job_content').val()
            var data = this.props.data
            data.company = job_name
            data.work = job_content
            data.position = job_place
            data.startTime = ''
            data.endTime = ''
            data.time = job_time
            return data
        },
        setData:function(){
            var data = this.props.data
            this.refs.job_place_time.setVal1(data.company || '')
            this.refs.job_place_time.setVal2(data.time || '')
            this.refs.job_name.setVal(data.position || '')
            $('#job_content').val(data.work)
        },
        render:function(){
            return (
                <div className="my_cv_b_item my_cv_b_job">
                    <MyCVInfoInputs ref="job_place_time" attr1="工作地点：" attr2="工作时间："/>
                    <MyCVInfoInput ref="job_name" attr="职位" value="产品实习生" />
                    <div className="cv_info_item clear">
                        <div className="cv_info_item_attr left">负责工作</div>
                        <textarea className="cv_info_work_area left" maxLength="80" id="job_content"></textarea>
                    </div>
                    {
                        this.props.index == 0 ? null : (
                            <div className="my_cv_b_item_del">
                                <div className="line_handle_btn detail" onClick={this.delWork}>删除</div>
                            </div>
                        )
                    }
                </div>
            )
        }
    })
    ReactDOM.render(<MainContent />, document.getElementById("curr_content"));
});