function renderComment() {
    let data = `<div class="media">
    <div class="img-circle"><img class="img-fluid" src="assets/images/c1.jpg" alt="..."></div>
    <div class="media-body">
       <ul class="time-rply mb-2">
          <li><a class="name mt-0 mb-2 d-block" href="#URL">William Jack</a>                                        April 15th, 2020 - 10:02 pm</li>
          <li class="reply-last"><a class="reply" href="#reply">Reply</a></li>
       </ul>
       <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repellat, hic
          reprehenderit eum cupiditate deleniti, Lorem ipsum dolor sit amet consectetur
          adipisicing.....
       </p>
    </div>
 </div>`

    $('.comments').append(data)
}


if (document.querySelectorAll('.blog-detail').length > 0) {

    var database = new DatabaseRealtime()

    var messageCollection = database.collection('message')

    $("#submit-btn").on("click", async function (e) {
        e.preventDefault();
        var comment = $("#comments");
        var commentValue = $.trim(comment.val());
        if (commentValue.length === 0) {
            alert('Comments are required to continue!');
        } else {

            let [res, error] = await messageCollection.push({ comment: commentValue });
            if (error) {
                alert('Unable to push comments to Server!');
            }

            comment.val("");
        }
        return false;
    });

    messageCollection.on('child_added', renderComment)


}