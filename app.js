// window.onload = function () {

// };

// var cart_item = [1, 1, 1, 1];
var cart_item = []; // array to hold the count of each item
var total = 0; // total selling price of each item, initilized as zero
var delivery = 0; // total delivery price of each item, initilized as zero
var payable = total + delivery; // total payable for the cart, initilized as zero
var max = 0; // max items for each specific item, initialized to zero.
var output = "";
// console.log(items);

// 1st API call using AJAX to show initial Cart Data on the page
function loadPage() {
    const request = new XMLHttpRequest();
    request.open("get", "http://www.mocky.io/v2/5d4150f33100006b00539276", true);
    request.onload = () => {
        try {
            var items = JSON.parse(request.responseText);
            populateItems(items); //function call to render the initial output template
            // init();
        } catch (e) {
            //call back function to catch the error and display the same to the user if required
            console.log("could not load the page");
        }
    };
    request.send(); // initiates the request.
}

function populateItems(items) {
    // populate data
    // console.log(items);
    var count = 0;
    for (var i in items) {
        //looping over the items in the JSON API
        // output += `<div class="user">
        //         <img src=${items[i].product_meta.img} height="100">
        //          <ul class="productData">
        //          <li title='heading'>${items[i].product_meta.title}</li>
        //          <li title='price'>Rs. ${items[i].pricing.selling_price}</li>
        //          <li> Delivery: Rs. ${items[i].pricing.delivery_charge}</li>
        //          <li><button class="add">+</button>
        //              <input type="text" class="count" value=1 value1=${count} readonly>
        //              <button class="remove">-</button>
        //              <span class="pincodeAvl"></span>
        //          </li>
        //          </ul>
        //         </div>`;

        let delivery_charge = `${items[i].pricing.delivery_charge}`; //variable to store delivery charges of each item
        var delivery_status = delivery_charge != 0 ? `<i class="fas fa-rupee-sign"></i> ${delivery_charge}` : "Free"; //ternary operator to validate if delivery is free or not
        cart_item.push(0); //initialize "0" value as the counter for each item
        let ind = items.indexOf(items[i]); //var to store index of each item in the cart.

        max = items[i].purchase_instructions.max_purchase_limit; //var to store max qty available for each item.
        // console.log(typeof max);
        output += `<div class="user">
            <div class="product_item_image${count}">
                <img src="${items[i].product_meta.img}" class="item_image" />
            </div>
                <div class="product_item_details${count}">
                <div title="heading">${items[i].product_meta.title}</div>
                <div title="price" class="item_price"><i class="fas fa-rupee-sign"></i> ${
                  items[i].pricing.selling_price}</div>
                <div class="item_delivery"> Delivery: ${delivery_status}</div>
                <div class="item_num">
                <div class="plus_btn" >
                    <button class="add" onclick="addToCart(${ind},${max})" >+</button>
                </div>
                <div class="item_num_value">${cart_item[ind]}</div>
                <div class="minus_btn">
                    <button class="remove" onclick="removeFromCart(${ind})">-</button> <span class="pincodeAvl"></span>
                </div>
                </div>
                </div>
                </div>
                `;
        count++;
    }
    document.getElementById("items").innerHTML = output; // create elements as per output variable
    document.querySelector("#total_price").innerHTML = `<i class="fas fa-rupee-sign"></i> ${total}`; // updates initial value of total price
    document.querySelector("#delivery_charges").innerHTML = `<i class="fas fa-rupee-sign"></i> ${delivery}`; // updates initial value of delivery charges
    document.querySelector("#amount_payable").innerHTML = `<i class="fas fa-rupee-sign"></i> ${payable}`; // updates initial value of amount payable
}
document.addEventListener("DOMContentLoaded", () => {
    //call the loadPage function once DOM, images and other resources are fully rendered on the page
    loadPage(items);
});

// 3rd API call for add and remove items functionality.

// function init(){

// }
var removeFromCart = function decrease(index) {
    // function to remove 1 qty from cart.
    if (cart_item[index] > 0) {
        cart_item[index] -= 1; // decrement the value of counter
        document.getElementsByClassName("item_num_value")[
            index
        ].childNodes[0].nodeValue = cart_item[index]; //update the value of the counter to DOM
        var ch = "-"; // char to denote that minus button is clicked.
        update(index, ch); // callback function when the removeFromCart function is called on the click event.
    }
};

var addToCart = function increase(index, max) {
    // function to add 1 qty from cart.
    if (cart_item[index] < max) {
        // condition for the max item availability.
        cart_item[index] += 1; // increment the value of counter
        document.getElementsByClassName("item_num_value")[
            index
        ].childNodes[0].nodeValue = cart_item[index]; //update the value of the counter to DOM
        var ch = "+"; // char to denote that minus button is clicked.
        update(index, ch); // callback function when the addToCart function is called on the click event
    }
};

function update(index, ch) {
    fetch("http://www.mocky.io/v2/5d4150f33100006b00539276")
        .then(res => res.json())
        .then(data => {
            tot = data[index].pricing.selling_price; //saves the selling price of the item.
            del = data[index].pricing.delivery_charge; // saves the delivery price of the item.
            console.log(index, tot, del);
            arr = [tot, del]; //saved values of tot and del variables are saved in this arr variable
            return arr;
        })
        .then(arr => {
            if (ch == "+") {
                total += arr[0];
                delivery += arr[1];
                payable = total + delivery;
            } else {
                total -= arr[0];
                delivery -= arr[1];
                payable = total + delivery;
            }

            document.querySelector("#total_price").innerHTML = `<i class="fas fa-rupee-sign"></i> ${total}`;
            document.querySelector("#delivery_charges").innerHTML = `<i class="fas fa-rupee-sign"></i> ${delivery}`;
            document.querySelector("#amount_payable").innerHTML = `<i class="fas fa-rupee-sign"></i> ${payable}`;
        });

    //document.querySelector('.price_details_payable').innerHTML = payable;
}

// 2nd API call and code to check Pin Code availability
function check() {
    let pin_node = document.getElementById("pincodeIP");
    let pin = pin_node.value;

    fetch("http://www.mocky.io/v2/5d4150f33100006b00539276")
        .then(res => res.json())
        .then(data => {
            console.log(data);
            for (let item of data) {
                let dummy = item.availability.unavailable_pincodes; //temp var
                let index = data.indexOf(item);
                let parent = document.getElementsByClassName("pincodeAvl")[index];

                parent = document.getElementsByClassName("pincodeAvl")[index];
                while (parent.firstChild) {
                    parent.firstChild.remove();
                }

                if (!dummy.includes(pin)) {
                    var message = document.createTextNode("Unavailable for this pincode");
                    var span_element = document.getElementsByClassName("pincodeAvl")[index];
                    span_element.appendChild(message);
                } else {
                    var message = document.createTextNode("");
                    var span_element = document.getElementsByClassName("pincodeAvl")[
                        index
                    ];
                    span_element.appendChild(message);
                }
            }
        });
}