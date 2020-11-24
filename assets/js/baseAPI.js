
// 为页面上所有基于 jq 的ajax 请求发送之前，对参数对象处理
// $.ajax做的事情：
// 1、接收传入的参数对象
// 2、为参数对象添加各种成员
// 3、调用ajaxPrefilter中的函数  并将参数对象传给他
// 4、创建异步对象，发送异步请求
$.ajaxPrefilter(function (ajaxOpt) {
    console.log(ajaxOpt);
    // 拼接基地址
    ajaxOpt.url = 'http://ajax.frontend.itheima.net' + ajaxOpt.url
})