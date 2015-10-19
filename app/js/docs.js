(function($) {
  'use strict';

  /* code here! */

  console.log('hello world!');

  var touchend = 'ontouchend' in window ? 'touchend' : 'click';

  //基本变量
  var rows = 3,count = 9;

  //获得宽高
  var vw = $(document.body).width(),
    vh = window.innerHeight,
    cw = $('.cell').width(),
    ch = cw * 1;

  //初始化间距
  var mar = vh - ch * rows - 160;

  function initT(){
    $('.row:not(:last-child)').css('margin-bottom', mar / (rows - 1));
    $('.table').css('margin', '80px auto');
  }

  //按照70% 20% 7% 3%的概率生成12张图片中奖的比例（假的）
  function myRandom() {
    var rand = Math.random();
    if (rand < .7) return 10;
    if (rand < .9) return 20;
    if (rand < .97) return 50;
    if (rand < 1) return 100;
  }

  //随机闪烁
  function ranfk(){
    return Math.floor(Math.random()*count);
  }

  var speed = 1000,integral = 0,sum = 0,startTime,overTime,time = 30 * 1000;
  var fknum, lastState;

  //开始闪烁
  function run(){
    if(!startTime){
      startTime = $.now();
    }
    overTime = $.now();
    if(overTime - startTime > time){
      console.log('game over');
      //初始化环境
      startTime = void 0;
      lastState = void 0;
      fknum = void 0;
      sum = 0;
      $('.cell').removeAttr('data-num').removeAttr('style');
      return;
    }
    $('.cell').removeAttr('data-num').removeAttr('style');
    fknum = ranfk();
    while(fknum === lastState){
      fknum = ranfk();
    }
    lastState = fknum;
    console.log(fknum);
    $($('.cell').get(fknum)).css('border','3px solid red').attr('data-num',fknum);
    if(sum  >= 200){
      speed = 800;
    }else if(sum  >= 500){
      speed = 600;
    }else if(sum  >= 700){
      speed = 500;
    }
    setTimeout(run,speed);
  }
  //开始闪烁
  function fk1(){
    setTimeout(run,2000);
  }

  //偏移点计算
  var goX, goY;
  goX = vw / 2 - cw / 2;
  goY = vh / 2 - ch / 2;

  //随机取积分图片（假的）场景1初始化
  $('.cell').each(function (index) {
    var ran = myRandom();
    $(this).css('background-image', 'url("http://dummyimage.com/300x300/'+ran+ran+ran+'/fff")');
    if(index === 4){
      $(this).css('background-image', 'url("http://dummyimage.com/300x300/e42f34/fff")');
      $(this).attr('data-start', 'start');
    }
  });
  $('.row').css('margin-bottom', (vh - ch * rows - 200)/2);
  $('.container').addClass('down');


  var ifStart = false;

  $(document).on(touchend, '.cell', function(e) {
      if(ifStart){
        if($(this).attr('data-num')){
          $(this).removeAttr('data-num');
          sum += myRandom();
          console.log(sum);
          $(this).toggleClass('rotate').one('webkitTransitionEnd', function(){
            $(this).toggleClass('rotate');
            $(this).removeAttr('style');
          });
        }
      }

    })
    .on(touchend, '[data-start]', function(e) {
      $(this).removeAttr('data-start');
      var ran = myRandom();
      $(this).css('background-image', 'url("http://dummyimage.com/300x300/'+ran+ran+ran+'/fff")');
      $('.intro').hide();
      initT();
      $('.cell').each(function(index) {
        $(this).css('transform', 'rotateY(180deg)').one('webkitTransitionEnd', function(){
          $(this).removeAttr('style');
          $(this).css('transform', 'translate(' + (goX - $(this).offset().left) + 'px,' + (goY - $(this).offset().top) + 'px) rotateY(0deg)').one('webkitTransitionEnd', function() {
            $(this).removeAttr('style');
            $(this).toggleClass('rotate');
            if( index === (count - 1)){
              $('.cell').addClass('trans');
              fk1();
              ifStart = true;
            }
          });
        });
      });
    });

})(jQuery);
