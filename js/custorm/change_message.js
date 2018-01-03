<<<<<<< HEAD
Zepto(document).ready(function() {
	var http_url = serveUrl();
	var a = zcGetLocationParm('a');
	var id = zcGetLocationParm('id');
	var uid = zcGetLocationParm('uid');
	// 点击头部返回按钮页面跳转
	$(".goBack").on("tap", function(){
		window.location.href = "personnel_list.html";
	})
	// 获取选中常用游客的信息
	$.ajax({
		type:'POST',
		contentType:"application/json;charset=UTF-8",
		url:http_url + "/api/user/get/guests",
		data: '{"uid":' + uid +'}',
		success: function(res){
			var time = getLocalTimeByMs(res.pageInfo.list[a].guestBirthday)
			console.log(time);
			$(".message li").eq(0).find(".span2").html(res.pageInfo.list[a].guestName);
			$(".message li").eq(1).find(".span2").html(time);
			if(res.pageInfo.list[a].guestSex == 0){
				$(".message li").eq(2).find(".span2").html("男");
			}else{
				$(".message li").eq(2).find(".span2").html("女");
			}
			if(res.pageInfo.list[a].guestCardType == 0){
				$(".message li").eq(3).find(".span2").html("身份证");
			}else if(res.pageInfo.list[a].guestCardType == 1){
				$(".message li").eq(3).find(".span2").html("护照");
			}else if(res.pageInfo.list[a].guestCardType == 2){
				$(".message li").eq(3).find(".span2").html("军官证");
			}else{
				$(".message li").eq(3).find(".span2").html("港澳通行证");
			}
			$(".message li").eq(4).find(".span2").html(res.pageInfo.list[a].guestCardNum);
		}
	})
	// 点击删除按钮是执行操作
	$("button").on("tap", function(){
		$.ajax({
			type: "POST",
			contentType:"application/json;charset=UTF-8",
			url:http_url + "/api/user/delete/guests",
			data: '{"id": "' + id + '"}',
			success: function(res){
				window.location.href = "personnel_list.html"
			}
		})
	})
})
=======
Zepto(document).ready(function() {
	var http_url = serveUrl();
	var a = zcGetLocationParm('a');
	var id = zcGetLocationParm('id');
	var uid = zcGetLocationParm('uid');
	// 点击头部返回按钮页面跳转
	$(".goBack").on("tap", function(){
		window.location.href = "personnel_list.html";
	})
	// 获取选中常用游客的信息
	$.ajax({
		type:'POST',
		contentType:"application/json;charset=UTF-8",
		url:http_url + "/api/user/get/guests",
		data: '{"uid":' + uid +'}',
		success: function(res){
			var time = getLocalTimeByMs(res.pageInfo.list[a].guestBirthday)
			//console.log(time);
			$(".message li").eq(0).find(".span2").html(res.pageInfo.list[a].guestName);
			$(".message li").eq(1).find(".span2").html(time);
			if(res.pageInfo.list[a].guestSex == 0){
				$(".message li").eq(2).find(".span2").html("男");
			}else{
				$(".message li").eq(2).find(".span2").html("女");
			}
			if(res.pageInfo.list[a].guestCardType == 0){
				$(".message li").eq(3).find(".span2").html("身份证");
			}else if(res.pageInfo.list[a].guestCardType == 1){
				$(".message li").eq(3).find(".span2").html("护照");
			}else if(res.pageInfo.list[a].guestCardType == 2){
				$(".message li").eq(3).find(".span2").html("军官证");
			}else{
				$(".message li").eq(3).find(".span2").html("港澳通行证");
			}
			$(".message li").eq(4).find(".span2").html(res.pageInfo.list[a].guestCardNum);
		}
	})
	// 点击删除按钮是执行操作
	$("button").on("tap", function(){
		$.ajax({
			type: "POST",
			contentType:"application/json;charset=UTF-8",
			url:http_url + "/api/user/delete/guests",
			data: '{"id": "' + id + '"}',
			success: function(res){
				window.location.href = "personnel_list.html"
			}
		})
	})
})
window.onload = function() {
	solveIosHead();
}
>>>>>>> bccbc961c190f864e53c0603e124035401db8cfd
