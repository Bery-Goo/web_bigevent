
$(function () {
    template.defaults.imports.dataFormat = function (date) {
        let dt = new Date(date)
        let y = dt.getFullYear();
        let m = padZero(dt.getMonth() + 1);
        let d = padZero(dt.getDate());

        let hh = padZero(dt.getHours());
        let mm = padZero(dt.getMinutes());
        let ss = padZero(dt.getSeconds());
        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
    }
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }
    // 为查询表单 绑定事件
    $('#formSearch').on('submit', search)
    initArtList()
    initCate()
    // 为未来的删除按钮代理点击事件
    $('tbody').on('click', '.btn-delete', del)
})
// 全局变量 分页查询参数对象
let q = {
    pagenum: 1,  //页码值 默认请求第一页的数据
    pagesize: 2,  //每页显示几条数据 默认每页显示2条
    cate_id: '',  //文章分类的id
    state: ''   //文章发布状态
}

///1、加载 文章列表
function initArtList() {
    $.ajax({
        method: 'get',
        url: '/my/article/list',
        data: q,
        success(res) {
            // console.log(res);
            // if (res.status !== 0) {
            //     return layui.layer.msg(res.message)
            // }
            // 1、遍历数组生成 html 字符串
            let strHtml = template('tpl-list', res)
            // 将html 字符串 渲染到tbody中
            $('tbody').html(strHtml)
            // 调用渲染 分页 的方法（当页面渲染完成后再渲染分页）
            renderPage(res.total)
        }
    })
}
// 2、加载分类下拉框
function initCate() {
    $.ajax({
        method: 'get',
        url: '/my/article/cates',
        success(res) {
            let htmlStr = template('tpl-cate', res.data)
            // console.log(htmlStr);
            $('select[name=cate_id]').html(htmlStr)
            // render 可以重新根据html下拉框生成漂亮的下拉框  通知layui 重新渲染下拉框和其他表单元素
            layui.form.render()
        }
    })
}
// 3、查询事件处理函数
function search(e) {
    // 阻断表单提交
    e.preventDefault()
    // 逐一获取查询表单下拉框的数据 设置给 分页查询参数对象
    q.cate_id = $('select[name=cate_id]').val()
    q.state = $('select[name=state]').val()
    // let cate_id = $('[name=cate_id]').val()
    // let state = $('[name=state]').val()
    // 重新加载文章列表
    initArtList()
}
// 生成页码条
// 注意：laypage中的jump函数触发时机1、layout.render 会执行首次触发2、切换页容量下拉框触发
function renderPage(total) {
    // console.log(total);
    layui.laypage.render({
        elem: 'pageBox',  //分页容器
        count: total,   //总数据条数
        limit: q.pagesize,  //总页数
        curr: q.pagenum,   //当前页码
        // 内置模块-->分页-->基础参数选项
        layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
        limits: [2, 3, 5, 10],  //页码容量
        // 点击页码的事件函数 
        // 触发jump回调的方法有两种：
        // 1、点击页码的时候 会触发jump回调
        // 2、只要调用render方法就会触发jump回调
        // （首次执行：调用render时触发jump,其他执行：点击页码时触发jump）
        jump: function (obj, first) {
            // console.log(obj.curr);
            // 把最新的页码值 赋值到pagenum中
            q.pagenum = obj.curr   //获取当前页码 设置给分页查询参数
            // 把最新的条目数赋值到q 这个查询参数对象中
            q.pagesize = obj.limit;   //获取 下拉框中选中的页容量设置给分页查询参数
            // 根据最新的q获取对应的数据列表 并渲染表格    直接调用会发生死循环(jump一直在触发 ）加first判断是否是首次执行，点击了页码按钮会初始化
            // initArtList()  
            if (!first) {
                initArtList()
            }
        }
    })
}
// 删除业务
function del() {
    // 获取 页面上剩余函数
    let rows = $('tbody tr .btn-delete').length;
    let id = this.dataset.id
    layer.confirm('确定要删除吗？', { icon: 3, title: '提示' }, function (index) {
        // console.log('要删除的是：', id);
        // 发送异步请求
        $.ajax({
            // deletecate?id=1 是查询参数
            // /deletecate/1 是动态参数
            url: '/my/article/delete/' + id,
            method: 'get',
            success(res) {
                layui.layer.msg(res.message)
                if (res.status !== 0) {
                    return
                }
                // 当数据删除完成后，需要判断当前这一页中是否还有剩余数值，如果没有则让页码值-1，之后再重新调用initArtList 方法
                if (rows === 1) {
                    // 如果当前页面已经是第一页，则仍然保持1 如果不是第一页，就往前翻一页
                    q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                }

                // 如果删除成功，则重新请求 列表数据
                initArtList()
            }
        })
        // 关闭当前 确认框
        layui.layer.close(index)
    })
}