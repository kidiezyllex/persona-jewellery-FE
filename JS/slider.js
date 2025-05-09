document.addEventListener('DOMContentLoaded', function() {
    // Khởi tạo slideshow
    initSlideshow();
});
function initSlideshow() {
    const slides = document.querySelectorAll('.slideshow-slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 1; // Slide thứ 2 là active ban đầu
    let slideInterval;

    // Bắt đầu slideshow tự động
    function startSlideshow() {
        slideInterval = setInterval(() => {
            nextSlide();
        }, 5000); // Chuyển slide sau mỗi 5 giây
    }

    // Hiển thị slide được chọn
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    }

    // Chuyển đến slide tiếp theo
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    // Xử lý sự kiện click vào dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            clearInterval(slideInterval); // Dừng slideshow tự động khi click
            showSlide(index);
            startSlideshow(); // Khởi động lại slideshow
        });
    });

    // Khởi động slideshow
    startSlideshow();
} 