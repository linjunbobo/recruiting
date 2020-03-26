function documentReady(fn) {//初始化页面
    if (document.addEventListener) {//兼容非IE  
        document.addEventListener("DOMContentLoaded", function () {
            //注销事件，避免反复触发  
            document.removeEventListener("DOMContentLoaded", arguments.callee, false);
            fn();//调用参数函数  
        }, false);
    } else if (document.attachEvent) {//兼容IE  
        document.attachEvent("onreadystatechange", function () {
            if (document.readyState === "complete") {
                document.detachEvent("onreadystatechange", arguments.callee);
                fn();
            }
        });
    }
}

// var _address = "http://192.168.129.201:15673/assets/";//"http://192.168.129.228:10102/behavior/";
var _address = "http://192.168.129.81:8082/";//"http://192.168.129.228:10102/behavior/";
var _listPageSize = 50;
var _theme_color = "#1ca6fe";
var _buildList = ["数学楼", "图书馆"];
function ajaxLogin(url, data, async, fun) {
    var aData = null;
    $.ajax({
        type: "GET",
        url: _address + url,
        // cache: false,
        dataType: "json",
        contentType: "application/json",
        data: data,
        async: async,
        // cache: false,
        success: function (data) {
            data = data || {error: 6};
            if (async)
                fun(data);
            else
                aData = data;
        },
        error: function (responseData, textStatus, errorThrown) {
            layer.closeAll("loading");
            layer.msg('后台返回错误',{time:2000})
        }
    });
    return aData;
}
function ajaxGet(url, data, async, fun) {
    var aData = null;
    $.ajax({
        type: "GET",
        url: _address + url,
        // cache: false,
        dataType: "json",
        contentType: "application/json",
        data: data,
        async: async,
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        // cache: false,
        success: function (data) {
            data = data || {error: 6};
            if (async)
                fun(data);
            else
                aData = data;
        },
        error: function (responseData, textStatus, errorThrown) {
            layer.closeAll("loading");
            layer.msg('后台返回错误',{time:2000})
        }
    });
    return aData;
}

function ajaxFile(url, data, async, fun) {
    var aData = null;
    $.ajax({
        type: "GET",
        url: _address + url,
        // cache: false,
        dataType: "blob",
        data: data,
        async: async,
        // cache: false,
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function (data) {
            data = data || {error: 6};
            if (async)
                fun(data);
            else
                aData = data;

            console.log(aData)
            var blob = aData;

            var reader = new FileReader();
            reader.readAsDataURL(blob);    // 转换为base64，可以直接放入a表情href
            reader.onload = function (e) {
                // 转换完成，创建一个a标签用于下载

                var a = document.createElement('a');
                a.download = 'data.xlsx';
                a.href = e.target.result;
                $("body").append(a);    // 修复firefox中无法触发click
                a.click();
                $(a).remove();

            }
        },
        error: function (responseData, textStatus, errorThrown) {
            layer.closeAll("loading");
            layer.msg('后台返回错误',{time:2000})
        }
    });
    return aData;
}
function ajaxPost(url, data, async, fun) {
    var aData = null;
    $.ajax({
        type: "POST",
        url: _address + url,
        data: JSON.stringify(data),
        dataType: "json",
        contentType: "application/json",
        async: async,
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function (data) {
            data = data || {error: 6};
            if (async)
                fun(data);
            else
                aData = data;
        },
        error: function (responseData, textStatus, errorThrown) {
            layer.closeAll("loading");
            layer.msg('后台返回错误',{time:2000})
        }
    });
    return aData;
}
function ajax3(type, url, data, async, fun) {
    var aData = null;
    $.ajax({
        type: type,
        url: _address + url,
        data: JSON.stringify(data),
        dataType: "json",
        contentType: "application/json",
        async: async,
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function (data) {
            data = data || {error: 6};
            if (async)
                fun(data);
            else
                aData = data;
        },
        error: function (responseData, textStatus, errorThrown) {
            layer.msg("数据请求出错");
            layer.closeAll("loading");
            layer.msg('后台返回错误',{time:2000})
        }
    });
    return aData;
}

function _setCookie(cname, cvalue) {
	var d = new Date();
	d.setTime(d.getTime() + (24 * 60 * 60 * 1000));
	var expires = "expires=" + d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function _getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}
function _delCookie(cname) {
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	var cval = getCookie(cname);
	if (cval)
		document.cookie = cname + "=;expires=" + exp.toGMTString();
}
//打开弹窗
function _openPageFun(ele, area, title, func) {
    var index = layer.open({
        type: 1,
        title: title,
        closeBtn: 1,
        shade: [0.6, '#515151'],
        content: $(ele),
        area: area,
        cancel: function() {
            if (func) {
                func();
                return false;
            }
            return true;
        }
    });
    return index;
}
//初始化滚动条
function _initScroll(ele, hide) {
    ele.mCustomScrollbar({
        theme: "dark-3",
        axis: "y",
        scrollbarPosition:"inside",
        autoDraggerLength:true,
        scrollInertia: 100,
        autoHideScrollbar: hide ? true : false,
        callbacks:{
            onScrollStart:function(){
            },
        }
    });
    return true;
}
function _getUrlParams() {
    var urlParamsStr = location.search.substr(1);

    if(urlParamsStr){
        var urlParamsArr = urlParamsStr.split('&');
        var urlParamsObj = {};

        for(var i = 0; i < urlParamsArr.length; i++){
            var index = urlParamsArr[i].indexOf('=');
            var key = urlParamsArr[i].substr(0, index);
            var value = urlParamsArr[i].substr(index + 1);

            urlParamsObj[key] = value;
        }

        return urlParamsObj;
    }else{
        return null;
    }
}

function _stopProp(e) {//禁止冒泡
    e = e || window.event,
    e.stopPropagation ? e.stopPropagation() : e.cancelBubble = !0
} 

//判断光标的索引
function _getCursorPosition(obj) {
    var cursurPosition = -1;
    if (obj.selectionStart) {
        cursurPosition = obj.selectionStart;
    } else if (document.selection) {
        var range = document.selection.createRange();
        range.moveStart("character", -obj.value.length);
        cursurPosition = range.text.length;
    } else {
        cursurPosition = 0;
    }
    return cursurPosition;
}
//格式化时间
function _formartTime(t) {
    if (!t) return "--"; 
    var tList = t.split('T');
    return tList[0] + " " + tList[1].substr(0, 8);
}
function _formartTime1(t) {
    if (!t) return "--"; 
    var tList = t.split('T');
    return tList[0];
}
//格式化用户类型
function _fotmartUserType(t) {
    switch(t) {
        case 0:
            return "管理员";
        case 1:
            return "教师";
        case 2:
            return "学生";
        case 3:
            return "家长";
        case 4:
            return "教育专家";
        case 5:
            return "教育局领导";
        case 6:
            return "教育局管理员";
        case 8:
            return "教育局领导";
    }
    return "-";
}


var PageMixin = {
    getInitialState: function() {
        return { 
            type: this.props.type ? "type1" : "type0",
            pageIndex: 1,
            totalPage: 0
        };
    },
    setData: function(type, total, index) {
        if (type == 0) {
            this.setState({totalPage: total, pageIndex: index});
        } else if (type == 1) {
            this.setState({totalPage: total, pageIndex: 1});
        } else if (type == 2) {
            this.setState({pageIndex: total});
        }
    },
    shouldComponentUpdate: function(nProps, nState) {
        if (nState.pageIndex != this.state.pageIndex || nState.totalPage != this.state.totalPage) {
            return true;
        }
        return false;
    },
    pageClickChange: function(e) {
        e.preventDefault();
        var ele = $(e.currentTarget);
        var num = parseInt(ele.text());
        if (num == this.state.pageIndex) return;
        this.setState({pageIndex: num});
        this.props.handlePage(num);
    },
    pageClickPre: function(e) {
        e.preventDefault();
        var num = this.state.pageIndex - 1;
        if (num > 0) {
            this.setState({pageIndex: num});
            this.props.handlePage(num);
        }
    },
    pageClickNext: function(e) {
        e.preventDefault();
        var num = this.state.pageIndex + 1;
        if (num <= this.state.totalPage) {
            this.setState({pageIndex: num});
            this.props.handlePage(num);
        }
    },
    pageClickGo: function(e) {
        e.preventDefault();
        if (this.state.totalPage < 2) return;
        var num = parseInt(this.refs.input.value);
        if (num > 0 && num <= this.state.totalPage) {
            this.setState({pageIndex: num});
            this.props.handlePage(num);
        } else {
            layer.msg('输入的页码无效,请重新输入',{time: 2000});
            this.refs.input.value = "";
        }
    }
}
var HandlePage = React.createClass({
    mixins: [PageMixin],
    render: function() {
        var total = this.state.totalPage, index = this.state.pageIndex;
        var pageList = [];
        if (this.state.totalPage < 8 ) {
            var style1 = {display:"none"}, style2 = {display:"none"}, style3 = {display:"none"}, style4 = {display:"none"};
            for (var i = 1; i <= this.state.totalPage; i++) {
                if (i == this.state.pageIndex) {
                    pageList.push(<span key={"page"+i} className="hp_page_n hp_sh_page hp_cur_page" onClick={this.pageClickChange}>{i}</span>);
                } else {
                    pageList.push(<span key={"page"+i}  className="hp_page_n hp_sh_page" onClick={this.pageClickChange}>{i}</span>);
                }
            }
        } else {
            var style1 = (this.state.pageIndex > 3)? {display:"block"} : {display:"none"};
            var style2 = (this.state.pageIndex > 4)? {display:"block"} : {display:"none"};
            var style3 = (this.state.pageIndex < this.state.totalPage-3)? {display:"block"} : {display:"none"};
            var style4 = (this.state.pageIndex < this.state.totalPage-2)? {display:"block"} : {display:"none"};
            
            var j = 0;
            if (this.state.pageIndex < 4) {
                j = this.state.pageIndex -1;
            } else if (this.state.pageIndex > 2 && this.state.pageIndex < this.state.totalPage - 1) {
                j = 2;
            } else if (this.state.pageIndex == this.state.totalPage - 1) {
                j = 3;
            } else if (this.state.pageIndex == this.state.totalPage) {
                j = 4;
            }
            for (var i = this.state.pageIndex - j; i < this.state.pageIndex + 5-j; i++) {
                if (i == this.state.pageIndex) {
                    pageList.push(<span key={"page"+i} className="hp_page_n hp_sh_page hp_cur_page" onClick={this.pageClickChange}>{i}</span>);
                } else {
                    pageList.push(<span key={"page"+i}  className="hp_page_n hp_sh_page" onClick={this.pageClickChange}>{i}</span>);
                }
            }
        }
        return (
            <div className={'hp_page_warp clear ' + this.state.type} style={(total > 0) ? {} : {display: "none"}}>
                <span className={'hp_pre' + ((index > 1) ? "" : " hp_ban_btn")} onClick={this.pageClickPre}>{"<"}</span>
                <span className='hp_page_n hp_page_first' style={style1} onClick={this.pageClickChange}>1</span>
                <span className='hp_pre_node' style={style2}>···</span>
                {pageList}
                <span className='hp_next_node' style={style3}>···</span>
                <span className='hp_page_n hp_page_last'  style={style4} onClick={this.pageClickChange}>{total}</span>
                <span className={'hp_next' + ((total > index) ? "" : " hp_ban_btn")} onClick={this.pageClickNext}>{">"}</span>
                <span className='hp_text'>&nbsp;共<span style={{color: "#f00", fontWeight: "bold"}}>{this.state.totalPage}</span>页&nbsp;&nbsp;到第</span>
                <input type='text' className='hp_input' ref="input" placeholder={this.state.totalPage}/>
                <span className='hp_text'>页&nbsp;&nbsp;</span>
                <span className={'hp_page_go'+ ((total > 1) ? "" : " hp_ban_btn")} onClick={this.pageClickGo}>{this.props.type ? "确定" : "Go"}</span>
            </div>
        );
    }
});

//是否为空
function _isNull(t) {
    if (!t || t.replace(/(^\s*)|(\s*$)/g, "") == "")
        return false;
    return true;
}

//下拉框
var Selepicker = React.createClass({
    componentDidMount: function() {
        this.ele = $(ReactDOM.findDOMNode(this.refs.selectpicker));
        this.ele.selectpicker({});
        var that = this;
        this.ele.on('changed.bs.select', function (e, index, newVal, oldVal) {
            that.props.handSele(index);
        }.bind(this));

        this.scrollBar = this.ele.parent().find('.inner');
        this.initScrollBar();
    },
    componentDidUpdate: function() {
        if (this.ele) {
            if (this.hasScrollBar) {
                this.scrollBar.mCustomScrollbar("destroy");
                this.hasScrollBar = false;
            }
            this.ele.selectpicker("refresh");
            if (this.props.data.length > 0) {
                this.ele.selectpicker("val", 0);
                this.initScrollBar();
            }
        }
    },
    shouldComponentUpdate: function(nProps, nState) {
        return (this.props.data !== nProps.data);
    },
    initScrollBar: function() {
        if (this.props.data.length < 7) return;
        this.hasScrollBar = true;
        // console.log(this.props.data.length);
        this.scrollBar.mCustomScrollbar({
            theme: "minimal-dark",
            axis:"y",
            scrollbarPosition:"inside",
            autoDraggerLength:true,
            scrollInertia : 500,
            mouseWheel:{ preventDefault: true },
            advanced:{ 
                updateOnBrowserResize:true,
                updateOnContentResize:true,
                autoScrollOnFocus:true
            }
        });
    },
    setVal: function(i) {
        this.ele.selectpicker("val", i);
    },
    getVal: function() {
        return this.ele.selectpicker("val");
    },
    render: function() {
        var attr = this.props.attr, disAttr = this.props.disAttr;
        var optList = this.props.data.map(function(o, i) {
            var text = (attr) ? o[attr] : o;
            var disabled = (disAttr && o[disAttr]) ? true : false;
            return <option value={i} key={"sele_opt" + i} disabled={disabled}>{text}</option>
        });
        var width = this.props.width || "90px";
        var size = this.props.size || "6";
        var search = (this.props.search) ? true : false;
        var no_sele = this.props.noSele || "未选择";
        return (
            <select className="selectpicker" ref="selectpicker" data-dropup-auto="false" data-live-search={search} data-none-results-text="没有匹配项{0}" data-size={size} data-width={width} data-style={this.props.className || 'sele_style '} data-none-selected-text={no_sele}>
                {optList}
            </select>
        );
    }
});

var SearchInput = React.createClass({
    getInitialState: function() {
        return { display: "none" };
    },
    searchEnter: function(e) {
        if (e.keyCode == 13) {
            this.searchBtn();
        }
    },
    searchBtn: function() {
        var value = this.refs.input.value;
        if (!_isRightText(value)) {
            value = "";
            this.refs.input.value = "";
        }
        this.props.handle(value);
    },
    changeVal: function() {
        var style = this.refs.input.value ? "block" : "none";
        if (this.state.display != style)
            this.setState({display: style});
    },
    clearValue: function() {
        this.refs.input.value = "";
        this.setState({display: "none"});
        this.props.handle("");
    },
    setValue: function(text) {
        this.refs.input.value = text;
        this.changeVal();
    },
    render: function() {
        var className = this.props.className || "";
        return (
            <div className={"search_input_warp clear " + className}>
                <input ref="input" type="text"  onKeyDown={this.searchEnter} onChange={this.changeVal} maxLength={this.props.length || 20} placeholder={this.props.placeholder || "请输入用户姓名"} className="search_input left"/>
                <div className="search_dele left" style={{display: this.state.display}} onClick={this.clearValue}/>
                <div className="search_btn" onClick={this.searchBtn}/>
            </div>
        );
    }
});

var TimeInput = React.createClass({
    componentDidMount: function() {
        if (this.props.future)
            this.initTime1();
        else
            this.initTime();
    },
    initTime: function() {
        var that = this;
        this.laydata = laydate.render({
            elem: "#" + this.props.id
            ,theme: _theme_color
            ,format: 'yyyy-MM-dd'
            ,max: 0
            ,value: this.props.value || ""
            ,range: '~'
            ,btns: ['confirm']
            ,done:  function(value, date, endDate) {
                that.props.handleTime(value);
            }
        });
    },
    initTime1: function() {
        var that = this;
        this.laydata = laydate.render({
            elem: "#" + this.props.id
            ,theme: _theme_color
            ,format: 'yyyy-MM-dd'
            ,min: 0
            ,value: this.props.value || ""
            ,range: '~'
            ,btns: ['confirm']
            ,done:  function(value, date, endDate) {
                that.props.handleTime(value);
            }
        });
    },
    setVal: function(startTime, endTime) {
        this.refs.input.value = startTime + " ~ " + endTime;
    },
    render: function() {
        var cla = this.props.className || "";
        return (
            <div className={"time_input_warp " + cla}>
                <input id={this.props.id} placeholder="点击选择时间区间" readOnly={true} ref="input"/>
                <span>{">"}</span>
            </div>
        )
    }
})

function _isRightText(content) {
    if (!content || content.replace(/(^\s*)|(\s*$)/g, "") == "") {
       return false;
    }
    return true;
}

function _setScroll(ele, autoHide) {
    ele.mCustomScrollbar({
        theme: "dark-3",
        axis:"y",
        scrollbarPosition:"inside",
        autoDraggerLength:true,
        scrollInertia : 500,
        autoHideScrollbar: autoHide || false,
        mouseWheel:{ preventDefault: true },
        advanced:{ 
            updateOnBrowserResize:true,
            updateOnContentResize:true,
            autoScrollOnFocus:true
        }
    });
    return true;
}

var SwitchBtn = React.createClass({
    getInitialState: function() {
        return {
            cla: " set_t_s_close"
        }
    },
    setData: function() {
        var cla = this.state.cla ? "" : " set_t_s_close";
        this.setState({cla: cla});
        this.props.setData(cla);
    },
    render: function() {
        if (this.state.cla) {
            var style = {display: "none"}, style1 = {display: "block"};
        } else {
            var style1 = {display: "none"}, style = {display: "block"};
        }
        return (
            <div className={"set_t_switch left clear" + this.state.cla} onClick={this.setData} style={this.props.style || {}}>
                <span className="left" style={style}>ON</span><span className="right" style={style1}>OFF</span>
                <div/>
            </div>
        );
    }
});

//校验ip地址是否有效
function isValidIP(ip) {
    var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
    return reg.test(ip);
}

function _handAjax(a, text, loadIndex, func) {
    layer.close(loadIndex);
    if (a.status == 'success') {
        func();
    } else
        layer.msg(a.msg || (text + "失败，请重新尝试"), {time: 2000});
}

function _load() {
    return layer.load(1);
}

//获取时间 getDay(-7)前七天 2020-03-07
function getDay(day) {
    var today = new Date();
    var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
    today.setTime(targetday_milliseconds); 
    var tYear = today.getFullYear();
    var tMonth = today.getMonth();
    var tDate = today.getDate();
    tMonth = doHandleMonth(tMonth + 1);
    tDate = doHandleMonth(tDate);
    return tYear + "-" + tMonth + "-" + tDate;
}
function doHandleMonth(month) {
    var m = month;
    if (month.toString().length == 1) {
        m = "0" + month;
    }
    return m;
}




//检测data的空值合法字符 {}
function _checkEmpty(data){
    console.log(data)
    if( typeof data == "object"){
        for(var key in data){
            if(data[key] == '' || !_isRightText(data[key].toString())){
                return false
            }
        }
    }
    return true
}