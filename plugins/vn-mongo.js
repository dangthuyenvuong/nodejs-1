const MongoClient = require('mongodb').MongoClient;

const url = "mongodb://localhost:27017/mydb";

let post, comment, tag, category, author, user;


// Post: author, slug, title, description, content, published_at, created_at, updated_at, cover, time_read, tags, categories, 
// Comment: user, post, content, crated_at
// tag: title, slug
// category: title, slug
// author: name, email, birthday, avatar, gender
// user: name, email, birthday, avatar, gender

MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
    if (err) {
        console.log('connect database fail')
        throw err
    } else {
        console.log("Database created!")
        let dtb = db.db('mydb');

        post = dtb.collection('post');
        comment = dtb.collection('comment');
        tag = dtb.collection('tag');
        category = dtb.collection('category');
        author = dtb.collection('author');
        user = dtb.collection('user');

        user.createIndex({ email: 1 }, { unique: 1 })
        author.createIndex({ email: 1 }, { unique: 1 })
        post.createIndex({ slug: 1 }, { unique: 1 })
        category.createIndex({ slug: 1 }, { unique: 1 })
        tag.createIndex({ slug: 1 }, { unique: 1 })

        // db.close();
    }
})


module.exports = (name) => {


    return { post, comment, tag, category, author, user }

    // Insert: one, many



    // customers.insertOne({
    //     name: 'Dang Thuyen Vuong',
    //     age: 26,
    //     email: 'dangthuyenvuong@gmail.com'
    // }, (err, res) => {
    //     if (err) throw err
    //     else {
    //         console.log(res)
    //     }
    // })

    // Delete: one, many

    // Update: one, many,

    // Select: one, many
}