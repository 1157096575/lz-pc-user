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
        console.log(this.host);
        this.classifyPage(1,-1,0);
        this.conditionFn();
        this.searchCommunity();
    };
    //条件筛选
    conditionFn(){
        var _self = this,
            $rankRight = $(".quesAnswersLeft .rankRight"),
            $timeRank = $rankRight.children('.timeRank'),
            $attened = $(".quesAnswersRight ul .attened"),
            $classfytlUl = $(".classfyTl ul"),
            $classfytlUlCur = $classfytlUl.children('.current');
        $timeRank.on('click', function(event) {
            $(this).siblings('ul').show();
        });
        //选择时间排序
        $rankRight.on('click',"li", function(event) {
            _self.forbidden();
            $(this).addClass('current').siblings('li').removeClass('current');
            $(this).parent().siblings('.timeRank').html($(this).text());
            $(this).parent().hide();
            $timeRank.attr('timeorder', $(this).attr("timeorder"));
            var orderBy = parseInt($(this).attr("timeorder"));
            var issueType = parseInt($classfytlUlCur.attr('caseid'));
            var selectConcern = parseInt($attened.attr("selectconcern"));
            _self.classifyPage(orderBy,issueType,selectConcern);
        });
        //点击案件类型
        $(".classfyTl ul").on('click', 'li', function(event) {
            $(this).addClass('current').siblings('li').removeClass("current");
            var issueType = parseInt($(this).attr('caseid'));
            var orderBy = parseInt($timeRank.attr('timeorder'));
            var selectConcern = parseInt($attened.attr("selectconcern"));
            _self.forbidden();
            _self.classifyPage(orderBy,issueType,selectConcern);
        });
        //是否查询已关注的列表
        $attened.on('click', function(event) {
            if (_self.checknll(_self.config.token)) {
                return;
            }
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
            var issueType = parseInt($classfytlUlCur.attr('caseid'));
            var orderBy = parseInt($timeRank.attr('timeorder'));
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
                            if(realLength_commentCon>190){
                                searchResData[i].comment.contentSubstr = _self.substrIndexFn(commentCon,190);
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
                        if(realLength_queContent>250){
                            searchResData[i].queContentStr = _self.substrIndexFn(queContent,250);
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
            _self.attentEvent('.attent');
            //点击收藏图标
            _self.collectEvent('.collect');
            //新浪分享
            _self.sinaShareEvent('.xina');
            //微信分享
            _self.weChatShareEvent();
            //点赞
            _self.likeEvent('.conListLike');
        }
        function erhFn(){
            var errHtml = '<div class="noSearchRes">';
                errHtml +=    '<img src= "'+require("../images/noCon.png")+ '" alt="" />';
                errHtml +=    '<p>很抱歉，暂无相关内容</p>';
                errHtml += '</div>';
            $("#classifyDiv").html(errHtml);
        }
        function errFn(res){
            erhFn();
        }
        function compFn(){
            _self.cancelForbidden();
            console.log('comp');
        }
        function f4() {
            console.log('f4');
            _self.config.totalPage = 0;
            $("#classifyPage").hide();
            erhFn();
        }
        _self.ajaxFn(url, "get", data, successFn, errFn, compFn, f4);
    };
};

new commClassifyPage();