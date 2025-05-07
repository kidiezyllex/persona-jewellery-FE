import { featuredProducts } from '../mocks/mockData.js';

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
    
    // Tạo phần tử chứa các badge lọc sản phẩm
    const productSection = document.querySelector('.product-grid-section .container');
    if (productSection) {
        const filterBadgesContainer = document.createElement('div');
        filterBadgesContainer.className = 'filter-badges';
        
        // Thêm tất cả như một tùy chọn
        filterBadgesContainer.innerHTML = `
            <button class="filter-badge active" data-category="all">Tất cả</button>
            <button class="filter-badge" data-category="tình yêu">Tình yêu</button>
            <button class="filter-badge" data-category="gia đình">Gia đình</button>
            <button class="filter-badge" data-category="cung hoàng đạo">Cung hoàng đạo</button>
            <button class="filter-badge" data-category="động vật">Động vật</button>
        `;
        
        // Chèn filter badges vào sau section header
        const sectionHeader = productSection.querySelector('.section-header');
        if (sectionHeader) {
            sectionHeader.insertAdjacentElement('afterend', filterBadgesContainer);
        }
        
        // Thêm sự kiện click cho các badge
        const filterBadges = filterBadgesContainer.querySelectorAll('.filter-badge');
        filterBadges.forEach(badge => {
            badge.addEventListener('click', function() {
                // Xóa trạng thái active của tất cả các badge
                filterBadges.forEach(b => b.classList.remove('active'));
                // Đặt trạng thái active cho badge được nhấp
                this.classList.add('active');
                
                // Lọc sản phẩm theo danh mục
                const selectedCategory = this.getAttribute('data-category');
                filterProducts(selectedCategory);
            });
        });
    }
    
    // Lọc sản phẩm theo danh mục
    function filterProducts(category) {
        let filteredProducts;
        if (category === 'all') {
            filteredProducts = featuredProducts;
        } else {
            filteredProducts = featuredProducts.filter(product => 
                product.categories && product.categories.includes(category)
            );
        }
        
        // Render lại sản phẩm đã lọc
        if (productsContainer) {
            productsContainer.innerHTML = filteredProducts.map(createProductCard).join('');
            
            // Cập nhật lại các sự kiện và hiệu ứng
            initProductCardEvents();
            
            // Reset slider position
            currentIndex = 0;
            moveSlider(0);
            
            // Cập nhật maxIndex dựa trên số lượng sản phẩm mới
            const productCards = document.querySelectorAll('.product-card');
            productsPerView = calculateProductsPerView();
            cardWidth = calculateCardWidth();
            maxIndex = Math.max(0, productCards.length - productsPerView);
            
            // Cập nhật trạng thái nút
            updateButtonStates();
        }
    }

    // Render sản phẩm nổi bật từ mockData
    function formatCurrency(number) {
        return number.toLocaleString('vi-VN') + '₫';
    }

    function createProductCard(product) {
        // Nếu có 2 ảnh thì dùng primary/secondary, nếu 1 ảnh thì chỉ primary
        let imagesHtml = '';
        if (product.images.length > 1) {
            imagesHtml = `
                <div class="product-image primary-image">
                    <img src="${product.images[0]}" alt="${product.name}">
                </div>
                <div class="product-image secondary-image">
                    <img src="${product.images[1]}" alt="${product.name}">
                </div>
            `;
        } else {
            imagesHtml = `
                <div class="product-image primary-image">
                    <img src="${product.images[0]}" alt="${product.name}">
                </div>
            `;
        }
        // Discount
        const discountHtml = product.discount ? `<div class="product-discount"><i class='fa fa-bolt'></i> ${product.discount}</div>` : '';
        // Stock
        const stockHtml = typeof product.stock !== 'undefined' ? `<div class="product-stock"><span class="stock-icon"><i class='fa fa-box'></i></span>Còn hàng: <b>${product.stock}</b></div>` : '';
        return `
            <div class="product-card" data-product-id="${product.id}">
                <a href="${product.productUrl}" class="product-link">
                    <div class="product-image-wrapper">
                        ${imagesHtml}
                        <div class="product-badge">${product.badge}</div>
                        ${discountHtml}
                        <button class="quick-view-btn" data-product-id="${product.id}">Xem nhanh</button>
                    </div>
                    <h3 class="product-title">${product.name}</h3>
                    ${stockHtml}
                    <div class="product-price">
                        <span class="current-price">${formatCurrency(product.currentPrice)}</span>
                        <span class="price-separator">-</span>
                        <span class="original-price">${formatCurrency(product.originalPrice)}</span>
                    </div>
                </a>
            </div>
        `;
    }

    if (productsContainer) {
        productsContainer.innerHTML = featuredProducts.map(createProductCard).join('');
    }
    
    // Tạo và thêm popup vào trang
    const popupHtml = `
        <div id="quickViewPopup" class="quick-view-popup">
            <div class="popup-content">
                <button class="close-popup">&times;</button>
                <div class="popup-body">
                    <div class="popup-product-images">
                        <div class="popup-main-image">
                            <img id="popupMainImage" src="" alt="Product Image">
                        </div>
                        <div class="popup-image-thumbnails">
                            <!-- Thumbnails sẽ được thêm bằng JavaScript -->
                        </div>
                    </div>
                    <div class="popup-product-info">
                        <h2 id="popupProductTitle" class="popup-product-title"></h2>
                        <div class="popup-product-price">
                            <span id="popupCurrentPrice" class="popup-current-price"></span>
                            <span id="popupOriginalPrice" class="popup-original-price"></span>
                            <span id="popupDiscount" class="popup-discount"></span>
                        </div>
                        <div id="popupStock" class="popup-stock"></div>
                        <div id="popupDescription" class="popup-description"></div>
                        <div class="popup-product-details">
                            <div class="popup-detail-item">
                                <span class="detail-label">Chất liệu:</span>
                                <span id="popupMaterial" class="detail-value"></span>
                            </div>
                            <div class="popup-detail-item">
                                <span class="detail-label">Kích thước:</span>
                                <span id="popupDimensions" class="detail-value"></span>
                            </div>
                            <div class="popup-detail-item">
                                <span class="detail-label">Trọng lượng:</span>
                                <span id="popupWeight" class="detail-value"></span>
                            </div>
                        </div>
                        
                        <!-- Tính năng nổi bật -->
                        <div class="popup-features">
                            <h3 class="popup-features-title">Tính Năng Nổi Bật</h3>
                            <div class="popup-features-grid">
                                <div class="popup-feature-item">
                                    <div class="popup-feature-icon">
                                        <i class="fas fa-cogs"></i>
                                    </div>
                                    <div class="popup-feature-content">
                                        <h4>Thiết Kế Modular</h4>
                                        <p>Dễ dàng tháo lắp, thay đổi charm theo ý thích</p>
                                    </div>
                                </div>
                                <div class="popup-feature-item">
                                    <div class="popup-feature-icon">
                                        <i class="fas fa-tint"></i>
                                    </div>
                                    <div class="popup-feature-content">
                                        <h4>Chất Liệu Cao Cấp</h4>
                                        <p>Thép không gỉ 316L bền bỉ, không gây dị ứng</p>
                                    </div>
                                </div>
                                <div class="popup-feature-item">
                                    <div class="popup-feature-icon">
                                        <i class="fas fa-shield-alt"></i>
                                    </div>
                                    <div class="popup-feature-content">
                                        <h4>Độ Bền Cao</h4>
                                        <p>Chịu được va đập và sử dụng hàng ngày</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="popup-buttons">
                            <div class="popup-quantity">
                                <button class="quantity-btn decrease">-</button>
                                <input type="number" id="popupQuantity" class="quantity-input" value="1" min="1">
                                <button class="quantity-btn increase">+</button>
                            </div>
                            <button class="popup-add-to-cart">Thêm vào giỏ hàng</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', popupHtml);
    
    // Lấy phần tử popup
    const quickViewPopup = document.getElementById('quickViewPopup');
    const closePopupBtn = document.querySelector('.close-popup');
    
    // Đóng popup khi nhấp vào nút đóng
    if (closePopupBtn) {
        closePopupBtn.addEventListener('click', function() {
            quickViewPopup.classList.remove('active');
        });
    }
    
    // Đóng popup khi nhấp bên ngoài
    quickViewPopup.addEventListener('click', function(e) {
        if (e.target === quickViewPopup) {
            quickViewPopup.classList.remove('active');
        }
    });
    
    // Hiển thị popup với thông tin sản phẩm
    function showQuickViewPopup(productId) {
        const product = featuredProducts.find(p => p.id === parseInt(productId));
        if (!product) return;
        
        // Cập nhật thông tin sản phẩm trong popup
        document.getElementById('popupProductTitle').textContent = product.name;
        document.getElementById('popupCurrentPrice').textContent = formatCurrency(product.currentPrice);
        document.getElementById('popupOriginalPrice').textContent = formatCurrency(product.originalPrice);
        document.getElementById('popupDiscount').textContent = product.discount;
        document.getElementById('popupDescription').textContent = product.description;
        document.getElementById('popupMaterial').textContent = product.material;
        document.getElementById('popupDimensions').textContent = product.dimensions;
        document.getElementById('popupWeight').textContent = product.weight;
        document.getElementById('popupStock').innerHTML = `<span class="stock-icon"><i class='fa fa-box'></i></span>Còn hàng: <b>${product.stock}</b>`;
        
        // Cập nhật hình ảnh chính
        const popupMainImage = document.getElementById('popupMainImage');
        popupMainImage.src = product.images[0];
        popupMainImage.alt = product.name;
        
        // Cập nhật hình ảnh thu nhỏ
        const thumbnailsContainer = document.querySelector('.popup-image-thumbnails');
        thumbnailsContainer.innerHTML = '';
        
        product.images.forEach((image, index) => {
            const thumbnail = document.createElement('div');
            thumbnail.className = 'popup-thumbnail' + (index === 0 ? ' active' : '');
            thumbnail.innerHTML = `<img src="${image}" alt="${product.name}">`;
            
            thumbnail.addEventListener('click', function() {
                // Thay đổi hình ảnh chính khi nhấn vào thumbnail
                popupMainImage.src = image;
                
                // Cập nhật trạng thái active cho thumbnails
                document.querySelectorAll('.popup-thumbnail').forEach(thumb => {
                    thumb.classList.remove('active');
                });
                thumbnail.classList.add('active');
            });
            
            thumbnailsContainer.appendChild(thumbnail);
        });
        
        // Xử lý tăng giảm số lượng
        const quantityInput = document.getElementById('popupQuantity');
        const decreaseBtn = document.querySelector('.quantity-btn.decrease');
        const increaseBtn = document.querySelector('.quantity-btn.increase');
        
        decreaseBtn.addEventListener('click', function() {
            const currentValue = parseInt(quantityInput.value);
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        });
        
        increaseBtn.addEventListener('click', function() {
            const currentValue = parseInt(quantityInput.value);
            quantityInput.value = currentValue + 1;
        });
        
        // Hiển thị popup
        quickViewPopup.classList.add('active');
    }
    
    // Khởi tạo các sự kiện cho product card
    function initProductCardEvents() {
        // Lấy tất cả các nút "Xem nhanh"
        const quickViewButtons = document.querySelectorAll('.quick-view-btn');
        
        // Thêm sự kiện click cho nút "Xem nhanh"
        quickViewButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const productId = this.getAttribute('data-product-id');
                showQuickViewPopup(productId);
            });
        });
        
        // Xử lý hiệu ứng hover cho sản phẩm
        const productCards = document.querySelectorAll('.product-card');
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
    }
    
    // Gọi hàm khởi tạo sự kiện
    initProductCardEvents();

    // Lấy lại các phần tử product-card sau khi render
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
        const containerWidth = productsContainer.parentElement.offsetWidth;
        let cardWidth;
        
        if (window.innerWidth >= 1200) {
            cardWidth = 280 + 20; // card width + gap
        } else if (window.innerWidth >= 992) {
            cardWidth = 260 + 20;
        } else if (window.innerWidth >= 768) {
            cardWidth = 240 + 20;
        } else {
            return 1; // Luôn hiển thị 1 sản phẩm trên mobile
        }
        
        // Tính số lượng sản phẩm có thể hiển thị
        const productsPerView = Math.floor(containerWidth / cardWidth);
        return Math.max(1, productsPerView);
    }

    // Tính toán độ rộng của một sản phẩm (bao gồm cả khoảng cách)
    function calculateCardWidth() {
        if (productCards.length === 0) return 0;
        
        // Lấy chiều rộng từ style
        let cardWidth;
        if (window.innerWidth >= 1200) {
            cardWidth = 280;
        } else if (window.innerWidth >= 992) {
            cardWidth = 260;
        } else if (window.innerWidth >= 768) {
            cardWidth = 240;
        } else {
            // Nếu là mobile, lấy chiều rộng thực tế của card
            cardWidth = productCards[0].offsetWidth;
        }
        
        // Thêm khoảng cách giữa các card
        const gap = 20;
        return cardWidth + gap;
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

    // Khởi tạo ban đầu
    updateButtonStates();
}); 