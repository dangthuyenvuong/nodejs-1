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
        $('.media-selected').attr('src', this.getAttribute('src'))
        $('.filemanager-close').trigger('click')
    })


    $('body').on('click', '#treeview a', function (e) {
        e.preventDefault();
        let dir = $(this).attr('href');



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
})


function renderFiles() {
    $(".pb-filemng-template-body").empty();
    for (var key in filesData) {
        $(".pb-filemng-template-body").append(
            '<div class=\"col-xs-6 col-sm-6 col-md-3 pb-filemng-body-folders\">' +
            filesData[key].icon + '<br />' +
            '<p class="pb-filemng-paragraphs">' + filesData[key].text + '</p>' +
            '</div>'
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