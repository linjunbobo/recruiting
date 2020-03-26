var _openTabPage = parent._openTabPage;
documentReady(function() {
    var handPageMixin = {
        pageIndex : 1,
        pageSize : 999,
        pageCount : 0,
        searchVal : "",
        getInitialState : function(){
            return {
                allData : [],
                noContent : ''
            }
        },
        componentDidMount: function() {
            this.getAllData()
        },
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
                limit: this.pageSize, 
                page: this.pageIndex
            }
            ajaxGet("user/getAllUser", data, true, function(a) {
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
        mixins:[handPageMixin],
        newUser:function(){
            _openPage('user_pop_page',{},this.getAllData)
        },
        render: function() {
            var that = this
            return (
                <div id="curr_content" className="clear">
                    <div className="my_msg_search">
                        <div className="line_handle_btn" onClick={this.newUser}>新建账号</div>
                    </div>
                    <div style={{padding:'0 30px'}}>
                        <div className="contant_table_top clear" style={{marginTop:'20px'}}>
                            <div style={{ width: "20%" }}>账号</div>
                            <div style={{ width: "20%" }}>密码</div>
                            <div style={{ width: "20%" }}>用户身份</div>
                            <div style={{ width: "20%" }}>联系方式</div>
                            <div style={{ width: "20%" }}>操作</div>
                        </div>
                        <div>
                            <div>
                                {
                                    this.state.allData.map(function(o, i){
                                        return <UserItem data={o} index={i} key={'user_item'+i} refresh={that.getAllData}/>
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    });


    var UserItem = React.createClass({
        editUser:function(){
            _openPage('user_pop_page',this.props.data,this.props.refresh)
        },  
        delUser:function(){
            var that = this
            layer.confirm("确认删除用户", function (index) {
                layer.close(index);
                var layload = _load()
                ajaxGet('user/deleteUser', { userId:that.props.data.userId }, true, function(a) {
                    _handAjax(a, "删除失败", layload, function () {
                        layer.msg("删除成功", { time: 2000 });
                        that.props.refresh();
                    })
                })
            })
        },
        render:function(){
            var type = ''
            switch(this.props.data.type){
                case 1 : type='求职者';break;
                case 2 : type='职位提供者';break;
                case 3: type='系统管理员';break;
            }
            return(
                <div className="content_table_line clear">
                    <div style={{ width: "20%" }} title={this.props.data.userId} className="oneline">{this.props.data.userId}</div>
                    <div style={{ width: "20%" }} title={this.props.data.phone} className="oneline">{this.props.data.phone}</div>
                    <div style={{ width: "20%" }} title={this.props.data.password} className="oneline">{this.props.data.password}</div>
                    <div style={{ width: "20%" }}>{type}</div>
                    <div style={{ width: "20%" }}>
                        <div className="line_handle_btn" onClick={this.editUser}>编辑</div>
                        <div className="line_handle_btn" onClick={this.delUser}>删除</div>
                    </div>
                </div>
            )
        }
    })
    ReactDOM.render(<MainContent />, document.getElementById("curr_content"));
});