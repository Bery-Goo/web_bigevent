// 将两个变量作为全局变量
let $image = null
let options = null
$(function () {
    // 0、初始化富文本编辑器
    initEditor()
    ///1、请求分类下拉框数据
    initCateList()

    // 2、初始化裁剪区域
    // 1. 初始化图片裁剪器
    $image = $('#image')
    // 2. 裁剪选项
    options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 3、为选择封面按钮 添加事件
    $('#btnChoose').on('click', () => {
        // 模拟 文件选择框 被点击
        $('#coverFile').click()
    })
    // 在入口函数中为 文件选择框 绑定事件处理函数
    $('#coverFile').on('change', fileChange)

    // 定义文章的发布状态
    $('#btnPublish').on('click', publish)
    $('#btnDraft').on('click', draft)
    // 6、为表单添加 绑定提交事件
    $('#form_pub').on('submit', doSubmit)
})

// 1、渲染数据
function initCateList() {
    // a.异步请求 分类列表数据
    $.ajax({
        method: 'get',
        url: '/my/article/cates',
        success(res) {
            // b.读取模板 并 结合res.data 生成下拉框html 
            let htmlStr = template('tpl-catelist', res.data)
            // c.将下拉框 html设置给select 标签
            $('select[name=cate_id]').html(htmlStr)
            // d.重新渲染下拉框
            layui.form.render()
        }
    })
}
// 2、选中文件
function fileChange(e) {
    let fileList = e.target.files
    if (fileList.length == 0) {
        return layui.layer.msg('请选择文件！')
    }
    let file = e.target.files[0]
    let newImgURL = URL.createObjectURL(file)
    $image
        .cropper('destroy')      // 销毁旧的裁剪区域
        .attr('src', newImgURL)  // 重新设置图片路径
        .cropper(options)        // 重新初始化裁剪区域
}

// 3、发布和草稿公用的 点击事件处理函数
let state = '已发布'
function publish() {
    state = '已发布'
}
function draft() {
    state = '存为草稿'
}
// 4、表单提交事件的处理函数
function doSubmit(e) {
    // a.阻断表单默认行为
    e.preventDefault()
    // b.获取表单数据 装入FormData对象（有文件要上传）
    let fd = new FormData(this)
    // c.为FormData追加 state值（已发布/草稿）
    fd.append('state', state)
    // 将封面裁剪过后的图片 输出为一个文件对象
    // d.为FormData追加 剪裁后的文件数据
    $image
        .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 400,
            height: 280
        })
        .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
            // 得到文件对象后，进行后续的操作
            fd.append('cover_img', blob)

            // fd.forEach((e, i) => {
            //     console.log(e, i);
            // })

            // d.提交到接口
            $.ajax({
                url: '/my/article/add',
                method: 'post',
                data: fd,
                // 当processData: true的时候，jquery会序列化数据。当processData: false的时候，jquery不会对数据进行处理。
                processData: false,
                contentType: false,
                success(res) {
                    // 判断是否发表成功
                    // console.log(res);
                    layui.layer.msg(res.message)
                    if (res.status !== 0) return
                    // 如果成功直接跳转到列表页面
                    // 是在ifr里面跳转，用window.location 
                    location.href = '/article/art_list.html'
                }
            })
        })
}