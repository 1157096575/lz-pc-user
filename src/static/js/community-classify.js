import '../css/community-classify.css';
import Base from 'base';

class commClassifyPage extends Base{
    constructor() {
        var config = {
            token: window.sessionStorage.getItem('token_user') || "1",
            totalPage: ''
        }
        super(config);
    };
    ready(){  
        var _self = this;
        console.log(this.host);
        this.classifyPage(1,-1,0);
        this.conditionFn();
    };
    //条件赛选
    conditionFn(){
        var _self = this;
        $(".quesAnswersLeft .rankRight .timeRank").on('click', function(event) {
            $(this).siblings('ul').show();
        });
        //选择时间排序
        $(".quesAnswersLeft .rankRight").on('click',"li", function(event) {
            _self.forbidden();
            $(this).addClass('current').siblings('li').removeClass('current');
            $(this).parent().siblings('.timeRank').html($(this).text());
            $(this).parent().hide();
            $(".quesAnswersLeft .rankRight .timeRank").attr('timeorder', $(this).attr("timeorder"));
            var orderBy = parseInt($(this).attr("timeorder"));
            var issueType = parseInt($(".classfyTl ul li.current").attr('caseid'));
            var selectConcern = parseInt($(".quesAnswersRight ul .attened").attr("selectconcern"));
            _self.classifyPage(orderBy,issueType,selectConcern);
        });
        //点击案件类型
        $(".classfyTl ul").on('click', 'li', function(event) {
            $(this).addClass('current').siblings('li').removeClass("current");
            var issueType = parseInt($(this).attr('caseid'));
            var orderBy = parseInt($(".quesAnswersLeft .rankRight .timeRank").attr('timeorder'));
            var selectConcern = parseInt($(".quesAnswersRight ul .attened").attr("selectconcern"));
            _self.forbidden();
            _self.classifyPage(orderBy,issueType,selectConcern);
        });
        //是否查询已关注的列表
        $(".quesAnswersRight ul .attened").on('click', function(event) {
            /*if(communityClassify.data.token=='' || communityClassify.data.token == 'undefined'){ //未登录
                user.tip(".tipCon");//登录提示
                user.bounced(".tipSureBtn",".loginWrap");//登录框
                user.loginEvent();
                return;
            }*/
            _self.forbidden();
            if($(this).hasClass('current')){
                $(this).removeClass('current');
                $(this).attr("selectconcern",0);
                var selectConcern = 0;
            }else{
                $(this).addClass('current');
                $(this).attr("selectconcern",1);
                var selectConcern = 1;
            }
            var issueType = parseInt($(".classfyTl ul li.current").attr('caseid'));
            var orderBy = parseInt($(".quesAnswersLeft .rankRight .timeRank").attr('timeorder'));
            _self.classifyPage(orderBy,issueType,selectConcern);
        });
    };
    //禁用全部
    forbidden(){
        $(".classfyTl ul li").each(function(index, el) {
            $(el).prop('disabled', true);
        });
        $(".quesAnswersLeft .rankRight li").each(function(index, el) {
            $(el).prop('disabled', true);
        });
        $(".quesAnswersRight ul .attened").prop('disabled', true);
    };
    //取消禁用
    cancelForbidden(){
        $(".classfyTl ul li").each(function(index, el) {
            $(el).prop('disabled', false);
        });
        $(".quesAnswersLeft .rankRight li").each(function(index, el) {
            $(el).prop('disabled', false);
        });
        $(".quesAnswersRight ul .attened").prop('disabled', false);
    };
    //分页
    classifyPage(orderBy,issueType,selectConcern,curr){
        var _self = this;
        _self.loading_new("#classifyDiv");
        var url = '/user/get-issue-list-type',
            data = {
                orderBy:orderBy,
                issueType:issueType,
                selectConcern:selectConcern,
                page: curr || 1,
                limit : 15
            };
        function successFn(res){
            $("#classifyPage").show();
            var searchResData = res.data.items || [];
            if(searchResData.length>0){
                _self.config.totalPage = Math.ceil(res.data.total/15 )|| 0; 
                for(var i=0; i<searchResData.length; i++){
                    var comment = searchResData[i].comment;
                    var queContent = searchResData[i].content || "";
                    if(_self.judgeObj(comment)){
                        var commentCon = searchResData[i].comment.content || "";
                        if(commentCon){
                            var realLength_commentCon = _self.getStrLength(commentCon) || 0 ;
                            if(realLength_commentCon>180){
                                searchResData[i].comment.contentSubstr = _self.substrIndexFn(commentCon,180);
                            }else{
                                searchResData[i].comment.contentSubstr = "";
                            }
                            searchResData[i].comment.createTime = searchResData[i].comment.createTime.substr(0,10);
                        }
                    }else{
                        searchResData[i].comment = "";
                    }
                    if(queContent){
                        var realLength_queContent = _self.getStrLength(queContent) || 0;
                        if(realLength_queContent>256){
                            searchResData[i].queContentStr = _self.substrIndexFn(queContent,256);
                        }else{
                            searchResData[i].queContentStr = "";
                        }
                    }
                }
                laypage({
                    cont: 'classifyPage', 
                    pages: _self.config.totalPage,
                    curr: curr || 1, 
                    skin: '#01bafe',
                    groups: 5,
                    first: 1,
                    last: _self.config.totalPage, 
                    jump: function(obj, first){
                        if(!first){
                            _self.classifyPage(orderBy,issueType,selectConcern,obj.curr);
                        }
                    }
                });
            }else{
                _self.config.totalPage = 0;
            }
            var classifyText = doT.template($("#classifyTmpl").text());
            $("#classifyDiv").html(classifyText(searchResData));
            _self.showAllFn(".conListAnsw .answer .showAnswer");
            $(".leftConList>.showAnswer").on('click', function(event) {
                if($(this).text()=="显示全部"){
                    $(this).siblings('.toCon').find('.question').addClass('showAll');
                    $(this).text("收起");
                }else{
                    $(this).siblings('.toCon').find('.question').removeClass('showAll');
                    $(this).text("显示全部");
                }
            });
            //点击关注图标
            _self.attentEvent();
            //点击收藏图标
            _self.collectEvent();
            //新浪分享
            _self.sinaShareEvent();
            //微信分享
            _self.weChatShareEvent();
            //点赞
            _self.likeEvent();
        }
        function erhFn(){
            var errHtml = '<div class="noSearchRes">';
                errHtml +=    '<img src= "'+require("../images/noCon.png")+ '" alt="" />';
                errHtml +=    '<p>很抱歉，暂无相关内容</p>';
                errHtml += '</div>';
            $("#classifyDiv").html(errHtml);
        }
        function errFn(res){
            _self.cancelForbidden();
            erhFn();
        }
        function compFn(){
            console.log('comp');
        }

        function f4() {
            _self.config.totalPage = 0;
            $("#classifyPage").hide();
            erhFn();
        }
        _self.ajaxFn(url, "get", data, successFn, errFn, compFn, f4);
    };
    //关注
    attentEvent(){
        var _self = this;
        $(".attent").on('click', function(event) {
            if(_self.config.token=='' || _self.config.token == 'undefined'){ //未登录
                //user.tip(".tipCon");//登录提示
                //user.bounced(".tipSureBtn",".loginWrap");//登录框
                //user.loginEvent();
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
    collectEvent(){
        var _self = this;
        $(".collect").on('click', function(event) {
            if(_self.config.token=='' || _self.config.token == 'undefined'){ //未登录
                //user.tip(".tipCon");//登录提示
                //user.bounced(".tipSureBtn",".loginWrap");//登录框
                //user.loginEvent();
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
    sinaShareEvent(){
        $('.xina').on('click',function(){
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
    likeEvent(){
        var _self = this;
        $(".conListLike").on('click', function(event) {
            if(_self.config.token=='' || _self.config.token == 'undefined'){ //未登录
                //user.tip(".tipCon");//登录提示
                //user.bounced(".tipSureBtn",".loginWrap");//登录框
                //user.loginEvent();
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
                    if(agreeNum<=9999){
                        $that.children('span').text(agreeNum);
                    }else{
                       $that.children('span').text("9999+"); 
                    }
                    $that.children('span').attr('data-agreenum',agreeNum);
                }
                function errFn(res){
                    if (res) {
                        var errmsg = "取消点赞失败"; //提示信息
                        _self.errTip(errmsg);
                    }
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
                    if(agreeNum<=9999){
                        $that.children('span').text(agreeNum);
                    }else{
                       $that.children('span').text("9999+"); 
                    }
                    $that.children('span').attr('data-agreenum',agreeNum);
                }
                function errFn(res){
                    if (res) {
                        var errmsg = "点赞失败"; //提示信息
                        _self.errTip(errmsg);
                    }
                }
                function compFn(){
                    $that.removeClass('conListLikeClick');
                }
                _self.ajaxFn(url, "POST", data, successFn, errFn, compFn);
            }
        });
    }
};

new commClassifyPage();