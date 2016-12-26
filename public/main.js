$(document).ready(function() {

    $('#js-input-link').on('click', function(e) {
        e.preventDefault();
        $('#js-file-input')[0].click();
    });

    $('#js-file-input').on('change', function(e) {
        e.preventDefault();
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            const formData = new window.FormData();
            formData.append('imageFile', file);
            const xhr = new window.XMLHttpRequest();
            xhr.open('post', '/', true);
            xhr.onerror = function(err) {
                console.error(err);
                swal('Oops!', err.message, 'error');
            };
            xhr.onload = function(res) {
                const currentTarget = res.currentTarget;
                const imagePath = currentTarget.response;
                $('#js-input-link-container').css('display', 'none');
                $('#js-note-container').css('display', 'none');
                $('#js-overlay-image').attr('src', imagePath);
                $('#js-overlay-image-container').css('display', 'block');
            };
            xhr.send(formData);
        } else {
            swal('No file selected', 'You must select a file.', 'warning');
        }
    });

});