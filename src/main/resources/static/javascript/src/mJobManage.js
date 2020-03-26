var _openTabPage = parent._openTabPage;
documentReady(function() {
    var handPageMixin = {
        pageIndex : 1,
        pageSize : 15,
        pageCount : 0,
        searchVal : "",
        handlePage:function(i){
            this.pageIndex = i
            this.getAllData()
        },
        handleSearch:function(val){
            this.searchVal = val
            this.getAllData()
        },
        getAllData: function() {
            var that = this, loadIndex = layer.load(1);
            var data = { 
                userId: _userID, 
                type: this.type, 
                page: this.pageIndex, 
                limit: this.pageSize
            }
            if(this.searchVal && this.searchVal !== "") data.search = this.searchVal
            ajaxGet("jobInfo/getAllJobinfo", data, true, function(a) {
                layer.close(loadIndex);
                if (a.status == 0) {
                    var allData = a.data.data;
                    var noContent = (allData.length > 0) ? "" : " no_content";
                    if (that.pageIndex > 1 && noContent) {
                        that.pageIndex--;
                        that.getAllData();
                    } else {
                        // if (!noTop) that.scrollEle.mCustomScrollbar("scrollTo", "top");
                        that.setState({ allData: allData, noContent: noContent });
                    }
                } else {
                    layer.msg(a.msg, { time: 2000 });
                    that.setState({ allData: [], noContent: " no_content" });
                }
            })
        },
        
    }
    // 包裹
    var MainContent = React.createClass({
        getInitialState:function(){
            return {
                choIndex : 0,
                data : {
                    company : '',
                    place  :'',
                    position : '',
                    requirement  :'',
                    responsibility : '',
                    salary  :'',
                    workAge  : '',
                },
                curJobInfoId:null
            }
        },
        choTap:function(choIndex){
            this.setState({choIndex:choIndex})
        },
        showHomeList:function(){
            this.choTap(0)
            this.refs.job_list.getAllData()
        },
        showHomeDetail:function(data,index){
            if(data.jobInfoId){
                // console.log(data)
                var that = this
                this.setState({
                    data : data,
                    curJobInfoId : data.jobInfoId
                })
                this.refs.job_detail.getJobDetail(data.jobInfoId,function(){
                    that.choTap(1)
                })
            }else[
                layer.msg('获取详细信息失败',{time:2000})
            ]
        },
        showApplyDetail:function(data,index){
            this.choTap(2)
            this.refs.my_cv.loadUserCV(data.resumeBaseInfoId)
        },
        cvToJobDetail:function(){
            this.showHomeDetail(this.state.data)
        },
        render: function() {
            var choIndex = this.state.choIndex
            var style = [{display:'none'},{display:'none'},{display:'none'}]
            style[choIndex].display = 'block'
            return (
                <div id="curr_content" className="clear">
                    <JobList ref="job_list" style={style[0]} handleDetail={this.showHomeDetail}/>
                    <JobDetail ref="job_detail" style={style[1]} data={this.state.data} handleBack={this.showHomeList} handleApplyDetail={this.showApplyDetail}/>
                    <MyCV ref="my_cv" style={style[2]} handleBack={this.cvToJobDetail}/>
                </div>
            )
        }
    });

    //首页岗位列表
    var JobList = React.createClass({
        mixins:[handPageMixin],
        getInitialState : function(){
            return {
                allData : [],
                noContent : '',
            }
        },
        componentDidMount: function() {
            this.getAllData()
        },
        showDetail:function(data,index){
            this.props.handleDetail(data,index)
        },
        newJob:function(){
            _openPage('new_job_pop',{},this.getAllData)
        },
        render : function(){
            var style = this.props.style
            var that = this
            return (
                <div className="home_list" style={style}>
                    <div className="my_msg_search">
                        {/* <SearchInput className="my_msg_s_box" placeholder="请输入岗位名称" handle={this.handleSearch}/> */}
                        <div className="line_handle_btn detail" onClick={this.newJob}>新建职位</div>
                    </div>
                    <div className="my_msg_content">
                        {
                            this.state.allData.map(function(o, i){
                                return (
                                    <JobItem data={o} index={i} handleDetail={that.showDetail} key={'job_item_'+i} refresh={that.getAllData}></JobItem>
                                )
                            })
                        }
                    </div>
                    {/* <div className="page_warp">
                        <HandlePage ref="my_msg_page" handlePage={this.handlePage}/>
                    </div> */}
                </div>
            )
        }
    })
    //每个岗位组件
    var JobItem = React.createClass({
        showDetail:function(){
            this.props.handleDetail(this.props.data,this.props.index)
        },
        delJob:function(){
            var data = {
                jobInfoId : this.props.data.jobInfoId
            }
            var that = this
            layer.confirm("确认删除岗位?", function (index) {
                layer.close(index);
                var layLoad = _load()
                ajaxGet('jobInfo/deleteJobInfo', data, true, function (a) {
                    layer.close(layLoad);
                    if (a.status == 'success') {
                        layer.msg("删除成功", { time: 2000 });
                        that.props.refresh()
                    } else
                        layer.msg(a.msg || "删除失败，请重新尝试", {time: 2000});
                })
            })
        },
        render : function(){
            var data = this.props.data
            return (
                <div className="my_job_item">
                    <div className="m_job_h">
                        <div className="m_job_name">{data.position}</div>
                        <div className="m_job_company">{data.company}</div>
                    </div>
                    <div className="m_job_h">
                        <div className="m_job_m">{data.salary}</div>
                        <div className="m_job_m">{data.workAge}</div>
                        <div className="m_job_m">{data.education}</div>
                    </div>
                    <div className="m_job_h">
                        <div className="m_job_b">{data.place}</div>
                    </div>

                    <div className="m_job_btns">
                        <div className="line_handle_btn detail" onClick={this.delJob}>删除职位</div>
                        <div className="line_handle_btn" onClick={this.showDetail}>投递详情</div>
                    </div>  
                </div>
            )
        }
    })

    var JobDetail = React.createClass({
        getInitialState:function(){
            return {
                jobInfoId : null,
                data : {
                    company : '',
                    place  :'',
                    position : '',
                    requirement  :'',
                    responsibility : '',
                    salary  :'',
                    workAge  : '',
                },
                allData : [],
                noContent : ''
            }
        },
        // shouldComponentUpdate:function(nextProps,nextState){
        //     if(nextProps.data.jobInfoId == nextState.data.jobInfoId){
        //         return false
        //     }else{
        //         this.setState({
        //             data : nextProps.data
        //         })
        //         this.getJobDetail()
        //         return false
        //     }
        // },
        getJobDetail:function(jobInfoId,callback){
            // var data = this.state.data
            // console.log(data)
            // if(!data.jobInfoId){
            //     this.backToHomeList()
            //     return
            // }
            var that = this, loadIndex = layer.load(1);
            ajaxGet("/jobaApply/getApply", {jobInfoId:jobInfoId}, true, function(a) {
                layer.close(loadIndex);
                if (a.status == 0 || a.status == 1) {
                    var allData = a.data;
                    var noContent = (allData.length > 0) ? "" : " no_content";
                    that.setState({ allData: allData, noContent: noContent });
                    callback && callback()
                } else {
                    layer.msg('获取投递情况失败', { time: 2000 });
                    that.setState({ allData: [], noContent: " no_content" });
                    that.backToHomeList()
                }
            })
        },
        backToHomeList:function(){
            this.props.handleBack()
        },
        delJob:function(){
            var that = this
            layer.confirm("确认删除职位", function (index) {
                layer.close(index);
                var layload = _load()
                ajaxGet('jobInfo/deleteJobInfo', { jobInfoId:that.props.data.jobInfoId }, true, function(a) {
                    _handAjax(a, "删除失败", layload, function () {
                        layer.msg("删除成功", { time: 2000 });
                        that.props.handleBack();
                    })
                })
            })
        },
        handleApplyDetail:function(data,index){
            this.props.handleApplyDetail(data,index)
        },
        render:function(){
            var style = this.props.style
            var data = this.props.data
            var that = this
            return (
                <div className="home_detail" style={style}>
                    <div className="my_msg_search">
                        <div className="line_handle_btn" onClick={this.backToHomeList}>返回</div>
                    </div>
                    <div className="my_msg_content">
                        <div className="my_msg_warp">
                            <div className="my_msg_detail_h clear">
                                <div className="my_m_d_name left">{data.position || ''}</div>
                                <div className="my_m_d_money right">{data.salary || ''}</div>
                            </div>
                            <div className="my_m_d_middle">
                                <div>{data.position || ''}</div>
                                <div>{data.workAge || ''}</div>
                                <div>{data.education || ''}</div>
                            </div>
                            <div className="my_m_d_middle">
                                <div>{data.place || ''}</div>
                            </div>
                            <div className="my_m_d_sub_btn">
                                <div className="line_handle_btn my_m_d_sub" onClick={this.delJob}>删除职位</div>
                            </div>
                        </div>
                    </div>
                    <div style={{width:'100%',padding:'0 30px'}}>
                        <div className="contant_table_top clear" style={{marginTop:'20px'}}>
                            <div style={{ width: "14%" }}>姓名</div>
                            <div style={{ width: "18%" }}>学校</div>
                            <div style={{ width: "16%" }}>专业</div>
                            <div style={{ width: "16%" }}>手机号码</div>
                            <div style={{ width: "16%" }}>邮箱</div>
                            <div style={{ width: "20%" }}>操作</div>
                        </div>
                        <div>
                            <div className={this.state.noContent}>
                                {
                                    this.state.allData.map(function(o, i){
                                        return <JobSendItem data={o} index={i} key={'job_send_item'+i} refresh={that.getJobDetail} handleDetail={that.handleApplyDetail}/>
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    })
    var JobSendItem = React.createClass({
        showDetail:function(){
            this.props.handleDetail(this.props.data, this.props.index)
        },
        sendNews:function(){
            var that = this, loadIndex = layer.load(1);
            ajaxGet("jobaApply/updateJobApplyState", {jobInfoId:this.props.jobInfoId, state:3}, true, function(a) {
                layer.close(loadIndex);
                if (a.status == 'success') {
                    layer.msg('通知成功', { time: 2000 });
                    that.props.refresh()
                } else {
                    layer.msg('通知失败,请重试', { time: 2000 });
                }
            })
        },
        render:function(){
            var data = this.props.data
            return(
                <div className="content_table_line clear">
                    <div style={{ width: "14%" }} title={data.name} className="oneline">{data.name}</div>
                    <div style={{ width: "18%" }} title={data.school} className="oneline">{data.school}</div>
                    <div style={{ width: "16%" }} title={data.profession} className="oneline">{data.profession}</div>
                    <div style={{ width: "16%" }}>{data.phone}</div>
                    <div style={{ width: "16%" }}>{data.emile}</div>
                    <div style={{ width: "20%" }}>
                        <div className="line_handle_btn" onClick={this.showDetail}>查看详情</div>
                        <div className="line_handle_btn" onClick={this.sendNews}>通知</div>
                    </div>
                </div>
            )
        }
    })



    //简历详细信息
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
                    resumeeducationList:[],
                    resumeworkList : [],
                }
            }
        },
        loadUserCV:function(resumeBaseInfoId){
            var that = this, loadIndex = layer.load(1);
            ajaxGet("resume/getResumeById", {resumeBaseInfoId:resumeBaseInfoId}, true, function(a) {
                layer.close(loadIndex);
                if (a.status == 0 && a.data) {
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
                } else {
                    layer.msg(a.msg, { time: 2000 });
                }
            })
        },
        backToApply:function(){
            this.props.handleBack()
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
                        <div className="my_cv_h_img" style={image_style}></div>
                        <div className="my_cv_h_t">
                            <div className="my_cv_h_t_name">{data.name}</div>
                            <div className="my_cv_h_t_age">{data.birth}</div>
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
                        <div className="line_handle_btn detail" onClick={this.backToApply}>返回</div>
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
    ReactDOM.render(<MainContent />, document.getElementById("curr_content"));
});