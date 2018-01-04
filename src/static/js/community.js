import '../css/community.css';
import Base from 'base';

class communityPage extends Base{
    constructor() {
        var config = {
            searchCon:'',
            token: window.sessionStorage.getItem('token_user') || "1",//假设已登录
        }
        super(config);
    };
    ready(){  
        this.fillSearchData();
        this.searchResPage();
        this.timeRankFn();
        this.searchInteract();
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
    //搜索关键词变红色
    emphasizeKey(keyword, str) {
        keyword = keyword.replace(/\s/g, "");
        var arr = [];
        var strArr = [];
        var myhtml = '';
        var flag = true;
        for (var i = 0; i < keyword.length; i++) {
            var keyItem = keyword[i];
            for (var j = 0; j < arr.length; j++) {
                if (keyItem == arr[j]) {
                    flag = false;
                    break;
                }
                flag = true;
            }
            if (flag) {
                arr.push(keyItem);
            }
        }
        for (var i = 0; i < str.length; i++) {
            var itemStr = str[i];
            strArr.push(itemStr);
        }
        for (var j = 0; j < strArr.length; j++) {
            var item = strArr[j];
            for (var k = 0; k < arr.length; k++) {
                if (item == arr[k]) {
                    strArr[j] = "<em style='color:#ff655f; display:inline-block;'>" + item + "</em>";
                }
            }
            myhtml += strArr[j];
        }
        return myhtml;
    };
    //搜索交互
    searchInteract(){
        var _self = this;
        $(".searchBtn").on('click', function(event) {
            var content = $(this).siblings('.searchInput').val().replace(/\s/g, "") || "";
            if(content){
                _self.searchResPage();
            }else{
                $(this).siblings('.searchInput').val("");
                $(this).siblings('.note').show().addClass('red');
            }
        });
        $('.search .searchInput').on('keydown', function(event) {
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
            var theEvent = e || window.event;
            var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
            if (code == 13) {
                e.preventDefault();
                if($(".searchBtn").attr('disabled')==true){
                    return;
                }
                $(".searchBtn").click();
            }
        });
    };
    //分页
    searchResPage(curr){
        this.loading_new("#searchResDiv");
        var _self = this,
            totalPage,
            content = $('.search .searchInput').val().replace(/\s/g, "") || "",
            orderBy = parseInt($(".rankRight .timeRank").attr("timeorder")) || 1;
        _self.forbidden();
        var url = '/user/get-all-issue-list',
            data = {
                orderBy:orderBy,
                content:content,
                page: curr || 1,
                limit : 15
            };
        function successFn(res){
            $("#quesAnsLeftPage").show();
            var searchResData = res.data.items || [];
            if(searchResData.length>0){
                $(".rankRight").show();
                totalPage = Math.ceil(res.data.total/15 )|| 0; 
                for(var i=0, l = searchResData.length; i<l; i++){
                    var comment = searchResData[i].comment || "",
                        queContent = searchResData[i].content || "";
                    if(_self.judgeObj(comment)){
                        var commentCon = searchResData[i].comment.content || "";
                        if(commentCon){
                            var realLength_commentCon = _self.getStrLength(commentCon) || 0;
                            searchResData[i].comment.contentSubstr = realLength_commentCon>190 ? _self.substrIndexFn(commentCon,190) : '';
                            searchResData[i].comment.createTime = searchResData[i].comment.createTime.substr(0,10);
                        }
                    }else{
                        searchResData[i].comment = "";
                    }
                    if(queContent){
                        var realLength_queContent = _self.getStrLength(queContent) || 0;
                        searchResData[i].queContentStr = realLength_queContent>250 ? _self.substrIndexFn(queContent,250) : '';
                    }
                    var contentStr = searchResData[i].content || "",
                        queContentStr = searchResData[i].queContentStr || "";
                    if(content && contentStr){
                        searchResData[i].content = _self.emphasizeKey(content,contentStr);
                        if(queContentStr){
                            searchResData[i].queContentStr = _self.emphasizeKey(content,queContentStr);
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
        function errFn(){
            $("#quesAnsLeftPage").hide();
            var errHtml = '<div class="noSearchRes">';
                errHtml +=    '<img src= "'+ require("../images/noCon.png") + '" alt="" />';;
                errHtml +=    '<p>很抱歉，暂无相关内容</p>';
                errHtml += '</div>';
            $("#searchResDiv").html(errHtml);
        }
        function compFn(){
            _self.cancelForbidden();
            $("#quesAnsLeftPage").hide();
        }
        _self.ajaxFn(url, "GET", data, successFn, errFn, compFn, errFn);


    } 
};

new communityPage();