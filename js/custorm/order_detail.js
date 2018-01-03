Zepto(document).ready(function() {
	// console.log(new Date().getTime());
	var absUrl = serveUrl();
	var order_id = zcGetLocationParm('orderId');
	var item_type = zcGetLocationParm('item_type');
	var pay_way = 0; //0支付宝 1微信
	var zc_ali_data = {};
	var zc_wx_data = {};
	// window.pay_way = pay_way;		
	



	var initList = function() {
		bindEvt();
		getOrderDetail(order_id,item_type);

	};

	var bindEvt = function() {
		$('.goback').on('tap',onGobackTap);
		$('#pay_pattern_wp>li').on('tap',selectPayWay);
		$('#submit_order').on('tap',testStatus);//onSubmitOrderTap     
		$('.unfold_cnt').on('tap',onUnfoldBtnTap);
	};

	var onSubmitOrderTap = function() {
		//console.log(pay_way);
		var ali_ajax_url =  absUrl+'/api/paynotice/aliconfig';
		var wx_ajax_url =  absUrl+'/api/paynotice/wxpaysign';
		var ali_data = {};
		var wx_data = {};
		var zc_wx_data_str = '';
		var zc_ali_data_str = '';

		if(pay_way == 0) {
			$.ajax({
				type:"GET",
				url:ali_ajax_url,
				success:function(res) {
					console.log(res);
					ali_data = $.extend(zc_ali_data, res.data);
					// console.log(ali_data);
					ali_data.order_id = order_id;
					// console.log(ali_data);
					applyAppAliPay( JSON.stringify(ali_data) );

				},
				error:function() {
					console.log('ali ajax error');
				}
			});
		}

		if(pay_way == 1) {
			// console.log(zc_wx_data);

			zc_wx_data_str = JSON.stringify(zc_wx_data);
			$.ajax({
				type:"POST",
				contentType:"application/json;charset=UTF-8",
				url:wx_ajax_url,
				data:zc_wx_data_str,
				success:function(res) {
					console.log(res);
					var zc_wx_pay_obj = res.data;
					delete zc_wx_pay_obj.appid;
					// console.log(zc_wx_pay_obj);
					zc_wx_pay_obj.type = item_type;
					zc_wx_pay_obj.order_id = order_id;
					// alert(JSON.stringify(zc_wx_pay_obj));
					//console.log(JSON.stringify(zc_wx_pay_obj));
					applyAppWxPay( JSON.stringify(zc_wx_pay_obj) );
				},
				error:function(xhr) {
					console.log('wx ajax error');
				}
			})
		}
	};

	var onUnfoldBtnTap = function() {
		var is_true = $(this).siblings('.li_psn_wp').hasClass('auto_height'); //默认没有
		if(!is_true) {
			$(this).html('收起').siblings('.li_psn_wp').addClass('auto_height');

		}else {
			$(this).html('展开').siblings('.li_psn_wp').removeClass('auto_height');
		}
	};

	var selectPayWay = function() {
		$(this).addClass('zc_is_checked').find('.zc_img').attr('src','../img/zc_ischecked.png').end().siblings().find('.zc_img').attr('src','../img/zc_nochecked.png');
		pay_way = $(this).attr('data-pay');
	};

	var onGobackTap = function() {
		window.location.href = 'theme_line.html';
	};

	var getOrderDetail = function(orderId,type) {
		// console.log(new Date().getTime());
		var ajax_url = absUrl+'/api/torder/orderdetailsc';
		var data_before = {oid:order_id,type:type};
		var ajax_data = JSON.stringify(data_before);
		$.ajax({
			type:"POST",
			contentType:"application/json;charset=UTF-8",
			url:ajax_url,
			data:ajax_data,
			success:onGetDetailSuccess,
			error:function(xhr) {
				console.log('ajax error');
			}
		})
	};

	var onGetDetailSuccess = function(res) {
		//console.log(res);
		// console.log(new Date().getTime());    
		var data = res.data;
		$('#goods_travelName').html(data.travelName);
		$("#activityDate").html(getLocalTimeByMs(data.activityDate));
		$('#old_cnt').html(data.anum);
		$('#new_cnt').html(data.childnum);
		$('#contact_name').html(data.contacts);
		$('#contact_tel').html(data.mobilePhone);
		renderTravelpsn(data.userInfos);
		$('#old_evy_price').html(data.price);
		$('#old_dtl_cnt').html(data.anum);
		$('#before_total').html(data.total);
		$('#cheap_pri').html(data.couponAmount);
		$('#require_price').html(data.payAmount);
		$('#zc_price').html(data.payAmount);
		$('#submit_order').attr('data-id',data.orderNo);
		zc_ali_data.orderPrice = data.payAmount;
		zc_ali_data.order_num = zc_wx_data.paymentNo = data.orderNo;
		zc_ali_data.order_name = data.travelName;
		zc_ali_data.type = item_type;

		/*微信调后台传递的数据*/
		zc_wx_data.body = '棠果旅居'+data.travelName;
		zc_wx_data.attach = item_type;
		zc_wx_data.spBillCreateIP = '127.0.0.1';
		zc_wx_data.tradeType = 'APP';
		// zc_wx_data.type = item_type;
		/*20171020添加支付倒计时*/
		renderPayInfo(data.paySurplusTime);

	};

	function renderPayInfo(time) {
		var zcMin = 15; 
		var zcSec =00; 
		if(!time&&time!==0) {
			return;
		}
		zcMin = zcAddZero( parseInt(time/60) );
		zcSec = zcAddZero( time%60 );
		if(time==0) {
			$('.pay_info').addClass('time_over').html('支付超时，请重新下单');
			subCancel();
		}else if(time>0) {
			$('.pay_info').addClass('time_remain').html('支付剩余时间<span id="pay_min">'+zcMin+'</span>分<span id="pay_sec">'+zcSec+'</span>秒');
			countDownTime(time,pay_min,pay_sec,subCancel);
		}

		function subCancel() {
			$('.pay_info').removeClass('time_remain').addClass('time_over').html('支付超时，请重新下单');
			$('#submit_order').addClass('time_out').off();
		}
	}

	function testStatus() {
		var id=$(this).attr('data-id');
		var url=absUrl+'/api/torder/checkPayState';
		$.ajax({
			type:'GET',
			url:url,
			data:{orderNo:id},
			success:function(bk) {
				// console.log(bk);
				// console.log(bk.data);
				if(bk.data) {
					onSubmitOrderTap();
				}
			},
			error:function(xhr) {
				console.log('ajax error',xhr)
			}
		})
	}



	function renderTravelpsn(arr) {
		var zc_str = '';
		$.each(arr,function(i,obj) {
			zc_str+='<li class="evy_people clearfix" data-sex='+obj.sex+' data-type='+obj.type+'>'+
						'<span class="pl_name">'+obj.name+'</span>'+
						'<span class="pl_id">'+obj.idcard+'</span>'+
					'</li>'
		})
		$('.li_psn_wp').prepend(zc_str);
		if(arr.length>4) {
			$('.unfold_cnt').addClass('show_out');
		}
	}

	// function getLocalTimeByMs(nS) {     //将时间戳（毫秒）转换成日期
	//    var bef_str =  new Date(parseInt(nS)).toLocaleString().replace(/:\d{1,2}$/,' ');
	//    var dateStr = bef_str.split(' ')[0];
	//    var dateArr = dateStr.split('-');
	//    var resultStr = dateArr[0]+'-'+zcAddZero(dateArr[1])+'-'+zcAddZero(dateArr[2]);
	//    return resultStr;
	// }

	function getLocalTimeByMs(timestamp) {     //将时间戳（毫秒）转换成日期@zc170609
		var zc_new_date_obj = new Date( parseInt(timestamp) );
		var zc_year = zc_new_date_obj.getFullYear();
		var zc_month = ( zc_new_date_obj.getMonth() )+1;
		var zc_day = zc_new_date_obj.getDate();
		var resultStr = zc_year +'-'+zcAddZero(zc_month)+'-'+zcAddZero(zc_day);
		if(!zc_year || !zc_month ||  !zc_day) {
			resultStr = '暂无可选日期';
			return resultStr;
		}
		return resultStr;
	}


	function zcAddZero(num) {
		return num<10?'0'+num:num;
	}



	initList();
})
window.onload = function() {
	solveIosHead();
}