/**
 * @file homework/08/online_shop/script.js
 * @description 瑞士包浩斯電商商城 - 購物車 LocalStorage 健壯管理器與密碼學 Ledger 簽發互動腳本
 * @student 洪晨祐 (111410517)
 */

'use strict';

// 1. 防禦性 LocalStorage 購物車狀態管理 (CartManager)
const CartManager = {
    get() {
        try {
            const data = localStorage.getItem("myCart");
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error("🚨 LocalStorage myCart 格式損壞，已自動防禦重設為空陣列。", e);
            localStorage.setItem("myCart", JSON.stringify([]));
            return [];
        }
    },
    save(cart) {
        try {
            localStorage.setItem("myCart", JSON.stringify(cart));
            // 主動派發事件供同網域其他標籤頁監聽
            window.dispatchEvent(new Event("cartUpdated"));
        } catch (e) {
            console.error("🚨 儲存購物車失敗:", e);
        }
    },
    add(product) {
        const cart = this.get();
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            existing.quantity = (existing.quantity || 1) + 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                img: product.img,
                quantity: 1
            });
        }
        this.save(cart);
        updateNavbarCartBadge();
    },
    updateQuantity(productId, delta) {
        let cart = this.get();
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity = (item.quantity || 1) + delta;
            if (item.quantity <= 0) {
                cart = cart.filter(item => item.id !== productId);
            }
            this.save(cart);
            updateNavbarCartBadge();
        }
    },
    clear() {
        this.save([]);
        updateNavbarCartBadge();
    }
};

// 2. 跨分頁狀態即時同步監聽
window.addEventListener("storage", (e) => {
    if (e.key === "myCart") {
        updateNavbarCartBadge();
        if (typeof renderCartPage === "function") {
            renderCartPage();
        }
    }
});

// 當前頁面的 cartUpdated 事件監聽
window.addEventListener("cartUpdated", () => {
    if (typeof renderCartPage === "function") {
        renderCartPage();
    }
});

// 更新 Navbar 購物車數量
function updateNavbarCartBadge() {
    const badge = document.getElementById("cart-badge");
    if (badge) {
        const cart = CartManager.get();
        const totalQty = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        badge.innerText = `CART (${totalQty.toString().padStart(2, '0')})`;
    }
}

// ------------------------------------------
// 🏪 商城主頁面商品渲染
// ------------------------------------------
let storeProducts = [];
let currentCategory = "all";
let searchQuery = "";

function fetchAndRenderProducts() {
    const grid = document.getElementById("store-product-grid");
    if (!grid) return; // 不在商城首頁則略過

    grid.innerHTML = `<div style="grid-column: 1/-1; padding: 50px; text-align: center; font-family: var(--font-mono); font-size: 0.9rem;">⏳ LOADING PRODUCT REGISTRY...</div>`;

    fetch("/products")
        .then(res => {
            if (!res.ok) throw new Error("無法獲取商品庫");
            return res.json();
        })
        .then(products => {
            storeProducts = products;
            applyFilterAndSearch();
        })
        .catch(err => {
            console.error("載入商品失敗:", err);
            grid.innerHTML = `<div style="grid-column: 1/-1; padding: 50px; text-align: center; color: red; font-family: var(--font-mono);">❌ ERROR: ${err.message}</div>`;
        });
}

// 幾何對稱渲染商品卡片
function renderProducts(products) {
    const grid = document.getElementById("store-product-grid");
    if (!grid) return;

    if (products.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1/-1; padding: 80px 0; text-align: center; font-family: var(--font-mono); font-size: 0.9rem; color: #888;">NO PRODUCTS MATCH YOUR QUERY // 找不到商品</div>`;
        return;
    }

    grid.innerHTML = "";
    products.forEach(prod => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
            <div class="product-top">
                <span class="product-category">${prod.category}</span>
                <div class="product-image-box">
                    <img src="${prod.img}" alt="${prod.name}">
                </div>
                <h3 class="product-title">${prod.name}</h3>
            </div>
            <div class="product-price-row">
                <span class="product-price">NT$ ${prod.price.toLocaleString()}</span>
                <button class="btn-action" onclick="addToCart(event, ${prod.id})">ADD TO BAG</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// 分類過濾邏輯
function filterByCategory(category) {
    currentCategory = category;
    
    // 更新分類按鈕樣式
    const container = document.getElementById("category-filters-container");
    if (container) {
        const buttons = container.querySelectorAll(".filter-btn");
        buttons.forEach(btn => {
            const btnText = btn.innerText.toLowerCase();
            const isMatch = (category === 'all' && btnText === 'all') ||
                            (category === '潮流服飾' && btnText === '服飾') ||
                            (category === '質感配件' && btnText === '配件') ||
                            (category === '生活美學' && btnText === '生活') ||
                            (category === '數碼周邊' && btnText === '周邊');
            
            if (isMatch) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
        });
    }

    applyFilterAndSearch();
}

// 即時搜尋邏輯
function handleSearchInput() {
    const input = document.getElementById("product-search-input");
    if (input) {
        searchQuery = input.value.trim();
        applyFilterAndSearch();
    }
}

// 綜合過濾執行器 (DRY 原則)
function applyFilterAndSearch() {
    let filtered = storeProducts;
    if (currentCategory !== "all") {
        filtered = filtered.filter(p => p.category === currentCategory);
    }
    if (searchQuery) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    renderProducts(filtered);
}

function addToCart(event, productId) {
    const prod = storeProducts.find(p => p.id === productId);
    if (prod) {
        CartManager.add(prod);
        
        // 取得點擊的按鈕並施加動態視覺反饋
        const btn = event.currentTarget || event.target;
        if (btn && btn.tagName === "BUTTON") {
            const originalText = btn.innerText;
            btn.innerText = "ADDED ✓";
            btn.classList.add("added-success");
            
            // 按鈕微震動或收縮動效
            btn.style.transform = "scale(0.95)";
            setTimeout(() => {
                btn.style.transform = "";
                btn.innerText = originalText;
                btn.classList.remove("added-success");
            }, 1000);
        }
    }
}

// ------------------------------------------
// 🛒 購物車頁面渲染
// ------------------------------------------
function renderCartPage() {
    const container = document.getElementById("cart-items-container");
    if (!container) return; // 不在購物車頁面則略過

    const cart = CartManager.get();
    const checkoutBtn = document.getElementById("checkout-trigger-btn");

    if (cart.length === 0) {
        container.innerHTML = `<div style="padding: 100px 0; text-align: center; font-family: var(--font-mono); font-size: 0.9rem;">YOUR CART IS EMPTY.</div>`;
        updateSummary(0);
        if (checkoutBtn) checkoutBtn.disabled = true;
        return;
    }

    if (checkoutBtn) checkoutBtn.disabled = false;
    container.innerHTML = "";

    cart.forEach(item => {
        const row = document.createElement("div");
        row.className = "cart-item-row";
        row.innerHTML = `
            <img class="cart-item-img" src="${item.img}" alt="${item.name}">
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <span style="font-family: var(--font-mono); font-size: 0.75rem; color: #888;">ID: #${item.id.toString().padStart(4, '0')}</span>
            </div>
            <div class="cart-item-qty">
                <button onclick="CartManager.updateQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="CartManager.updateQuantity(${item.id}, 1)">+</button>
            </div>
            <div class="cart-item-price">NT$ ${(item.price * item.quantity).toLocaleString()}</div>
        `;
        container.appendChild(row);
    });

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    updateSummary(subtotal);
}

function updateSummary(subtotal) {
    const subtotalDom = document.getElementById("summary-subtotal");
    const discountDom = document.getElementById("summary-discount");
    const totalDom = document.getElementById("summary-total");

    if (subtotalDom) subtotalDom.innerText = `NT$ ${subtotal.toLocaleString()}`;
    
    // 超過 5000 打 9 折
    const discount = subtotal >= 5000 ? Math.round(subtotal * 0.1) : 0;
    if (discountDom) discountDom.innerText = `NT$ -${discount.toLocaleString()}`;

    const total = subtotal - discount;
    if (totalDom) totalDom.innerText = `NT$ ${total.toLocaleString()}`;
}

// ------------------------------------------
// 📟 數位 Ledger 收據簽發打字機動效
// ------------------------------------------
function executeLedgerCheckout() {
    const cart = CartManager.get();
    if (cart.length === 0) return;

    const receiptItemsContainer = document.getElementById("receipt-items");
    if (!receiptItemsContainer) return;
    
    receiptItemsContainer.innerHTML = ""; // 清空舊資料
    
    // 生成基於 SHA-256 視覺風格的隨機密碼學雜湊
    const currentSessionId = "87bf31d3395b4bf7aad6234a08632ae4";
    const randHash = "0x" + currentSessionId.slice(0, 8) + Array.from({length: 32}, () => Math.floor(Math.random()*16).toString(16)).join("");
    document.getElementById("receipt-hash").innerText = `TX_HASH: ${randHash.slice(0, 18)}...${randHash.slice(-8)}`;
    document.getElementById("receipt-barcode-num").innerText = `TX-${randHash.slice(2, 10)}-${randHash.slice(10, 14)}-${randHash.slice(14, 18)}`;
    
    // 設置交易時間
    const now = new Date();
    document.getElementById("receipt-date").innerText = now.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" });
    
    // 計算總計與構建打字機列印文字列
    let subtotal = 0;
    const printLines = [];
    
    cart.forEach(item => {
        const qty = item.quantity || 1;
        const sub = item.price * qty;
        subtotal += sub;
        
        // 格式化為固定寬度(40字元)的打字機列印格式
        const namePart = `${item.name.slice(0, 12)} [${item.id}]`;
        const pricePart = `x${qty} NT$${sub.toLocaleString()}`;
        const dots = ".".repeat(Math.max(1, 40 - namePart.length - pricePart.length));
        printLines.push(namePart + dots + pricePart);
    });

    const discount = subtotal >= 5000 ? Math.round(subtotal * 0.1) : 0;
    const total = subtotal - discount;
    
    document.getElementById("receipt-subtotal").innerText = `NT$ ${subtotal.toLocaleString()}`;
    document.getElementById("receipt-total").innerText = `NT$ ${total.toLocaleString()}`;
    
    if (discount > 0) {
        // 添加折扣列印
        printLines.push(`PROMO DISCOUNT (10% off).....NT$ -${discount.toLocaleString()}`);
    }

    // 顯示全螢幕 Modal 並觸發紙張展開動畫
    const modal = document.getElementById("ledger-modal");
    modal.style.display = "flex";
    setTimeout(() => { modal.classList.add("active"); }, 50);
    
    // 逐行打字機動效 (Typewriter Effect)
    let currentLineIdx = 0;
    function printNextLine() {
        if (currentLineIdx < printLines.length) {
            const lineDiv = document.createElement("div");
            lineDiv.style.minHeight = "1.5em";
            receiptItemsContainer.appendChild(lineDiv);
            
            let charIdx = 0;
            const fullText = printLines[currentLineIdx];
            
            function typeChar() {
                if (charIdx < fullText.length) {
                    lineDiv.textContent += fullText.charAt(charIdx);
                    charIdx++;
                    setTimeout(typeChar, 8); // 打字速度控制 (8ms)
                } else {
                    currentLineIdx++;
                    setTimeout(printNextLine, 80); // 行間停頓
                }
            }
            typeChar();
        } else {
            // 所有明細列印完畢，延遲加蓋虛擬 "PAID" 鋼印
            setTimeout(() => {
                const stamp = document.getElementById("paid-stamp");
                if (stamp) {
                    stamp.classList.add("stamped");
                }
                if (navigator.vibrate) {
                    navigator.vibrate([100, 50, 100]); // 震動回饋
                }
            }, 300);
        }
    }
    
    setTimeout(printNextLine, 600); // 等紙張展開動畫穩定後開始打印
}

function downloadReceiptText() {
    const paper = document.querySelector(".ledger-paper");
    if (!paper) return;
    // 簡單的文字格式化下載
    const cart = CartManager.get();
    let txt = `-----------------------------------------\n`;
    txt += `              - L C S T S -\n`;
    txt += `        DIGITAL LEDGER RECEIPT\n`;
    txt += `DATE: ${document.getElementById("receipt-date").innerText}\n`;
    txt += `${document.getElementById("receipt-hash").innerText}\n`;
    txt += `-----------------------------------------\n`;
    cart.forEach(item => {
        txt += `${item.name} x${item.quantity} - NT$ ${(item.price * item.quantity).toLocaleString()}\n`;
    });
    txt += `-----------------------------------------\n`;
    txt += `TOTAL: ${document.getElementById("receipt-total").innerText}\n`;
    txt += `=========================================\n`;
    txt += `  CRYPTOGRAPHICALLY SECURED BY L-LEDGER\n`;
    
    const blob = new Blob([txt], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `receipt_${Date.now()}.txt`;
    link.click();
}

function closeLedgerAndReset() {
    const modal = document.getElementById("ledger-modal");
    if (modal) {
        modal.classList.remove("active");
        setTimeout(() => {
            modal.style.display = "none";
            CartManager.clear();
            window.location.href = "index.html";
        }, 500);
    }
}

// 頁面初始化
document.addEventListener("DOMContentLoaded", () => {
    updateNavbarCartBadge();
    fetchAndRenderProducts();
    renderCartPage();
});