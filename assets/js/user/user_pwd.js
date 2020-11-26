

$(function () {
    // 1、添加表单验证规则
    layui.form.verify({
        // 1.1、密码规则
        pwd: [/^\S{6,12}$/, '密码必须在6-16位之间'],
        // 1.2、新旧密码必须不一样规则
        samePwd: function (value) {
            if (value == $('[name=oldPwd]').val()) {
                return '新旧密码不能一样哦'
            }
        },
        // 1.2、确认密码必须和新密码一样规则
        confirmpwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '确认密码和新密码输入不一致！'
            }
        }
    })
    // 2、为表单添加提交事件
    $('.layui-form').on('submit', changePwd)
})
///1、修改密码
function changePwd(e) {
    e.preventDefault()
    // a.提交数据 到接口 完成更新密码
    $.ajax({
        method: 'post',
        url: '/my/updatepwd',
        data: $(this).serialize(),
        success: function (res) {
            // b、如果不成功，则退出函数
            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            }
            // c、如果成功，则清空token 并跳转到login.html 
            layui.layer.msg(res.message, {
                icon: 1,
                time: 1500
            }, function () {
                // localStorage.removeItem('token')
                window.top.location = '/login.html'
            })
        }
    })
}