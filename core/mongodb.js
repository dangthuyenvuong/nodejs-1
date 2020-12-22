const mongodb = require('mongodb')


const MongoClient = mongodb.MongoClient
// const ObjectID = mongodb.ObjectID

var url = "mongodb://localhost:27017";
// var url = "mongodb+srv://dangthuyenvuong_nodejs:dangthuyenvuong_nodejs@cluster0.ticyv.mongodb.net/";

// post: title, description, content, published_at, created_at, updated_at, cover, time_read, tags, categories, author (user), slug, feature, trending, highlight
// user: name, email, birthday, avatar, gender, type: author | user
// tag: title, slug
// categry: title, slug
// comment: user, post, content, created_at



// Message: user, room, message, created_at
// Room: people: [], type: 'private' | 'group'



// Room: people: [user1, user2]

// Room: people: [user1, user2, user3, user4, user5]

// room : people [user1, user2]



let postCollection, userCollection, tagCollection, categoryCollection, commentCollection, messageCollection, roomCollection;


MongoClient.connect(url, { useUnifiedTopology: true }, (err, db) => {
    if (err) {
        console.log('Connect MongoDB error')
        throw err;
    } else {
        console.log('Connection MongoDB success')

        let database = db.db('nodejs_blog')


        postCollection = database.collection('post');
        userCollection = database.collection('user');
        tagCollection = database.collection('tag');
        categoryCollection = database.collection('category');
        commentCollection = database.collection('comment');

        postCollection.createIndex({ slug: 1 }, { unique: 1 })
        userCollection.createIndex({ email: 1 }, { unique: 1 })
        tagCollection.createIndex({ slug: 1 }, { unique: 1 })
        categoryCollection.createIndex({ slug: 1 }, { unique: 1 })


        // ---------------
        messageCollection = database.collection('message');
        roomCollection = database.collection('room');



        // let userCollection = database.collection('user');
        // userCollection.createIndex({ email: 1 }, { unique: 1 })


        // let user = {
        //     name: 'Dang Thuyen Vuong',
        //     email: 'vuong.dang@gmail.com',
        //     age: 26,
        //     gender: 'male'
        // }


        // userCollection.insertOne(user, (err, result) => {
        //     if (err) {
        //         // throw err
        //     } else {
        //         console.log(result)
        //     }
        // })

        // userCollection.findOne({ _id: ObjectID('5fde04b994ca1e2ed473906e') }, (err, result) => {
        //     if (err) {
        //         throw err
        //     } else {
        //         console.log(result);
        //     }
        // })

        // userCollection.find().toArray((err, result) => {
        //     if (err) {
        //         throw err
        //     } else {
        //         console.log(result);
        //     }
        // })

        // let updateData = {
        //     $set: {
        //         hoVaTen: 'Đặng Thuyền Vươngg'
        //     },
        //     $push: {
        //         array: {
        //             $each: [1, 2, 3, 4, 5, 6]
        //         }
        //     }
        //     // $rename: {
        //     //     name: 'hoVaTen'
        //     // }
        // }

        // userCollection.updateOne({ email: 'dangthuyenvuong@gmail.com' }, updateData, (err, result) => {
        //     if (err) {
        //         throw err
        //     } else {
        //         console.log(result.result.nModified);
        //     }
        // })


        // db.close()



        // find
        // findOne : {}
        // findMany: []


        // findOneAndUpdate(query, data)


    }

})




module.exports = function (name) {

    let object = {
        User: userCollection,
        Post: postCollection,
        Tag: tagCollection,
        Category: categoryCollection,
        Comment: commentCollection,
        Message: messageCollection,
        Room: roomCollection
    }

    return object[name] || null
}