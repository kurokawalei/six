const api_pach = 'kurokawa';
const config = {
    headers:{
        Authorization:"sNSFHkuxupYBy2nL1EZHexiDb652"
    }
}





let orderAry =[];
const list = document.querySelector('.renderlist');
const delAllBtn = document.querySelector('.discardAllBtn');
const loading = document.querySelector('.center');

//取得後台名單API
function getOrderList() {

axios.get(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/${api_pach}/orders` , config )
.then(function(res){
   // console.log(res)
    orderAry = res.data.orders;
    console.log(orderAry);
    renOrdList();
    loadC3();
    loading.innerHTML = "";
  
}).catch(function(er){
console.log(er)
})

};

getOrderList();

//寫入後台名單

function renOrdList(){

   let str ="";

   orderAry.forEach( (item,index) => {

    //處理時間

    const thisStamp = new Date(item.createdAt*1000);
    const orderTime = `${thisStamp.getFullYear()}/${thisStamp.getMonth()+1}/${thisStamp.getDate()}`;
    //${new Date(item.createdAt * 1000).toLocaleString()}

    //處理品項資訊
    let prStr = "";
    item.products.forEach( (pr,i) => {
      prStr += `<div>${ pr.title } x ${ pr.quantity}</div>`
    
    })

   

     //處理訂單狀態
     let paidStates = "";
     if( item.paid == true  ){
      paidStates="已處理";
     }else {
      paidStates="未處理";
     }

       str+= `<tr>
       <td>${item.id}</td>
       <td>
         <p>${item.user.name}</p>
         <p>${item.user.tel}</p>
       </td>
       <td>${item.user.address}</td>
       <td>${item.user.email}</td>
       <td>
         ${prStr}
       </td>
       <td>${orderTime}</td>
       <td >
         <a href="javascript:;" data-id="${item.id}" data-states="${item.paid}" class="orderStatus">${paidStates}</a>
       </td>
       <td>
         <input type="button" class="delSingleOrder-Btn" value="刪除" data-id="${item.id}">
       </td>
   </tr>`
   } )

   list.innerHTML = str;

}


//處理訂單狀態API
function orderStates( orderId , states ) {

  let newStates;
  if( states == 'true' ){
    newStates=false;
  }else{
    newStates=true;
  }

  let Sdata = {

    data:{
    id:orderId,
    paid:newStates
    }
  }
  
  axios.put(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/${api_pach}/orders` , Sdata , config )
  .then(function(res){

     alert('訂單狀態已更新！')
     getOrderList();
  })


}


//刪除單一API

function delOrderList(orderId) {

    axios.delete(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/${api_pach}/orders/${orderId}` , config )
    .then( function(res){
        alert('刪除單筆成功');
        getOrderList();
    })
  
}


//監聽訂單列表
list.addEventListener('click',function(e){

  let getCLass = e.target.getAttribute('class');
  let orderId = e.target.getAttribute('data-id');


if(  getCLass == "delSingleOrder-Btn"   ) {
   delOrderList(orderId);
   return
}
 

if(  getCLass == "orderStatus" ) {

   let orderState = e.target.getAttribute('data-states');
  
   orderStates( orderId , orderState );
   return
}



})


//刪除全部訂單API

function delAll(e){
    e.preventDefault() ;
    axios.delete(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/${api_pach}/orders`  , config )
    .then( function(res){
        alert('已全部刪除');
        getOrderList();
    })
    
}

delAllBtn.addEventListener('click', delAll );


//cs.js


function loadC3() {

    let total = {};
    let colorObj = {};
    let colorCode = ["#ff9800", "#db880e", "#f8ac3c"];



    orderAry.forEach(function(item){

     
        item.products.forEach(function(productItem){
          if (total[productItem.category]== undefined){
            total[productItem.category] = productItem.price*productItem.quantity;
          }else{
            total[productItem.category] += productItem.price*productItem.quantity;
          }
        })

       
      })
     

      let categoryAry = Object.keys(total);

      console.log(categoryAry)

      categoryAry.forEach((item, i) => {
        colorObj[item] = colorCode[i];

      })
      console.log(colorObj)


    let newData = [];


    categoryAry.forEach((item,index) =>{
     
        let ary =[];
        ary.push(item);
        ary.push( total[item] );
        newData.push(ary);
       
    } )


    
 

  //   c3DataTitle.forEach((item, i) => {
  //     dataColor[item] = colorCode[i];
  // })

      // C3.js
      let chart = c3.generate({
        bindto: '#chart', // HTML 元素綁定
        data: {
            type: "pie",
            columns: newData,
            colors: colorObj
            // colors:{
             
            //     "Antony 雙人床架":"#9D7FEA",
            //     "Anty 雙人床架": "#5434A7",
            //     "其他": "#301E5F",
            // }
        },
    });

}


  

