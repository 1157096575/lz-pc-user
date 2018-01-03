import '../css/community-con.css';
import Base from 'base';

class commConPage extends Base{
    constructor() {
        var config = {
            issueId: '',
            token: window.sessionStorage.getItem('token_user') || "1", //假设已登录
            totalPage: '',
            userLogo: '',
            userName: '',
            loadFlag: ''
        }
        super(config);
    };
    ready(){  
        console.log(this.config)
        console.log(this.host);
        this.config.issueId = parseInt(this.getRequest('issueid'));
        this.issueInfoFn();
        this.searchCommunity();
    };
    //接收URL传递过来的参数
    getRequest(parm) {
        var query = window.location.search;
        var iLen = parm.length;
        var iStart = query.indexOf(parm);
        if (iStart == -1) return "";
        iStart += iLen + 1;
        var iEnd = query.indexOf("&", iStart);
        if (iEnd == -1) return query.substring(iStart);
        return query.substring(iStart, iEnd);
    }
    //查询问题信息
    issueInfoFn(){
        var _self = this;
        _self.loading_new("#issueInfoDiv");
        var url = '/user/get-issue-info',
            data = {issueId : _self.config.issueId},
            sucFn = function(res){
                var issueInfoData = res.data || "";
                issueInfoData.issueid = _self.config.issueId;
                _self.config.userLogo = issueInfoData.userLogo;
                _self.config.userName = issueInfoData.userName;
                var issueInfoText = doT.template($("#issueInfoTmpl").text());
                $("#issueInfoDiv").html(issueInfoText(issueInfoData));
            },
            errFn = function(){
                _self.errHFn("#issueInfoDiv");
            },
            compFn = function(){
                console.log('comp');
            };
        _self.ajaxFn(url,"GET", data, sucFn, errFn, compFn, errFn);
    };
    errHFn(dom) {
        var errHtml = '';
        errHtml += '<div class="relatedIssues noIssueBox">';
        errHtml +=    '<div class="noIssue">';
        errHtml +=        '<img src= "'+ require("../images/noCon.png") + '" alt="" />';
        errHtml +=        '<p>很抱歉，暂无相关内容</p>';
        errHtml +=    '</div>';
        errHtml += '</div>';
        $(dom).html(errHtml);
    };
    //更多回答
    getMoreComment(self){
        var _self = this;
        if (_self.checknll(_self.config.token)) {
            return;
        }
        var $that = $(self);
        var isMine = $that.attr('data-ismine') == 'false' ? false : true;
        if($that.hasClass('getMoreCommentClick')){
            return;
        }
        $that.addClass('getMoreCommentClick');        
        var curr = 1;
        _self.config.loadFlag = true;
        getMoreCommentPage(curr);
        function getMoreCommentPage(){
            _self.loading_new("#getMoreCommentDiv");
            var totalPage;
            _self.config.loadFlag = false;
            var url = '/user/get-more-comment',
            data = {
                    issueId:_self.config.issueId,
                    page: curr || 1,
                    limit : 15
                },
            sucFn = function(res){
                _self.config.loadFlag = true;
                var moreCommentData = res.data.items || [];
                if(moreCommentData.length>0){
                    for(var i=0; i<moreCommentData.length; i++){
                        moreCommentData[i].isMine = isMine;
                    }
                    var moreCommentText = doT.template($("#moreCommentTmpl").text());
                    totalPage = Math.ceil(res.data.total/15 )|| 0; 
                    if(curr==1){
                        $("#getMoreCommentDiv").html("");
                    }
                    $("#getMoreCommentDiv").append(moreCommentText(moreCommentData));
                    if(totalPage>1){
                        if($("#loadMore-getMoreCommentPage").length==0 && $(".answerList").length>0){
                            var pageHtml = '<div id="loadMore-getMoreCommentPage" style="text-align:center"></div>';
                            $("#getMoreCommentPage").append(pageHtml);
                        }
                        if(curr<totalPage){
                            $("#loadMore-getMoreCommentPage").html("加载更多");
                            curr++;
                        }else{
                            $("#loadMore-getMoreCommentPage").html("没有更多了");
                            var loadTimer = setTimeout(function(){
                                $("#loadMore-getMoreCommentPage").hide();
                                clearTimeout(loadTimer);
                            },2000);
                        }
                    }
                }else{
                    _self.errHFn("#getMoreCommentDiv");
                }
            },
            errFn = function(){
                var errmsg = "查询失败";
                _self.errTip(errmsg);
            },
            compFn = function(){
                $(".queAns_moreAnsw").remove();
                $that.removeClass('getMoreCommentClick');
                _self.loadinghide_new("#getMoreCommentDiv");

            };
            _self.ajaxFn(url,"GET", data, sucFn, errFn, compFn, errFn);  
        }
        $(document).on('scroll', function(event) {
            if($("#loadMore-getMoreCommentPage").length>0 && _self.bottomed("loadMore-getMoreCommentPage") && _self.config.loadFlag && $("#loadMore-getMoreCommentPage").html()=="加载更多"){
                getMoreCommentPage();
            }
        });
    };
    //判断触底
    bottomed(domId){
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        var clientHeight = window.innerHeight ;
        if(domId){
            var offsetTop = document.getElementById(domId).offsetTop;
        }
        var height = $(".footerWrap").height();
        if(scrollTop+clientHeight>offsetTop+height){
            return true;
        }
    };
    //点赞
    agreeEvent(self){
        console.log(self);
        var _self = this;
        if (_self.checknll(_self.config.token)) {
            return;
        }
        var $that = $(self);
        if($that.hasClass('conListLikeClick')){
            return;
        }
        $that.addClass('conListLikeClick');
        var commentId = parseInt($that.attr("data-replyid"));
        if($that.hasClass('yes')){
            //取消点赞
            var url = '/user/delete-agree-info',
            data = {commentId: commentId},
            sucFn = function(res){
                $that.removeClass('yes');
                var agreeNum = parseInt($that.attr('data-agreenum'))-1;
                $that.text(agreeNum+"条赞");
                $that.attr('data-agreenum',agreeNum);
            },
            errFn = function(){
                var errmsg = "取消点赞失败"; //提示信息
                _self.errTip(errmsg);
            },
            compFn = function(){
                $that.removeClass('conListLikeClick');
            };
            _self.ajaxFn(url,"POST", data, sucFn, errFn, compFn);  
            //点赞
        }else{
            var url = '/user/save-agree-info',
            data = {
                    issueId: _self.config.issueId,
                    issueCommentId:commentId
                },
            sucFn = function(res){
                $that.addClass('yes');
                var agreeNum = parseInt($that.attr('data-agreenum'))+1;
                $that.text(agreeNum+"条赞");
                $that.attr('data-agreenum',agreeNum);
            },
            errFn = function(){
                var errmsg = "点赞失败";
                 _self.errTip(errmsg);
            },
            compFn = function(){
                $that.removeClass('conListLikeClick');
            };
            _self.ajaxFn(url,"POST", data, sucFn, errFn, compFn); 
        }
    };
    //收藏
    collectEvent(self){
        var _self = this;
        if (_self.checknll(_self.config.token)) {
            return;
        }
        var $that = $(self);
        var replyid = parseInt($that.attr("data-replyid"));
        if($that.hasClass('collectEventClick')){
            return;
        }
        $that.addClass('collectEventClick');
        if($that.hasClass('yes')){
            //取消收藏           
            var url = '/user/delete-issue-collect',
            data = {commentId: replyid},
            sucFn = function(res){
                $that.removeClass('yes');
                $that.text("收藏");
            },
            errFn = function(){
                var errmsg = "取消收藏失败";
                _self.errTip(errmsg);
            },
            compFn = function(){
                $that.removeClass('collectEventClick');
            };
            _self.ajaxFn(url,"POST", data, sucFn, errFn, compFn); 
            //收藏
        }else{
            var url = '/user/save-issue-collect',
            data = {issueId: _self.config.issueId, issueCommentId: replyid},
            sucFn = function(res){
                $that.addClass('yes');
                $that.text("取消收藏");
            },
            errFn = function(){
                var errmsg = "收藏失败";
                _self.errTip(errmsg);
            },
            compFn = function(){
                $that.removeClass('collectEventClick');
            };
            _self.ajaxFn(url,"POST", data, sucFn, errFn, compFn); 
        }
    };
    //关注
    issueConcernEvent(self){
        var _self = this;
        if (_self.checknll(_self.config.token)) {
            return;
        }
        var $that = $(self);
        $that.attr('disabled', 'disabled');
        //关注
        if($that.hasClass('blue')){
            var url = '/user/save-issue-concern',
            data = {issueId: _self.config.issueId},
            sucFn = function(res){
                $that.removeClass('blue');
                var concernNum = parseInt($that.siblings('.conRight_attent').children('.attenrNo').find('.number').text())+1;
                $that.siblings('.conRight_attent').children('.attenrNo').find('.number').text(concernNum);
                $that.text("取消关注")
            },
            errFn = function(){
                var errmsg = "关注失败";
                _self.errTip(errmsg);
            },
            compFn = function(){
                $that.removeAttr("disabled");
            };
            _self.ajaxFn(url,"POST", data, sucFn, errFn, compFn);    
        //取消关注
        }else{
            var url = '/user/delete-issue-concern',
            data = {issueId: _self.config.issueId},
            sucFn = function(res){
                $that.addClass('blue');
                var concernNum = parseInt($that.siblings('.conRight_attent').children('.attenrNo').find('.number').text())-1;
                $that.siblings('.conRight_attent').children('.attenrNo').find('.number').text(concernNum);
                $that.text("点击关注");
            },
            errFn = function(){
                var errmsg = "取消关注失败";
                _self.errTip(errmsg);
            },
            compFn = function(){
                $that.removeAttr("disabled");
            };
            _self.ajaxFn(url,"POST", data, sucFn, errFn, compFn); 
        }
    };
    //查看追问
    getAskAgain(self){
        var _self = this;
        if (_self.checknll(_self.config.token)) {
            return;
        }
        var $that = $(self);
        var replyid = parseInt($that.attr("data-replyid")); //回答id
        var lawyerid = parseInt($that.attr("data-lawyerid")) || "";
        var $domAskAgainBoxWrap = $that.parent().parent().siblings('.askAgainBoxWrap');
        if($domAskAgainBoxWrap.length>0){
            $that.removeClass('yes');
            $domAskAgainBoxWrap.remove();
            return;
        }
        var url = '/user/get-comment-id',
        data = {id:replyid},
        sucFn = function(res){
            var askAgainData = _self.dealAskAgainData(res);
            var askAgainText = '<div class="askAgainBoxWrap hasAskAgain">';
            askAgainText +=   '<div class="askAgainBox">';
            askAgainText +=      '<div class="askAgainTl clear">';
            askAgainText +=         '<div class="askTlLeft" data-allasknum="'+askAgainData.length+'">'+askAgainData.length+'条追问</div>';
            askAgainText +=         '<span class="replyLoadAgain" onclick="commConPage.replyLoadAgain(this)" data-replyid="'+replyid+'"></span>';
            askAgainText +=     '</div>';
            askAgainText +=      '<div class="askConBox">';
            askAgainText +=            '<div class="askCon">';
            askAgainText += _self.commonAskAgainText(askAgainData, 'this');
            askAgainText +=             '</div>';
            askAgainText +=         '<div class="replyWrap">';
            askAgainText +=             '<div class="replyBox clear">';
            askAgainText +=                  '<div class="replayInput">';
            askAgainText +=                      '<span class="replyNote">填写追问内容（256字以下）</span>';
            askAgainText +=                     '<textarea class="textP" maxlength="256" contenteditable="true"></textarea>';
            askAgainText +=                 '</div>';
            askAgainText +=                 '<div class="btnBox clear">';
            askAgainText +=                     '<button class="sureReply" data-replyid="'+replyid+'" onclick="commConPage.appendComment(this)">确定</button>';
            askAgainText +=                 '</div>';
            askAgainText +=                 '<p class="appendCommentFail">回复失败</p>';
            askAgainText +=              '</div>';
            askAgainText +=          '</div>';
            askAgainText +=     '</div>';
            askAgainText +=  '</div>';
            if(askAgainData.length > 3){
            askAgainText +=  '<button class="checkAll showAll askagainFlag" data-restnum="'+(askAgainData.length-3)+'" onclick="commConPage.checkAllAskAgain(this)">查看其余'+(askAgainData.length-3)+'条</button>';
            }else{
            askAgainText += '<button class="checkAll showAll askagainFlag" style="display:none" onclick="commConPage.checkAllAskAgain(this)">查看其余0条</button>';
            }
            askAgainText +=  '</div>';  
            if($domAskAgainBoxWrap.length==0){
                $that.parent().parent().parent().append(askAgainText);
                $that.parent().parent().parent().siblings('.answerList').find('.askAgainBoxWrap').remove();
            }
            var answerLength = askAgainData.length || 0;
            var $domCheckAll = $that.parent().parent().siblings('.askAgainBoxWrap').find('.checkAll');
            if(answerLength>3){
                var $domAskCon = $that.parent().parent().siblings('.askAgainBoxWrap').find('.askCon');
                var $domAskConList = $domAskCon.children('.askConList');
                var domAskConListLength2 = $domAskCon.children('.askConList').length-3;
                var $domAskConList2 = $domAskCon.children('.askConList:lt('+domAskConListLength2+')');
                $domAskConList2.hide();
            } 
             _self.textP();
        },
        errFn = function(){
            var errmsg = "查看追问失败";
            _self.errTip(errmsg);
        },
        compFn = function(){
            
        };
        _self.ajaxFn(url,"GET", data, sucFn, errFn, compFn); 
        
    };
    //处理追问框
    textP(){
        var _self = this;
        $(".textP").on('focus', function(event) {
            $(this).siblings('.replyNote').hide();
            $(this).parent().addClass('focus');
        });
        $(".textP").on('blur', function(event) {
            if($(this).val()=="" || $(this).val().replace(/\s/g, "")==""){
                $(this).siblings('.replyNote').show();
                $(this).parent().removeClass('focus');
                $(this).val("");
            }else{
                $(this).siblings('.replyNote').hide();
            }
            $(this).siblings('.replyNote').removeClass('red');
        });

        $(".textP").on('click', function(event) {
            if($(this).val()<0){
                $(this).val("0");
            }
            $(this).siblings('.replyNote').removeClass('red');
            $(this).parent().siblings('.rewardBox').children('.rewardNote').removeClass('red');
        });
        $(".textP").keydown(function(e) {
            $(this).siblings('.replyNote').removeClass('red').hide();
            if($(this).text()<0){
                $(this).text("0");
            }
            var theEvent = e || window.event;
            var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
            if (code == 13) {
                e.preventDefault();
                var $dom = $(this).parent().siblings('.btnBox').children('.sureReply');
                if($(".sureReply").length>0){
                    if($(".sureReply").attr('disabled')=='disabled'){
                        return;
                    }
                    _self.appendComment(".sureReply");
                }
            }
        });
    };
    //继续追问
    appendComment(self){
        var _self = this;
        var $that2 = $(self);
        var $textP = $that2.parent().siblings('.replayInput').children('.textP');
        var content = $textP.val().replace(/\s/g, "") || "";
        var replyId = parseInt($that2.attr('data-replyid'));
        $textP.on('keydown', function(event) {
            content = content.length>256 ? content.substr(0,256) : content;
        });
        $that2.attr('disabled', 'disabled');
        var url = '/user/append-comment',
        data = {
                content : content,
                issueId : _self.config.issueId,
                replyId : replyId
            },
        sucFn = function(res){
            var replyHtml = '';
            var contentLength = _self.getStrLength(content) || 0;
            var contentSubstr = contentLength>180 ? _self.substrIndexFn(content,180) : "";
            replyHtml += '<div class="askConList">';
            replyHtml +=    '<div class="lawyerInfo">';
            replyHtml +=        '<div class="lawyerImg">';
            replyHtml +=             '<img src="'+_self.config.userLogo+'" alt="" />';
            replyHtml +=         '</div>';
            replyHtml +=         '<div class="lawyerName">'+_self.config.userName+'</div>';
            replyHtml +=     '</div>';
            replyHtml +=     '<div class="answerCon replyAnswerCon">';
            if(contentSubstr){
                replyHtml +=         '<div class="subStr">'+contentSubstr+'</div>';
                replyHtml +=         '<div class="allStr">'+content+'</div>';
                replyHtml +=         '<a class="showAnswer askagainFlag2" onclick="commConPage.showAllAnswer(this)" href="javascript:;">显示全部</a>';
            }else{
                replyHtml +=         '<div class="subStr">'+content+'</div>';
            }
            replyHtml +=     '</div>';
            replyHtml += '</div>';
            $that2.parent().parent().parent().siblings('.askCon').append(replyHtml);
            $that2.parent().parent().siblings('.answerIcons').show();
            $that2.parent().siblings('.replayInput').removeClass('focus');
            $that2.parent().siblings('.replayInput').children('.textP').val("");
            $that2.parent().siblings('.replayInput').children('.replyNote').show();
            //处理追问信息
            var $domAskCon = $that2.parent().parent().parent().siblings('.askCon');
            var $domAskConList = $domAskCon.children('.askConList');
            var domAskConListLength = $domAskCon.children('.askConList').length;
            var $domAskTlLeft = $that2.parent().parent().parent().parent().siblings(".askAgainTl").find('.askTlLeft');
            var allAskNum = parseInt($domAskTlLeft.attr('data-allasknum')) + 1 || 1;
            $domAskTlLeft.attr('data-allasknum', allAskNum);
            $domAskTlLeft.text(allAskNum+"条追问");
            if(domAskConListLength>3){
                var domAskConListLength2 = $domAskCon.children('.askConList').length-3;
                var $domAskConList2 = $domAskCon.children('.askConList:lt('+domAskConListLength2+')');
                var domCheckAll = $that2.parent().parent().parent().parent().parent().siblings('.checkAll');
                var restnum = parseInt(domCheckAll.attr('data-restnum'))+1 || 1;
                if(domCheckAll.hasClass('showAll')){
                    $domAskConList2.hide();
                    domCheckAll.text("查看其余"+restnum+"条");  
                }else{
                    domCheckAll.text("收起");
                    setTimeout(function(){
                        $domAskCon.scrollTop(99999999);
                    },100);
                }
                domCheckAll.show();
                domCheckAll.attr('data-restnum', restnum); 
            }
        },
        errFn = function(){
            $that2.parent().siblings('.appendCommentFail').show();
            var failTimer = setTimeout(function(){
                $that2.parent().siblings('.appendCommentFail').hide();
                clearTimeout(failTimer);
            },2000);

        },
        compFn = function(){
            $that2.removeAttr("disabled");
        };
        _self.ajaxFn(url,"POST", data, sucFn, errFn, compFn); 
    };
    //显示掩藏
    showAllAnswer(self){
        if($(self).text()=="显示全部"){
            $(self).parent().addClass('showAll');
            $(self).text("收起");
        }else{
            $(self).parent().removeClass('showAll');
            $(self).text("显示全部");
        }
    };
    //处理追问数据
    dealAskAgainData(res){
        var _self = this;
        var askAgainData = res.data || [];
        for(var i=0; i<askAgainData.length; i++){
            var askContent = askAgainData[i].content || "";
            var askContentLength = _self.getStrLength(askContent) || 0;
            var issueCommentListData = askAgainData[i].issueCommentList || [];
            askAgainData[i].contentSubstr = askContent && askContentLength>180 ? _self.substrIndexFn(askContent,180) : '';
            if(issueCommentListData.length>0){
                for(var j=0; j<issueCommentListData.length; j++){
                    var issueCommentCon = issueCommentListData[j].content || "";
                    var issueCommentConLength = _self.getStrLength(issueCommentCon) || 0;
                    askAgainData[i].issueCommentList[j].contentSubstr = issueCommentCon && issueCommentConLength>156 ? _self.substrIndexFn(issueCommentCon,156) : '';
                }
            }
        }
        return askAgainData;
    };
    //askAgainText共同部分
    commonAskAgainText(askAgainData, context){
        var askAgainText = '';
        for(var i=0; i<askAgainData.length; i++){
        askAgainText +=             '<div class="askConList">';
        askAgainText +=                 '<div class="lawyerInfo">';
        askAgainText +=                     '<div class="lawyerImg">';
        askAgainText +=                         '<img src="'+askAgainData[i].userLogo+'" alt="" />';
        askAgainText +=                     '</div>';
        askAgainText +=                     '<div class="lawyerName">'+askAgainData[i].userName+'</div>';
        askAgainText +=                 '</div>';
        askAgainText +=                 '<div class="answerCon replyAnswerCon">';
            if(askAgainData[i].contentSubstr){
        askAgainText +=                     '<div class="subStr">'+askAgainData[i].contentSubstr+'</div>';
        askAgainText +=                      '<div class="allStr">'+askAgainData[i].content+'</div>';
        askAgainText +=                      '<a class="showAnswer askagainFlag1" href="javascript:;" onclick="commConPage.showAllAnswer('+context+')">显示全部</a>';
            }else{
        askAgainText +=                     '<div class="subStr">'+askAgainData[i].content+'</div>';
            }
        askAgainText +=                 '</div>';
        var myissueCommentListData = askAgainData[i].issueCommentList || [];
        if(myissueCommentListData.length>0){
            for(var j=0; j<myissueCommentListData.length; j++){
                var myissueCommentItem = myissueCommentListData[j];
                askAgainText += '<div class="reReplyBox">';
                askAgainText +=     '<div class="answerCon replyAnswerCon">';
                if(myissueCommentItem.contentSubstr){
                    askAgainText +=          '<div class="subStr">';
                    askAgainText +=              '<span><i>'+myissueCommentItem.userName+'律师</i>：回复<i>'+askAgainData[i].userName+'</i>：</span>'+myissueCommentItem.contentSubstr+'';
                    askAgainText +=           '</div>';
                    askAgainText +=         '<div class="allStr">';
                    askAgainText +=              '<span><i>'+myissueCommentItem.userName+'律师</i>：回复<i>'+askAgainData[i].userName+'</i>：</span>'+myissueCommentItem.content+'</div>';
                    askAgainText +=         '<a class="showAnswer" href="javascript:;" onclick="showAllAnswer('+context+')">显示全部</a>';
                }else{
                    askAgainText +=          '<div class="subStr">';
                    askAgainText +=              '<span><i>'+myissueCommentItem.userName+'律师</i>：回复<i>'+askAgainData[i].userName+'</i>：</span>'+myissueCommentItem.content+'</div>';
                }
                
                askAgainText +=     '</div>';
                askAgainText +=  '</div>';
            }
        } 
        askAgainText +=             '</div>';
        }
        return askAgainText;
    };
    //刷新追问信息
    replyLoadAgain(self){
        var _self = this;
        if (_self.checknll(_self.config.token)) {
            return;
        }
        var $that = $(self);
        var replyid = parseInt($that.attr("data-replyid")); //回答id
        var $myaskConBox = $that.parent().siblings('.askConBox')
        var $myaskCon = $myaskConBox.children('.askCon');
        
        var mydiv = "<div class='myloading' style='height:70px; width:100%'></div>";
        var $myloading = $myaskCon.find('.myloading');
        if($myloading.length==0){
            $myaskCon.prepend(mydiv);
        }    
        _self.loading_new(".myloading");
        $myaskConBox.css({
            paddingTop: '70px',
            position: 'relative'
        });
        $(".myloading").css({
            position: 'absolute',
            left: '0',
            top:'0'
        });
        $that.prop('disabled', true);
        var url = '/user/get-comment-id',
        data = {id:replyid},
        sucFn = function(res){
            $myaskConBox.css({
                paddingTop: '0',
                position: 'static'
            });
            $(".myloading").css({
                position: 'static'
            });
            var askAgainData = _self.dealAskAgainData(res);
            var askAgainText = _self.commonAskAgainText(askAgainData, 'this');
            $that.parent().siblings('.askConBox').children('.askCon').html(askAgainText);
            var $askTlLeft = $that.siblings(".askTlLeft");
            var answerLength = askAgainData.length || 0;
            $askTlLeft.attr('data-allasknum', answerLength);
            $askTlLeft.text(answerLength+"条追问");
            var $domCheckAll = $that.parent().parent().siblings('.checkAll');
            if(answerLength>3){
                if($domCheckAll.hasClass('showAll')){
                    var $domAskCon = $that.parent().siblings('.askConBox').children('.askCon');
                    var $domAskConList = $domAskCon.children('.askConList');
                    var domAskConListLength2 = $domAskCon.children('.askConList').length-3;
                    var $domAskConList2 = $domAskCon.children('.askConList:lt('+domAskConListLength2+')');
                    $domAskConList2.hide();
                    $domCheckAll.attr('data-allasknum', answerLength-3);
                    $domCheckAll.text("查看其余"+(answerLength-3)+"条");
                }else{
                    $domCheckAll.text("折叠追问");
                }
            }
            _self.textP();
        },
        errFn = function(){
            var errmsg = "查看追问失败";
            _self.errTip(errmsg);
        },
        compFn = function(){
            $that.prop('disabled', false);
        };
        _self.ajaxFn(url,"GET", data, sucFn, errFn, compFn); 
    };
    //查看其余追问
    checkAllAskAgain(self){
        var $that = $(self);
        var restNum = $that.attr('data-restnum') || "";
        var $domAskCon = $that.siblings('.askAgainBox').find('.askCon');
        if($that.hasClass('showAll')){
            $domAskCon.children('.askConList:lt('+restNum+')').show();
            $that.removeClass('showAll');
            $that.text("收起");
        }else{
            $domAskCon.children('.askConList:lt('+restNum+')').hide();
            $that.addClass('showAll');
            $that.text("查看其余"+restNum+"条");
        }
    };
};

var page = new commConPage();
top.commConPage = page;