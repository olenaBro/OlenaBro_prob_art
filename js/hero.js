function initHeroGallery() {
    const galleryTracks = document.querySelectorAll('.hero-gallery-track');

    setupAnimationHeights(galleryTracks);
}

function setupAnimationHeights(tracks) {
    tracks.forEach(track => {
        pauseAnimation(track);

        const allPictures = getAllPictures(track);
        const originalPictures = getOriginalPictures(allPictures);

        let originalHeight = 0;
        let loadedImagesCount = 0;

        function onAllImagesLoaded() {
            setTrackHeight(track, originalHeight);
            startAnimation(track);
        }

        function onImageLoaded() {
            loadedImagesCount++;
            if (loadedImagesCount === originalPictures.length) {
                onAllImagesLoaded();
            }
        }

        originalPictures.forEach(picture => {
            const img = picture.querySelector('img');

            if (isImageLoaded(img)) {
                originalHeight += calculatePictureHeight(picture);
                onImageLoaded();
            } else {
                img.addEventListener('load', () => {
                    setTimeout(() => {
                        originalHeight += calculatePictureHeight(picture);
                        onImageLoaded();
                    }, 10);
                });
            }
        });

        setInitialPositionForRightColumn(track);
    });
}

function getAllPictures(track) {
    return [...track.querySelectorAll('.hero-gallery-img')];
}

function getOriginalPictures(allPictures) {
    return allPictures.slice(0, allPictures.length / 2);
}

function isImageLoaded(img) {
    return img.complete && img.naturalHeight !== 0;
}

function calculatePictureHeight(picture) {
    const gapSize = 10;
    return picture.offsetHeight + gapSize;
}

function setTrackHeight(track, height) {
    track.style.setProperty('--original-height', `${height}px`);
}

function pauseAnimation(track) {
    track.style.animationPlayState = 'paused';
}

function startAnimation(track) {
    track.style.animationPlayState = 'running';
}

function setInitialPositionForRightColumn(track) {
    if (isRightColumn(track)) {
        const checkInterval = setInterval(() => {
            const height = track.style.getPropertyValue('--original-height');
            if (height) {
                track.style.transform = `translateY(calc(-1 * ${height}))`;
                clearInterval(checkInterval);
            }
        }, 50);
    }
}

function isRightColumn(track) {
    return track.closest('.hero-gallery-column-right');
}

document.addEventListener('DOMContentLoaded', initHeroGallery);