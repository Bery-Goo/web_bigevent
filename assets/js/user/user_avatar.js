$(function () {
    initCropper()
    // 1.4、为上传按钮添加点击事件
    $('#btnChooseImage').on('click', chooseFile)
    // 1.5、为文件选择框绑定onchange事件，获取选中文件信息  文件发生改变的时候 '请选择文件！'才会弹起
    $('#file').on('change', fileChange)
    // 为确定按钮添加点击事件
    $('#btnOk').on('click', upload)
})
// 0.裁剪区的 全局配置选项
let $image = null;
const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
}
// 1、初始化 裁剪插件
function initCropper() {
    // 1.1 获取裁剪区域的 DOM 元素
    $image = $('#image')
    // 1.2 配置选项
    // 1.3 创建裁剪区域
    $image.cropper(options)
}
// 1.选择文件
function chooseFile() {
    $('#file').click()
}
// 2.选中文件
function fileChange(e) {
    // console.log(e);
    // 获取选中文件列表
    // 0.获取选中文件信息的数组
    let fileList = e.target.files
    if (fileList.length == 0) {
        return layui.layer.msg('请选择文件！')
    }
    // console.log(fileList);
    // 1.获取选中的第一个文件 信息对象
    var file = fileList[0]
    // 2.创建文件虚拟路径
    var newImgURL = URL.createObjectURL(file)
    // 显示新图片
    // 调用 裁剪组件 销毁之前的图片设置新的虚拟路径给他 并重新创建裁剪区
    $image
        .cropper('destroy') // 销毁旧的裁剪区域
        .attr('src', newImgURL) // 重新设置图片路径
        .cropper(options) // 重新初始化裁剪区域
}
// 3、确认上传
function upload() {
    // a.获取选中的 裁剪后的图片数据


    var dataURL = $image
        .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 100,
            height: 100
        })
        .toDataURL('image/png')  // 将 Canvas 画布上的内容，转化为 base64 格式字符串
    // b.提交到服务器 接口
    $.ajax({
        method: 'post',
        url: '/my/update/avatar',
        data: {
            avatar: dataURL
        },
        success: function (res) {
            layui.layer.msg(res.message)
            // b.如果失败，则退出函数
            if (res.status !== 0) {
                return
            }
            // c.如果上传成功 则调用父页面的方法 重新渲染 用户信息
            window.top.getUserInfo()
        }
    })
}
