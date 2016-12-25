$(document).ready(() => {

    // $('#js-image-form').on('submit', e => {
    //     e.preventDefault();
    //     console.log(e);
    // });

    $('#js-input-link').on('click', e => {
        e.preventDefault();
        $('#js-file-input')[0].click();
    });

    $('#js-file-input').on('change', e => {
        e.preventDefault();
        if (e.target.files.length > 0) {
            // $('#js-image-form').submit();
            const [file] = e.target.files;
            const formData = new window.FormData();
            formData.append('imageFile', file);
            const xhr = new window.XMLHttpRequest();
            xhr.open('post', '/', true);
            xhr.onerror = err => {
                console.error(err);
                swal('Oops!', err.message, 'error');
            };
            xhr.onload = () => {
                swal('Success', 'File successfully submitted.', 'success');
            };
            xhr.send(formData);
        }
    });

});