import '../css/index.css';
import Base from 'base';
class IndexPage extends Base{
    constructor() {
        super();
    };
    ready(){  
        console.log('index')
        this.bannerFn();
        this.secondPart();
    };
    bannerFn() {
        var headH = $(".headerWrap").height();
        var bannerH = $(".banner").height();
        var clientHeight = window.innerHeight || document.documentElement.clientHeight|| document.body.clientHeight || 0;
        $(".banner").css('height', (clientHeight-headH)+'px');
        $(".banner .toConsult").addClass('current');
        $(".banner .toConsult").on('mouseenter', function(event) {
            $(this).addClass('hover');
        });
        $(".banner .toConsult").on('mouseleave', function(event) {
            $(this).removeClass('hover');
        });
        $('.arr').click(function(event) {
            $('html,body').animate({'scrollTop':clientHeight},1000);
        });
    };
    secondPart() {
        var liData = [{"width": "220px","height": "386px", "top":"50%","left":"50%", "margin":"-193px 0 0 -110px","opacity": "0","filter":"alpha(opacity=0)"},
            {"width": "200px","height": "358px","top":"50%","left":"84%", "margin":"-170px 0 0 -135px","opacity": "0.5","filter":"alpha(opacity=50)"},
            {"width": "200px","height": "358px","top":"50%","left":"107%", "margin":"-170px 0 0 -135px","opacity": "0.2","filter":"alpha(opacity=20)"},
            {"width": "200px","height": "358px","top":"50%","left":"130%", "margin":"-170px 0 0 -135px","opacity": "0","filter":"alpha(opacity=0)"}];
        var bkFlag, bk = 0, txt = 0, timerPrev = null, tg = $(".consult .phone1").clone(true);
        $(".consult ol li").each(function(index, el) {
            $(el).animate(liData[index], 500,function(){
                bkFlag = true;
            });
        });
        $(".consult .phoneW").append(tg);
        function next(){
            if(bkFlag){
                bkFlag = false;
                liData.push(liData.shift());
                $(".consult ol li").each(function(index, el) {
                    $(el).stop().animate(liData[index], 500, function(){
                        bkFlag = true;
                    });
                });
                txt--;
                if(txt<0){
                    txt = 3;
                }
                $(".consult ul li").eq(txt).addClass('current2').siblings('li').removeClass('current2');
                bk--;
                if(bk<0){
                    bk=3;
                    $(".consult .phoneW").css('left', -4*220);
                }
                $(".consult .phoneW").stop().animate({left:-220*bk}, 500);
            }
        }
        function prev(){
            if(bkFlag){
                bkFlag = false;
                liData.unshift(liData.pop());
                $(".consult ol li").each(function(index, el) {
                    $(el).stop().animate(liData[index], 500, function(){
                        bkFlag = true;
                    });
                });
                txt++;
                if(txt>3){
                    txt = 0;
                }
                $(".consult ul li").eq(txt).addClass('current2').siblings('li').removeClass('current2');
                bk++;
                if(bk>4){
                    bk=1;
                    $(".consult .phoneW").css('left', 0);
                }
                $(".consult .phoneW").stop().animate({left:-220*bk}, 500);
            }
        }
        timerPrev = setInterval(function(){
            prev();
        },2500);
        $(".consult .arrWrap .arrNext").on('click',  function(event) {
            next();
        });
        $(".consult .arrWrap .arrPrev").on('click', function(event) {
            prev();
        });  
        $(".consult .arrWrap .arrNext, .consult .arrWrap .arrPrev").on('mouseenter', function(event) {
            clearInterval(timerPrev);
        });
        $(".consult .arrWrap .arrNext, .consult .arrWrap .arrPrev").on('mouseleave', function(event) {
            timerPrev = setInterval(function(){
                prev();
            },2500);
        });
    }
};

new IndexPage();