
//定时器
var timer = null;
var maotaiBoxId = 'J_CheckBox_2613005730631';

//检测状态
function checkElementState(path, callback) {
    var ele = document.querySelector(path);
    if (ele) {
        callback && callback();
    }
    else {
        setTimeout(function () { window.location.href = 'https://cart.tmall.com/cart.htm'; }, 200);
    }
}

//点击购买按钮
function clickBuy() {
    console.log('买！');

    //票的数量  如果还不可以购买，这个地方获取会失败 
    var amount = document.getElementsByClassName('mui-amount-increase')[0];
    amount && amount.click();  //+1
}

//结算
function checkOut() {
    console.log('结算开始....');
    var btn = document.getElementById('J_Go');

    if (btn) {
        btn.click();
    }
    else {
        console.log('结算按钮没找到');
    }
}

function checkOutAsync() {
    checkElementState('#J_Go', checkOut);
}

//提交订单
function submitOrder() {
    console.log('提交订单开始....');

    checkElementState('.go-btn', function () {
        var btn = document.querySelector(".go-btn");

        if (btn) {
            btn.click();
        }
        else {
            console.log('提交订单按钮没找到');
        }
    });
}

//目标时间
var dDate = new Date();  //10点和20点开抢
if (dDate.getHours() < 10) {
    dDate.setHours(9, 59, 59.2);
} else {
    dDate.setHours(19, 59, 59.5);
}

//dDate.setSeconds( dDate.getSeconds() + 10 );

//进入时间判断循环
function enterTimeCheckLoop(callback) {
    var date = new Date();

    var diff = Date.parse(dDate) - Date.parse(date) + 500;

    var leave1 = diff % (24 * 3600 * 1000);             //计算天数后剩余的毫秒数  
    var hours = Math.floor(leave1 / (3600 * 1000));  //计算出小时数  

    var leave2 = leave1 % (3600 * 1000);             //计算小时数后剩余的毫秒数  
    var minutes = Math.floor(leave2 / (60 * 1000));  //计算相差分钟数  

    var leave3 = leave2 % (60 * 1000);               //计算分钟数后剩余的毫秒数  
    var seconds = Math.round(leave3 / 1000);       //计算相差秒数  
    console.log("倒计时: " + hours + "小时 " + minutes + " 分钟" + seconds + " 秒");

    if (diff < -900) {
        console.log('时间过了！');
    } else if (diff < 15 * 1000) {
        setTimeout(function () { 
            document.getElementById(maotaiBoxId).click();
            callback && callback();
        }, 500);

        console.log('时间到了！！！');
    } else {
        setTimeout(function () { enterTimeCheckLoop(callback); }, 400);
    }
}

//主要函数
function main() {
    console.log('############################开始抢购茅台############################');

    var href = window.location.href;
    if (href.indexOf('cart.tmall.com') > -1) {
        //结算页面
        //进入时间判断
        enterTimeCheckLoop(checkOutAsync);
    }
    else if (href.indexOf('buy.tmall.com') > -1) {
        //提交订单页面
        submitOrder();
    }
}


main();