
let tg = window.Telegram.WebApp;
let total = 0;

tg.expand();
tg.MainButton.textColor = '#FFFFFF';
tg.MainButton.color = '#0db447';

let items = [];
let basketItems = [];
let generateOrder = [];

// анимация боковой панели
const slideOutBtn = document.querySelector('.slide-out-btn');
const slideOutPanel = document.querySelector('.slide-out-panel');

slideOutPanel.style.right = '-90%';
slideOutBtn.addEventListener('click', function() {
    if (slideOutPanel.style.right === '-90%') {
        slideOutPanel.style.right = '0%';
    } else {
        slideOutPanel.style.right = '-90%';
    }
});
// let n = 0;
let t = 0;
// получение данных о меню и построение карточек
fetch('https://mnovouralsk.github.io/Cafe-Kaktus/products.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();

    })
    .then(data => {
        const productsContainer = document.getElementById('products-container');

        data.forEach((product, index) => {
            const productCard = createElementF('div', 'product-card ' + product.category);

            const productImage = createElementF('img', 'product-image', '', product.image);
            productCard.appendChild(productImage);

            const productData = createElementF('div', 'product-details');

            productData.innerHTML = '<h6 class="product-name">'+product.name+'</h6>'
            productData.innerHTML += '<p class="product-composition"><b>Состав:</b> <span class="composition-text">'+product.ingredients+'</span></p>';
            if (product.numConstructor == 2) {
                let option = '';
                let option2 = '';
                for (let i = 0; i < product.proportions.length; i++) {
                    option += '<option value="'+i+'">'+product.proportions[i]+'</option>';
                }
                for (let i = 0; i < product.proportions.length; i++) {
                    option2 += '<option value="'+i+'">'+product.options[i]+'</option>';
                }
                productData.innerHTML += '<div class="product-options"><div class="option-group"><label for="quantity'+index+'">Количество:</label><select id="quantity'+index+'" class="selectSize">'+option+'</select></div><div class="option-group"><label for="sauce'+index+'">Выберите соус:</label><select id="sauce'+index+'" class="selectSauce">'+option2+'</select></div></div>';
            } else if (product.numConstructor == 3) {

            } else {
                // console.log('третий вариант карточки')
            }
            productData.innerHTML += '<div class="price-button"><p class="product-price">'+product.price[0]+' руб</p><button class="product-button">Добавить</button></div>';
            productCard.appendChild(productData);
            productsContainer.appendChild(productCard);

            items.push([product.name, product.price, product.proportions, product.options]); //название, цена, количество
        });
        tg.MainButton.show();
        tg.MainButton.setText('Заказать');

        // меняем цену в  зависимости от выбранных опций
        // $('select').change(()=>{
        //     changePrice()
        // });
        const productPrice = document.querySelectorAll('.product-price');
        const checkSelect = document.querySelectorAll('.selectSize');
        checkSelect.forEach((select, index) => {
            select.addEventListener('change', (event) => {
                const numbers = Number(event.target.id.match(/\d+/g));
                productPrice[numbers].textContent = items[numbers][1][Number(event.target.value)] + ' руб';
            });
        });
        // формирование позиции заказа
        const orderPozition = document.querySelectorAll('.product-button');
        orderPozition.forEach((orderObject, index) => {
            orderObject.addEventListener('click', (event) => {
                let iorder = {};
                // console.log(items[index][2].length);
                if (items[index][2].length != 1) {
                    const selectElement = document.getElementById('quantity'+index);
                    const selectedValue = selectElement.value;
                    const souceElement = document.getElementById('sauce'+index);
                    const souceValue = souceElement.value;
                    iorder = {
                        name: items[index][0],
                        price: productPrice[index].textContent,
                        size: items[index][2][selectedValue],
                        souce: items[index][3][souceValue]
                    }
                } else {
                    iorder = {
                        name: items[index][0],
                        price: productPrice[index].textContent,
                        size: "",
                        souce: ""
                    }
                }
                basketItems.push(iorder);
                generateOrder = countObjects(basketItems);
                console.log(generateOrder);
                // addOrderBasket(iorder);
                // console.log(iorder.name+"//"+iorder.price+"//"+iorder.size+"//"+iorder.souce);
            });
        });
    })
.catch(error => {
    console.error('There has been a problem with your fetch operation:', error);
});

function createElementF(element, className, value = '', url = '') {
    const el = document.createElement(element);
    el.className = className;
    if (url) {el.src = url;}
    if (value) {el.textContent = value;}
    return el;
}

function createMiniCard(order) {
    miniCardConteiner = document.getElementById('basket-items');

}

// function addOrderBasket(order) {
//     const exists = basketItems.some(item => JSON.stringify(item) === JSON.stringify(order));
//     if (!exists) {

//     }
//     console.log(basketItems);
// }

// Функция для подсчета количества повторяющихся объектов
function countObjects(array) {
    const countMap = new Map();

    array.forEach(obj => {
        const key = JSON.stringify(obj);
        countMap.set(key, (countMap.get(key) || 0) + 1);
    });

    const result = [];
    countMap.forEach((count, key) => {
        result.push([JSON.parse(key), count]);
    });

    return result;
}

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
