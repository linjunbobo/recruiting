var _openPage = parent._openPage;
var layer = parent.layer;
var _token = parent._token, _source = "web";
var _userType = parent._userType;
var _userID = parent._userID;
var _base_addr = parent._base_addr;
var _userData = parent._userData;
var _schoolID = parent._schoolID;//"S0-666-FA9D";

var Tabs = React.createClass({
    getInitialState: function() {
        return {
            allTabs: this.props.allTabs,
            choIndex: this.props.choIndex || 0
        }
    },
    handle: function(i) {
        this.setState({choIndex: i});
        this.props.handle(i);
    },
    render: function() {
        var handle = this.handle, choIndex = this.state.choIndex;
        return (
            <div className="content_tabs clear left">
                {
                    this.state.allTabs.map(function(o, i) {
                        return <TabsItem key={"tabs_i" + i} index={i} data={o} handle={handle} choIndex={choIndex}/>
                    })
                }
            </div>
        )
    }
});
var TabsItem = React.createClass({
    choTab: function() {
        if (this.props.choIndex == this.props.index) return;
        this.props.handle(this.props.index);
    },
    render: function() {
        var hasCho = (this.props.choIndex == this.props.index) ? " tabs_item_cho" : "";
        return (
            <div className={"tabs_item left" + hasCho} onClick={this.choTab}>
                <div className="tabs_item_name">{this.props.data}<b /></div>
                <div className="tabs_item_line"/>
            </div>
        )
    }
});

//子页面公共方法
var InitHashMixin = {
    componentWillMount: function() {
        this.initHash();
    },
    initHash: function() {
        var hash = parent._getHash();
        if (hash) {
            var index = hash.split("|");
            var allTabs = this.props.allTabs;
            if (index.length > 2 && allTabs[index[2]]) {
                this.choIndex = index[2];
            }
            //console.log(this.choIndex);
        }
    }
    
}
var SubPageMixin = {
    getInitialState: function() {
        return {
            allData: [],
            noContent: ""
        }
    },
    componentDidMount: function() {
        if (this.props.style.display == "block") {
            this.initPage();
        }
    },
    componentWillReceiveProps: function(nprops) {
        if (nprops.style.display == "block") {
            this.initPage();
        }
    },
    initPage: function() {
        if (!this.contentDom) {
            if (this.refs.content) {
                this.contentDom = $(ReactDOM.findDOMNode(this.refs.content));
                _initScroll(this.contentDom);
            } else {
                this.contentDom = true;
            }
            this.getAllData();
        }
    },
    shouldComponentUpdate: function(nprops, nstates) {
        return (nprops.style.display != "none" || this.props.style.display != "none");
    }
}
//end子页面公共方法

