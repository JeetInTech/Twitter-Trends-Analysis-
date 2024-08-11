function toggleSize(element) {
    // Remove the 'enlarged' class from all hashtags
    var hashtags = document.querySelectorAll('.hashtag');
    hashtags.forEach(function (hashtag) {
        hashtag.classList.remove('enlarged');
    });

    // Add the 'enlarged' class to the clicked hashtag
    element.classList.add('enlarged');
}
