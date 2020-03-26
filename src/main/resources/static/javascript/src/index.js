var _userType = _getCookie('userType');//0管理员1其他的
var _userID = _getCookie('userID');
var _userName = _getCookie('userName');
if(!_userID && !_userType && !_userName)window.location.href='./view/login.html'
function _maninBtnList() {
	if (_userType == 3 || _userType == 2) {//管理员
		var my_tabs = [{
			name: "账号管理",
			icon: "images/tab_shiwu.png",
			btns: [
				{ name: "账号管理", url: "view/mUser.html" },
			]
		}];
	} else if ( _userType == 1) {//领导
		var my_tabs = [{
			name: "个人中心",
			icon: "images/tab_shiwu.png",
			btns: [
				{ name: "个人简历", url: "view/myCV.html" },
				{ name: "已投递", url: "view/mySend.html" }
			]
		}];
	}
	return my_tabs;
}

function pageToken() {
	var baseA = ajaxGet("getMainServerAddr", {}, false);
	if (!baseA) window.location.href = "404.html";
	_base_addr = (baseA.code == 200 && baseA.data && baseA.data.status == 0) ? baseA.data.data : "";
	_token = _getCookie("lg_name");
	if (_token && _getUserInfo(true)) {
		return;
	}
	var urlParams = _getUrlParams();
	_token = urlParams ? urlParams.lg_tk : "";
	if (!_token) {
		var curHref = encodeURI(window.location.href);
		window.location.href = _base_addr ? (_base_addr + "/UserMgr/Login/Login.aspx?lg_preurl=" + curHref) : "404.html";
	}
	_getUserInfo();
}
function _getUserInfo(type) {
	var a = ajaxGet("getUserIsOnline", { token: _token }, false);
	if (a.code == 200) {
		if (a.data.result) {
			setInterval(testOnline, 90000);
			var user = ajaxGet("getAdminInfos", { token: _token }, false);
			_userData = (user.code == 200 && user.data) ? user.data.data : null;
			_userType = _userData.UserType;
			_userID = _userData.UserID;
			_schoolID = _userData.SchoolID || "S0-666-FA9D"; //测试用schoolID
			_setCookie("lg_name", _token);
			if (_userData) return true;
		}
	}
	if (type) return false;
	var curHref = encodeURI(window.location.href);
	window.location.href = _base_addr ? (_base_addr + "/UserMgr/Login/Login.aspx?lg_preurl=" + curHref) : "404.html";
}
// pageToken();
function testOnline() {
	ajaxGet("getUserIsOnline", { token: _token }, true, function (a) {
		if (a.code == 200 && a.data.result) {
			return;
		}
		var curHref = encodeURI(window.location.href);
		window.location.href = _base_addr ? (_base_addr + "/UserMgr/Login/Login.aspx?lg_preurl=" + curHref) : "404.html";
	});
}

documentReady(function () {
	var MainTabWarp = React.createClass({
		hoverList: function () {
			if (!this.hover) {
				this.hover = true;
				this.props.choTab(this.props.index, 1);
			}
		},
		leaveList: function () {
			this.hover = false;
			// if (this.hover) {
			// 	this.hover = 0;
			// 	this.props.choTab(-1, 1);
			// }
		},
		render: function () {
			var o = this.props.data, that = this, choIndex = this.props.choIndex, hasCho = "", style = {}, index = this.props.index;
			if (choIndex.length == 2 && choIndex[0] == index || choIndex.length == 3 && choIndex[2] == index) {
				hasCho = " main_tab_List_cho";
				style = { height: 54 + o.btns.length * 52 };
			}
			return (
				<div className={"main_tab_List" + hasCho} onMouseOver={this.hoverList} onMouseLeave={this.leaveList} style={style}>
					<div className="main_tab_name" style={{ backgroundImage: "url('" + o.icon + "')" }}>{o.name}<b>{">"}</b></div>
					{
						o.btns.map(function (o, i) {
							return <MainTabItem data={o} index={[index, i]} key={"man_t_i" + i} choTab={that.props.choTab} choIndex={choIndex} />
						})
					}
				</div>
			)
		}
	});
	var MainTabItem = React.createClass({
		choTab: function () {
			var index = this.props.index, choIndex = this.props.choIndex;
			if (choIndex[0] == index[0] && choIndex[1] == index[1]) return;
			var data = this.props.data;
			data.posi = this.props.index;
			this.props.choTab(data);
		},
		render: function () {
			var o = this.props.data, index = this.props.index, choIndex = this.props.choIndex;
			var hasCho = (choIndex[0] == index[0] && choIndex[1] == index[1]) ? " main_tab_i_cho" : "";
			return (
				<div className={"main_tab_itam clear" + hasCho} onClick={this.choTab}>
					<div className="main_tab_i_node left" />
					<div className="main_tab_i_name left">{o.name}<b /></div>
				</div>
			)
		}
	});
	var HomeMainTabWarp = React.createClass({
		choTab: function () {
			this.props.choTab(-1);
		},
		render: function () {
			var choIndex = this.props.choIndex, hasCho = "";
			hasCho = (choIndex.length == 2 && choIndex[0] == -1) ? " main_tab_List_cho" : "";
			return (
				<div className={"main_tab_List main_tab_List_home" + hasCho} onClick={this.choTab}>
					<div className="main_tab_name" style={{ backgroundImage: "url('images/tab_shouye.png')" }}>
						{
							_userType == 3 ? '职位管理' : '首页'
						}
					</div>
				</div>
			)
		}
	});

	var ChoTabItem = React.createClass({
		close: function (e) {
			_stopProp(e);
			this.props.handle(this.props.index, this.props.data);
		},
		choTab: function () {
			if (this.props.choIndex == this.props.index) return;
			this.props.handle(this.props.index, this.props.data, 1);
		},
		render: function () {
			var o = this.props.data;
			if (this.props.choIndex == this.props.index) {
				var cla = " cho_tab_i_cho", style = {};
			} else {
				var cla = "", style = this.props.style;
			}
			return (
				<div className={"cho_tab_i left" + cla} onClick={this.choTab} style={style}>
					<div className="cho_tab_i_text left">{o.name}</div>
					<div className="cho_tab_i_close left hover_btn" onClick={this.close} />
				</div>
			);
		}
	});
	var HomeTabItem = React.createClass({
		choTab: function () {
			if (this.props.choIndex == -1) return;
			this.props.handle(-1, -1, 1);
		},
		render: function () {
			var cla = (this.props.choIndex == -1) ? " cho_tab_i_cho" : "";
			return (
				<div className={"cho_tab_i left cho_tab_i_home" + cla} onClick={this.choTab}>
					<div className="cho_tab_i_text left">
						{
							_userType == 3 ? '职位管理' : '首页'
						}
					</div>
				</div>
			);
		}
	});

	var ContentItem = React.createClass({
		componentWillReceiveProps:function(nextProps){
			if(this.props.choIndex != this.props.index && nextProps.choIndex == this.props.index){
				var posi = this.props.data.posi
				var mySubPage = window.frames["mySubPage" + posi[0] + "_" + posi[1]]
				if(mySubPage && mySubPage.window && mySubPage.window.refreshCurPage){
					mySubPage.window.refreshCurPage()
				}
			}
		},
		render: function () {
			var o = this.props.data;
			return (
				<div className="content_item" style={{ display: (this.props.choIndex == this.props.index) ? "block" : "none" }}>
					<iframe src={o.url} name={"mySubPage" + o.posi[0] + "_" + o.posi[1]}/>
				</div>
			)
		}
	});


	var MainContent = React.createClass({
		tabWidth: 72,
		getInitialState: function () {
			var btnList = _maninBtnList(), choIndex = [-1, -1], hash3, tabIndex = -1, tab = [];
			var params = window.location.hash;
			if (params && params.substr(1)) {
				var posi = params.substr(1).split("|");
				if (posi && posi[2]) hash3 = posi[2];
				if (posi.length > 1 && btnList[posi[0]] && btnList[posi[0]].btns[posi[1]]) {
					choIndex = [posi[0], posi[1]];
					window.location.hash = choIndex[0] + "|" + choIndex[1] + "|" + hash3;
					tab = btnList[choIndex[0]].btns[choIndex[1]];
					tab.posi = choIndex;
					tab = [tab];
					tabIndex = 0;
				}
			}
			return {
				btnList: btnList,
				choIndex: choIndex,
				tabIndex: tabIndex,
				tab: tab,
				style: { width: "auto" }
			}
		},
		componentDidMount: function () {
			this.setTopTime();
			this.width = document.body.scrollWidth - 250;
			var that = this;
			$(window).resize(function () {
				that.width = document.body.scrollWidth - 250;
				var style = { width: "auto" };
				if (that.width < that.tabWidth) {
					var tab = that.state.tab;
					var margin = (that.width - that.tabWidth) / (tab.length - 1);
					style = { marginLeft: margin };
				}
				that.setState({ style: style });
			});
			_handOpenTabPage = this.addTab;
		},
		setTopTime: function () {
			var date = new Date();
			var y = date.getFullYear();
			var m = this.formatNum(date.getMonth() + 1);
			var d = this.formatNum(date.getDate());
			var day = this.formartDay(date.getDay());
			var h = this.formatNum(date.getHours());
			var min = this.formatNum(date.getMinutes());
			var sec = date.getSeconds();
			var time = sec ? sec * 1000 : 60000;
			$("#top_time").html(y + "-" + m + "-" + d + "&nbsp;&nbsp;" + day + "&nbsp;&nbsp;" + h + ":" + min);
			var that = this;
			setTimeout(function () {
				that.setTopTime();
			}, time);
		},
		formatNum: function (num) {
			return (num > 9) ? num : "0" + num.toString();
		},
		formartDay: function (i) {
			var day = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
			return day[i];
		},
		addTab: function (data, type) {
			var choIndex = this.state.choIndex;
			if (type) {
				if (data == -1) {
					choIndex = [-1, -1];
				} else {
					choIndex[2] = data;
				}
				this.setState({ choIndex: choIndex });
			} else {
				if (data == -1) {
					this.setState({ tabIndex: -1, choIndex: [-1, -1] });
					location.hash = "";
					return;
				}
				var tab = this.state.tab, tabIndex;
				choIndex = data.posi;
				for (var i in tab) {
					if (tab[i].name == data.name) {
						tabIndex = i;
						location.hash = choIndex[0] + "|" + choIndex[1] + "|0";
						this.setState({ tabIndex: tabIndex, choIndex: choIndex });
						return;
					}
				}
				this.tabWidth += data.width || 104;
				tab.push(data);
				var style = this.setTabStyle(tab);
				tabIndex = tabIndex || (tab.length - 1);
				this.setState({ tab: tab, tabIndex: tabIndex, style: style, choIndex: choIndex });
				location.hash = choIndex[0] + "|" + choIndex[1] + "|0";
			}
		},
		handleTab: function (i, data, type) {
			if (i == -1) {
				this.setState({ tabIndex: -1, choIndex: [-1, -1] });
				location.hash = "";
				return;
			}
			var choIndex = this.state.choIndex;
			if (type) {
				choIndex = data.posi ? [data.posi[0], data.posi[1]] : [0, 0];
				this.setState({ tabIndex: i, choIndex: choIndex });
			} else {
				var tab = this.state.tab, tabIndex = this.state.tabIndex;
				tab.splice(i, 1);
				this.tabWidth -= data.width || 104;
				var style = this.setTabStyle(tab);
				if (i == tabIndex) {
					tabIndex = tab.length - 1;
				} else if (i < tabIndex) {
					tabIndex--;
				}
				choIndex = tab[tabIndex] ? tab[tabIndex].posi : [-1, -1];
				this.setState({ tab: tab, tabIndex: tabIndex, style: style, choIndex: choIndex });
			}
			location.hash = choIndex[0] + "|" + choIndex[1] + "|0";
		},
		setTabStyle: function (tab) {
			var style = { width: "auto" };
			if (this.width < this.tabWidth) {
				var margin = (this.width - this.tabWidth) / (tab.length - 1);
				style = { marginLeft: margin };
			}
			return style;
		},
		quitPage: function () {
			layer.confirm("确定要退出登录吗?", function (index) {						
				window.location.href = "./view/login.html";
				layer.close(index);
			});
		},
		render: function () {
			var that = this, choIndex = this.state.choIndex, tabIndex = this.state.tabIndex;
			return (
				<div style={{ width: "100%", height: "100%" }}>
					<div id="top_content">
						<div className="clear">
							<div id="top_time" className="left"></div>
							<div id="top_content_u" className="right">
								<div className="top_help left hover_btn">帮助</div>
								<div className="top_icon left"></div>
								<div className="top_name left hover_btn" onClick={this.quitPage}>{decodeURIComponent(_userName || '小李')}</div>
							</div>
						</div>
					</div>
					<div id="cho_tab_warp">
						<div id="cho_tab_list" className="clear" style={{ width: 2000 }}>
							<HomeTabItem choIndex={tabIndex} style={that.state.style} handle={that.handleTab} />
							{
								this.state.tab.map(function (o, i) {
									return <ChoTabItem choIndex={tabIndex} style={that.state.style} index={i} key={"cho_tab" + i} data={o} handle={that.handleTab} />
								})
							}
						</div>
					</div>
					<div id="left_content">
						<div className="logo">校园招聘系统</div>
						<div className="main_tab_warp">
							<HomeMainTabWarp choTab={that.addTab} choIndex={choIndex} />
							{
								this.state.btnList.map(function (o, i) {
									return <MainTabWarp data={o} index={i} key={"man_t_w" + i} choTab={that.addTab} choIndex={choIndex} />
								})
							}
						</div>
					</div>
					<div id="content_warp">
						<div className="content_item" style={{ display: (tabIndex == -1) ? "block" : "none" }}>
							{
								_userType == 3 ? (
									<iframe src={"view/mJobManage.html"} />
								) : (
									<iframe src={"view/myMsg.html"} /> 
								)
							}
							
						</div>
						{
							this.state.tab.map(function (o, i) {
								return <ContentItem data={o} index={i} key={"con_i" + i} choIndex={tabIndex} />
							})
						}
					</div>
					<PopPageWarp />
				</div>
			)
		}
	});
	ReactDOM.render(<MainContent />, document.getElementById("main_content"));
});
function _setHash(i) {
	var hash = window.location.hash;
	var index = hash.split("|");
	index[2] = i;
	window.location.hash = index.join("|");
}
function _getHash() {
	return window.location.hash;
}

var _handOpenTabPage;
function _openTabPage(name) {
	var tabList = _maninBtnList();
	for (var i in tabList) {
		for (var j in tabList[i].btns) {
			if (tabList[i].btns[j].name == name) {
				var data = tabList[i].btns[j];
				data.posi = [i, j];
				_handOpenTabPage(data);
				return;
			}
		}
	}
}