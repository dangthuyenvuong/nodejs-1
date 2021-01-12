// let folderData = 

// {
//     "icon": "<img class=\"img-responsive\" src=\"/folder-icon.png\">",
//     "text": "bin"
// }
filesData = []
folderData = [{}];
// dataSrc = [
// {
//     "text": "Lorem Ipsum",
//     "iconCls": "fa fa-folder"
// }
// ]
console.log(dataSrc)

function initData(folders, dataSrc) {
    folders.path = folders.path.replace('public', '');

    if (folders.type === "directory" && dataSrc) {

        dataSrc.text = folders.name
        dataSrc.iconCls = "fa fa-folder"
        dataSrc.url = folders.path
    }


    if (folders.children) {

        dataSrc.items = []
        folders.children.forEach((e, i) => {
            if (e.type === 'directory') {
                dataSrc.items.push({})
                initData(e, dataSrc.items[dataSrc.items.length - 1])
            } else {
                initData(e)
            }

        })

        if (dataSrc.items.length === 0) {
            delete dataSrc.items;
        }
    }

}
initData(dataSrc, folderData[0])

// folderData = dataSrc.map(e => ({
//     text: e,
//     "iconCls": "fa fa-folder"
// }))

let selectedFolder = null;


$(function () {
    $('.asset-media').on('click', function () {
        $('.filemanager').fadeIn(200)

        $(this).addClass('media-selected')
    })

    $('.filemanager-close').on('click', () => {
        $('.filemanager').fadeOut(200)
    })

    // initTreeView()


    $('#treeview').append(initTreeView(folderData))

    $('body').on('click', '.pb-filemng-template-body img', function (e) {
        // $('.media-selected').attr('src', this.getAttribute('src'))

        $('.pb-filemng-template-body .pb-filemng-body-folders.selected').removeClass('selected');


        $(this).closest('.pb-filemng-body-folders').toggleClass('selected');
        if ($(this).closest('.pb-filemng-body-folders').hasClass('selected')) {
            $('.btn-file-select').css({ display: 'inline-block' })
            $('.btn-file-delete').css({ display: 'inline-block' })
        } else {
            $('.btn-file-select').css({ display: 'none' })
            $('.btn-file-delete').css({ display: 'none' })

        }
        // $('.filemanager-close').trigger('click')
    })

    $('.btn-file-select').on('click', () => {

        let url = $('.pb-filemng-template-body .pb-filemng-body-folders.selected img').attr('src')
        $('.media-selected').attr('src', url);
        $('.filemanager-close').trigger('click')
    })

    $('.btn-file-delete').on('click', () => {

        let formData = new FormData();

        let path = $('.pb-filemng-template-body .pb-filemng-body-folders.selected img').attr('src')
        formData.append('path', path)

        fetch('/admin/filemanager-delete', {
            method: 'POST',
            body: formData,
        })
            .then(res => res.json())
            .then(res => {
                if (res.success) {
                    $('.pb-filemng-template-body .pb-filemng-body-folders.selected').remove();
                    $('.btn-file-select').css({ display: 'none' })
                    $('.btn-file-delete').css({ display: 'none' })
                }
            })
    })


    $('.btn-filemanager-upload').on('click', () => {
        $("#filemanager-input").trigger('click')
    })

    $("#filemanager-input").on('change', function () {
        if (this?.files?.[0]) {
            let formData = new FormData();
            formData.append('file', this.files[0])

            let $dir = $('#treeview li a.selected');
            let dir = $dir.length > 0 ? $dir.attr("href") : '/upload'

            formData.append('dir', dir)

            fetch('/admin/filemanager-upload', {
                method: 'POST',
                body: formData,
            })
                .then(res => res.json())
                .then(res => {
                    if (res.file) {
                        renderFile(res.file)
                    }
                })
        }
    })





    $('body').on('click', '#treeview a', function (e) {
        e.preventDefault();
        let dir = $(this).attr('href');

        $('#treeview li a.selected').removeClass('selected');
        $(this).addClass('selected');

        $('.btn-delete-folder').css('display', 'inline-block')
        $('.btn-rename-folder').css('display', 'inline-block')


        fetch('/admin/media-list-file', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                dir
            })
        })
            .then(res => res.json())
            .then(res => {
                filesData = res.files.map(e => (
                    {
                        "icon": `<img class="img-responsive" src="${e.path}">`,
                        "text": e.name
                    }
                ))

                console.log(selectedFolder)
                // folderData[selectedFolder].items = res.folder.map(e => (
                //     {
                //         "text": e.name,
                //         "iconCls": "fa fa-folder"
                //     }
                // ))

                // initTreeView();

                renderFiles();

            })
    })

    renderFiles();




    // Folder

    $('.btn-add-folder').on('click', () => {
        let name = prompt('Đặt tên folder cần khởi tạo')
        name = name.trim();

        let formData = new FormData();
        formData.append('name', name)

        let $dir = $('#treeview li a.selected');
        let dir = $dir.length > 0 ? $dir.attr("href") : '/upload'

        formData.append('dir', dir)

        fetch('/admin/filemanager-add-folder', {
            method: 'POST',
            body: formData,
        })
            .then(res => res.json())
            .then(res => {
                if (res.dir) {
                    let $dirSelected = $dir;
                    if ($dir.length === 0) {
                        $dirSelected = $('#treeview li a:eq(0)')
                    }


                    let $ulChild = $dirSelected.next();

                    if ($ulChild.length < 0) {
                        $ulChild = $('<ul></ul>')
                    }

                    $ulChild.append($(`<li><i class="fa fa-folder"></i><a href="${res.dir}">${name}</a></li>`))
                    $dirSelected.after($ulChild)

                }

            })
    })

    $('.btn-delete-folder').on('click', () => {
        if (confirm('Bạn có chắc chắn muốn xóa folder này không?')) {
            let formData = new FormData()

            let $dir = $('#treeview li a.selected');
            let dir = $dir.length > 0 ? $dir.attr("href") : '/upload'
            formData.append('dir', dir)

            if (dir !== '/upload') {


                fetch('/admin/filemanager-delete-folder', {
                    method: 'POST',
                    body: formData,
                })
                    .then(res => res.json())
                    .then(res => {
                        $('#treeview li a.selected').closest('li').remove();

                        $('.btn-delete-folder').css('display', 'none')
                        $('.btn-rename-folder').css('display', 'none')
                    })
            } else {
                alert('Bạn không có quyền xóa folder này')
            }


        }
    })

    $('.btn-rename-folder').on('click', () => {
        let name = prompt('Điền tên folder cần thay đổi:');
        name = name.trim();

        let formData = new FormData()

        let $dir = $('#treeview li a.selected');
        let dir = $dir.length > 0 ? $dir.attr("href") : '/upload'
        formData.append('rename', name)
        formData.append('dir', dir)
        if (dir !== '/upload') {


            fetch('/admin/filemanager-rename-folder', {
                method: 'POST',
                body: formData,
            })
                .then(res => res.json())
                .then(res => {
                    if (res.dir) {
                        $('#treeview li a.selected').html(name).attr('href', res.dir);
                    }
                })
        } else {
            alert('Bạn không có quyền đổi tên folder này')
        }
    })
})


function renderFile(file) {
    let name = file.src.split('/')
    $(".pb-filemng-template-body").append(
        `<div class=\"col-xs-6 col-sm-6 col-md-3 pb-filemng-body-folders\">
        <div class="wrap">
            <img src="${file.src}"/><br />
            <p class="pb-filemng-paragraphs">${name[name.length - 1]}</p>
        </div>
        </div>`
    );
}

function renderFiles() {
    $(".pb-filemng-template-body").empty();
    for (var key in filesData) {
        $(".pb-filemng-template-body").append(
            `<div class=\"col-xs-6 col-sm-6 col-md-3 pb-filemng-body-folders\">
            <div class="wrap">
                ${filesData[key].icon}<br />
                <p class="pb-filemng-paragraphs">${filesData[key].text}</p>
            </div>
            </div>`
        );
    }
}

function initTreeView(folderData, $ul) {
    console.log(folderData)

    // $(".sui-treeview-list").remove();
    // $("#treeview").shieldTreeView({
    //     dataSource: folderData,
    //     events: {
    //         select: function (e) {
    //             selectedFolder = this.getPath(e.element);
    //             // console.log("selecting node " , this.getPath(e.element));
    //         },
    //     }
    // });


    $ul = $ul || $('<ul></ul>')


    folderData.forEach(e => {
        let $li = $(`<li><i class="fa fa-folder"></i><a href="${e.url}">${e.text}</a></li>`)

        if (e.items) {
            let $ul2 = $('<ul></ul>')

            $ul2 = initTreeView(e.items, $ul2)

            $li.append($ul2);
        }

        $ul.append($li);

    })

    return $ul
}