const GAP_SIZE = 16;

function initHeroGallery() {
    const galleryTracks = document.querySelectorAll('.hero-gallery-track');
    duplicateImages(galleryTracks);
    setupAnimationHeights(galleryTracks);
    setupNavigationButton();
}

function setupNavigationButton() {
    const navButton = document.querySelector('[data-href]');
    if (navButton) {
        navButton.addEventListener('click', function () {
            const href = this.dataset.href;
            if (href) {
                window.location.href = href;
            }
        });
    }
}

function duplicateImages(tracks) {
    tracks.forEach(track => {
        const originalPictures = [...track.querySelectorAll('.hero-gallery-img')];
        originalPictures.forEach(picture => {
            const clone = picture.cloneNode(true);
            track.appendChild(clone);
        });
    });
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
    return picture.offsetHeight + GAP_SIZE;
}

function setTrackHeight(track, height) {
    const adjustedHeight = height - GAP_SIZE;
    track.style.setProperty('--original-height', `${adjustedHeight}px`);
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