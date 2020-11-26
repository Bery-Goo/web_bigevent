// 在Dom树 创建完后 开始执行

$(function () {
    getUserInfo()
    $('#btnLogout').on('click', logout)
})
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers 请求头配置对象
        // 不想每次都加headers，就在baseAPI里设置
        // headers: {
        //     Authorization: localStorage.getItem('token')||''
        // },
        success(res) {
            console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            }
            // 调用  渲染用户的头像
            renderAvater(res.data)
        },
        // complete=function (res) {
        //     console.log('执行失败');
        //     // 在complete 回调函数中。可以使用res.responseJSON 
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败') {
        //         localStorage.removeItem('token')
        //         location.href = '/login.html'
        //     }
        // }
    })
}
// 渲染用户信息函数
function renderAvater(usrData) {
    // 先获取用户名（昵称/登录名）
    let usrName = usrData.nickname || usrData.username
    // 设置给 welcome span 标签
    $('#welcome').html(usrName)
    // 渲染用户的头像
    if (usrData.user_pic !== null) {
        // 有图片头像
        $('.layui-nav-img').attr('src', usrData.user_pic).show()
        // 隐藏文字头像
        $('.text-avatar').hide()
    } else {
        // 没有图片头像 使用文本头像
        // 隐藏图片头像
        $('.layui-nav-img').hide()
        // 设置文字首字
        let firstChar = usrName[0].toUpperCase()
        // 设置文字并显示
        $('.text-avatar').text(firstChar).show()
    }
}
// 3、退出按钮
function logout() {
    let layer = layui.layer
    // a.弹出确认框
    layer.confirm('确定退出登录?', { icon: 3, title: '系统提示' }, function (index) {
        console.log(index);
        // b.删除 localStorage中的token值
        localStorage.removeItem('token')
        // c.跳转到login.html 
        location.href = '/login.html'
        // 关闭弹出层
        layer.close(index)
    })
}

