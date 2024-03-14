let tg = window.Telegram.WebApp;
let total = 0;

tg.expand();
tg.MainButton.textColor = '#FFFFFF';
tg.MainButton.color = '#2cab37';
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
            productCard.className = 'product-card';

            const productTitle = document.createElement('h2');
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
