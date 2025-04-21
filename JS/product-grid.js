document.addEventListener('DOMContentLoaded', function() {
    // Khởi tạo AOS
    AOS.init({
        duration: 800,
        once: true
    });
    
    // Lấy các phần tử cần thiết
    const productsContainer = document.querySelector('.products-container');
    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');
    const productCards = document.querySelectorAll('.product-card');
    
    // Tính toán số lượng sản phẩm được hiển thị dựa trên kích thước màn hình
    let productsPerView = calculateProductsPerView();
    let currentIndex = 0;
    let cardWidth = calculateCardWidth();
    let maxIndex = Math.max(0, productCards.length - productsPerView);
    
    // Cập nhật số lượng sản phẩm hiển thị khi thay đổi kích thước màn hình
    window.addEventListener('resize', function() {
        productsPerView = calculateProductsPerView();
        cardWidth = calculateCardWidth();
        maxIndex = Math.max(0, productCards.length - productsPerView);
        
        // Di chuyển slider đến vị trí hiện tại
        moveSlider(currentIndex);
    });
    
    // Tính toán số sản phẩm được hiển thị dựa trên kích thước màn hình
    function calculateProductsPerView() {
        if (window.innerWidth >= 1200) {
            return 4;
        } else if (window.innerWidth >= 992) {
            return 3;
        } else if (window.innerWidth >= 768) {
            return 2;
        } else {
            return 1;
        }
    }
    
    // Tính toán độ rộng của một sản phẩm (bao gồm cả khoảng cách)
    function calculateCardWidth() {
        if (productCards.length === 0) return 0;
        
        const card = productCards[0];
        const cardStyle = getComputedStyle(card);
        const containerStyle = getComputedStyle(productsContainer);
        const cardMarginRight = parseInt(containerStyle.gap) || 20; // Mặc định là 20px nếu không có gap
        
        return card.offsetWidth + cardMarginRight;
    }
    
    // Di chuyển slider đến vị trí chỉ định
    function moveSlider(index) {
        // Đảm bảo index không vượt quá giới hạn
        currentIndex = Math.max(0, Math.min(index, maxIndex));
        
        // Tính toán vị trí mới
        const translateX = -currentIndex * cardWidth;
        
        // Áp dụng transform để di chuyển slider
        productsContainer.style.transform = `translateX(${translateX}px)`;
        
        // Cập nhật trạng thái nút
        updateButtonStates();
    }
    
    // Cập nhật trạng thái nút prev/next
    function updateButtonStates() {
        prevButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex >= maxIndex;
        
        // Thêm/xóa lớp 'disabled' để thay đổi giao diện
        if (prevButton.disabled) {
            prevButton.classList.add('disabled');
        } else {
            prevButton.classList.remove('disabled');
        }
        
        if (nextButton.disabled) {
            nextButton.classList.add('disabled');
        } else {
            nextButton.classList.remove('disabled');
        }
    }
    
    // Thêm sự kiện click cho nút prev
    prevButton.addEventListener('click', function() {
        moveSlider(currentIndex - 1);
    });
    
    // Thêm sự kiện click cho nút next
    nextButton.addEventListener('click', function() {
        moveSlider(currentIndex + 1);
    });
    
    // Xử lý hiệu ứng hover cho sản phẩm
    productCards.forEach(card => {
        const primaryImage = card.querySelector('.primary-image');
        const secondaryImage = card.querySelector('.secondary-image');
        
        // Nếu có cả hai hình ảnh, thêm hiệu ứng hover
        if (primaryImage && secondaryImage) {
            card.addEventListener('mouseenter', function() {
                primaryImage.style.opacity = '0';
                secondaryImage.style.opacity = '1';
            });
            
            card.addEventListener('mouseleave', function() {
                primaryImage.style.opacity = '1';
                secondaryImage.style.opacity = '0';
            });
        }
    });
    
    // Khởi tạo ban đầu
    updateButtonStates();
}); 