
let tg = window.Telegram.WebApp;
let total = 0;

tg.expand();
tg.MainButton.textColor = '#FFFFFF';
tg.MainButton.color = '#0db447';
let items = [];

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
            // const productImg = document.createElement('div');
            // productImg.className = 'product-img';

            const productImage = document.createElement('img');
            productImage.className = 'product-image';
            productImage.src = product.image;
            productImage.alt = product.name;
            productCard.appendChild(productImage);

            const productData = document.createElement('div');
            productData.className = 'product-details';

            productData.innerHTML = '<h6 class="product-name">'+product.name+'</h6>'
            productData.innerHTML += '<p class="product-composition"><b>Состав:</b> <span class="composition-text">'+product.composition+'</span></p>';
            productData.innerHTML += '<p class="product-price">'+product.price+' руб</p>';

            const productQuantity = document.createElement('div');
            productQuantity.className = 'quantity-selector';
            productQuantity.innerHTML = '<button class="quantity-button minus">-</button><span class="quantity-value">0</span><button class="quantity-button plus">+</button>';

            items.push([product.name, product.price, 0]); //название, цена, количество

            productData.appendChild(productQuantity);

            // productCard.appendChild(productImg);
            productCard.appendChild(productData);
            productsContainer.appendChild(productCard);
        });

        const addBtns = document.querySelectorAll('.plus');
        const removeBtns = document.querySelectorAll('.minus');
        const quantities = document.querySelectorAll('.quantity-value');
        // const info = document.querySelectorAll('.product-info >p:nth-child(2)');


        addBtns.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                if (parseInt(quantities[index].textContent) === ''){
                    quantities[index].textContent = "0";
                }
                let currentQuantity = parseInt(quantities[index].textContent);
                quantities[index].textContent = Number(currentQuantity) + 1;
                items[index][2] = quantities[index].textContent;
                // info.textContent = items[index];
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
                var checkbox = document.getElementById('menu');
                if(checkbox.checked) {
                    checkbox.checked = false;
                } else {
                    checkbox.checked = true;
                }

                const category = btn.dataset.category;
                categoryBtns.forEach(btn => btn.classList.remove('active'));
                btn.classList.add('active');
                const products = document.querySelectorAll('.product-card');
                products.forEach(product => {
                    if (product.classList.contains(category)) {
                        product.style.display = 'flex';
                    } else {
                        product.style.display = 'none';
                    }
                });
            });
        });

        tg.MainButton.show();
        tg.MainButton.setText('Заказать');
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });

Telegram.WebApp.onEvent("mainButtonClicked", function() {
    if (total != 0){
        let js = [];
        for (let i = 0; i < items.length; i++){
            if (items[i][2] > 0){
                js.push(items[i]);
            }
        }
        let data = {
            items: js,
            totalPrice: total
        };
        tg.sendData(JSON.stringify(data));
    } else {
        tg.sendData('0');
    }
});
