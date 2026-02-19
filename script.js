document.addEventListener('DOMContentLoaded', () => {
    // 0. Scroll to Top on Load
    if (history.scrollRestoration) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // 1. D-Day Counter & Real-time Countdown
    const weddingDate = new Date('2026-04-19T15:30:00'); // Target Date

    function updateCountdown() {
        const today = new Date();
        const diff = weddingDate - today;

        if (diff > 0) {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);

            const daysLeftSimple = Math.ceil(diff / (1000 * 60 * 60 * 24));

            // Update Text D-Day
            const dDayElement = document.getElementById('days-left');
            if (dDayElement) {
                dDayElement.innerText = daysLeftSimple;
            }

            // Update Real-time Countdown
            document.getElementById('cd-days').innerText = days;
            document.getElementById('cd-hours').innerText = hours;
            document.getElementById('cd-minutes').innerText = minutes;
            document.getElementById('cd-seconds').innerText = seconds;
        } else {
            // Wedding Day Passed
            document.getElementById('d-day-counter').innerText = "결혼을 축하합니다!";
            document.getElementById('countdown-timer').style.display = 'none';
        }
    }

    // Initial call and Interval
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // 2. Scroll Animation (Fade In Up)
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-up').forEach(el => {
        observer.observe(el);
    });

    // 3. Accordion
    const accordions = document.querySelectorAll('.accordion-header');
    accordions.forEach(acc => {
        acc.addEventListener('click', function () {
            this.classList.toggle('active');
            const content = this.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
                this.querySelector('.icon').innerText = '+';
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
                this.querySelector('.icon').innerText = '-';
            }
        });
    });

    // 4. Copy to Clipboard
    const copyBtns = document.querySelectorAll('.copy-btn');
    const toast = document.getElementById('toast');

    copyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const textToCopy = btn.getAttribute('data-clipboard-text');
            navigator.clipboard.writeText(textToCopy).then(() => {
                showToast("계좌번호가 복사되었습니다.");
            }).catch(err => {
                console.error('복사 실패:', err);
                showToast("복사에 실패했습니다.");
            });
        });
    });

    function showToast(message) {
        toast.innerText = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // 5. Simple Confetti Animation
    const confettiContainer = document.getElementById('confetti-container');
    const colors = ['#cc2679', '#cc2679', '#ffdde1', '#ffffff', '#e6a8d7'];

    function createConfetti() {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');

        // Random properties
        const bg = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100 + 'vw';
        const animDuration = Math.random() * 3 + 2 + 's'; // 2-5s
        const size = Math.random() * 8 + 5 + 'px';

        confetti.style.backgroundColor = bg;
        confetti.style.left = left;
        confetti.style.width = size;
        confetti.style.height = size;
        confetti.style.opacity = Math.random();
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0'; // Circle or Square

        // Inline animation for falling
        confetti.animate([
            { transform: `translate3d(0, -10px, 0) rotateX(0) rotateY(0)` },
            { transform: `translate3d(${Math.random() * 100 - 50}px, 100vh, 0) rotateX(${Math.random() * 360}deg) rotateY(${Math.random() * 360}deg)` }
        ], {
            duration: Math.random() * 3000 + 3000,
            easing: 'linear',
            fill: 'forwards'
        }).onfinish = () => {
            confetti.remove();
        };

        confettiContainer.appendChild(confetti);
    }

    // Launch confetti periodically
    setInterval(createConfetti, 300);

    // Initial burst
    for (let i = 0; i < 20; i++) {
        setTimeout(createConfetti, i * 100);
    }
    // 6. Gallery Logic
    const galleryGrid = document.getElementById('gallery-grid');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const modal = document.getElementById('gallery-modal');
    const modalImg = document.getElementById('modal-img');
    const closeModal = document.querySelector('.close-modal');

    // List of images in ./images folder (hardcoded as we are client-side)
    const galleryAppImages = [];
    for (let i = 1; i <= 37; i++) {
        // Pad with leading zero if needed (e.g., '01.jpg', '10.jpg')
        const num = i.toString().padStart(2, '0');
        galleryAppImages.push(`${num}.jpg`);
    }

    // Config
    const ITEMS_PER_PAGE = 9;
    let visibleCount = ITEMS_PER_PAGE;

    function renderGallery() {
        galleryGrid.innerHTML = '';
        galleryAppImages.forEach((src, index) => {
            const item = document.createElement('div');
            item.classList.add('gallery-item');
            if (index >= visibleCount) {
                item.classList.add('hidden');
            }

            const img = document.createElement('img');
            img.src = `./images/${src}`;
            img.loading = "lazy";
            img.alt = `Gallery Image ${index + 1}`;

            // Modal Open
            item.addEventListener('click', () => {
                modal.style.display = 'flex';
                modalImg.src = img.src;
            });

            item.appendChild(img);
            galleryGrid.appendChild(item);
        });

        updateButtons();
    }

    const collapseBtn = document.getElementById('collapse-btn');

    function updateButtons() {
        if (visibleCount >= galleryAppImages.length) {
            loadMoreBtn.style.display = 'none';
            collapseBtn.style.display = 'inline-block';
        } else {
            loadMoreBtn.style.display = 'inline-block';
            collapseBtn.style.display = 'none';
        }
    }

    loadMoreBtn.addEventListener('click', () => {
        const hiddenItems = document.querySelectorAll('.gallery-item.hidden');
        hiddenItems.forEach(item => item.classList.remove('hidden'));
        visibleCount = galleryAppImages.length;
        updateButtons();
    });

    collapseBtn.addEventListener('click', () => {
        visibleCount = ITEMS_PER_PAGE;
        renderGallery();
        const gallerySection = document.querySelector('.gallery-section');
        gallerySection.scrollIntoView({ behavior: 'smooth' });
    });

    // Modal Close
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // 7. Kakao Map
    const mapContainer = document.getElementById('map');
    if (mapContainer && window.kakao && window.kakao.maps) {
        kakao.maps.load(() => {
            const mapOption = {
                center: new kakao.maps.LatLng(37.5031952, 127.0463974), // 지도의 중심좌표
                level: 3 // 지도의 확대 레벨
            };

            const map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

            // 마커가 표시될 위치입니다 
            const markerPosition = new kakao.maps.LatLng(37.5031952, 127.0463974);

            // 마커를 생성합니다
            const marker = new kakao.maps.Marker({
                position: markerPosition
            });

            // 마커가 지도 위에 표시되도록 설정합니다
            marker.setMap(map);

            // 지도 컨트롤 추가 (줌, 스카이뷰 등) - 선택사항이지만 있으면 좋음
            const zoomControl = new kakao.maps.ZoomControl();
            map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

            // 모바일에서 드래그 막기 (선택사항, 보통 초대장에서는 드래그 가능하게 둠)
        });
    }
// 8. Share Buttons (수정됨)
    // 카카오톡 초기화 (맨 처음 한 번만 실행)
    if (!Kakao.isInitialized()) {
        Kakao.init('a6195ef725cd2f29edd1d38c8d977bb0'); 
    }

    // index.html에서 onclick="shareMessage()" 로 호출될 함수
    window.shareMessage = function() {
        Kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
                title: '다운 ❤️ 서정 결혼합니다',
                description: '2026년 4월 19일 일요일 오후 3시 30분 아펠가모 선릉',
                imageUrl: 'https://dhkdekdns-web.github.io/Wedding-Wang-repository/images/01.jpg', // 진짜 썸네일 사진 주소로 변경됨
                link: {
                    mobileWebUrl: 'https://dhkdekdns-web.github.io/Wedding-Wang-repository/',
                    webUrl: 'https://dhkdekdns-web.github.io/Wedding-Wang-repository/',
                },
            },
            buttons: [
                {
                    title: '모바일 청첩장 보기',
                    link: {
                        mobileWebUrl: 'https://dhkdekdns-web.github.io/Wedding-Wang-repository/',
                        webUrl: 'https://dhkdekdns-web.github.io/Wedding-Wang-repository/',
                    },
                },
            ],
        });
    };

    const shareLinkBtn = document.getElementById('share-link-btn');
    if (shareLinkBtn) {
        shareLinkBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(window.location.href).then(() => {
                showToast("청첩장 링크가 복사되었습니다.");
            }).catch(err => {
                console.error('복사 실패:', err);
                showToast("링크 복사에 실패했습니다.");
            });
        });
    }

    // Initialize
    renderGallery();

    // 9. Intro Sequence
    const introOverlay = document.getElementById('intro-overlay');
    const introTextLine1 = document.querySelector('.intro-text .line1');
    const introTextLine2 = document.querySelector('.intro-text .line2');

    if (introOverlay) {
        // Remove overflow hidden after animation to show full cursive tails
        setTimeout(() => {
            if (introTextLine1) introTextLine1.style.overflow = 'visible';
        }, 2600); // 0.5s delay + 2s anim + buffer

        setTimeout(() => {
            if (introTextLine2) introTextLine2.style.overflow = 'visible';
        }, 4600); // 2.5s delay + 2s anim + buffer

        // Total animation time: 0.5s delay + 2s line1 + 2s line2 = ~4.5s
        // User requested +1 second delay compared to previous 5s -> 6s
        setTimeout(() => {
            // 1. Burst Confetti
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    // createConfetti is defined above but scope might be issue if not careful.
                    // The createConfetti function is defined inside DOMContentLoaded, so it is accessible here.
                    for (let k = 0; k < 10; k++) createConfetti();
                }, i * 200);
            }

            // 2. Fade Out Overlay
            introOverlay.classList.add('fade-out'); // This triggers the CSS transition

            // 3. Play Background Music
            const bgMusic = document.getElementById('bg-music');
            const muteBtn = document.getElementById('mute-btn');

            if (bgMusic) {
                bgMusic.volume = 0.5; // Set initial volume
                bgMusic.play().then(() => {
                    // Auto-play success
                    if (muteBtn) muteBtn.innerText = '🔊';
                }).catch(error => {
                    console.log("Autoplay prevented:", error);
                    // Autoplay failed (likely due to no interaction), show muted icon
                    if (muteBtn) muteBtn.innerText = '🔇';
                });
            }

            // 4. Remove after fade transition (1s)
            setTimeout(() => {
                introOverlay.style.display = 'none';
            }, 1000);

        }, 6000); // 6 seconds after load
    }

    // 10. Mute Button Logic
    const bgMusic = document.getElementById('bg-music');
    const muteBtn = document.getElementById('mute-btn');

    if (muteBtn && bgMusic) {
        muteBtn.addEventListener('click', () => {
            if (bgMusic.paused) {
                bgMusic.play();
                muteBtn.innerText = '🔊';
            } else {
                bgMusic.pause();
                muteBtn.innerText = '🔇';
            }
        });
    }
});

