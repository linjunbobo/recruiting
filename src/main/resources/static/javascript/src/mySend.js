var _openTabPage = parent._openTabPage;
var refreshCurPage = function(){
     window.location.reload()
}
documentReady(function () {
     var handPageMixin = {
          pageIndex: 1,
          pageSize: 15,
          pageCount: 0,
          getAllData: function () {
               var that = this, loadIndex = layer.load(1);
               ajaxGet("jobaApply/getJobApplyByuserId", {userId:_userID}, true, function (a) {
                    layer.close(loadIndex);
                    if (a.status == 0 || a.status == 1) {
                         var allData = a.data;
                         var noContent = (allData.length > 0) ? "" : " no_content";
                         that.setState({ allData: allData, noContent: noContent });
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
          getInitialState: function () {
               return {
                    choIndex: 0,
                    allData:[],
                    noContent:''
               }
          },
          componentDidMount:function(){
               this.getAllData()
          },
          render: function () {
               return (
                    <div id="curr_content" className="clear">
                         <div className="my_send_header">已投递职位</div>
                         <div className="content_item contant_table">
                              <div className="contant_table_top clear">
                                   <div style={{ width: "25%" }}>职位</div>
                                   <div style={{ width: "25%" }}>投递时间</div>
                                   <div style={{ width: "25%" }}>投递状态</div>
                                   <div style={{ width: "25%" }}></div>
                              </div>
                              <div>
                                   <div className={this.state.noContent}>
                                        {
                                             this.state.allData.map(function (o, i) {
                                                  return <MySendItem data={o} index={i} key={'my_give1_' + i} />
                                             })
                                        }
                                   </div>
                              </div>
                         </div>
                    </div>
               )
          }
     });
     var MySendItem = React.createClass({
          render: function () {
               var data = this.props.data
               var state = ''
               switch(data.state){
                    case 1 : state='投递中';break;
                    case 2 : state='已读';break;
                    case 3 : state='投递成功';break;
                    default: state='未知';break;
               }

               return (
                    <div className="content_table_line clear">
                         <div style={{ width: "25%" }}>{data.position}</div>
                         <div style={{ width: "25%" }}>{data.updateTime.substr(0,10)}</div>
                         <div style={{ width: "25%" }}>{state}</div>
                         <div style={{ width: "25%" }}></div>
                    </div>
               )
          }
     })
     ReactDOM.render(<MainContent />, document.getElementById("curr_content"));
});