<<<<<<< HEAD
Zepto(document).ready(function() {
	var http_url = serveUrl();
	var uid = zcGetLocationParm('uid');
	$(".goBack").on("tap", function(){
		window.location.href = "personnel_list.html";
	})
	// 姓名验证
	$(".list_wrap li").eq(0).find("input").on("blur", function(){
		if($(".list_wrap li").eq(0).find("input").val() == "请输入中文姓名" || $(".list_wrap li").eq(0).find("input").val() == ""){
			$(".list_wrap li").eq(0).find("input").val("请输入中文姓名")
			$(".list_wrap li").eq(0).find("input").css({
				"color": "red",
				"font-size": "0.7rem"
			});
			$(".wrap").css("display", "block")
		}else{
			$(".list_wrap li").eq(0).find("input").css({
				"color": "#999",
				"font-size": "0.7rem"
			});
			$(".wrap").css("display", "none");
		}
	})
	// 证件号验证
	var val = "";
	$(".list_wrap li").eq(4).find("input").on("input", function(){
		if($(".list_wrap li").eq(3).find(".span2").html() == "身份证"){
			if($(".list_wrap li").eq(4).find("input").val().length == 18){
				val = $(".list_wrap li").eq(4).find("input").val().split("").slice(0, 19).join("");
			}
			if($(".list_wrap li").eq(4).find("input").val().length > 18){
				$(".list_wrap li").eq(4).find("input").val(val);
				$(".warn p").html("身份证号对大长度是18位")
				$(".warn").css("display", "block");
				$(".warn h4 span").on("tap", function(){
					$(".warn").css("display", "none")
				})
			}
		}
		
	})
	$(".list_wrap li").eq(4).find("input").on("blur", function(){
		if($(".list_wrap li").eq(3).find(".span2").html() == "身份证"){
			if($(this).val().length <18){
				$(".warn p").html("身份证号填写有误")
				$(".warn").css("display", "block");
				$(".warn h4 span").on("tap", function(){
					$(".warn").css("display", "none")
				})
			}
		}
	})
	// 点击性别时出发弹出效果
	$("li").eq(2).on("tap", function(ev){
		var e = ev || window.event;
		if(e || e.stopPropagation()){
			e.stopPropagation();
		}else{
			e.cancelBubble = true
		}
		$(".sex_wrap").animate({
			"bottom": "0rem"
		}, 200)
		$(".card_wrap").animate({
			"bottom": "-10.4rem"
		}, 0)
		$(".mask").animate({
			"top": "0rem"
		}, 200);
		$(".sex_wrap li").each(function(index){
			$(".sex_wrap li").eq(index).on("tap", function(){
				if($(this).html() == "取消"){
					$("li").eq(2).find(".span2").html("男");
				}else{
					$("li").eq(2).find(".span2").html($(this).html());
				}				
				$(".sex_wrap").animate({
					"bottom": "-6.2rem"
				}, 200)
			})
		})
	})
	// 点击证件类型弹出效果
	$("li").eq(3).on("tap", function(ev){
		var e = ev || window.event;
		if(e || e.stopPropagation()){
			e.stopPropagation();
		}else{
			e.cancelBubble = true
		}
		$(".card_wrap").animate({
			"bottom": "0rem"
		}, 200)
		$(".sex_wrap").animate({
			"bottom": "-6.2rem"
		}, 0)
		$(".mask").animate({
			"top": "0rem"
		}, 200);
		$(".card_wrap li").each(function(index){
			$(".card_wrap li").eq(index).on("tap", function(){				
				if($(this).html() == "取消"){
					$("li").eq(3).find(".span2").html("身份证");
				}else{
					$("li").eq(3).find(".span2").html($(this).html());
				}
				$(".card_wrap").animate({
					"bottom": "-10.4rem"
				}, 200)
			})
		})
	})
	// 点击取消按钮执行效果
	$(".wrap1 .last_li").each(function(index){
		$(".wrap1 .last_li").eq(index).on("tap", function(){
			$(".wrap1").eq(index).animate({
				"bottom": -2 * $(".wrap1").eq(index).find("li").length - ($(".wrap1").eq(index).find("li").length - 1) * 0.1 + "rem"
			}, 200)
		})		
	})
	// 点击确定按钮
	$("button").on("tap", function(){
		// 判断证件类型
		if($(".list_wrap li").eq(3).find(".span2").html() == "身份证"){
			guestCardType = 0;
		}else if($(".list_wrap li").eq(3).find(".span2").html() == "护照"){
			guestCardType = 1;
		}else if($(".list_wrap li").eq(3).find(".span2").html() == "军官证"){
			guestCardType = 2;
		}else if($(".list_wrap li").eq(3).find(".span2").html() == "港澳通行证"){
			guestCardType = 3;
		}	
		// 判断性别	
		if($(".list_wrap li").eq(2).find(".span2").html() == "男"){
			guestSex = 0;
		}else{
			guestSex = 1;
		}
		var per = {
			"guestName": $(".list_wrap li").eq(0).find("input").val(),
			"guestCardNum": $(".list_wrap li").eq(4).find("input").val(),
			"guestCardType": guestCardType,
			"guestSex": guestSex,
			"guestBirthday": $(".list_wrap li").eq(1).find(".span2").val(),
			"uid": uid
		}
		console.log(per)
		// 发送请求，将数据推至服务器
		$.ajax({
			type: "POST",
			contentType:"application/json;charset=UTF-8",
			url:http_url + "/api/user/save/guests",
			data: JSON.stringify(per),
			success: function(res){
				if(res.msg == "success"){
					window.location.href = "personnel_list.html";
				}else{
					$(".warn p").html("用户信息有误!<br/>请核对信息后重新填写")
					$(".warn").css("display", "block");
					$(".warn h4 span").on("tap", function(){
						$(".warn").css("display", "none")
					})
				}				
			}	
		})		
	})
	$(".wrap").on("tap", function(){
		$(".warn p").html("用户信息有误!<br/>请核对信息后重新填写")
		$(".warn").css("display", "block");
		$(".warn h4 span").on("tap", function(){
			$(".warn").css("display", "none")
		})
	})
	// 当姓名栏获得焦点是执行
	$("li").eq(0).find("input").on("focus", function(){
		$(this).css("color", "#999999");
	})
	//
	$("body").on("tap", function(){
		$(".sex_wrap").animate({
			"bottom": "-6.2rem"
		}, 200)
		$(".card_wrap").animate({
			"bottom": "-10.4rem"
		}, 200)
	})
	// 这是生日选择部分
	var opt = {  
        theme: "android-ics light", 
        display: 'modal', //显示方式  
        lang: "zh",  
        setText: '确定', //确认按钮名称
        cancelText: "取消",  
        dateFormat: 'yyyy-mm-dd', //返回结果格式化为年月格式  
        dateOrder: 'yyyymmdd', //面板中日期排列格式
        onBeforeShow: function (inst) {
		//	console.info( inst.settings.wheels);
          }, 
        headerText: function (valueText) { //自定义弹出框头部格式  
        //	console.info(valueText);
            array = valueText.split('-');  
            return array[0] + "年" + array[1] + "月" + array[2] + "日";  
        }  
    };
    $("li").eq(1).find(".span2").mobiscroll().date(opt);
})
=======
Zepto(document).ready(function() {
	var http_url = serveUrl();
	var uid = zcGetLocationParm('uid');
	$(".goBack").on("tap", function(){
		window.location.href = "personnel_list.html";
	})
	// 姓名验证
	$(".list_wrap li").eq(0).find("input").on("blur", function(){
		if($(".list_wrap li").eq(0).find("input").val() == "请输入中文姓名" || $(".list_wrap li").eq(0).find("input").val() == ""){
			$(".list_wrap li").eq(0).find("input").val("请输入您的姓名!")
			$(".list_wrap li").eq(0).find("input").css({
				"color": "red",
				"font-size": "0.5rem"
			});
			$(".wrap").css("display", "block")
		}else{
			$(".list_wrap li").eq(0).find("input").css({
				"color": "#999",
				"font-size": "0.7rem"
			});
			$(".wrap").css("display", "none");
		}
	})
	// 证件号验证
	$(".list_wrap li").eq(4).find("input").on("blur", function(){
		if($(".list_wrap li").eq(3).find(".span2").html() == "身份证"){
			var re = /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/;
			if(re.test($(".list_wrap li").eq(4).find("input").val())){
				$(".list_wrap li").eq(4).find("input").css({
					"color": "#999",
					"font-size": "0.7rem"
				});
				$(".wrap").css("display", "none")
			}else{
				$(".list_wrap li").eq(4).find("input").val("证件号码不正确,请重新输入!")
				$(".list_wrap li").eq(4).find("input").css({
					"color": "red",
					"font-size": "0.5rem"
				});
				$(".wrap").css("display", "block")
			}
		}
		
	})
	// 点击性别时出发弹出效果
	$("li").eq(2).on("tap", function(){
		document.activeElement.blur();
		$('.masker').addClass('show_out');
		$(".sex_wrap").animate({
			"bottom": "0rem"
		}, 200)
		$(".card_wrap").animate({
			"bottom": "-10.4rem"
		}, 0)
		$(".sex_wrap li").each(function(index){
			$(".sex_wrap li").eq(index).on("tap", function(){
				if($(this).html() == "取消"){
					// $("li").eq(2).find(".span2").html("男");
				}else{
					$("li").eq(2).find(".span2").html($(this).html());
				}				
				$(".sex_wrap").animate({
					"bottom": "-6.2rem"
				}, 200);
				$('.masker').removeClass('show_out');
			})
		})
	})
	// 点击证件类型弹出效果
	$("li").eq(3).on("tap", function(){
		document.activeElement.blur();
		$('.masker').addClass('show_out');
		$(".card_wrap").animate({
			"bottom": "0rem"
		}, 200)
		$(".sex_wrap").animate({
			"bottom": "-6.2rem"
		}, 0)
		$(".card_wrap li").each(function(index){
			$(".card_wrap li").eq(index).on("tap", function(){				
				if($(this).html() == "取消"){
					// $("li").eq(3).find(".span2").html("身份证");
				}else{
					$("li").eq(3).find(".span2").html($(this).html());
				}
				$(".card_wrap").animate({
					"bottom": "-10.4rem"
				}, 200);
				$('.masker').removeClass('show_out');
			})
		})
	})
	// 点击取消按钮执行效果
	$(".wrap1 .last_li").each(function(index){
		$(".wrap1 .last_li").eq(index).on("tap", function(){
			$('.masker').removeClass('show_out');
			$(".wrap1").eq(index).animate({
				"bottom": -2 * $(".wrap1").eq(index).find("li").length - ($(".wrap1").eq(index).find("li").length - 1) * 0.1 + "rem"
			}, 200)
		})		
	})
	// 点击确定按钮
	$("button").on("tap", function(){
		// 判断证件类型
		if($(".list_wrap li").eq(3).find(".span2").html() == "身份证"){
			guestCardType = 0;
		}else if($(".list_wrap li").eq(3).find(".span2").html() == "护照"){
			guestCardType = 1;
		}else if($(".list_wrap li").eq(3).find(".span2").html() == "军官证"){
			guestCardType = 2;
		}else if($(".list_wrap li").eq(3).find(".span2").html() == "港澳通行证"){
			guestCardType = 3;
		}	
		// 判断性别	
		if($(".list_wrap li").eq(2).find(".span2").html() == "男"){
			guestSex = 0;
		}else{
			guestSex = 1;
		}
		var per = {
			"guestName": $(".list_wrap li").eq(0).find("input").val(),
			"guestCardNum": $(".list_wrap li").eq(4).find("input").val(),
			"guestCardType": guestCardType,
			"guestSex": guestSex,
			"guestBirthday": $(".list_wrap li").eq(1).find(".span2").val(),
			"uid": uid
		}
		// 发送请求，将数据推至服务器
		$.ajax({
			type: "POST",
			contentType:"application/json;charset=UTF-8",
			url:http_url + "/api/user/save/guests",
			data: JSON.stringify(per),
			success: function(res){
				//console.log(res);
				if(res.code==0) {
					window.location.href = "personnel_list.html";
				}else {

				}
				
			}	
		})
		
	})
	// 进页面后直接点保存，执行操作
	$(".wrap").on("tap", function(){
		$("li").eq(0).find("input").css("color", "red");
		$("li").eq(4).find("input").css("color", "red");
		$("li").eq(4).find("input").val("请输入证件号码");
		$("li").eq(0).find("input").val("请输入您的姓名");
	})
	// 当姓名栏获得焦点是执行
	$("li").eq(0).find("input").on("focus", function(){
		$(this).css("color", "#999999");
		$(this).val("");
	})
	// 当证件号码栏获得焦点是执行
	$("li").eq(4).find("input").on("focus", function(){
		$(this).css("color", "#999999");
		$(this).val("");
	})
	// 这是生日选择部分
	var opt = {  
        theme: "android-ics light", 
        display: 'modal', //显示方式  
        lang: "zh",  
        setText: '确定', //确认按钮名称
        cancelText: "取消",  
        dateFormat: 'yyyy-mm-dd', //返回结果格式化为年月格式  
        dateOrder: 'yyyymmdd', //面板中日期排列格式
        onBeforeShow: function (inst) {
			console.log(inst);
          }, 
        headerText: function (valueText) { //自定义弹出框头部格式  
        //	console.info(valueText);
            array = valueText.split('-');  
            return array[0] + "年" + array[1] + "月" + array[2] + "日";  
        }  ,
        onClose:function() {
        	$('.span2').blur();
        },
        onCancel:function() {
        	$('.span2').blur();
        }
    };
    $("li").eq(1).on('tap',function() {
    	 document.activeElement.blur();
    })

    $("li").eq(1).find(".span2").mobiscroll().date(opt);

 	$(".forbid_input").focus(function(){
        document.activeElement.blur();
    });
})

window.onload = function() {
	solveIosHead();
}
>>>>>>> bccbc961c190f864e53c0603e124035401db8cfd
