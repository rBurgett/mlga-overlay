$(document).ready(() => {

    $('#js-input-link').on('click', e => {
        e.preventDefault();
        $('#js-file-input')[0].click();
    });

    $('#js-file-input').on('change', e => {
        e.preventDefault();
        if (e.target.files.length > 0) {
            const [file] = e.target.files;
            const formData = new window.FormData();
            formData.append('imageFile', file);
            const xhr = new window.XMLHttpRequest();
            xhr.open('post', '/', true);
            xhr.onerror = err => {
                console.error(err);
                swal('Oops!', err.message, 'error');
            };
            xhr.onload = ({ currentTarget }) => {
                const imagePath = currentTarget.response;
                $('#js-input-link').css('display', 'none');
                $('#js-overlay-image').attr('src', imagePath);
                $('#js-overlay-image-container').css('display', 'block');
            };
            xhr.send(formData);
        }
    });

});