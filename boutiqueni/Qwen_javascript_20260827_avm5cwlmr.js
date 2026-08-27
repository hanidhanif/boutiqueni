// Data JSON untuk Video Gallery
const videoData = [
    {
        "id": 1,
        "title": "Tutorial HTML Dasar",
        // Mengambil ID dari link youtube yang diberikan
        "youtubeId": "awWKxGftWh4" 
    },
    {
        "id": 2,
        "title": "Belajar CSS Layout",
        "youtubeId": "xhSQzLvjtnw"
    },
    {
        "id": 3,
        "title": "Teknologi Website Modern",
        "youtubeId": "iiADhChRriM"
    },
    {
        "id": 4,
        "title": "Tips Desain Web",
        "youtubeId": "aHxxbTq0TXE"
    }
];

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Render Video Carousel dari JSON
    const track = document.getElementById('videoTrack');
    
    videoData.forEach((video, index) => {
        const li = document.createElement('li');
        li.classList.add('carousel-slide');
        
        // Menggunakan Embed URL YouTube
        li.innerHTML = `
            <iframe 
                src="https://www.youtube.com/embed/${video.youtubeId}" 
                title="${video.title}" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
            </iframe>
        `;
        track.appendChild(li);
    });

    // 2. Logika Carousel Slider
    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.next-btn');
    const prevButton = document.querySelector('.prev-btn');
    
    let currentIndex = 0;

    function updateSlidePosition() {
        // Geser track berdasarkan index saat ini
        // Karena slide di-set absolute width 100%, kita geser -100% * index
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    nextButton.addEventListener('click', () => {
        if (currentIndex < slides.length - 1) {
            currentIndex++;
        } else {
            currentIndex = 0; // Loop kembali ke awal
        }
        updateSlidePosition();
    });

    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = slides.length - 1; // Loop ke akhir
        }
        updateSlidePosition();
    });

    // 3. Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Smooth Scrolling untuk Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            navLinks.classList.remove('active'); // Tutup menu mobile jika diklik
            
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});