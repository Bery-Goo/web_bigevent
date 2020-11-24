$(function () {
    // 点击  去注册账号  的链接
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    // 点击  去登录  的链接 
    $('#link_login').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    // 从layui中获取form对象
    let form = layui.form
    // 为layui添加登录校验规则
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 使用函数作为自定义规则 如果出错，返回消息，如果正常，什么也不做    value是 确认密码框中的 密码
        repwd: function (value) {
            // 通过形参拿到的是确认密码框的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败，则return一个提示消息
            var pwd = $('.reg-box [name=password]').val()
            console.log(pwd);
            console.log(value);
            if (pwd !== value) return '两次密码不一致';
        }
    })
    // 注册表单提交事件
    // onsubmit 校验包含
    $('#regForm').on('submit', submitData);
    // 注册表单登录事件
    $('#formLogin').on('submit', function (e) {
        e.preventDefault()
        // 获取登录表单数据
        let dataStr = $(this).serialize()
        // 异步提交到登录接口
        $.ajax({
            url: '/api/login',
            method: 'post',
            data: dataStr,
            success(res) {
                console.log(res);
                // 登录失败
                if (res.status != 0) return layui.layer.msg(res.message)
                // 登录成功
                layui.layer.msg(res.message, {
                    icon: 1,
                    time: 1500 //1.5秒关闭（如果不配置，默认是3秒
                }, function () {
                    // a.保存token 值到localStorage
                    localStorage.setItem('token', res.token)
                    // b.跳转到index.html 
                    location.href = '/index.html'
                })
            }
        })
    })
})
// 根路径
// let baseUrl = 'http://ajax.frontend.itheima.net';
// 去掉基路径，使用引入的ajaxPrefilter里面拼接的路径
// 使用ajaxPrefilter的目的就是统一在发送ajax请求之前，来执行一些准备工作 比如：为url添加基地址  对请求报文做处理

// 注册函数
function submitData(e) {
    // 阻断表单默认提交
    e.preventDefault();
    // 获取 表单数据
    let dataStr = $(this).serialize();
    console.log(dataStr);
    $.ajax({
        method: 'post',
        url: '/api/reguser',
        data: dataStr,
        // dataType: 'jsonp',
        success: function (res) {
            console.log(res);
            // 不论成功与否，都显示消息
            layui.layer.msg(res.message);
            // 注册出错
            if (res.status != 0) return;
            // 将用户名密码自动填充到登录表单中
            let uname = $('.reg-box [name=username]').val().trim()
            $('.login-box [name=username]').val(uname)
            let upwd = $('.reg-box [name=password]').val().trim()
            $('.login-box [name=password]').val(upwd)
            // 清空注册表单
            $('#regForm')[0].reset()

            // 切换到登录页面
            $('#link_login').click()
        }
    });
}
