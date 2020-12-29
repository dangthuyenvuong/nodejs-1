const fs = require('fs')
const path = require('path')
const dirTree = require("directory-tree");



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
    }
}



// function getAllDirectory(dirPath, arrayOfFiles) {
//     console.log(dirPath)
//     let files = fs.readdirSync(dirPath)
//     arrayOfFiles = arrayOfFiles || []

//     files.forEach(function (file) {
//         // console.log(fs.statSync(dirPath + "/" + file).isDirectory())
//         if (fs.statSync(dirPath + "/" + file).isDirectory()) {
//             arrayOfFiles = getAllDirectory(dirPath + "/" + file, arrayOfFiles)
//         }
//         //  else {
//         //     arrayOfFiles.push(path.join(__dirname, dirPath, "/", file))
//         // }
//     })

//     return arrayOfFiles
// }