
$(function () {
    // 获取文章分类的列表
    initArtCateList()
    $('#btnAddCate').on('click', showWindow)
    // 通过代理的形式为其绑定submit事件
    $('body').on('submit', '#formAdd', doAdd)
    // 通过代理方式 为未来的删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', doDelete)
    // 通过代理的方式 为btn-edit 按钮绑定点击事件
    $('tbody').on('click', '.btn-edit', showEdit)
})
// 1、加载文章分类列表
function initArtCateList() {
    $.ajax({
        method: 'get',
        url: '/my/article/cates',
        success: function (res) {
            // console.log(res);
            // 1、遍历数组 生成htmL字符串
            let strHtml = template('tpl-cate', res.data)
            // 2、将html字符串渲染到tbody中
            $('tbody').html(strHtml)
        }
    })
}
let layerID = null    //保存open时返回的id
// 2、显示新增窗口
function showWindow() {
    // layui里弹出层 在线调试 设置type和area属性
    layerID = layui.layer.open({
        type: 1,
        area: ['500px', '250px'],
        title: '添加文章分类',
        content: $('#tpl-window').html()
    })
}

// 3、执行新增
// 新增/编辑 标志位：0 新增打开的窗口 1 编辑的窗口
// let flag = 0
function doAdd(e) {
    e.preventDefault()
    // 获取 弹出层 标题
    let title = $('.layui-layer-title').text().trim()
    if (title == '添加文章分类') {
        // console.log('提交');
        // a.获取数据
        let dataStr = $(this).serialize();  //这里获取到的是 Id=&name=123&alias=456

        // 将数组字符串中的  id=& 替换成空字符串
        dataStr = dataStr.replace('Id=&', '') //这里获取到的是 name=123&alias=456

        // 需要判断当前提交是 新增还是编辑操作
        // b.异步请求
        $.ajax({
            method: 'post',
            url: '/my/article/addcates',
            data: dataStr,
            success: function (res) {
                layui.layer.msg(res.message)
                if (res.status !== 0) {
                    return
                }
                // c.重新获取分类列表
                initArtCateList()
                // d.关闭弹出层
                layui.layer.close(layerID)   //按照id关闭弹出层
            }
        })
    } else {
        // 编辑操作
        $.ajax({
            url: '/my/article/updatecate',
            method: 'post',
            data: $(this).serialize(),
            success(res) {
                layui.layer.msg(res.message)
                if (res.status !== 0) return
                initArtCateList()
                layui.layer.close(layerID)
            }
        })
    }
}
// 执行删除
function doDelete() {
    // let id = this.getAttribute('data-id')
    // h5提供的获取data- 属性的快捷语法
    let id = this.dataset.id
    // 如果用户点击确认 则执行回调函数
    layer.confirm('确定要删除吗？', function (index) {
        // console.log('要删除的是：', id);
        // 发送异步请求
        $.ajax({
            // deletecate?id=1 是查询参数
            // /deletecate/1 是动态参数
            url: '/my/article/deletecate/' + id,
            method: 'get',
            success(res) {
                layui.layer.msg(res.message)
                if (res.status !== 0) {
                    return
                }
                // 如果删除成功，则重新请求 列表数据
                initArtCateList()
            }
        })
        // 关闭当前 确认框
        layui.layer.close(index)
    })
}
// 显示编辑
// let indexEdit = null
function showEdit() {
    console.log(this.dataset.id);
    // 弹出一个修改文章分类信息的层
    layerID = layui.layer.open({
        type: 1,
        area: ['500px', '250px'],
        title: '编辑文章分类',
        content: $('#tpl-window').html()
    })
    // 获取id 
    let id = this.dataset.id
    // 查询数据
    $.ajax({
        url: '/my/article/cates/' + id,
        method: 'get',
        success(res) {
            // 将获取的文章分类数据自动装填到表单元素
            layui.form.val('formData', res.data)
        }
    })
}