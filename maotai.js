const needReturnUrls = [
    'www.taobao.com/markets/bx/wait_pc',
    'www.tmall.com/home'
];

//检测状态
function checkElementState(path, callback, index = 0) {
    var ele = document.querySelector(path);
    if (ele) {
        callback && callback();
    }
    else {
        setTimeout(function () {
            if (index < 6) {
                checkElementState(path, callback, index + 1);
            }
            else {
                window.location.href = 'https://cart.tmall.com/cart.htm';
            }
        }, 200);
    }
}

//结算
function checkOut(index = 0) {
    console.log('结算开始....');
    var btn = document.getElementById('J_Go');
    var className = btn.className;

    if (className.indexOf('submit-btn-disabled') > 0) {
        setTimeout(function () {
            if (index < 6) {
                checkOut(index + 1);
            }
            else {
                window.location.href = 'https://cart.tmall.com/cart.htm';
            }
        }, 200);
        return;
    }

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
dDate.setHours(20, 00, 00);

//dDate.setSeconds( dDate.getSeconds() + 10 );

//进入时间判断循环
function enterTimeCheckLoop(callback) {
    var date = new Date();

    var diff = Date.parse(dDate) - Date.parse(date);

    var leave1 = diff % (24 * 3600 * 1000);             //计算天数后剩余的毫秒数  
    var hours = Math.floor(leave1 / (3600 * 1000));  //计算出小时数  

    var leave2 = leave1 % (3600 * 1000);             //计算小时数后剩余的毫秒数  
    var minutes = Math.floor(leave2 / (60 * 1000));  //计算相差分钟数  

    var leave3 = leave2 % (60 * 1000);               //计算分钟数后剩余的毫秒数  
    var seconds = Math.round(leave3 / 1000);       //计算相差秒数  
    console.log("倒计时: " + hours + "小时 " + minutes + " 分钟" + seconds + " 秒");

    if (diff < -5 * 60 * 1000) {
        console.log('时间过了！');
        return;
    } else if (diff < 500) {
        callback && callback();

        console.log('时间到了！！！');
    } else {
        setTimeout(function () { enterTimeCheckLoop(callback); }, 50);
    }
}

function findAndSubmit() {
}

//主要函数
function main() {
    console.log('############################开始抢购茅台############################');

    var href = window.location.href;
    if (href.indexOf('cart.tmall.com') > -1) {
        var isFindMaotai = false;
        var checkBoxStatus = false;
        var aList = document.getElementsByTagName('a');
    
        for (var i = 0; i < aList.length; i++) {
            var item = aList[i];
            var title = item.getAttribute('data-title'); 
            if (title && title.indexOf('飞天53度500ml') !== -1) {
                isFindMaotai = true;
                var checkBox = item.parentNode
                    .parentNode
                    .parentNode
                    .parentNode
                    .childNodes.item(1)
                    .childNodes.item(1)
                    .childNodes.item(0)
                    .childNodes.item(0)
                    .childNodes.item(0);

                checkBox.click && checkBox.click();

                checkBoxStatus = checkBox.checked;
            }
        }
    
        if (!isFindMaotai || !checkBoxStatus) {
            setTimeout(main, 50);
            return;
        }
        //结算页面
        //进入时间判断
        enterTimeCheckLoop(checkOutAsync);
    }
    else if (href.indexOf('buy.tmall.com') > -1) {
        //提交订单页面
        submitOrder();
    }
    else {
        needReturnUrls.forEach(function(url) {
            if (href.indexOf(url) > -1) {
                window.location.href = 'https://cart.tmall.com/cart.htm';
            }
        });
    }
}


main();