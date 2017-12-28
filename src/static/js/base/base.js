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
};

module.exports = Base;