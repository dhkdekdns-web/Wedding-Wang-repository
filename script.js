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
    // 6. Gallery Logic (업그레이드 버전)
    const galleryGrid = document.getElementById('gallery-grid');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const collapseBtn = document.getElementById('collapse-btn');
    const modal = document.getElementById('gallery-modal');
    const modalImg = document.getElementById('modal-img');
    const closeModalBtn = document.getElementById('close-modal-btn');

    // 갤러리 이미지 커스텀 배열 생성 (원하시는 순서대로 숫자를 자유롭게 섞어서 배치하세요!)
    const customOrder = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
        11, 38, 39, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 40, 41, 30,
        31, 32, 33, 34, 35, 36, 37
    ];

    // 위에서 작성한 리스트를 바탕으로 '01.jpg', '04.jpg' 형태의 파일명 배열을 자동 생성합니다.
    const galleryAppImages = customOrder.map(num => {
        return num.toString().padStart(2, '0') + '.jpg';
    });

    const ITEMS_PER_PAGE = 9;
    let visibleCount = ITEMS_PER_PAGE;
    let currentImageIndex = 0; // 현재 보고 있는 사진의 번호를 기억합니다.

    function renderGallery() {
        if (!galleryGrid) return;
        galleryGrid.innerHTML = '';
        
        galleryAppImages.forEach((src, index) => {
            const item = document.createElement('div');
            item.classList.add('gallery-item');
            if (index >= visibleCount) item.classList.add('hidden');

            const img = document.createElement('img');
            img.src = `./images/${src}`;
            img.loading = "lazy";
            img.alt = `Gallery Image ${index + 1}`;

            // 사진 클릭 시 모달창 열기
            item.addEventListener('click', () => {
                currentImageIndex = index; // 클릭한 사진 번호 저장
                openModal();
            });

            item.appendChild(img);
            galleryGrid.appendChild(item);
        });
        updateButtons();
    }

    function updateButtons() {
        if (!loadMoreBtn || !collapseBtn) return;
        if (visibleCount >= galleryAppImages.length) {
            loadMoreBtn.style.display = 'none';
            collapseBtn.style.display = 'inline-block';
        } else {
            loadMoreBtn.style.display = 'inline-block';
            collapseBtn.style.display = 'none';
        }
    }

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            document.querySelectorAll('.gallery-item.hidden').forEach(item => item.classList.remove('hidden'));
            visibleCount = galleryAppImages.length;
            updateButtons();
        });
    }

    if (collapseBtn) {
        collapseBtn.addEventListener('click', () => {
            visibleCount = ITEMS_PER_PAGE;
            renderGallery();
            const gallerySection = document.querySelector('.gallery-section');
            if (gallerySection) gallerySection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // --- 모달창 제어 및 슬라이드 기능 ---

    function openModal() {
        modal.style.display = 'flex';
        modalImg.src = `./images/${galleryAppImages[currentImageIndex]}`;
        document.body.classList.add('modal-open'); // 배경 스크롤 멈춰!
    }

    function closeModalFunc() {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open'); // 배경 스크롤 다시 움직여!
    }

    function showPrevImage() {
        // 첫 사진에서 이전으로 가면 맨 마지막 사진으로
        currentImageIndex = (currentImageIndex - 1 + galleryAppImages.length) % galleryAppImages.length;
        modalImg.src = `./images/${galleryAppImages[currentImageIndex]}`;
    }

    function showNextImage() {
        // 마지막 사진에서 다음으로 가면 맨 첫 사진으로
        currentImageIndex = (currentImageIndex + 1) % galleryAppImages.length;
        modalImg.src = `./images/${galleryAppImages[currentImageIndex]}`;
    }

    // 1. X 버튼 누르면 닫기
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModalFunc);
    }

    // 2. 검은 배경 누르면 닫기 (단, 좌우 넘기기 구역이나 사진 누르면 안 닫힘)
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModalFunc();
        });
    }

    // 3. 좌우 벽면(투명 버튼) 터치 시 사진 넘기기
    document.getElementById('modal-prev').addEventListener('click', (e) => {
        e.stopPropagation(); // 클릭이 뒤로 번져서 모달이 닫히는 것 방지
        showPrevImage();
    });
    document.getElementById('modal-next').addEventListener('click', (e) => {
        e.stopPropagation();
        showNextImage();
    });

    // 4. 스와이프(손가락으로 밀기) 감지 기능
    let touchStartX = 0;
    let touchEndX = 0;

    if (modal) {
        modal.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        modal.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }

    function handleSwipe() {
        const swipeThreshold = 50; // 이 픽셀 이상 밀어야 인정
        if (touchEndX < touchStartX - swipeThreshold) {
            showNextImage(); // 왼쪽으로 밀면 다음 사진
        }
        if (touchEndX > touchStartX + swipeThreshold) {
            showPrevImage(); // 오른쪽으로 밀면 이전 사진
        }
    }

    // 갤러리 초기 렌더링 실행
    renderGallery();

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
// 8. Share Buttons
    window.shareKakao = function() {
        // 1. 카카오 도구가 제대로 불러와졌는지 확인
        if (!window.Kakao) {
            alert("카카오톡 공유 기능을 불러오지 못했습니다. (혹시 폰트나 광고 차단 앱을 사용 중이시라면 꺼주세요!)");
            return;
        }

        // 2. 카카오 초기화 (안 되어있을 때만 실행)
        if (!window.Kakao.isInitialized()) {
            window.Kakao.init('a6195ef725cd2f29edd1d38c8d977bb0'); 
        }

        // 3. 공유하기 실행
        window.Kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
                title: '다운 ❤️ 서정 결혼합니다',
                description: '2026년 4월 19일 일요일 오후 3시 30분 아펠가모 선릉',
                imageUrl: 'https://dhkdekdns-web.github.io/Wedding-Wang-repository/images/Front_main.jpg',
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

    // 링크 복사 버튼
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
    
    // 11. Easter Egg Connection (3분 대기 로직)
    const easterBtn = document.getElementById('easter-link');
    
    if (easterBtn) {
        // 3분(180,000밀리초) 뒤에 기능 활성화
        setTimeout(() => {
            // 3분이 지나면 클릭할 수 있다는 걸 알리기 위해 색상을 살짝 진하게 바꿉니다 (선택사항)
            easterBtn.style.color = '#ccc'; 
            easterBtn.style.cursor = 'pointer';
            
            // 클릭 시 이스터에그 0번 페이지로 이동
            easterBtn.addEventListener('click', () => {
                window.location.href = 'easter.html';
            });
            
            console.log("Easter egg link is now active!");
        }, 30000); // 180000ms = 3분
    }
});






