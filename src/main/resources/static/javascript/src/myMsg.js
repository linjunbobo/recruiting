var _openTabPage = parent._openTabPage;
documentReady(function() {
    // 包裹
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
                        that.refs.hand_page.setData(0, a.count, that.pageIndex);
                    }
                } else {
                    layer.msg(a.msg, { time: 2000 });
                    that.setState({ allData: [], noContent: " no_content" });
                    that.refs.hand_page.setData(0, 0, 1);
                }
            })
        },
        
    }
    var MainContent = React.createClass({
        getInitialState : function(){
            return {
                choIndex : 0
            }
        },
        choTap:function(choIndex){
            this.setState({choIndex:choIndex})
        },
        showHomeList:function(){
            this.choTap(0)
            this.refs.home_list.getAllData()
        },
        showHomeDetail:function(data,index){
            this.choTap(1)
            this.refs.home_ref.loadCV(data.jobInfoId)
        },
        render: function() {
            var choIndex = this.state.choIndex
            var style = [{display:'none'},{display:'none'}]
            style[choIndex].display = 'block'
            return (
                <div id="curr_content" className="clear">
                    <HomeList ref="home_list" style={style[0]} handleDetail={this.showHomeDetail}/>
                    <HomeDetail ref="home_ref" style={style[1]} handleBack={this.showHomeList}/>
                </div>
            )
        }
    });

    //首页岗位列表
    var HomeList = React.createClass({
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
        render : function(){
            var style = this.props.style
            var that = this
            return (
                <div className="home_list" style={style}>
                    <div className="my_msg_search">
                        <SearchInput className="my_msg_s_box" placeholder="请输入岗位名称" handle={this.handleSearch}/>
                    </div>
                    <div className={'my_msg_content '+this.state.noContent}>
                        {
                            this.state.allData.map(function(o, i){
                                return <JobItem data={o} index={i} handleDetail={that.showDetail} key={'job_item'+i}></JobItem>
                            })
                        }
                    </div>
                    <div className="page_warp">
                        <HandlePage ref="hand_page" handlePage={this.handlePage}/>
                    </div>
                </div>
            )
        }
    })
    //每个岗位组件
    var JobItem = React.createClass({
        showDetail:function(){
            this.props.handleDetail(this.props.data,this.props.index)
        },
        sendCV:function(){
            var data = {
                jobInfoId : this.props.data.jobInfoId,
                userId : _userID
            }
            var layLoad = _load(),that=this
            ajaxGet('jobaApply/AddJobApply', data, true, function (a) {
                layer.close(layLoad);
                if (a.status == 'success') {
                    layer.msg("投递成功", { time: 2000 });
                    that.props.handleBack()
                } else
                    layer.msg(a.msg || "投递失败，请重新尝试", {time: 2000});
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
                        <div className="m_job_m">{'学历要求'}</div>
                    </div>
                    <div className="m_job_h">
                        <div className="m_job_b">{data.place}</div>
                    </div>

                    <div className="m_job_btns">
                        <div className="line_handle_btn detail" onClick={this.showDetail}>查看详情</div>
                        <div className="line_handle_btn" onClick={this.sendCV}>投递简历</div>
                    </div>  
                </div>
            )
        }
    })

    var HomeDetail = React.createClass({
        getInitialState:function(){
            return {
                data : {
                    company : '',
                    place  :'',
                    position : '',
                    requirement  :'',
                    responsibility : '',
                    salary  :'',
                    workAge  : '',
                }
            }
        },
        backToHomeList:function(){
            this.props.handleBack()
        },
        loadCV:function(jobInfoId){
            var that = this, loadIndex = layer.load(1);
            ajaxGet("jobInfo/getJobinfoById", {jobInfoId:jobInfoId}, true, function(a) {
                layer.close(loadIndex);
                if (a.status == 0) {
                    that.setState({ data: a.data });
                } else {
                    layer.msg(a.msg, { time: 2000 });
                }
            })
        },
        sendCV:function(){
            var data = {
                jobInfoId : this.state.jobInfoId,
                userId : _userID
            }
            var layLoad = _load(),that=this
            ajaxGet('jobaApply/AddJobApply', data, true, function (a) {
                layer.close(layLoad);
                if (a.status == 'success') {
                    layer.msg("投递成功", { time: 2000 });
                    that.props.handleBack()
                } else
                    layer.msg(a.msg || "投递失败，请重新尝试", {time: 2000});
            })
        },
        render:function(){
            var style = this.props.style
            var data = this.state.data
            return (
                <div className="home_detail" style={style}>
                    <div className="my_msg_search">
                        <div className="line_handle_btn" onClick={this.backToHomeList}>返回</div>
                    </div>
                    <div className="my_msg_content">
                        <div className="my_msg_warp">
                            <div className="my_msg_detail_h clear">
                                <div className="my_m_d_name left">{data.position}</div>
                                <div className="my_m_d_money right">{data.salary}</div>
                            </div>
                            <div className="my_m_d_middle">
                                <div>{data.place}</div>
                                <div>{data.workAge}</div>
                                <div>{'学历要求'}</div>
                            </div>
                            <div className="my_m_d_dec">
                                <div className="my_m_d_dec_title oneline">岗位职责:</div>
                                <div className="dec_line"></div>
                            </div>
                            <div className="my_m_d_content">
                                {data.responsibility}                                                        
                            </div>
                            <div className="my_m_d_dec">
                                <div className="my_m_d_dec_title oneline">岗位要求:</div>
                                <div className="dec_line"></div>
                            </div>
                            <div className="my_m_d_content">
                                {data.requirement}                                                        
                            </div>
                            <div className="my_m_d_sub_btn">
                                <div className="line_handle_btn my_m_d_sub" onClick={this.sendCV}>投递简历</div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    })
    ReactDOM.render(<MainContent />, document.getElementById("curr_content"));
});