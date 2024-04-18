document.addEventListener('DOMContentLoaded', function() {
    var playButtons = document.getElementsByClassName('play-btn');

    Array.prototype.forEach.call(playButtons, function(button) {
        button.addEventListener('click', function() {
            var videoId = this.getAttribute('data-video-id');
            var modalId = this.getAttribute('data-modal-id');
            var videoFrameId = this.getAttribute('data-video-frame-id');

            var modal = document.getElementById(modalId);
            var iframe = document.getElementById(videoFrameId);

            iframe.src = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1';
            modal.style.display = 'block';
        });
    });

    var closeButtons = document.getElementsByClassName('close');
    Array.prototype.forEach.call(closeButtons, function(button) {
        button.addEventListener('click', function() {
            var modal = this.closest('.modal');
            modal.style.display = 'none';
            var iframe = modal.querySelector('iframe');
            iframe.src = '';
        });
    });

    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
            var iframe = event.target.querySelector('iframe');
            iframe.src = '';
        }
    });
});
