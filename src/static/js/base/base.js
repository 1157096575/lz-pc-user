class Base{
    constructor(_config) {
        this.host = __SiteEnv__.host;
        this.config = _config || {};
        let _self = this;
        this.ready();
        this.footFn();
    };
    ready() { 
        console.log('base');
        this.searchCommunity();
    };
    footFn() {
        var aa = 1;
        if($("#footerWrap").length>0){
            var ft = `<div class="footerWrap">
                <div class="footer clear">
                    <div class="right">
                        <p class="about">关于我们</p>
                        <p class="web">华海律正（http://www.hao13322.com）是国内领先的法律服务平台，致力于为用户提供优质法律服务。华海律正成立至今以其诚信、透明、公平、高效、创新的特征赢得用户口碑。</p>
                        <div class="copy clear">
                            <p>Copyright © 2014-2017 lvzheng. All Rights Reserved</p>
                            <p>深圳市华海律正网络科技有限公司</p>
                        </div>
                    </div>
                </div>
            </div>`;
            $("#footerWrap").html(ft);
        }
    };
    //判断对象是否为空
    judgeObj(obj) {
        for (var i in obj) {
            return true;
        }
        return false;
    };
    //获取字符串长度（数字英文为1，汉字为2）
    getStrLength(str) {
        var realLength = 0,
            len = str.length,
            charCode = -1;
        for (var i = 0; i < len; i++) {
            charCode = str.charCodeAt(i);
            if (charCode >= 0 && charCode <= 128) {
                realLength += 1;
            } else {
                realLength += 2;
            }
        }
        return realLength;
    };
    //截取字符串(l不为索引)
    substrIndexFn(str, l) {
        var realLength = 0,
            len = str.length,
            charCode = -1;
        for (var i = 0; i < len; i++) {
            charCode = str.charCodeAt(i);
            if (charCode >= 0 && charCode <= 128) {
                realLength += 1;
            } else {
                realLength += 2;
            }
            if (realLength == l || realLength == (l - 1)) {
                var mystr = this.substrFn(str, i);
                return mystr;
            }
        }
    };
    //截取字符串
    substrFn(str, l) {
        var str = str;
        str = str.substr(0, l).replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]$/g, "") + "...";
        return str;
    };
    //收起-显示全部
    showAllFn(dom) {
        $(dom).on('click', function(event) {
            if ($(this).text() == "显示全部") {
                $(this).parent().addClass('showAll');
                $(this).text("收起");
            } else {
                $(this).parent().removeClass('showAll');
                $(this).text("显示全部");
            }
        });
    };
    //优化加载
    loading_new(dom) {
        var domH = $(dom).height();
        $(dom).css('position', 'relative');
        var loading = "<div class='loadEffectWrap'><div class='loadEffect'><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div><p class='text-p'>拼命加载中</p></div> ";
        $(dom).prepend(loading);
        $(".loadEffectWrap").css({
            height: domH + 'px'
        });
    };
    loadinghide_new(dom) {
        $(dom).children('.loadEffectWrap').remove();
    };
    //封装ajax请求
    ajaxFn(url, type, data, f1, f2, f3, f4) {
        var _self = this;
        $.ajax({
            url: _self.host + url,
            headers: {
                "X-Requested-With":"XMLHttpRequest",
                token: window.sessionStorage.getItem('token_user') || 1
            },
            type: type, 
            data: data, 
            success:function(res){
                var res = JSON.parse(res);
                if(res){
                    var code = res.code;
                    switch(code){
                        case 1:
                            f1 && f1(res);
                            break;
                        case 0:
                            var errmsg = res.msg; 
                            _self.errTip(errmsg);
                            break;
                        case 10:
                            sessionStorage.clear();
                            window.location.href = "./login.html";
                            break;
                        case 100:
                            var errmsg = "律师未认证，无法进行此操作";
                            _self.errTip(errmsg);
                        default:
                            if(f4){
                                f4()
                            }else{
                                var errmsg = res.msg;
                                _self.errTip(errmsg);
                            }
                    }
                }
            },
            error:function(res){
                var res = JSON.parse(res);
                f2 && f2(res)
            },
            complete:function(res){
                f3 && f3(res);
            }
        })
    };
    //处理ajax请求成功的数据
    dealAjaxSucRes(res, fn) {
        var _self = this;
        if (res.code == 1) {
            fn && fn(res);
        } else if (res.code == 0) {
            var errmsg = res.msg; //提示信息
            _self.errTip(errmsg);
        } else if (res.code == 10 || res.code == 11) {
            sessionStorage.clear();
            window.location.href = "./login.html";
        } else if (res.code == 100) {
            var errmsg = "律师未认证，无法进行此操作"; //提示信息
            _self.errTip(errmsg);
        } else {
            var errmsg = res.msg; //提示信息
            _self.errTip(errmsg);
        }
    };
    //请求错误提示框
    errTip(txt) { //txt为错误信息
        var errDivWrap = "<div class='errDivWrap'></div>";
        if ($(".errDivWrap").length < 1) {
            $('body').prepend(errDivWrap);
            var tag = "<div class='errDiv'><h3>提示</h3><p>" + txt + "</p><i class='closeBtn'></i><div class='sureDiv'><a class='sureBtn'>确定</a></div></div>";
            $(".errDivWrap").append(tag);
            $(".errDivWrap").show();
            $(".errDiv .closeBtn, .errDiv .sureDiv").on('click', function(event) {
                $(".errDivWrap").remove();
            });
        }
    };
    //验证空值
    checknll(fromsj) {
        if (fromsj && fromsj.length > 0) {
            for (var i = 0; i < fromsj.length; i++) {
                if (i < fromsj.length - 1) {
                    if ($.trim(fromsj[i]) == "") {
                        return true;
                    }
                } else {
                    if ($.trim(fromsj[i]) == "") {
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        } else {
            return true;
        }
    };
    //关注
    attentEvent(dom){
        var _self = this;
        $(dom).on('click', function(event) {
            /*if(_self.config.token=='' || _self.config.token == 'undefined'){ //未登录
                //user.tip(".tipCon");//登录提示
                //user.bounced(".tipSureBtn",".loginWrap");//登录框
                //user.loginEvent();
                return;
            }*/
            if (_self.checknll(_self.config.token)) {
                return;
            }
            var $that = $(this);
            //取消关注
            if($that.hasClass('attentClick')){
                return;
            }
            $that.addClass('attentClick');
            var issueId = parseInt($that.attr("data-issueid"));
            if($that.hasClass('yes')){
                var url = '/user/delete-issue-concern',
                    data = {issueId: issueId};
                function attentResFn(attentRes){
                    $that.removeClass('yes');
                    $that.text("关注");
                }
                function errFn(attentRes){
                    if (attentRes) {
                        var errmsg = "取消关注失败";
                        _self.errTip(errmsg);
                    }
                }
                function compFn(){
                    $that.removeClass('attentClick');
                }
                _self.ajaxFn(url,"POST", data, attentResFn, errFn, compFn);
                //关注
            }else{
                var url = '/user/save-issue-concern',
                    data = {issueId: issueId};
                function attentResFn(attentRes){
                    $that.addClass('yes');
                    $that.text("取消关注");
                }
                function errFn(attentRes){
                    if (attentRes) {
                        var errmsg = "关注失败";
                        _self.errTip(errmsg);
                    }
                }
                function compFn(){
                    $that.removeClass('attentClick');
                }
                _self.ajaxFn(url, "POST", data, attentResFn, errFn, compFn);
            }
        });
    };
    //收藏
    collectEvent(dom){
        var _self = this;
        $(dom).on('click', function(event) {
            console.log(_self.config.token);
            if (_self.checknll(_self.config.token)) {
                return;
            }
            var $that = $(this);
            if($that.hasClass('collectClick')){
                return;
            }
            $that.addClass('collectClick');
            if($that.hasClass('yes')){
                var commentId = parseInt($that.attr("data-issuecommentid"));
                //取消收藏
                var url = '/user/delete-issue-collect',
                    data = {commentId: commentId};
                function successFn(res){
                    $that.removeClass('yes');
                    $that.text("收藏");
                }
                function errFn(res){
                    if (res) {
                        var errmsg = "取消收藏失败";
                        _self.errTip(errmsg);
                    }
                }
                function compFn(){
                    $that.removeClass('collectClick');
                }
                _self.ajaxFn(url, "POST", data, successFn, errFn, compFn);
        
                //收藏
            }else{
                var issueId = parseInt($that.attr("data-issueid"));
                var issueCommentId = parseInt($that.attr("data-issuecommentid"));
                var url = '/user/save-issue-collect',
                    data = {issueId: issueId, commentId: commentId};
                function successFn(res){
                    $that.addClass('yes');
                    $that.text("取消收藏");
                }
                function errFn(res){
                    if (res) {
                        var errmsg = "收藏失败"; //提示信息
                        _self.errTip(errmsg);
                    }
                }
                function compFn(){
                    $that.removeClass('collectClick');
                }
                _self.ajaxFn(url, "POST", data, successFn, errFn, compFn);
            }
        });
    };
    //新浪分享
    sinaShareEvent(dom){
        $(dom).on('click',function(){
            var shareSinauserName =  $(this).attr('data-username') + ' '; //作者
            var shareSinacontent = shareSinauserName+ $(this).attr('data-content'); //内容
            var shareSinaurl = $(this).attr('data-shareurl'); //url
            var sina = 'http://service.weibo.com/share/share.php?title='+shareSinacontent+'&url='+shareSinaurl;
            window.open(sina);
        });
    };
    //微信分享
    weChatShareEvent(){
    };
    //点赞
    likeEvent(dom){
        var _self = this;
        $(dom).on('click', function(event) {
            if (_self.checknll(_self.config.token)) {
                return;
            }
            var $that = $(this);
            if($that.hasClass('conListLikeClick')){
                return;
            }
            $that.addClass('conListLikeClick');
            if($that.hasClass('yes')){
                var commentId = parseInt($that.attr("data-issuecommentid"));
                //取消点赞
                var url = '/user/delete-agree-info',
                    data = {commentId: commentId};
                function successFn(res){
                    $that.removeClass('yes');
                    var agreeNum = parseInt($that.children('span').attr('data-agreenum'))-1;
                    var agreeNumTxt = agreeNum <= 9999 ? agreeNum : '9999+';
                    $that.children('span').text(agreeNumTxt);
                    $that.children('span').attr('data-agreenum',agreeNum);
                }
                function errFn(res){
                    var errmsg = "取消点赞失败";
                    _self.errTip(errmsg);
                }
                function compFn(){
                    $that.removeClass('conListLikeClick');
                }
                _self.ajaxFn(url, "POST", data, successFn, errFn, compFn);
                //点赞
            }else{
                var issueId = parseInt($that.attr("data-issueid"));
                var issueCommentId = parseInt($that.attr("data-issuecommentid"));
                var url = '/user/save-agree-info',
                    data = {issueId: issueId, commentId: commentId};
                function successFn(res){
                    $that.addClass('yes');
                    var agreeNum = parseInt($that.children('span').attr('data-agreenum'))+1;
                    var agreeNumTxt = agreeNum <= 9999 ? agreeNum : '9999+';
                    $that.children('span').text(agreeNumTxt);
                    $that.children('span').attr('data-agreenum',agreeNum);
                }
                function errFn(res){
                    var errmsg = "点赞失败";
                    _self.errTip(errmsg);
                }
                function compFn(){
                    $that.removeClass('conListLikeClick');
                }
                _self.ajaxFn(url, "POST", data, successFn, errFn, compFn);
            }
        });
    };
    //社区头部搜索(社区模块社区首页外的页面引用)
    searchCommunity() {
        console.log(0);
        $(".searchBtn").on('click', function(event) {
            console.log(111111111111);
            var searchCon = $(this).siblings('.searchInput').val().replace(/\s/g, "");
            if (searchCon) {
                window.sessionStorage.setItem("searchCon_community", searchCon);
                 window.location.href = "../community.html"; //跳到社区首页
            } else {
                $(this).siblings('.searchInput').val("");
                $(this).siblings('.note').show().addClass('red');
            }
        });
        if($(".searchInput").val().replace(/\s/g, "")){
            $(".searchInput").val('');
            $('.searchInput').siblings('.note').show().removeClass('red');
        }
        $('.search .searchInput').on('keydown', function(event) {
            //$(this).removeClass('red');
            $(this).siblings('.note').hide().removeClass('red');
        });
        $(document).on('click', function (e) {
            if ($(e.target).eq(0).is($(".search")) || $(e.target).eq(0).is($(".search .note")) || $(e.target).eq(0).is($(".search .searchInput"))) {
                return;
            }
            if($('.search .searchInput').val().replace(/\s/g, "")==""){
                $('.search .note').show();
                $('.search .searchInput').val("");
            }
        });
        $(".searchInput").keydown(function(e) {
            // 兼容FF和IE和Opera
            var theEvent = e || window.event;
            var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
            if (code == 13) {
                //回车执行查询
                e.preventDefault();
                $(".searchBtn").click();
            }
        });
    };
};

//new Base().searchCommunity();
module.exports = Base;