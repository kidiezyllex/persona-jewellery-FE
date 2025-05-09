/**
 * Product Gallery JavaScript
 * Xử lý tất cả chức năng liên quan đến sản phẩm và gallery sản phẩm
 */

document.addEventListener('DOMContentLoaded', function () {
    // Xử lý thumbnail gallery
    initThumbnailGallery();

    // Xử lý variant picker
    initVariantPickers();

    // Xử lý quantity selector
    initQuantitySelector();

    // Xử lý nút mua hàng
    initBuyButtons();

    // Xử lý accordion
    initAccordion();
});

/**
 * Khởi tạo thumbnail gallery
 */
function initThumbnailGallery() {
    const thumbnails = document.querySelectorAll('.product-gallery__thumbnail');
    const featuredImage = document.getElementById('mainImage');

    if (thumbnails.length > 0 && featuredImage) {
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', function () {
                // Cập nhật trạng thái active
                thumbnails.forEach(t => t.setAttribute('aria-current', 'false'));
                this.setAttribute('aria-current', 'true');

                // Lấy URL ảnh từ data attribute
                const imageUrl = this.getAttribute('data-image-url');

                // Cập nhật ảnh chính
                if (imageUrl) {
                    updateMainImage(imageUrl);
                }
            });
        });
    }

    // Xử lý carousel cho thumbnail gallery
    const thumbnailScroller = document.querySelector('.product-gallery__thumbnail-scroller');
    const prevButton = document.querySelector('.thumbnail-nav-button.prev');
    const nextButton = document.querySelector('.thumbnail-nav-button.next');

    if (thumbnailScroller && prevButton && nextButton) {
        const scrollAmount = 200;

        prevButton.addEventListener('click', function () {
            thumbnailScroller.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });

        nextButton.addEventListener('click', function () {
            thumbnailScroller.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });
    }
}

/**
 * Cập nhật hình ảnh chính
 * @param {string} imageUrl - URL của hình ảnh cần hiển thị
 */
function updateMainImage(imageUrl) {
    const featuredImage = document.getElementById('mainImage');
    if (featuredImage && imageUrl) {
        featuredImage.src = imageUrl;

        // Cập nhật srcset
        const baseSrc = imageUrl.split('?')[0];
        const params = imageUrl.split('?')[1];
        featuredImage.srcset =
            `${baseSrc}?${params}&width=200 200w, 
            ${baseSrc}?${params}&width=300 300w, 
            ${baseSrc}?${params}&width=400 400w, 
            ${baseSrc}?${params}&width=500 500w, 
            ${baseSrc}?${params}&width=600 600w`;
    }
}

/**
 * Chọn thumbnail dựa trên URL hình ảnh
 * @param {string} targetImageUrl - URL của hình ảnh cần chọn
 */
function selectThumbnailByUrl(targetImageUrl) {
    const thumbnails = document.querySelectorAll('.product-gallery__thumbnail');

    thumbnails.forEach(thumb => {
        if (thumb.getAttribute('data-image-url') === targetImageUrl) {
            thumbnails.forEach(t => t.setAttribute('aria-current', 'false'));
            thumb.setAttribute('aria-current', 'true');
        }
    });
}

/**
 * Khởi tạo tất cả variant picker
 */
function initVariantPickers() {
    // Xử lý variant picker (màu sắc)
    initColorPicker();

    // Xử lý variant picker (kiểu khắc)
    initEngravingPicker();
}

/**
 * Khởi tạo color picker
 */
function initColorPicker() {
    const colorOptions = document.querySelectorAll('input[name="option1"]');
    if (colorOptions.length > 0) {
        colorOptions.forEach(option => {
            option.addEventListener('change', function () {
                // Cập nhật hiển thị màu sắc đã chọn
                const colorText = this.nextElementSibling.querySelector('.sr-only').textContent;
                const colorDisplay = document.querySelector('.variant-picker__option-info span:last-child');
                if (colorDisplay) {
                    colorDisplay.textContent = colorText;
                }

                // Thay đổi ảnh sản phẩm dựa trên màu sắc
                let selectedColor = this.value;

                // Lấy kiểu khắc hiện tại
                const currentEngravingOption = document.querySelector('input[name="option2"]:checked');
                const currentEngraving = currentEngravingOption ? currentEngravingOption.value : 'none';

                // Xác định URL ảnh dựa trên kết hợp màu sắc và kiểu khắc
                const targetImageUrl = getProductImageUrl(selectedColor, currentEngraving);

                // Cập nhật ảnh chính nếu tìm thấy URL phù hợp
                if (targetImageUrl) {
                    updateMainImage(targetImageUrl);
                    selectThumbnailByUrl(targetImageUrl);
                }
            });
        });
    }
}

/**
 * Khởi tạo engraving picker
 */
function initEngravingPicker() {
    const engravingOptions = document.querySelectorAll('input[name="option2"]');
    if (engravingOptions.length > 0) {
        engravingOptions.forEach(option => {
            option.addEventListener('change', function () {
                // Lấy kiểu khắc được chọn
                let selectedEngraving = this.value;

                // Lấy màu sắc hiện tại
                const currentColorOption = document.querySelector('input[name="option1"]:checked');
                const currentColor = currentColorOption ? currentColorOption.value : 'silver';

                // Xác định URL ảnh dựa trên kết hợp màu sắc và kiểu khắc
                const targetImageUrl = getProductImageUrl(currentColor, selectedEngraving);

                // Cập nhật ảnh chính nếu tìm thấy URL phù hợp
                if (targetImageUrl) {
                    updateMainImage(targetImageUrl);
                    selectThumbnailByUrl(targetImageUrl);
                }
            });
        });
    }
}

/**
 * Lấy URL hình ảnh sản phẩm dựa trên màu sắc và kiểu khắc
 * @param {string} color - Màu sắc sản phẩm
 * @param {string} engraving - Kiểu khắc sản phẩm
 * @returns {string} URL hình ảnh sản phẩm
 */
function getProductImageUrl(color, engraving) {
    let imageUrl = '';

    if (engraving === 'none') {
        switch (color) {
            case 'silver':
                imageUrl = 'https://myitaliancharms.com/cdn/shop/files/slvrtp.png?v=1712640261&width=600';
                break;
            case 'gold':
                imageUrl = 'https://myitaliancharms.com/cdn/shop/files/gldtp.png?v=1712640261&width=600';
                break;
            case 'rose-gold':
                imageUrl = 'https://myitaliancharms.com/cdn/shop/files/rsgldtp.png?v=1712640261&width=600';
                break;
            case 'black':
                imageUrl = 'https://myitaliancharms.com/cdn/shop/files/blacktp.png?v=1712639786&width=600';
                break;
        }
    } else if (engraving === 'star') {
        switch (color) {
            case 'silver':
                imageUrl = 'https://myitaliancharms.com/cdn/shop/files/slvrstrtp.png?v=1712640261&width=600';
                break;
            case 'gold':
                imageUrl = 'https://myitaliancharms.com/cdn/shop/files/gldstrtp.png?v=1712640261&width=600';
                break;
            case 'rose-gold':
                imageUrl = 'https://myitaliancharms.com/cdn/shop/files/rsgldstrtp.png?v=1712640261&width=600';
                break;
            case 'black':
                imageUrl = 'https://myitaliancharms.com/cdn/shop/files/blacktp.png?v=1712639786&width=600';
                break;
        }
    } else if (engraving === 'butterfly') {
        switch (color) {
            case 'silver':
                imageUrl = 'https://myitaliancharms.com/cdn/shop/files/slvrbflytp.png?v=1712640261&width=600';
                break;
            case 'gold':
                imageUrl = 'https://myitaliancharms.com/cdn/shop/files/gldbflytp.png?v=1712640261&width=600';
                break;
            case 'rose-gold':
                imageUrl = 'https://myitaliancharms.com/cdn/shop/files/rsgldbflytp.png?v=1712640261&width=600';
                break;
            case 'black':
                imageUrl = 'https://myitaliancharms.com/cdn/shop/files/blacktp.png?v=1712639786&width=600';
                break;
        }
    } else if (engraving === 'heart') {
        switch (color) {
            case 'silver':
                imageUrl = 'https://myitaliancharms.com/cdn/shop/files/slvrhrttp.png?v=1712640261&width=600';
                break;
            case 'gold':
                imageUrl = 'https://myitaliancharms.com/cdn/shop/files/gldbhrttp.png?v=1712640261&width=600';
                break;
            case 'rose-gold':
                imageUrl = 'https://myitaliancharms.com/cdn/shop/files/rsgldbhrttp.png?v=1712639859&width=600';
                break;
            case 'black':
                imageUrl = 'https://myitaliancharms.com/cdn/shop/files/blacktp.png?v=1712639786&width=600';
                break;
        }
    }

    return imageUrl;
}

/**
 * Khởi tạo trình xử lý số lượng sản phẩm
 */
function initQuantitySelector() {
    const quantityInput = document.querySelector('.quantity-selector__input');
    const decreaseBtn = document.querySelector('.quantity-selector__button:first-child');
    const increaseBtn = document.querySelector('.quantity-selector__button:last-child');

    if (quantityInput && decreaseBtn && increaseBtn) {
        // Đặt giá trị mặc định và cập nhật trạng thái nút
        let quantity = 1;
        updateQuantityState();

        // Xử lý khi giá trị thay đổi trực tiếp
        quantityInput.addEventListener('change', function () {
            quantity = parseInt(this.value) || 1;
            if (quantity < 1) quantity = 1;
            this.value = quantity;
            updateQuantityState();
        });

        // Nút giảm số lượng
        decreaseBtn.addEventListener('click', function () {
            if (quantity > 1) {
                quantity--;
                quantityInput.value = quantity;
                updateQuantityState();
            }
        });

        // Nút tăng số lượng
        increaseBtn.addEventListener('click', function () {
            quantity++;
            quantityInput.value = quantity;
            updateQuantityState();
        });

        // Cập nhật trạng thái nút dựa trên giá trị
        function updateQuantityState() {
            decreaseBtn.disabled = quantity <= 1;
        }
    }
}

/**
 * Khởi tạo các nút mua hàng
 */
function initBuyButtons() {
    // Xử lý nút Add to Cart
    const addToCartBtn = document.querySelector('.buy-buttons .button');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function (e) {
            e.preventDefault();

            // Lấy các thông tin sản phẩm
            const productInfo = getSelectedProductInfo();

            // Hiển thị thông báo
            alert(`Đã thêm vào giỏ hàng:
            Sản phẩm: ${productInfo.title}
            Màu sắc: ${productInfo.color}
            Khắc: ${productInfo.engraving}
            Số lượng: ${productInfo.quantity}`);
        });
    }

    // Xử lý nút Buy Now
    const buyNowBtn = document.querySelector('.buy-buttons .button--secondary');
    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', function (e) {
            e.preventDefault();

            // Lấy các thông tin sản phẩm
            const productInfo = getSelectedProductInfo();

            // Hiển thị thông báo
            alert(`Đang chuyển đến trang thanh toán:
            Sản phẩm: ${productInfo.title}
            Màu sắc: ${productInfo.color}
            Khắc: ${productInfo.engraving}
            Số lượng: ${productInfo.quantity}`);
        });
    }
}

/**
 * Lấy thông tin sản phẩm đã chọn
 * @returns {Object} Thông tin sản phẩm
 */
function getSelectedProductInfo() {
    const productTitle = document.querySelector('.product-title').textContent.trim();
    const colorOption = document.querySelector('input[name="option1"]:checked');
    const engravingOption = document.querySelector('input[name="option2"]:checked');
    const quantity = document.querySelector('.quantity-selector__input').value;

    const selectedColor = colorOption ? colorOption.nextElementSibling.querySelector('.sr-only').textContent : 'Bạc';
    const selectedEngraving = engravingOption ? engravingOption.nextElementSibling.querySelector('span').textContent : 'Không';

    return {
        title: productTitle,
        color: selectedColor,
        engraving: selectedEngraving,
        quantity: quantity
    };
}

/**
 * Khởi tạo accordion
 */
function initAccordion() {
    const accordionDetails = document.querySelectorAll('.accordion__disclosure');
    if (accordionDetails.length > 0) {
        accordionDetails.forEach(detail => {
            detail.addEventListener('toggle', function () {
                // Cập nhật ARIA attributes
                this.setAttribute('aria-expanded', this.open);
            });
        });
    }
} 