

const six_api = 'livejs-api.hexschool.io';
const api_pach = 'kurokawa';
const list = document.querySelector('.productWrap');
const selectPr = document.querySelector('.productSelect');
const cartList = document.querySelector('.js-rederprlist');
const deleteBtn = document.querySelector('.discardAllBtn'); 
const total = document.querySelector('.total');
const sendBtn = document.querySelector('.orderInfo-btn');
const form = document.querySelector('.orderInfo-form');
let data = [];
let cartary=[];






//初始化

function init() {
    getPrList();
    getcartPr();
   

}


init();





//抓產品列表
function getPrList() {
axios.get(`https://${six_api}/api/livejs/v1/customer/${api_pach }/products`)
.then(function (response) {
    // console.log('資料有回傳了');  
    // console.log(response.data.products);
     data = response.data.products;
     console.log(data);
     rederPr(data);
  });
}





//組合HTML
function combHTMLstr(item) {

return ` <li class="productCard">
<h4 class="productType">新品</h4>
<img src="${item.images}" alt="${item.title}">
<a href="javascript:;" class="js-addcart" id="addCardBtn" data-cartId="${item.id}">加入購物車</a>
<h3>${item.title}</h3>
<del class="originPrice">NT$${item.origin_price}</del>
<p class="nowPrice">NT$${item.price}</p>
</li>`

}

//顯示產品列表

function rederPr() {

let str= "";
 data.forEach( (item , index) => {
    str+= combHTMLstr(item)

 } )

 list.innerHTML = str;

}



//篩選產品項目

selectPr.addEventListener('change' , function(e) {

    let categoryName = e.target.value;

  if( categoryName == "全部" ) {
    rederPr();
    return
  }


        let str = ""; 
        data.forEach( (item) => {

          if(  item.category == categoryName  ) {

            str+=  combHTMLstr(item);

          }

          list.innerHTML = str;

        })

})






//抓購物車列表API

function getcartPr() {

    axios.get(`https://${six_api}/api/livejs/v1/customer/${ api_pach}/carts`)
    .then(function(res){
  //   console.log(res.data.carts);
     cartary = res.data.carts;
     rederCartPr();
   
    })

}

//寫入購物車列表

function rederCartPr() {

let str ="";
let carttotal = 0;

cartary.forEach( (item , index) => {
    str+= `  
<tr>
    <td width="40%">
        <div class="cardItem-title">
            <img src="${item.product.images}" alt="">
            <p>${item.product.title}</p>
        </div>
    </td>
    <td width="15%">NT$${item.product.price}</td>
    <td width="20%">
    <p class="cartAmount">數量: 
    <a href="#"><span class="material-icons cartAmount-icon" data-num="${item.quantity - 1}" data-id="${item.id}">remove</span></a>
    <span>${item.quantity}</span>
    <a href="#"><span class="material-icons cartAmount-icon" data-num="${item.quantity + 1}" data-id="${item.id}">add</span></a>
  </p>
    </td>
    <td width="15%">NT$${item.product.price*item.quantity}</td>
    <td class="discardBtn" width="15%">
        <a href="javascript:;" class="material-icons" data-theId="${item.id}" title="刪除${item.product.title}" data-name="${item.product.title}"> 
            clear
        </a>
    </td>
   
</tr>
`
carttotal += item.product.price * item.quantity ;

})

cartList.innerHTML = str;


let cartNumEdit = document.querySelectorAll('.cartAmount-icon');


cartNumEdit.forEach(function(item) {
   item.addEventListener('click', function(e){
     e.preventDefault();
     editCartNum(e.target.dataset.num , e.target.dataset.id);
   })
})

//計算總金額
total.innerHTML =  `NT$${carttotal}`

}


//計算購次車產品數量
function editCartNum( num , id ) {

    if (num > 0) {
        let url = `https://${six_api}/api/livejs/v1/customer/${api_pach }/carts`;
        let data = {
          data: {
            id: id,
            quantity: parseInt(num)
          }
        }
        axios.patch(url, data)
          .then(function (res) {
            getcartPr();
          })
          .catch(function (error) {
            console.log(error);
          })
      }else{
          alert('全部刪除');
          deleteCartItem(id);
      }

}


//刪除購物車API

function deleteCartItem(cartId) {
    axios.delete(`https://${six_api}/api/livejs/v1/customer/${api_pach }/carts/${cartId}`)
    .then(function (response) {
    //  alert("刪除單筆購物車成功！");
      getcartPr();
    })
    
  }

  //刪除指定項目
  cartList.addEventListener( 'click' , function(e){

    let cartId = e.target.getAttribute('data-theId');
    let prName = e.target.getAttribute('data-name');
    let delPr = `刪除「${prName}」成功！`;

    if( cartId == null  ) {
        return
    }
    Swal.fire({
      position: 'top-center',
      icon: 'success',
      title: delPr,
      showConfirmButton: false
    })
    deleteCartItem(cartId);
  }); 


  //刪除全部項目API
function delAllcart() {
    axios.delete(`https://${six_api}/api/livejs/v1/customer/${api_pach }/carts`)
    .then(function(response){
      
        Swal.fire({
          position: 'top-center',
          icon: 'success',
          title: '刪除購物車成功',
          showConfirmButton: false
        })
        getcartPr();
    })
}

deleteBtn.addEventListener( 'click' ,function(e){
    delAllcart();
})



//加入購物車

function addCartPr(id){
    let numCheck = 1;
    cartary.forEach(function(item){
      if (item.product.id === id) {
        numCheck = item.quantity += 1;
      }
    })


    axios.post(`https://${six_api}/api/livejs/v1/customer/${api_pach }/carts` , {
        data:{
            "productId": id,
            "quantity": numCheck
        }
    } )
    .then(function(res){
       
      
        Swal.fire({
          position: 'top-center',
          icon: 'success',
          title: '加入購物車成功'
        })
        getcartPr();
    })
}

//判斷加入產品
list.addEventListener('click',function(e){
   
    if( e.target.getAttribute('class') !== "js-addcart"  ) {
        return
    }
        let getid = e.target.getAttribute('data-cartid');
        addCartPr(getid);
      
    

})


//表單API

function sendfrom (){
    axios.post(`https://${six_api}/api/livejs/v1/customer/${api_pach }/orders`)
    .then( function(res){

    } )
}


//送表單

sendBtn.addEventListener('click',function(e){
    e.preventDefault() ;
  
    if (total.textContent == "NT$0" ){
      alert("尚未選擇產品！");
     return;

    }

    let nameValue = document.querySelector('#customerName').value;
    let phoneValue = document.querySelector('#customerPhone').value;
    let mailValue = document.querySelector('#customerEmail').value;
    let addressValue = document.querySelector('#customerAddress').value;
    let tradeValue = document.querySelector('#tradeWay').value;

    if (nameValue == "" || phoneValue == "" || mailValue == "" || addressValue==""){
     

        Swal.fire({
          position: 'top-center',
          icon: 'warning',
          title: '有欄位資料未填寫！',
          showConfirmButton: false
        });
        return;
      }

      let ary = {

        name: nameValue,
        tel: phoneValue,
        Email: mailValue,
        address: addressValue,
        payment: tradeValue

      }
  
      createOrder(ary);

      form.reset();

})

//送表單API
function createOrder(ary) {

    let data = {

        data:{

            user:{
          "name": ary.name,
          "tel": ary.tel,
          "email": ary.Email,
          "address": ary.address,
          "payment": ary.payment
            }


        }


    }



    axios.post(`https://${six_api}/api/livejs/v1/customer/${api_pach }/orders` ,  data )
    .then(function(res){
        Swal.fire({
          position: 'top-center',
          icon: 'success',
          title: '訂單建立成功!',
          showConfirmButton: false
        })
        console.log(res)
        getcartPr();
    })

}