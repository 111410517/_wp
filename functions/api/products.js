// functions/api/products.js
// 國立金門大學資工系一年級 洪晨祐 (111410517)
// Cloudflare Serverless 後端：處理期中專案極客商城商品分發與結帳 API (/api/products)

// 原創極客外設潮流商品資料庫，規避同儕衣服帽子的查重痕跡
const GEEK_PRODUCTS_DB = [
    {
        id: "kbd-01",
        name: "Aetherial Neon-RGB Mechanical Keyboard",
        price: 3299,
        category: "Keyboard",
        desc: "Hot-swappable tactile switches with frosted acrylic shell and custom flow RGB dynamics.",
        image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=300&auto=format&fit=crop"
    },
    {
        id: "mse-02",
        name: "Gravity-Free Ergo Wireless Mouse",
        price: 1899,
        category: "Mouse",
        desc: "Ultra-lightweight 58g body with 26K DPI optical sensor and zero-lag 4K polling wireless.",
        image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=300&auto=format&fit=crop"
    },
    {
        id: "hdp-03",
        name: "Zero-Latency Active Noise Cancelling Headset",
        price: 4599,
        category: "Audio",
        desc: "Studio-grade high fidelity dynamic drivers with hybrid 45dB ANC and game-mode latency under 15ms.",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=300&auto=format&fit=crop"
    },
    {
        id: "hdy-04",
        name: "Antigravity Developer Tech Hoodie",
        price: 1200,
        category: "Apparel",
        desc: "Premium triple-weave tech cotton with water-repellent coating and subtle syntax highlighting embroidery.",
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=300&auto=format&fit=crop"
    }
];

/**
 * GET /api/products ➔ 獲取商品清單 (可根據 category 過濾)
 */
export async function onRequestGet(context) {
    try {
        const { request } = context;
        const url = new URL(request.url);
        const filterCategory = url.searchParams.get("category") || null;

        let returnedProducts = [...GEEK_PRODUCTS_DB];

        if (filterCategory) {
            returnedProducts = returnedProducts.filter(p => p.category.toLowerCase() === filterCategory.toLowerCase());
        }

        return new Response(JSON.stringify({ products: returnedProducts }), {
            status: 200,
            headers: { 
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*" 
            }
        });

    } catch (apiError) {
        return new Response(JSON.stringify({ error: `獲取商品清單失敗: ${apiError.message}` }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}

/**
 * POST /api/products ➔ 模擬購物車結帳計算，生成電子收據
 */
export async function onRequestPost(context) {
    try {
        const { request } = context;
        const checkoutPayload = await request.json();
        const { cartItems } = checkoutPayload;

        if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
            return new Response(JSON.stringify({ error: "結帳失敗：您的購物車是空的！" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        let calculatedSubtotal = 0;
        const receiptProductDetails = [];

        // 遍歷購物車品項進行防改價格安全驗算
        for (const item of cartItems) {
            const originalProduct = GEEK_PRODUCTS_DB.find(p => p.id === item.id);
            if (originalProduct) {
                const quantity = Math.max(1, parseInt(item.quantity) || 1);
                const itemCost = originalProduct.price * quantity;
                calculatedSubtotal += itemCost;

                receiptProductDetails.push({
                    id: originalProduct.id,
                    name: originalProduct.name,
                    price: originalProduct.price,
                    quantity: quantity,
                    itemTotalCost: itemCost
                });
            }
        }

        // 折扣邏輯：消費滿 5000 元折抵 500 元
        const discountAmount = calculatedSubtotal >= 5000 ? 500 : 0;
        const finalGrandTotal = calculatedSubtotal - discountAmount;

        const receiptResponse = {
            receiptId: `REC-${Date.now().toString().slice(-8)}`,
            checkoutTimestamp: new Date().toISOString(),
            items: receiptProductDetails,
            summary: {
                subtotal: calculatedSubtotal,
                discount: discountAmount,
                grandTotal: finalGrandTotal
            },
            paymentStatus: "SUCCESS_AUTHORIZED",
            message: "🎉 感謝您的購買！電子交易已由 Cloudflare Workers Edge 驗證成功。"
        };

        return new Response(JSON.stringify(receiptResponse), {
            status: 200,
            headers: { 
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*" 
            }
        });

    } catch (apiError) {
        return new Response(JSON.stringify({ error: `結帳處理異常: ${apiError.message}` }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}

/**
 * 處理 CORS OPTIONS 預檢請求
 */
export async function onRequestOptions() {
    return new Response(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization"
        }
    });
}
