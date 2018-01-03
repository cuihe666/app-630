window.zc_store = {
	set:function(key,value) {
		if(typeof value ==='string') {
			sessionStorage.setItem(key, value);
		}else {
			sessionStorage.setItem(key, JSON.stringify(value));
		}
	},
	get:function(key,json_obj) {
		if(json_obj) {
			return JSON.parse( sessionStorage.getItem(key) );
		} else {
			return sessionStorage.getItem(key);
		}
	},
	remove:function(key) {
		sessionStorage.removeItem(key);
	}
};

function goToComeFrom(argu_name) { 
	var curr_url=window.location.href;
	var index = curr_url.indexOf(argu_name);
	var comeArgus = curr_url.substr(index);
	var toPageUrlBefore = comeArgus.substr(9);
	var toPageUrl = toPageUrlBefore.replace('&','?');
	return toPageUrl;
}

function serveUrl() { //域名
	return 'https://prejapis.tgljweb.com';//71测试环境
	// return 'https://javapres.tgljweb.com';//75预发布环境
	// return 'https://javaapis.tgljweb.com';//正式
	// return 'http://javatest.tgljweb.com:9090';//java 40环境
}

function zcGetLocationParm(argu_name,curr_str) { //获取url参数argu_name的值,如果未获取到则返回空,原生JS完成,不依赖$,获取不到时返回空串''
	var i=0;
	var url = curr_str||window.location.href;
	var arguStr = url.split('?')[1];
	var key_val_s = [];
	var len = 0;
	var result='';
	if(arguStr) {
		key_val_s = arguStr.split('&');
		len = key_val_s.length;
		for(i=0;i<len;i++) {
			if(argu_name==key_val_s[i].split('=')[0]) {
				result=key_val_s[i].split('=')[1];
				break;
			}
		}
	}
	return result? result=='null'?'':result :'';
}

function zcGetAndSetUid() { //获取uid，如果url获取到了就存在本地，否则从本地获取（此处不处理是否获取到@zc），依赖zcGetLocationParm
	var uid = zcGetLocationParm('uid');
	if(uid) {
		zc_store.set('uid',uid);
	}
	if(!uid) {
		uid = zc_store.get('uid','json_obj'); //必须转成json格式，否则多一对双引号而报错@zc170612
	}
	return uid;
}
function zcGetAndSetcityCode() { //方法合并优化TODO0623
	var city_code = zcGetLocationParm('city_code')||zcGetLocationParm('currCityCode');
	if(city_code) {
		zc_store.set('init_city_code',city_code);
	}
	if(!city_code) {
		city_code = zc_store.get('init_city_code','json_obj'); //必须转成json格式，否则多一对双引号而报错@zc170612
	}
	return city_code;
}

function applyAppAliPay(obj){
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1; //android终端
    var isdiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if(isdiOS){
        function showIosToast(){
            window.webkit.messageHandlers.alipay.postMessage(obj);
        }
        showIosToast();
    }
    if(isAndroid){
        function showAndroidToast() {
            javascript:jsandroid.alipay(obj);
       		 // window.h5Interface.alipay(obj);
        }
        showAndroidToast();
    }
}
function applyAppWxPay(obj){
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1; //android终端
    var isdiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if(isdiOS){
        window.webkit.messageHandlers.wxpay.postMessage(obj);
    }
    if(isAndroid){
    	javascript:jsandroid.wxpay(obj); //此处方法名为wxpay@zc
       	// window.h5Interface.wxpay(obj);
    }
}

function applyAppDetailGoback(){ // 请求app 详情页 goback方法
   var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1; //android终端
    var isdiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
		if(isAndroid){
			javascript:jsandroid.goback();
		}
		if(isdiOS){
			window.webkit.messageHandlers.goback.postMessage('123123');
		}

}
function applyAppLogin(curr_url){ //调取登陆
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1; //android终端
    var isdiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if(isdiOS){
        window.webkit.messageHandlers.userLogin.postMessage(curr_url);
    }
    if(isAndroid){
       	// window.h5Interface.wxpay(obj);
       	javascript:jsandroid.userLogin(curr_url);
    }
}
function applyAppShare(obj){ //调取登陆
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1; //android终端
    var isdiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if(isdiOS){
        window.webkit.messageHandlers.share.postMessage(obj);
    }
    if(isAndroid){
       	javascript:jsandroid.share(obj);
    }
}

function applyAppShowOrderDetail(obj){ //获取订单详情
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1; //android终端
    var isdiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if(isdiOS){
            window.webkit.messageHandlers.showOrderDetail.postMessage(obj);
    }
    if(isAndroid){
       	javascript:jsandroid.showOrderDetail(obj);
    }
}


function applyAppsendMessage(obj){ //获取订单详情
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1; //android终端
    var isdiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if(isdiOS){
        window.webkit.messageHandlers.showOrderDetail.postMessage(obj);
    }
    if(isAndroid){
       	javascript:jsandroid.showOrderDetail(obj);
    }
}

function applyAppContactFan(tel,name,tid,travelName,titlePic,price,orderType) {
	var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1; //android终端
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if(arguments.length==2) {
    	objStr=JSON.stringify({userMobile:(tel),nickname:name});
    }else {
    	objStr=JSON.stringify({userMobile:(tel),nickname:name,tid:tid,travelName:(travelName||'棠果旅行'),titlePic:titlePic,price:price,orderType:orderType});
    }
    // console.log(objStr);
    if(isIOS){
        window.webkit.messageHandlers.sendMessage.postMessage(objStr);
    }
    if(isAndroid){
       	javascript:jsandroid.sendMessage(objStr);
    }
}

function solveIosHead(headNextHasMt,fn) { //
	var u = navigator.userAgent;
	var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
	var $h_top = $('.h_top');
	var h_top_height = $h_top.height();
	var $h_top_next = $h_top.next();
	var nextMt = h_top_height+20+'px';
	if(isIOS) {
		$h_top.css('padding-top','20px');
		if(!headNextHasMt) {
			$h_top_next.css('margin-top',nextMt);
		}
		if(fn) {
			fn();
		}
	}
	
}

function setTargetTop(target,obj) { //设置弹出框的top值以适应ios终端头部下移问题 传递要设置的目标元素和相关联的元素jq对象或者选择器
	var $target = (typeof target==='string'?$(target):target);
	var $obj =  (typeof obj==='string'?$(obj):obj);
	var $objOffsetTop = $obj.position().top;
	var $objHeight = $obj.height();
	var $targetTop = Number($objOffsetTop)+ Number($objHeight)+'px';
	$target.css('top',$targetTop);
}


function getLocalTimeByMs(timestamp,argu) {     //将时间戳（毫秒）转换成日期@zc170609
	var zc_new_date_obj = new Date( parseInt(timestamp) );
	var zc_year = zc_new_date_obj.getFullYear();
	var zc_month = ( zc_new_date_obj.getMonth() )+1;
	var zc_day = zc_new_date_obj.getDate();
	var resultStr = zc_year +'-'+zcAddZero(zc_month)+'-'+zcAddZero(zc_day);
	if(argu) {
		resultStr = zc_year +argu+zcAddZero(zc_month)+argu+zcAddZero(zc_day);
	}
	if(!zc_year || !zc_month ||  !zc_day) {
		resultStr = '暂无可选日期';
		return resultStr;
	}
	return resultStr;
}


function zcAddZero(num) {
	return num<10?'0'+num:num;
}

function renderAhref ($ul,city_code) { //根据传入的ul对象和当前citycode把a链接加上code参数
	var $as = $ul.find('li a');
	$.each($as,function(i,v) {
		// console.log(v.href);
		v.href+='?city_code='+city_code+'';
	})
};

function rmPageFrom() {
	zc_store.remove('from_app');
	zc_store.remove('come_from');
};


function getDauid() {
	var id=zcGetLocationParm('dauid');
	if(id) {
		zc_store.set('mdauid',id);
	}else {
		id=zc_store.get('mdauid');
	}
	return id;
}


function whatBrow(){  //获取浏览器类型(app，微信，微博，qq，其它)
    var ua = navigator.userAgent.toLowerCase();  
    if(ua.match(/MicroMessenger/i)=="micromessenger") {  
        return '微信';  
    } else if(ua.match(/WeiBo/i) == "weibo") {  
        return '微博';  
    } else if(ua.match(/QQ/i) == "qq") {
    	return 'qq';
    }else if(ua.indexOf('tgljappshow')>0) {
    	return 'app';
    }else {
    	return '其它';
    }
}

function countDownTime(secs,minId,secId,fn) { 
	var currTime=secs;
	var timer=0;
	var minDom=returnDom(minId);
	var secDom=returnDom(secId);
	timer=setInterval(function(){
		var min=parseInt(currTime/60);
		var sec=currTime%60;
		if(currTime==-1) {
			clearInterval(timer);
			if(fn && typeof fn ==='function') {
				fn();
			}
			return;
		}
		setHtml(minDom,min);
		setHtml(secDom,sec);
		--currTime;
	},1000);

	function returnDom(id) { 
		return (typeof id==='string')?(document.getElementById(id)):id;
	}

	function setHtml(dom,time) {
		time=time<10?'0'+time:time;
		dom.innerHTML=time;
	}
}


