<<<<<<< HEAD
Zepto(document).ready(function() {
	var http_url = serveUrl();
	var gobackUrl = zcGetLocationParm('gobackUrl');
	zc_store.set("goBackurl", gobackUrl);
	var uid =  zcGetAndSetUid() || "2713326";
	// 首先获取数据，判断是否有常用游客
	$.ajax({
		type:'POST',
		contentType:"application/json;charset=UTF-8",
		url:http_url + "/api/user/get/guests",
		data: '{"uid":' + uid +'}',
		success:function(res) {
			if(res.pageInfo.list.length == 0){
				// 没有常用游客时执行
				$(".null_box").css("display", "block");
				$(".pers_box").css("display", "none");
				$("header .add").css("display", "block");
			}else{
				// 有常用游客时执行
				$(".null_box").css("display", "none");
				$(".pers_box").css("display", "block");
				$("header .add").css("display", "none");
				for(var i = 0; i < res.pageInfo.list.length - 1; i++){
					$(".pers_box ul").append("<li>" + $(".pers_box ul li").html() +"</li>")
				}
				for(var j = 0; j < $(".pers_box ul li").length; j ++){
					if(res.pageInfo.list[j].guestCardType == 0){
						$(".pers_box ul li").eq(j).find("p").eq(1).find(".span1").html("身份证");
					}else if(res.pageInfo.list[j].guestCardType == 1){
						$(".pers_box ul li").eq(j).find("p").eq(1).find(".span1").html("护照");
					}else if(res.pageInfo.list[j].guestCardType == 2){
						$(".pers_box ul li").eq(j).find("p").eq(1).find(".span1").html("军官证");
					}else if(res.pageInfo.list[j].guestCardType == 3){
						$(".pers_box ul li").eq(j).find("p").eq(1).find(".span1").html("港澳通行证");
					}
					$(".pers_box ul li").eq(j).find(".span2").eq(0).html(res.pageInfo.list[j].guestName);
					$(".pers_box ul li").eq(j).find(".span2").eq(1).html(res.pageInfo.list[j].guestCardNum);
				}				
				var arr = [];
				var perArr = [];
				var ind = 0;
				// 点击选中常用游客
				$(".chose").each(function(index){
					$("li div").eq(index).on("tap", function(){
						window.location.href = "change_message.html?a=" + index + "&id=" + res.pageInfo.list[index]['id'] + "&uid=" + uid;
					})
					arr.push(index + 1);
					$(".chose").eq(index).on("tap", function(){
						var per = {
							"id": res.pageInfo.list[index].id,
							"name": res.pageInfo.list[index].guestName,
							"idCard": [res.pageInfo.list[index].guestCardType, res.pageInfo.list[index].guestCardNum]
						}
						if(arr[index] != 0){
							$(this).css({
								"background": "url('../img/agree_after.png') left top no-repeat",
								"-webkit-background-size": "1rem 1rem",
								"background-size": "1rem 1rem"
							})
							perArr.push(per);
							arr[index] = 0;
						}else{
							$(this).css({
								"background": "url('../img/zc_nochecked.png') left top no-repeat",
								"-webkit-background-size": "1rem 1rem",
								"background-size": "1rem 1rem"
							})
							for(var z = 0; z < perArr.length; z++){
								if(perArr[z].name == $("li").eq(index).find(".span2").eq(1).html()){
									ind = index;
									break;
								}
							}
							perArr.splice(ind, 1);
							arr[index] = index + 1;
						}						
					})
				})
				// 点击确定按钮时执行
				$("button").on("tap", function(){
					var obj = zc_store.get("userInfo", "json_obj");
					if(obj == null){
						obj = [];
					}
					obj.all_persons = perArr;
					zc_store.set("userInfo", obj);
					// 跳回订单页
					var goUrl = zc_store.get("gobackUrl")
					window.location.href = "writeOrder.html?gobackUrl=" + goUrl;
				})
			}
		},
		error:function() {
			console.log('ajax error');
		}
	})
	// 当存在游客列表时，点击添加常用游客跳转
	$(".add_per").on("tap", function(){
		window.location.href = "add_new_per.html?uid=" + uid;
	})
	// 当不存在游客列表时，点击头部添加跳转
	$(".add").on("tap", function(){
		window.location.href = "add_new_per.html?uid=" + uid;
	})
	// 头部返回按钮点击时执行
	$(".goBack").on("tap", function(){
		window.location.href = "writeOrder.html?gobackUrl=" + gobackUrl;
	})
})
=======
Zepto(document).ready(function() {
	var http_url = serveUrl();
	// var gobackUrl = zcGetLocationParm('gobackUrl');
	var tid = zcGetLocationParm('tid');
	var item_type = zcGetLocationParm('item_type');
	// console.log(gobackUrl);
	tid && zc_store.set("tid", tid);
	item_type && zc_store.set("item_type", item_type);
	var uid =  zcGetAndSetUid();
	// 首先获取数据，判断是否有常用游客
	console.log(new Date().getTime());
	$.ajax({
		type:'POST',
		contentType:"application/json;charset=UTF-8",
		url:http_url + "/api/user/get/guests",
		data: '{"uid":' + uid +'}',
		success:function(res) {
			console.log(new Date().getTime());
			if(res.pageInfo.list.length == 0){
				// 没有常用游客时执行
				$(".null_box").css("display", "block");
				$(".pers_box").css("display", "none");
				$(".header .add").css("display", "block");
			}else{
				// 有常用游客时执行
				$(".null_box").css("display", "none");
				$(".pers_box").css("display", "block");
				$(".header .add").css("display", "none");
				for(var i = 0; i < res.pageInfo.list.length - 1; i++){
					$(".pers_box ul").append("<li>" + $(".pers_box ul li").html() +"</li>")
				}
				for(var j = 0; j < $(".pers_box ul li").length; j ++){
					$(".pers_box ul li").eq(j).find(".span2").eq(0).html(res.pageInfo.list[j].guestName);
					$(".pers_box ul li").eq(j).find(".span2").eq(1).html(res.pageInfo.list[j].guestCardNum);
				}				
				var arr = [];
				var perArr = [];
				var ind = 0;
				// 点击选中常用游客
				$(".chose").each(function(index){
					$("li div").eq(index).on("tap", function(){
						window.location.href = "change_message.html?a=" + index + "&id=" + res.pageInfo.list[index]['id'] + "&uid=" + uid;
					})
					arr.push(index + 1);
					$(".chose").eq(index).on("tap", function(){
						var per = {
							"id": res.pageInfo.list[index].id,
							"name": res.pageInfo.list[index].guestName,
							"idCard": [res.pageInfo.list[index].guestCardType, res.pageInfo.list[index].guestCardNum]
						}
						if(arr[index] != 0){
							$(this).css({
								"background": "url('../img/agree_after.png') left top no-repeat",
								"-webkit-background-size": "1rem 1rem",
								"background-size": "1rem 1rem"
							})
							perArr.push(per);
							arr[index] = 0;
						}else{
							$(this).css({
								"background": "url('../img/zc_nochecked.png') left top no-repeat",
								"-webkit-background-size": "1rem 1rem",
								"background-size": "1rem 1rem"
							})
							for(var z = 0; z < perArr.length; z++){
								if(perArr[z].name == $("li").eq(index).find(".span2").eq(1).html()){
									ind = index;
									break;
								}
							}
							perArr.splice(ind, 1);
							arr[index] = index + 1;
						}						
					})
				})
				// 点击确定按钮时执行
				$("button").on("tap", function(){
					var obj = zc_store.get("userInfo", "json_obj");
					var tid = zc_store.get("tid",'json');
					var item_type = zc_store.get("item_type",'json');
					//console.log(obj);
					// return;
					if(obj == null){
						obj = {};
					}
					// obj.all_persons = perArr;
					obj.all_persons = addArr(obj.all_persons,perArr);
					zc_store.set("userInfo", obj);
					// 跳回订单页
					
					window.location.href ='writeOrder.html?tid='+tid+'&item_type='+item_type+'';
				})
			}
		},
		error:function() {
			console.log('ajax error');
		}
	})
	// 当存在游客列表时，点击添加常用游客跳转
	$(".add_per").on("tap", function(){
		window.location.href = "add_new_per.html?uid=" + uid;
	})
	// 当不存在游客列表时，点击头部添加跳转
	$(".add").on("tap", function(){
		window.location.href = "add_new_per.html?uid=" + uid;
	})
	// 头部返回按钮点击时执行
	$(".goBack").on("tap", function(){
		var tid = zc_store.get("tid",'json');
		var item_type = zc_store.get("item_type",'json');
		window.location.href ='writeOrder.html?tid='+tid+'&item_type='+item_type+'';
	})

	function addArr(arr1,arr2) {
		if(!arr1 || arr1.length==0) {
			return arr2;
		}else {
			$.each(arr2, function(index, val) {
				if(!inObjArr(arr1,val.id)) {
					arr1.push(val);
				}
			});
			return arr1;
		}
	}

	function inObjArr(arr,id) {
		var r = false;
		$.each(arr,function(i,obj) {
			if(obj.id == id) {
				r = true;
			}
		})
		return r;
	}

})
window.onload = function() {
	solveIosHead();
}
>>>>>>> bccbc961c190f864e53c0603e124035401db8cfd
