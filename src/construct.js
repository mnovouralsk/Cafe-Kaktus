
let tg = window.Telegram.WebApp;
let total = 0;

tg.expand();
tg.MainButton.textColor = '#FFFFFF';
tg.MainButton.color = '#0db447';
let items = [];

// анимация боковой панели
const slideOutBtn = document.querySelector('.slide-out-btn');
const slideOutPanel = document.querySelector('.slide-out-panel');

slideOutPanel.style.right = '-80%';
slideOutBtn.addEventListener('click', function() {
  if (slideOutPanel.style.right === '-80%') {
    slideOutPanel.style.right = '0%';
  } else {
    slideOutPanel.style.right = '-80%';
  }
});

// получение данных о меню и построение карточек
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

            const productImage = document.createElement('img');
            productImage.className = 'product-image';
            productImage.src = product.image;
            productImage.alt = product.name;
            productCard.appendChild(productImage);

            const productData = document.createElement('div');
            productData.className = 'product-details';

            productData.innerHTML = '<h6 class="product-name">'+product.name+'</h6>'
            productData.innerHTML += '<p class="product-composition"><b>Состав:</b> <span class="composition-text">'+product.ingredients+'</span></p>';
            if (product.numConstructor == 2) {
                // productQuantity.innerHTML = '<button class="quantity-button minus">-</button><span class="quantity-value">0</span><button class="quantity-button plus">+</button>';
                let option = '';
                let option2 = '';
                for (let i = 0; i < product.proportions.length; i++) {
                    option += '<option value="'+product.proportions[i]+'">'+product.proportions[i]+'</option>';
                }
                for (let i = 0; i < product.proportions.length; i++) {
                    option2 += '<option value="'+product.options[i]+'">'+product.options[i]+'</option>';
                }
                productData.innerHTML += '<div class="product-options"><div class="option-group"><label for="quantity">Количество:</label><select id="quantity">'+option+'</select></div><div class="option-group"><label for="sauce">Выберите соус:</label><select id="sauce">'+option2+'</select></div></div>';
            } else if (product.numConstructor == 3) {

            } else {
                console.log('третий вариант карточки')
            }
            productData.innerHTML += '<div class="price-button"><p class="product-price">'+product.price[0]+' руб</p><button class="product-button">Добавить</button></div>';
            productCard.appendChild(productData);
            productsContainer.appendChild(productCard);

            items.push([product.name, product.price, 0]); //название, цена, количество
        });


        // addBtns.forEach((btn, index) => {
        //     btn.addEventListener('click', () => {
        //         if (parseInt(quantities[index].textContent) === ''){
        //             quantities[index].textContent = "0";
        //         }
        //         let currentQuantity = parseInt(quantities[index].textContent);

        //         quantities[index].textContent = Number(currentQuantity) + 1;
        //         items[index][2] = quantities[index].textContent;

        //         if (items[index][1].length > 1) {
        //             // console.log(items[index][1].length)
        //             if (Number(items[index][2]) > items[index][1].length) {
        //                 if (Number(items[index][2]) == 4) {
        //                     total -= Number(items[index][1][2]);
        //                 } else {
        //                     var temp = (Number(items[index][2])-1) % Number(items[index][1].length);
        //                     var temp2 = ((Number(items[index][2])-1) - temp) / Number(items[index][1].length);
        //                     if (temp == 0) {
        //                         total -= temp2 * Number(items[index][1][2]);
        //                     } else {
        //                         total -= temp2 * Number(items[index][1][2]) + Number(items[index][1][temp-1]);
        //                     }
        //                     // total -= temp2 * Number(items[index][1][2]) + Number(items[index][1][temp-1]);
        //                 }
        //                 temp = Number(items[index][2]) % Number(items[index][1].length);
        //                 temp2 = (Number(items[index][2]) - temp) / Number(items[index][1].length);
        //                 if (temp == 0) {
        //                     total += temp2 * Number(items[index][1][2]);
        //                 } else {
        //                     total += temp2 * Number(items[index][1][2]) + Number(items[index][1][temp-1]);
        //                 }

        //             } else if (Number(items[index][2]) == 2){
        //                 total -= Number(items[index][1][0]);
        //                 total += Number(items[index][1][1]);
        //             } else if (Number(items[index][2]) == 3) {
        //                 total -= Number(items[index][1][1]);
        //                 total += Number(items[index][1][2]);
        //             } else {
        //                 total += Number(items[index][1][0]);
        //             }
        //         } else {
        //             // console.log('НЕмассив')
        //             total += Number(items[index][1][0]);
        //         }
        //         tg.MainButton.setText('Заказать на сумму: ' + total + ' руб');
        //         console.log(total);
        //     });
        // });

        // removeBtns.forEach((btn, index) => {
        //     quantities[index].textContent = "0";

        //     btn.addEventListener('click', () => {
        //         let currentQuantity = parseInt(quantities[index].textContent);
        //         if (currentQuantity > 0) {
        //             quantities[index].textContent = Number(currentQuantity) - 1;
        //             items[index][2] = quantities[index].textContent;
        //             total -= Number(items[index][1]);
        //             tg.MainButton.setText('Заказать на сумму: ' + total + ' руб');
        //             // console.log(total);
        //         }
        //     });
        // });

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
