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
};

module.exports = Base;