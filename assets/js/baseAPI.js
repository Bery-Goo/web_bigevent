
// 1、为页面上所有基于 jq 的ajax 请求发送之前，对参数对象处理
// $.ajax做的事情：
// 1、接收传入的参数对象
// 2、为参数对象添加各种成员
// 3、调用ajaxPrefilter中的函数  并将参数对象传给他
// 4、创建异步对象，发送异步请求
$.ajaxPrefilter(function (ajaxOpt) {
    // console.log(ajaxOpt);
    // a.拼接基地址
    ajaxOpt.url = 'http://ajax.frontend.itheima.net' + ajaxOpt.url
    // b.统一为有权限的接口，设置Header请求头
    // 2、为所有/my/请求 添加token 

    if (ajaxOpt.url.indexOf('/my/') > -1) {
        ajaxOpt.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    // 3、为所有的ajax 请求 统一配置complet 事件函数
    // 获取响应报文之后，先执行success或error回调函数，最后执行complete回调函数
    // success拿到的是响应报文体里面的内容，complete拿到的是响应报文对象 它们的res数据内容不一样
    ajaxOpt.complete = function (res) {
        // console.log('执行失败');
        // 在complete 回调函数中，可以使用res.responseJSON 
        // 1、判断 返回的数据是否在告诉我们没有登录【没有登录】
        // console.log(res);
        // console.log(res.responseJSON);
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 没有登录 则：
            // d1:显示需要重新登录的消息 显示结束 再执行 清空token和跳转操作
            layer.msg(res.responseJSON.message, {
                icon: 1,
                time: 1500 //1.5秒关闭（如果不配置，默认是3秒)
            }, function () {
                // d2:清空 tokrn 
                localStorage.removeItem('token')
                // d3: 跳转到 login.html
                window.top.location.href = '/login.html'
            })
        }
    }
})