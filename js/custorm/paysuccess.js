Zepto(document).ready(function() {
	var absUrl = serveUrl();
	var uid = zcGetAndSetUid();
	var item_type = zcGetLocationParm('item_type');  
	var order_id = zcGetLocationParm('order_id');
	var tmpObj = {oid:order_id,type:item_type};
	var initList = function() {
		bindEvt();
		showPeopleInfo(item_type);
		getDetail();
	};

	var bindEvt = function() {
		$('.goback').on('tap',onGobackTap);
		$('.goback_head ').on('tap',onGobackTap);
		$('.scan_order').on('tap',onScanOrderTap);

	};

	var onScanOrderTap = function() {
		if(tmpObj.oid) {
			applyAppShowOrderDetail(JSON.stringify(tmpObj));
		}else {
			console.log('与接口数据不匹配');
		}
	};

	var onGobackTap = function() {
		window.location.href = 'travel_index.html';
	};

	var getDetail = function() {
		var ajax_url = absUrl+'/api/torder/orderdetailsc';
		var ajax_data = JSON.stringify({oid:order_id,type:item_type});
		$.ajax({
			type:'POST',
			contentType:"application/json;charset=UTF-8",
			url:ajax_url,
			data:ajax_data,
			success:onGetOrderGetailSuccess,
			error:function() {
				console.log('ajax error');
			}
		})
	};

	var onGetOrderGetailSuccess = function(res) {
		//console.log(res);
		var data = res.data;
		$('.img_wp img').attr('src',data.titlePic);
		$('.title').html(data.travelName);
		$('#exp_date').html(getLocalTimeByMs(data.activityDate));
		if(item_type==3) {
			$('#cr_count').html(data.anum);
			$('#child_count').html(data.childnum);
		}else if(item_type==2) {
			$('#pel_count').html(data.anum);
		}

		
	};

	var showPeopleInfo = function(type) {
		type==3 && $('.thm_people').addClass('show_out');
		type==2 && $('.aty_people').addClass('show_out');
	};

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