const apiBaseUrl = "http://localhost:3000/api";

// Load products
fetch(`${apiBaseUrl}/products`)
  .then((response) => response.json())
  .then((products) => {
    const productList = document.getElementById("product-list");
    products.forEach((product) => {
      const div = document.createElement("div");
      div.innerHTML = `
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <button onclick="addToCart('${product.id}')">Add to Cart</button>
      `;
      productList.appendChild(div);
    });
  });

// Add to cart
function addToCart(productId) {
  fetch(`${apiBaseUrl}/cart`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert("Added to cart!");
    });
}

// ฟังก์ชันสำหรับค้นหาสินค้า
function searchProducts(query) {
  const filteredProducts = allProducts.filter((product) =>
    product.name.toLowerCase().includes(query.toLowerCase())
  );
  displayProducts(filteredProducts); // แสดงสินค้าที่ค้นหา
}

// ผูก Event Listener กับ Search Bar
document.getElementById("search-bar").addEventListener("input", (event) => {
  searchProducts(event.target.value); // ค้นหาทุกครั้งที่พิมพ์
});