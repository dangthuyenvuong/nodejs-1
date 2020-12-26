$('.btn-submit').on('click', (e) => {
    e.preventDefault();
    let data = {};
    $('[name]').each((i, e) => {
        let $this = $(e);
        let val = $(e).val();
        if ($this.attr('type') === 'checkbox') {
            val = $this[0].checked;
        }

        data[$this.attr('name')] = val;
    })

    fetch('/admin/post', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(res => {
            if (res.success) {
                alert('Cập nhật thành công')
            } else {
                alert(res.message)
            }
        })
})

window.addEventListener('load', function () {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function (form) {
        form.addEventListener('submit', function (event) {
            if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    });
}, false);