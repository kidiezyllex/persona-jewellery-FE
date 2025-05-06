/**
 * UI JavaScript
 * Xử lý các tính năng chung của giao diện người dùng
 */

document.addEventListener('DOMContentLoaded', function() {
    // Khởi tạo mobile menu
    initMobileMenu();
    
    // Khởi tạo scroll header
    initScrollHeader();
    
    // Khởi tạo form validation
    initFormValidation();
    
    // Khởi tạo AOS (Animate on Scroll)
    initAOS();

    // Cập nhật số lượng sản phẩm giỏ hàng lên badge
    updateCartBadge();
});

/**
 * Khởi tạo mobile menu
 */
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
        
        // Đóng menu khi click ra ngoài
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target) && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        });
        
        // Đóng menu khi bấm vào các liên kết
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }
}

/**
 * Khởi tạo scroll header
 */
function initScrollHeader() {
    const header = document.querySelector('.header');
    
    if (header) {
        // Kiểm tra vị trí ban đầu
        checkScrollPosition();
        
        // Lắng nghe sự kiện cuộn
        window.addEventListener('scroll', checkScrollPosition);
        
        function checkScrollPosition() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    }
}

/**
 * Khởi tạo form validation
 */
function initFormValidation() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Kiểm tra email
            const email = document.getElementById('email').value;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            // Kiểm tra số điện thoại
            const phone = document.getElementById('phone').value;
            const phoneRegex = /^[0-9]{10}$/;
            
            // Kiểm tra tên
            const name = document.getElementById('name').value;
            
            // Kiểm tra tin nhắn
            const message = document.getElementById('message').value;
            
            // Hiển thị lỗi nếu có
            let hasError = false;
            let errorMessage = '';
            
            if (!name.trim()) {
                hasError = true;
                errorMessage += 'Vui lòng nhập họ và tên!\n';
            }
            
            if (!emailRegex.test(email)) {
                hasError = true;
                errorMessage += 'Vui lòng nhập đúng định dạng email!\n';
            }
            
            if (!phoneRegex.test(phone)) {
                hasError = true;
                errorMessage += 'Vui lòng nhập đúng số điện thoại 10 chữ số!\n';
            }
            
            if (!message.trim()) {
                hasError = true;
                errorMessage += 'Vui lòng nhập tin nhắn!\n';
            }
            
            if (hasError) {
                alert(errorMessage);
                return;
            }
            
            // Nếu không có lỗi, gửi form
            alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.');
            contactForm.reset();
        });
    }
    
    // Kiểm tra form đăng ký nhận tin
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        const submitBtn = newsletterForm.querySelector('.newsletter-btn');
        
        submitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const emailInput = newsletterForm.querySelector('.newsletter-input');
            const email = emailInput.value;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (!emailRegex.test(email)) {
                alert('Vui lòng nhập đúng định dạng email!');
                return;
            }
            
            alert('Cảm ơn bạn đã đăng ký nhận tin!');
            emailInput.value = '';
        });
    }
}

/**
 * Khởi tạo Animate on Scroll
 */
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });
    }
}

function updateCartBadge() {
    const cartCountEl = document.getElementById('cart-count');
    let cart = [];
    try {
        cart = JSON.parse(localStorage.getItem('cart')) || [];
    } catch (e) {
        cart = [];
    }
    cartCountEl.textContent = cart.length;
} 