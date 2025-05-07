document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    
    initScrollHeader();
    
    initFormValidation();
    
    initAOS();

    updateCartBadge();
});

function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function () {
            navMenu.classList.toggle('active');
            mobileToggle.querySelector('i').classList.toggle('fa-bars');
            mobileToggle.querySelector('i').classList.toggle('fa-times');
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

const quantityInput = document.querySelector('.quantity-selector__input');
const decreaseBtn = document.querySelector('.quantity-selector__button:first-child');
const increaseBtn = document.querySelector('.quantity-selector__button:last-child');
const priceElement = document.querySelector('.price-list .text-on-sale');
const originalPriceElement = document.querySelector('.price-list .text-subdued');

if (quantityInput && decreaseBtn && increaseBtn && priceElement && originalPriceElement) {
    // Giá ban đầu
    const basePrice = 90000;
    const originalBasePrice = 299000;

    // Cập nhật giá dựa trên số lượng
    function updatePrice() {
        const quantity = parseInt(quantityInput.value) || 1;
        const newPrice = basePrice * quantity;
        const newOriginalPrice = originalBasePrice * quantity;
        
        // Cập nhật giá hiển thị
        priceElement.innerHTML = `<span class="sr-only">Giá khuyến mãi</span>${newPrice.toLocaleString('vi-VN')}₫`;
        originalPriceElement.innerHTML = `<span class="sr-only">Giá gốc</span>${newOriginalPrice.toLocaleString('vi-VN')}₫`;
    }

    // Xử lý nút giảm số lượng
    decreaseBtn.addEventListener('click', function() {
        const currentValue = parseInt(quantityInput.value) || 1;
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
            updatePrice();
            
            // Bỏ trạng thái disabled nếu số lượng > 1
            if (parseInt(quantityInput.value) === 1) {
                decreaseBtn.disabled = true;
            } else {
                decreaseBtn.disabled = false;
            }
        }
    });

    // Xử lý nút tăng số lượng
    increaseBtn.addEventListener('click', function() {
        const currentValue = parseInt(quantityInput.value) || 1;
        quantityInput.value = currentValue + 1;
        updatePrice();
        
        // Bỏ trạng thái disabled khi số lượng > 1
        if (parseInt(quantityInput.value) > 1) {
            decreaseBtn.disabled = false;
        }
    });

    // Xử lý khi thay đổi giá trị input trực tiếp
    quantityInput.addEventListener('change', function() {
        const currentValue = parseInt(this.value) || 1;
        
        // Đảm bảo giá trị không nhỏ hơn 1
        if (currentValue < 1) {
            this.value = 1;
        }
        
        // Cập nhật trạng thái nút giảm
        if (parseInt(this.value) === 1) {
            decreaseBtn.disabled = true;
        } else {
            decreaseBtn.disabled = false;
        }
        
        updatePrice();
    });
} 