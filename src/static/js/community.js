import '../css/community.css';
import Base from 'base';

class communityPage extends Base{
    constructor() {
        var config = {
            searchCon:''
        }
        super(config);
    };
    ready(){  
        console.log(this.config)
        console.log(this.host);
        this.fillSearchData();
        this.searchResPage();
        this.timeRankFn();
    };
    //填充搜索数据
    fillSearchData() {
        var _self = this;
        _self.config.searchCon = window.sessionStorage.getItem("searchCon_community");
        if(_self.config.searchCon){
            $('.search .searchInput').val(_self.config.searchCon);
            $('.search .note').hide().removeClass('red');
            window.sessionStorage.removeItem("searchCon_community");
        }else{
            $('.search .note').show().removeClass('red');
        }
        if($('.search .searchInput').val().replace(/\s/g, "")){
            $('.search .note').hide().removeClass('red');
        }
    };
    //禁用全部
    forbidden(){
        $(".quesAnswersLeft .rankRight li").each(function(index, el) {
            $(el).prop('disabled', true);
        });
        $(".searchBtn").prop('disabled', true);
    };
    //取消禁用
    cancelForbidden(){
        $(".quesAnswersLeft .rankRight li").each(function(index, el) {
            $(el).prop('disabled', false);
        });
        $(".searchBtn").prop('disabled', false);
    };
    //时间筛选
    timeRankFn(){
        var _self = this;
        $(".quesAnswersLeft .rankRight .timeRank").on('click', function(event) {
            $(this).siblings('ul').show();
        });
        $(".quesAnswersLeft .rankRight li").on('click', function(event) {
            $(this).addClass('current').siblings('li').removeClass('current');
            $(this).parent().siblings('.timeRank').html($(this).text());
            $(this).parent().hide();
            $(".rankRight .timeRank").attr("timeorder",$(this).attr("timeorder"));
            _self.searchResPage();
        });
    };
    //新浪分享
    sinaShareEvent(){
        $('.xina').on('click',function(){
            var shareSinauserName = $(this).attr('data-username') + ' ';
            var shareSinacontent = shareSinauserName+ $(this).attr('data-content');
            var shareSinaurl = $(this).attr('data-shareurl');
            var sina = 'http://service.weibo.com/share/share.php?title='+shareSinacontent+'&url='+shareSinaurl;
            window.open(sina);
        });
    };
    //微信分享
    weChatShareEvent() {

    };
    //分页
    searchResPage(curr){
        this.loading_new("#searchResDiv");
        var _self = this;
        var totalPage;
        var content = $('.search .searchInput').val().replace(/\s/g, "") || "";
        var orderBy = parseInt($(".rankRight .timeRank").attr("timeorder")) || 1;
        _self.forbidden();
        $.ajax({
            url: _self.host + "/user/get-all-issue-list",
            data:{
                orderBy:orderBy,
                content:content,
                page: curr || 1,
                limit : 15
            },
            success:function(res){
                _self.cancelForbidden();
                var res = JSON.parse(res);
                console.log(res)
                if(res.code==1){
                    resFn(res)
                }else{
                    $("#quesAnsLeftPage").hide();
                    var errHtml = '<div class="noSearchRes">';
                        errHtml +=    '<img src= "'+ require("../images/noCon.png") + '" alt="" />';
                        errHtml +=    '<p>很抱歉，暂无相关内容</p>';
                        errHtml += '</div>';
                    $("#searchResDiv").html(errHtml);
                }
                function resFn(res){
                    $("#quesAnsLeftPage").show();
                    var searchResData = res.data.items || [];
                    if(searchResData.length>0){
                        $(".rankRight").show();
                        totalPage = Math.ceil(res.data.total/15 )|| 0; 
                        for(var i=0; i<searchResData.length; i++){
                            var comment = searchResData[i].comment || "";
                            var queContent = searchResData[i].content || "";
                            if(_self.judgeObj(comment)){
                                var commentCon = searchResData[i].comment.content || "";
                                if(commentCon){
                                    var realLength_commentCon = _self.getStrLength(commentCon) || 0;
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
                            var contentStr = searchResData[i].content || "";
                            var queContentStr = searchResData[i].queContentStr || "";
                            if(content){
                                if(contentStr){
                                    var newcontentStr = _self.emphasizeKey(content,contentStr);
                                    searchResData[i].content = newcontentStr;
                                    if(queContentStr){
                                        var newqueContentStr = _self.emphasizeKey(content,queContentStr);
                                        searchResData[i].queContentStr = newqueContentStr;
                                    }
                                }
                            }
                        }
                        laypage({
                            cont: 'quesAnsLeftPage', 
                            pages: totalPage,
                            curr: curr || 1, 
                            skin: '#01bafe',
                            groups: 5,
                            first: 1,
                            last: totalPage,
                            jump: function(obj, first){
                                if(!first){
                                    _self.searchResPage(obj.curr);
                                }
                            }
                        });
                    }else{
                        $(".rankRight").hide();
                    }
                    var searchResText = doT.template($("#searchResTmpl").text());
                    $("#searchResDiv").html(searchResText(searchResData));
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
                    _self.sinaShareEvent();
                    _self.weChatShareEvent();
                }
            },
            error:function(res){
                this.cancelForbidden();
                if(res){
                    $("#quesAnsLeftPage").hide();
                    var errHtml = '<div class="noSearchRes">';
                        errHtml +=    '<img src= "'+ require("../images/noCon.png") + '" alt="" />';;
                        errHtml +=    '<p>很抱歉，暂无相关内容</p>';
                        errHtml += '</div>';
                    $("#searchResDiv").html(errHtml);
                }
            }
        })
    } 
};

new communityPage();