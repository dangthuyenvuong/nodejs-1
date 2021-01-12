const fs = require('fs')
const path = require('path')
const dirTree = require("directory-tree");
const { maxHeaderSize } = require('http');




// fs.readdir('public/upload/', (err, files) => {
//     files.forEach(file => {
//         if (fs.lstatSync(path.resolve('public/upload/', file)).isDirectory()) {
//             console.log('Directory: ' + file);
//         } else {
//             console.log('File: ' + file);
//         }
//     });
// });


module.exports = {
    index: (req, res) => {
        let { dir } = req.body;
        let files = []
        let folder = []
        fs.readdirSync('public/' + dir, { withFileTypes: true })
            .forEach(dirent => {
                if (dirent.isDirectory()) {
                    folder.push({
                        name: dirent.name,
                        path: `${dir}/${dirent.name}`
                    })
                } else {
                    files.push({
                        name: dirent.name,
                        path: `${dir}/${dirent.name}`
                    })
                }
            })


        res.json({ files, folder })

    },
    middleware: (req, res, next) => {
        let { path } = req;

        // let dir = fs.readdirSync('public/upload', { withFileTypes: true })
        //     .filter(dirent => dirent.isDirectory())
        //     .map(dirent => dirent.name);

        let dir = dirTree('public/upload');

        //         const tree = dirTree('public/upload');
        // console.log(tree);

        filemanager = {
            dir
        }
        res.locals.filemanager = filemanager;
        next()
    },



    upload: (req, res) => {
        if (req?.files?.file) {
            let { dir } = req.body;
            let { file } = req.files;

            let name = dir + '/' + file.name;

            if (fs.existsSync('./public/' + dir + '/' + file.name)) {
                name = file.name.split('.');
                let ext = name.pop();
                name = name.join('.') + '-' + Math.round(Math.random() * 9999999999) + '.' + ext;


                name = dir + '/' + name;
            }

            file.mv('./public/' + name)



            return res.json({
                file: {
                    src: name,
                }
            });
        }

        return res.json({ error: 'file not exists' });
    },
    delete: (req, res) => {
        let { path } = req.body;
        if (path) {
            fs.unlinkSync('./public/' + path);
            return res.json({ success: true });
        }

        return res.json({ error: 'path not exists' });

    },



    // Folder


    addFolder: (req, res) => {
        let { dir, name } = req.body;

        dir += '/' + name

        if (!fs.existsSync('./public/' + dir)) {
            fs.mkdirSync('./public/' + dir);
        }

        return res.json({ dir })
    },
    renameFolder: (req, res) => {
        let { dir, rename } = req.body;

        if (dir !== '/upload') {
            let newName = dir.split('/')

            newName.pop();

            newName = newName.join('/') + '/' + rename

            if (dir !== '/upload') {
                if (fs.existsSync('./public/' + dir)) {
                    fs.renameSync('./public/' + dir, './public/' + newName);
                }
                return res.json({ dir: newName })

            }
            return res.json({ success: true })

        }

        return res.json({ error: "can't rename folder upload" })


    },
    deleteFolder: (req, res) => {
        let { dir } = req.body;

        if (dir !== '/upload') {
            if (fs.existsSync('./public/' + dir)) {
                fs.rmdirSync('./public/' + dir, { recursive: true });
            }
            return res.json({ success: true })

        }

        return res.json({ error: "can't delete folder upload" })

    }

    // List, Upload, delete, Select



}


