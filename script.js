// Project details toggle functionality
function toggleDetails(row) {
    row.classList.toggle('expanded');
    const detailsRow = row.nextElementSibling;
    if (detailsRow && detailsRow.classList.contains('project-details')) {
        detailsRow.classList.toggle('show');
    }
}

// Toggle all project rows
function toggleAll() {
    const button = document.querySelector('.control-button');
    const allRows = document.querySelectorAll('.project-row');
    const allExpanded = Array.from(allRows).every(row => row.classList.contains('expanded'));
    
    if (allExpanded) {
        // Collapse all
        allRows.forEach(row => {
            row.classList.remove('expanded');
            const detailsRow = row.nextElementSibling;
            if (detailsRow && detailsRow.classList.contains('project-details')) {
                detailsRow.classList.remove('show');
            }
        });
        button.textContent = '[Expand All]';
    } else {
        // Expand all
        allRows.forEach(row => {
            row.classList.add('expanded');
            const detailsRow = row.nextElementSibling;
            if (detailsRow && detailsRow.classList.contains('project-details')) {
                detailsRow.classList.add('show');
            }
        });
        button.textContent = '[ Collapse All ]';
    }
}

// Make sure expanded row shows properly on page load
document.addEventListener('DOMContentLoaded', function() {
    // Handle expanded rows
    var expandedRows = document.querySelectorAll('.project-row.expanded');
    expandedRows.forEach(function(row) {
        var detailsRow = row.nextElementSibling;
        if (detailsRow && detailsRow.classList.contains('project-details')) {
            detailsRow.classList.add('show');
        }
    });

    // Lightbox functionality
    const lightbox = document.querySelector('.lightbox');
    const lightboxContent = document.querySelector('.lightbox-content');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    const counter = document.querySelector('.lightbox-counter');
    
    let currentProject = null;
    let currentIndex = 0;
    let mediaItems = [];

    // Format number with leading zero
    function formatNumber(num) {
        return num.toString().padStart(2, '0');
    }

    // Update counter display
    function updateCounter() {
        counter.textContent = `${formatNumber(currentIndex + 1)} / ${formatNumber(mediaItems.length)}`;
    }

    // Open lightbox
    function openLightbox(mediaElement) {
        // Find the project row by going up through the DOM
        const thumbnail = mediaElement.closest('.project-thumbnail');
        const projectDetails = thumbnail.closest('.project-details');
        const projectRow = projectDetails.previousElementSibling;
        
        currentProject = projectRow;
        mediaItems = Array.from(projectDetails.querySelectorAll('.project-thumbnail img, .project-thumbnail video'));
        currentIndex = mediaItems.indexOf(mediaElement);
        
        // Set the project title
        const title = projectRow.querySelector('.project-title').textContent;
        document.querySelector('.lightbox-title').textContent = title;
        
        updateLightboxContent();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Update lightbox content
    function updateLightboxContent() {
        const media = mediaItems[currentIndex];
        const clone = media.cloneNode(true);
        
        // If it's a video, ensure it plays
        if (clone.tagName === 'VIDEO') {
            clone.autoplay = true;
            clone.loop = true;
            clone.muted = true;
            clone.controls = false;
        }
        
        lightboxContent.innerHTML = '';
        lightboxContent.appendChild(clone);
        updateCounter();
    }

    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        currentProject = null;
        currentIndex = 0;
        mediaItems = [];
        document.querySelector('.lightbox-title').textContent = '';
    }

    // Navigate to previous media
    function prevMedia() {
        currentIndex = currentIndex > 0 ? currentIndex - 1 : mediaItems.length - 1;
        updateLightboxContent();
    }

    // Navigate to next media
    function nextMedia() {
        currentIndex = currentIndex < mediaItems.length - 1 ? currentIndex + 1 : 0;
        updateLightboxContent();
    }

    // Event listeners for media items
    document.querySelectorAll('.project-thumbnail img, .project-thumbnail video').forEach(media => {
        media.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openLightbox(e.target);
        });
    });

    // Event listeners for lightbox controls
    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', prevMedia);
    nextBtn.addEventListener('click', nextMedia);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                prevMedia();
                break;
            case 'ArrowRight':
                nextMedia();
                break;
        }
    });

    // Close lightbox when clicking outside content
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
});

// Get day suffix (st, nd, rd, th)
function getDaySuffix(day) {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
}

// Update time display
function updateTime() {
    const timeElement = document.querySelector('.time');
    const now = new Date();
    const day = now.getDate();
    const dateOptions = {
        month: 'short',
        day: 'numeric'
    };
    const timeOptions = { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true,
        timeZone: 'America/New_York'
    };
    const date = now.toLocaleDateString('en-US', dateOptions).replace(/\d+/, day + getDaySuffix(day));
    const time = now.toLocaleTimeString('en-US', timeOptions);
    timeElement.textContent = `${time}, ${date}`;
}

// Update time immediately and then every minute
updateTime();
setInterval(updateTime, 1000);
