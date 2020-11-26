

$(function () {
    // 为layui 添加校验规则
    layui.form.verify({
        nickname: [/^\S{2,12}$/, '昵称必须在2-12个字符之间'],
    })
    initUserInfo()
    // 重置按钮事件
    $('#btnReset').on('click', function (e) {
        // 阻止表单默认重置行为
        // e.peventDefault()
        initUserInfo()
    })
    // 表单提交事件
    $('.layui-form').on('submit', submitData)
})
// 1、加载用户的基本信息
function initUserInfo() {
    $.ajax({
        method: 'get',
        url: '/my/userinfo',
        success: function (res) {
            // 错误判断
            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            }
            console.log(res);
            // 将返回的data里面的数据加入到表单里面 （layui里面的方法，简单快速）
            layui.form.val('formUserInfo', res.data)
        }
    })
}
function submitData(e) {
    // 阻止表单的默认提交行为
    e.preventDefault()
    // 发起ajax数据请求
    $.ajax({
        method: 'post',
        url: '/my/userinfo',
        data: $(this).serialize(),
        success: function (res) {
            console.log(res);
            // 如果有错，再显示消息
            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            }
            layui.layer.msg(res.message)
            // 如果没有错，则通过window.parens 或window,top 调用父页面的方法
            window.top.getUserInfo()
        }
    })
}