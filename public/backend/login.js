$('.btn-login').on('click', function (e) {
    e.preventDefault();
    let email = $('#email').val().trim();
    let password = $('#password').val().trim();

    if (email && password) {
        fetch('', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email, password
            })
        })
            .then(res => res.json())
            .then(res => {
                if (res.success) {
                    window.location = res.redirect
                } else {
                    alert(res.message)
                }
            })

    } else {
        alert('Vui lòng nhập đủ email và password');
    }
})