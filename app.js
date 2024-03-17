let tg = window.Telegram.WebApp;
let total = 0;

tg.expand();
tg.MainButton.textColor = '#FFFFFF';
tg.MainButton.color = '#2cab37';
let items = [];

const scrollContainer = document.querySelector('.menu-categories .scroll-container');
const myScroll = new IScroll(scrollContainer, {
  scrollX: true, // Set to true for horizontal scrolling
  scrollY: false, // Set to true for vertical scrolling
  mouseWheel: false, // Enable mouse wheel scrolling
  click: true, // Enable click events within the scroller
  interactiveScrollbars: true, // Enable interactive scrollbars
});

menuScrollContainer.addEventListener('touchstart', function (e) {
    const touch = e.touches[0];
    menuScroll.x = touch.pageX;
});

menuScrollContainer.addEventListener('touchmove', function (e) {
    if (!menuScroll.enabled) return;
    e.preventDefault();
    const touch = e.touches[0];
    const deltaX = touch.pageX - menuScroll.x;
    menuScroll.x = touch.pageX;
    menuScroll.scrollTo(menuScroll.x + deltaX, 0);
  });

fetch('https://mnovouralsk.github.io/Cafe-Kaktus/products.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();

    })
    .then(data => {
        console.log(data);
        const productsContainer = document.getElementById('products-container');

        data.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card ' + product.category;
            console.log(product.category);
            const productTitle = document.createElement('h3');
            productTitle.className = 'product-title';
            productTitle.textContent = product.name;
            productCard.appendChild(productTitle);

            const productImage = document.createElement('img');
            productImage.className = 'product-image';
            productImage.src = product.image;
            productImage.alt = 'Product Image';
            productCard.appendChild(productImage);

            const productInfo = document.createElement('div');
            productInfo.className = 'product-info';
            productInfo.innerHTML = '<p>'+product.composition+'</p><p class="product-price">Цена: '+product.price+'</p>';

            productCard.appendChild(productInfo);

            const productQuantity = document.createElement('div');
            productQuantity.className = 'product-quantity';
            productQuantity.innerHTML = '<button class="remove-btn">-</button><span class="quantity"></span><button class="add-btn">+</button>';

            items.push([product.name, product.price, 0]); //название, цена, количество

            productCard.appendChild(productQuantity);

            productsContainer.appendChild(productCard);
        });

        const addBtns = document.querySelectorAll('.add-btn');
        const removeBtns = document.querySelectorAll('.remove-btn');
        const quantities = document.querySelectorAll('.quantity');
        const info = document.querySelectorAll('.product-info >p:nth-child(2)');


        addBtns.forEach((btn, index) => {
            // quantities[index].textContent = "0";

            btn.addEventListener('click', () => {
                if (parseInt(quantities[index].textContent) === ''){
                    quantities[index].textContent = "0";
                }
                let currentQuantity = parseInt(quantities[index].textContent);
                quantities[index].textContent = Number(currentQuantity) + 1;
                items[index][2] = quantities[index].textContent;
                info.textContent = items[index];
                total += Number(items[index][1]);
                tg.MainButton.setText('Заказать на сумму: ' + total + ' руб');
                // console.log(total);
            });
        });

        removeBtns.forEach((btn, index) => {
            quantities[index].textContent = "0";

            btn.addEventListener('click', () => {
                let currentQuantity = parseInt(quantities[index].textContent);
                if (currentQuantity > 0) {
                    quantities[index].textContent = Number(currentQuantity) - 1;
                    items[index][2] = quantities[index].textContent;
                    total -= Number(items[index][1]);
                    tg.MainButton.setText('Заказать на сумму: ' + total + ' руб');
                    // console.log(total);
                }
            });
        });

        const categoryBtns = document.querySelectorAll('.category-btn');

        categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.dataset.category;
                categoryBtns.forEach(btn => btn.classList.remove('active'));
                btn.classList.add('active');
                const products = document.querySelectorAll('.product-card');
                products.forEach(product => {
                    if (product.classList.contains(category)) {
                        product.style.display = 'block';
                    } else {
                        product.style.display = 'none';
                    }
                });
            });
        });

        tg. MainButton.show();
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });

Telegram.WebApp.onEvent("mainButtonClicked", function() {
    let js = [];
    for (let i=0;i<items.length;i++){
        if (items[i][2] > 0){
            js.push(items[i]);
        }
    }
    let data = {
        items: js,
        totalPrice: total
    };
    tg.sendData(JSON.stringify(data));
});
