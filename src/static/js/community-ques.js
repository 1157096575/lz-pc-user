import '../css/community-ques.css';
import Base from 'base';

class commQuePage extends Base{
    constructor() {
        var config = {
            token: window.sessionStorage.getItem('token_user') || "1",//假设已登录
            content_communityQue : '',
            issueType_communityQue : '',
            issueTypeText_communityQue : ''
        }
        super(config);
    };
    ready(){ 
        this.searchCommunity();
        this.fillQueData();
        this.dealDataInteract();
        this.queEvent();
    };
    //填充数据
    fillQueData(){
        var _self = this;
        _self.config.content_communityQue = window.sessionStorage.getItem('content_communityQue') || "";
        _self.config.issueType_communityQue = window.sessionStorage.getItem('issueType_communityQue') || "";
        _self.config.issueTypeText_communityQue = window.sessionStorage.getItem('issueTypeText_communityQue') || "";
        //赋值
        if(_self.config.content_communityQue) $(".queDescribe textarea").val(_self.config.content_communityQue);
        if(_self.config.issueTypeText_communityQue) {
            $(".classifyInput p i").text(_self.config.issueTypeText_communityQue);
        }
        if(_self.config.issueType_communityQue) {
            $(".classifyInput").attr("caseid",_self.config.issueType_communityQue);
            $(".classifyInput").show().siblings('.classifyNote').hide();
        }
        //清除sessionStorage     
        if($(".queDescribe textarea").val()){
            window.sessionStorage.removeItem("content_communityQue");
            $(".queDescribe .note").removeClass('red').hide();
        }
        if($(".classifyInput p i").text()){
            window.sessionStorage.removeItem("issueTypeText_communityQue");
            window.sessionStorage.removeItem("issueType_communityQue");
        }
    };
    //处理交互
    dealDataInteract(){
        $(".queClassify .classifyNote").on('click', function(event) {
            $(this).siblings('ul').show();
            $(this).removeClass('red');
        });
        $(".queClassify ul").on('click', 'li', function(event) {
            $(this).parent().siblings('.classifyInput').show();
            $(this).parent().siblings('.classifyNote').hide();
            $(this).parent().siblings('.classifyInput').children("p").children('i').text($(this).text());
            $(this).parent().siblings('.classifyInput').attr('caseid', $(this).attr('caseid'));
            $(this).parent().siblings('.classifyNote').hide();
            $(this).parent().hide();
        });
        $(".classifyInput p em").on('click', function(event) {
            $(this).siblings('i').text("");
            $(this).parent().parent().hide();
            $(this).parent().parent().siblings("ul").show();
            $(this).parent().parent().removeAttr('caseid');
            $(this).parent().parent().siblings('.classifyNote').show();
        });
        $(document).on('click', function(e) {
            if($(e.target).eq(0).is($(".queClassify .classifyInput")) || $(e.target).eq(0).is($(".queClassify .classifyNote"))|| $(e.target).eq(0).is($(".queClassify .classifyNote i")) || $(e.target).eq(0).is($(".classifyInput p em"))|| $(e.target).eq(0).is($(".queDescribe .note"))) {
                return;
            }
            $(".queClassify ul").hide();
             if($(e.target).eq(0).is($(".submitBtn"))) {
                return;
            }
            if($(".queDescribe textarea").val()=='' || $(".queDescribe textarea").val().replace(/\s/g, "")==''){
                $('.queDescribe .note').show().removeClass('red');
                $('.queDescribe .note').val('');
            }

        });
        $(".queDescribe textarea").on('click', function(event) {
            $(this).siblings('.note').removeClass('red');
        });
        $(".queDescribe textarea").on('keydown', function(event) {
            $(this).siblings('.note').hide().removeClass('red');
        });
    };
    //点击发布
    queEvent(){
        var _self = this;
        $(".submitBtn").on('click', function(event) {
            var $that = $(this),
                content = $.trim($(".queDescribe textarea").val()) || "",
                issueType = parseInt($(".queClassify .classifyInput").attr('caseid')) || "",
                issueTypeText = $(".classifyInput p i").text() || "";
            if(content==""){
                $(".queDescribe .note").addClass('red').show();
                $('.queDescribe .note').val('');
                return;
            }
            if(issueType==""){
                $(".queClassify .classifyNote").addClass('red');
                return;
            }
            function queSetSession(){
                if(content){
                    window.sessionStorage.setItem('content_communityQue',content);
                }
                if(issueType){
                    window.sessionStorage.setItem('issueType_communityQue',issueType);
                }
                if(issueTypeText){
                    window.sessionStorage.setItem('issueTypeText_communityQue',issueTypeText);
                }
            }

            if(content && issueType){
                _self.logoutState();
                $that.attr('disabled', 'disabled');
                var url = '/user/save-issue',
                    data = {
                        content : content,
                        issueType : issueType
                    },
                    sucFn = function(res){
                        var sucDivWrap = "<div class='sucDivWrap'></div>";
                        if ($(".sucDivWrap").length < 1) {
                            $('body').prepend(sucDivWrap);
                            var tag = "<div class='sucDiv sucDiv2'><h3>您的问题已提交成功</h3></div>";
                            $(".sucDivWrap").append(tag);
                            var sucTimer = setTimeout(function() {
                                $(".sucDivWrap").remove();
                                clearTimeout(sucTimer);
                            }, 2500);
                        }
                        setTimeout(function(){
                            window.location.href = "community.html";//跳到社区首页
                        },3000);
                    },
                    errFn = function(){
                        var errmsg = "您的问题提交失败"; 
                        _self.errTip(errmsg);
                    },
                    compFn = function(){
                        $that.removeAttr("disabled");
                    };
                _self.ajaxFn(url,"POST", data, sucFn, errFn, compFn, errFn);
            }
        });
    }
};

new commQuePage();