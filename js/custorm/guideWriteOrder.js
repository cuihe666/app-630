Zepto(document).ready(function() {

	var http_url = serveUrl();
	var zcHigoId = zcGetLocationParm('tid');
	var item_type = zcGetLocationParm('item_type');
	var uid =  zcGetAndSetUid();
	var activityDateValueOf = '';//时间戳,传至后台(！！！！！！！！！！！！！！！！！！！！！！！！！！！！！需处理)
	var activityDate = '';//前端显示
	var isCheckedDate = false;//标志是否选择了日期
	var currStock = 0;//库存
	var coupon_url = http_url+'/api/couponnew/available';
	var calendarCurrObj = { //选择日期时的动态信息，点击确定按钮时，添加进userObj
		date :'',
		price:'',
		stock:10,
		childPrice:''
	};
	var userObj = zc_store.get('userInfo','json_obj') || {date :'', parcount:1, childcount:0, price:'', childPrice:'', uname:'', utel:'', allpersons:[/*{id:''name:'',idCard:''}*/], stock:10, coupon:''}; //本地存储用户填写的信息，存储时key值为userInfo（待优化）
	var ajaxRenderPage = zc_store.get('userInfo','json_obj')?false:true; //是否用价格日历的ajax的第一条渲染页面（如果本地有userInfo，则该值为false，不做渲染）
	var cpnType = {'0':'代金券','1':'满减券'};
	var classObj = {'0':'daijin','1':'manjian'};
	var product = {'0':'','1':'民宿','2':'旅行','3':'酒店'};//0表示通用
	var cardType  ={'0':'身份证','1':'护照','2':'军官证','3':'港澳通行证'};
	
	//console.log(zc_store.get('userInfo','json_obj'));
	var initList = function() {
		bindEvt();
		getPriceClendarData();
		// renderParentBtn();     //
		// renderChildBtn();      //接口返回处理后调用
		// renderFooterPrice();   //
		!ajaxRenderPage && renderPageByObj(userObj); //若取出了本地信息则直接渲染
		removeListData();
	};

	var bindEvt = function() {

		$('.goback').on('tap',onGobackTap);
		$('#agree_pic').on('tap',onAgreePicTap);
		$('#agree_word').on('tap',onAgreePicTap);
		$('.experience_day_wp').on('tap',onExperienceDayWpTap);
		$('.pf_btn').on('tap',onPfbtnTap);//日历确认按钮
		$('.c_rn_skwp .zc_min_btn').off('tap').on('tap',onCrMinBtnTap);
		$('.c_rn_skwp .zc_add_btn').off('tap').on('tap',onCrAddBtnTap);
		$('.child_skwp .zc_min_btn').off('tap').on('tap',onEtMinBtnTap);
		$('.child_skwp .zc_add_btn').off('tap').on('tap',onEtAddBtnTap);
		$('#cnt_tel').on('blur',onCnttelBlur);
		$('#contact_person').on('blur',onContactPersonBlur);
		$('#submit_order').on('tap',onSubmitOrderTap);
		$("#coupon").on('tap',onCouponTap);
		$(".use_intru").on('tap',onUseintruTap);
		$(".use_cancel").on('tap',onUsecancelTap);
		$(".child_goback").on('tap',onChildGobackTap);
		$('.use_sure').on('tap',onUseSureTap);
		$('.cld_cancel_btn').on('tap',onCldCancelBtnTap);
		// $('.discount_wp').on('tap','.select_or_not',onSelectTap);
		$('.discount_wp').on('tap','.evy_privilege',onEvyPrivilegeTap);
	};

	var onEvyPrivilegeTap = function() {
		var $this = $(this);
		currCnpId = $this.find('.select_or_not').attr('data-id');
		console.log($this.siblings())
		$this
			.find('.select_or_not')
			.toggleClass('done_selt')
			.end()
			.siblings()
			.find('.select_or_not.done_selt')
			.removeClass('done_selt')
			.find('img')
			.attr('src','../img/list_youhuiquan_nor@3x.png')

		if($this.find('.select_or_not').hasClass('done_selt')) {
			$this.find('img').attr('src','../img/list_youhuiquan_pre@3x.png');
		}else {
			$this.find('img').attr('src','../img/list_youhuiquan_nor@3x.png');
		}
	};

	window.onunload = function() {
		// userObj = {};
		// zc_store.set('userInfo',userObj);
		// var $currCnpId = $('.select_or_not.done_selt');
		// if($currCnpId.size()>0) { //如果用户选择了一个优惠券
		// 	userObj.currCnpPrice = renderFooterPrice('return_price');
		// 	userObj.selectedCnpId = $currCnpId.parents('.evy_privilege').attr('id');
		// 	zc_store.set('userInfo',userObj);
		// }
		
	};

	var onCldCancelBtnTap = function() {
		$('.start_day_wp').removeClass('show_out');
	};

	var onUseSureTap = function() {
		var $selected  = $('.counp_list_wp .select_or_not.done_selt');
		var len = $selected.size();

		if(len>0) {
			useCnpId = currCnpId;
			currCnpPrice = $selected.parents('.evy_privilege').attr('data-price');
			$('.cpn_ed').addClass('show_out').find('#curr_cpn_pri').html(currCnpPrice);
			$('.can_use_count').removeClass('show_out');
		}else {
			useCnpId=-1;
			currCnpPrice = 0;
			$('.cpn_ed').removeClass('show_out').find('#curr_cpn_pri').html(currCnpPrice);
			// $('.can_use_count').addClass('show_out');
			if($('#can_num').html()>0) {
				$('.can_use_count').addClass('show_out');
			}
		}
		//console.log(useCnpId);
		$('#zc_price').html(renderFooterPrice('return_price')-currCnpPrice);
		// $selected.removeClass('done_selt').find('img').attr('src','../img/list_youhuiquan_nor@3x.png');
		$('.discount_wp').removeClass('show_out');
		$('body').removeClass('hide');
		$('.masker').removeClass('show_out');
	};

	var removeListData = function() {
		zc_store.remove('pageDataJson');
		zc_store.remove('currScrollTop');
		zc_store.remove('currTapCityCode');
		zc_store.remove('currTapListJson');
	};

	// var onSelectTap = function() {
	// 	var $this = $(this);
	// 	currCnpId = $this.attr('data-id');
	// 	$this
	// 		.toggleClass('done_selt')
	// 		.parents('.evy_privilege')
	// 		.siblings()
	// 		.find('.select_or_not.done_selt')
	// 		.removeClass('done_selt')
	// 		.find('img')
	// 		.attr('src','../img/list_youhuiquan_nor@3x.png');
	// 	if($this.hasClass('done_selt')) {
	// 		$this.find('img').attr('src','../img/list_youhuiquan_pre@3x.png');
	// 	}else {
	// 		$this.find('img').attr('src','../img/list_youhuiquan_nor@3x.png');
	// 	}
	// };

	var renderCoupon = function(arr) {
		var tmpStr = '';
		var tmpArr = [];
		var localObj = zc_store.get('userInfo');
		$('.cpn_ed').removeClass('show_out');
		$('.can_use_count').addClass('show_out').find('#can_num').html(arr.length);
		$.each(arr,function(i,obj) {
			tmpArr.push(
				'<div id='+obj.id+' class="evy_privilege '+classObj[obj.ruleType]+'" data-price='+obj.amount+'>',
					'<div class="coupon_name">'+cpnType[obj.ruleType]+'</div>',
					'<div class="coupon_name_value"><span class="rmb_sts">￥</span><span class="rmb_cnt">'+obj.amount+'</span></div>',
					'<div class="cpn_name_detail">'+obj.title+'</div>',
					 renderTuleByRule(obj),
					'<div class="time_limit_wp">',
						'<span>有效期：</span>',
						 renderForever(obj),
					'</div>',
					'<div class="select_or_not" data-id='+obj.id+'><img src="../img/list_youhuiquan_nor@3x.png"></div>',
				'</div>'
			);
		});

		$('.counp_list_wp').html(tmpArr.join(''));
		// if(localObj.selectedCnpId && localObj.selectedCnpId!='null') {
		// 	console.log($('#'+localObj.selectedCnpId));
		// 	$('#'+localObj.selectedCnpId).find('.select_or_not').addClass('done_selt');
		// 	$('#zc_price').html(renderFooterPrice('return_price')-$('#'+localObj.selectedCnpId).attr('data-price'));
		// 	$('.cpn_ed').addClass('show_out').find('#curr_cpn_pri').html($('#'+localObj.selectedCnpId).attr('data-price'));
		// 	// obj.selectedCnpId='';
		// }
		
	};

	var onUsecancelTap = function() {
		useCnpId = currCnpId =-1;
		$('.discount_wp').removeClass('show_out');
		$('body').removeClass('hide');
		$('.masker').removeClass('show_out');
		$('.counp_list_wp .select_or_not.done_selt')
				.removeClass('done_selt')
				.find('img')
				.attr('src','../img/list_youhuiquan_nor@3x.png');
	};

	var getCanuseCoupon = function(curr_prc) {
		var ajax_data = {uid:uid,price:curr_prc,biz_type:2,houseId:zcHigoId};
		var ajax_data_str = JSON.stringify(ajax_data);
		$.ajax({
			type:'POST',
			// type:'GET',
			contentType:"application/json;charset=UTF-8",
			url:coupon_url,
			data:ajax_data_str,
			success:function(res) {
				//console.log(res);
				var data= res.data;
				if(res.code==0) {
					if(data.length>0) {
						$('.no_counp').removeClass('show_out'); //在开始没有优惠券的情况下会。。。
						$('.counp_list_wp').css('display','block');
						renderCoupon(data);
					}else { //没有优惠券
						$('.no_counp').addClass('show_out');
						$('.counp_list_wp').html('').css('display','none');
						$('.can_use_count').removeClass('show_out');
						$('.cpn_ed.show_out').removeClass('show_out');
						$('#can_num').html('0')

					}
				}
				 
			},
			error:function() {
				console.log('获取优惠券列表 ajax error');
			}
		})
	};


	var onChildGobackTap = function() {
		$('.yh_use_intru').removeClass('show_out');
	};

	var onUseintruTap = function() {
		// alert(34);
		$('.yh_use_intru').addClass('show_out');
	};

	var onCouponTap = function() {
		// $('.discount_wp').css('display','block');
		// var currPrice = $("#zc_price").html();
		// getCanuseCoupon(currPrice);
		$('.discount_wp').addClass('show_out');
		$('.masker').addClass('show_out');
		$('body').addClass('hide');
	};

	var onSubmitOrderTap = function() {
		var isAgreeTgPact = $('#agree_pic').hasClass('agr_before');//标识是否同意棠果条款
		var uname = $.trim($('#contact_person').val());
		var utel = $('#cnt_tel').val();
		var crCount = Number($('.c_rn_skwp .zc_cr_count').html());
		var etCount = Number($('.child_skwp .zc_cr_count').html());
		var totalCount = crCount+etCount;
		var remind_h;
		var ajax_data = {};
		var zc_ajax_data_str = '';
		var curr_page_url = window.location.href;
		var may_cnp_id = $('.counp_list_wp .select_or_not.done_selt').attr('data-id');
		uid =  zcGetAndSetUid();
		if(!uid) { //uid不存在，调取app的登陆方法以获取登陆
			// console.log(curr_page_url);
			applyAppLogin(curr_page_url);
			return;
		}
		if(isAgreeTgPact) {
			$('#zc_remind_cnt').html('请阅读并同意棠果预订条款').addClass('show_out');//.css('margin-left',(-$('#zc_remind_cnt').width()/2+'px'))
			setTimeout(function(){$('#zc_remind_cnt').html('').removeClass('show_out');},2000);
			return;
		}
		if(!uname) {
			$('#zc_remind_cnt').html('请填写联系人').addClass('show_out');//.css('margin-left',(-$('#zc_remind_cnt').width()/2+'px'))
			setTimeout(function(){$('#zc_remind_cnt').html('').removeClass('show_out');},2000);
			return;
		}
		if(!utel) {
			$('#zc_remind_cnt').html('请填写联系电话').addClass('show_out');//.css('margin-left',(-$('#zc_remind_cnt').width()/2+'px'))
			setTimeout(function(){$('#zc_remind_cnt').html('').removeClass('show_out');},2000);
			return;
		}
		if(userObj.stock<(crCount+etCount)) {
			$('#zc_remind_cnt').html('库存不够').addClass('show_out');//.css('margin-left',(-$('#zc_remind_cnt').width()/2+'px'))
			setTimeout(function(){$('#zc_remind_cnt').html('').removeClass('show_out');},2000);
			return;
		}
		// uid =  zcGetAndSetUid();
		// ajax_data.orderUid = uid;// TODO
		// ajax_data.travelId = zcHigoId;
		// ajax_data.activityDate = activityDateValueOf||userObj.date||$('#detail_day').attr('data-day-date');
		// ajax_data.contacts = uname;
		// ajax_data.mobilePhone = utel;
		// ajax_data.anum = crCount;
		// ajax_data.childnum = etCount;
		// ajax_data.contactlists = [44,45];//暂时给默认值

		ajax_data.orderUid = uid;
		ajax_data.travelId = zcHigoId; //复用线路，暂不修改变量名TODO
		ajax_data.activityDate = activityDateValueOf||userObj.date||$('#detail_day').attr('data-day-date');
		ajax_data.contacts = $('#contact_person').val();
		ajax_data.mobilePhone = $('#cnt_tel').val();
		ajax_data.anum = $('.c_rn_skwp .zc_cr_count').html();
		if(may_cnp_id) {
			ajax_data.couponId = may_cnp_id;//暂时缺省=>已解决170706
		}
		
		zc_ajax_data_str = JSON.stringify(ajax_data);

		creatOrder(zc_ajax_data_str);
	};

	var creatOrder = function(ajax_str) {
		console.log(ajax_str);
		// var ajax_url = http_url+'/api/activity/actorder';
		var ajax_url = http_url+'/api/guide/actorder';
		$.ajax({
			type:'POST',
			contentType:"application/json;charset=UTF-8",
			url:ajax_url,
			data:ajax_str,
			success:function(res) {
				console.log(res);
				var oId ,orderNo;
				if(res.code==80000) {
					$('#zc_remind_cnt').html('库存不够').addClass('show_out');//.css('margin-left',(-$('#zc_remind_cnt').width()/2+'px'))
					return;
				}
				if(res.code==0) {
					oId = res.data.oid;
					orderNo = res.data.orderNo;
					//console.log(orderNo);
					zc_store.remove('userInfo');
					// return;
					window.location.href = 'guideOrder_detail.html?orderId='+oId+'&item_type='+item_type+'';
				}
			},
			error:function() {
				console.log('ajax error');
			}
		});
	}

	var onContactPersonBlur = function() {
		var val = $.trim($(this).val());
		userObj.uname = val;
		zc_store.set('userInfo',userObj);
	
	};

	var onCnttelBlur = function() {

		var val = $(this).val();
		var r =  testPhone(val);
		if(val=='') {
			userObj.utel = val;
			zc_store.set('userInfo',userObj);
		}
		if(!r) {
			$(this).val('');
			return;
		}
		userObj.utel = val;
		zc_store.set('userInfo',userObj);
	};

	var onGobackTap = function() {
		window.location.href = 'local_guide_detail.html?tid='+zcHigoId+'&item_type='+item_type;
		rmPageFrom();
	};

	var onPfbtnTap = function() { //TODO (须在本地更新userInfo)
		if (isCheckedDate) {
			$('.start_day_wp').removeClass('show_out');
			$.extend(userObj,calendarCurrObj); //如果点击了确认，就把选择的日期对应的数据渲染
			renderPageByObj(userObj);
			zc_store.set('userInfo',userObj);			
			// isCheckedDate=false;
		}else {

		}
	};

	var renderFooterPrice = function(return_price) { //底部价格
		var totalPrice = userObj.price ;
		totalPrice && $('#zc_price').html(totalPrice);
		if(totalPrice && return_price){return totalPrice;} 
		getCanuseCoupon(totalPrice);
	};

	var renderParentBtn = function() {
		var crCount = Number($('.c_rn_skwp .zc_cr_count').html());
		if(crCount>1&&crCount<9) {
			$('.c_rn_skwp .zc_min_btn').off('tap').on('tap',onCrMinBtnTap);
			$('.c_rn_skwp .zc_add_btn').off('tap').on('tap',onCrAddBtnTap);
		}else if(crCount<=1) {
			$('.c_rn_skwp .zc_min_btn').addClass('no_use');
			$('.c_rn_skwp .zc_min_btn').off('tap');
		}else if(crCount>=9) {
			$('.c_rn_skwp .zc_add_btn').addClass('no_use');
			$('.c_rn_skwp .zc_add_btn').off('tap');
		}
		// userObj.parcount = crCount;
		// console.log(userObj);
		// zc_store.set('userInfo',userObj);
		// var aa = zc_store.get('userInfo','er');
		// console.log(aa);
	};

	var renderChildBtn = function() {
		var etCount = Number($('.child_skwp .zc_cr_count').html());
		if(etCount>0&&etCount<9) {
			$('.child_skwp .zc_min_btn').off('tap').on('tap',onEtMinBtnTap);
			$('.child_skwp .zc_min_btn').removeClass('no_use');
		} else if(etCount<=0) {
			$('.child_skwp .zc_min_btn').off('tap');
			$('.child_skwp .zc_min_btn').addClass('no_use');
		} else if(etCount>=9) {
			$('.child_skwp .zc_add_btn').addClass('no_use');
			$('.child_skwp .zc_add_btn').off('tap');
		}
	};

	var onCrMinBtnTap = function() {
		var crCount = $('.c_rn_skwp .zc_cr_count').html();
		//console.log(crCount);
		if(crCount>=9) { //改变加号按钮状态（可以==9）
			$('.c_rn_skwp .zc_add_btn').removeClass('no_use');
			$('.c_rn_skwp .zc_add_btn').off('tap').on('tap',onCrAddBtnTap);
		}
		if(crCount>1) {
			$('.c_rn_skwp .zc_cr_count').html(--crCount);
			renderFooterPrice();
			renderParentBtn();
			userObj.parcount = crCount;
			zc_store.set('userInfo',userObj);
		}

	};
	var onCrAddBtnTap = function() {
		var crCount = $('.c_rn_skwp .zc_cr_count').html();
		// console.log(crCount);
		crCount==1 && $('.c_rn_skwp .zc_min_btn').removeClass('no_use');
		if(crCount<9) { //保险起见做一下判断，不做判断也可以
			$('.c_rn_skwp .zc_cr_count').html(++crCount);
			renderFooterPrice();
			renderParentBtn();
			userObj.parcount = crCount;
			zc_store.set('userInfo',userObj);
		}
		
	};
	var onEtMinBtnTap = function() {
		var etCount = $('.child_skwp .zc_cr_count').html();
		//console.log(etCount)
		if(etCount>=9) {
			$('.child_skwp .zc_add_btn').removeClass('no_use');
			$('.child_skwp .zc_add_btn').off('tap').on('tap',onEtAddBtnTap);
		}

		if(etCount>0) {
			$('.child_skwp .zc_cr_count').html(--etCount);
			renderFooterPrice();
			renderChildBtn();
			userObj.childcount = etCount;
			zc_store.set('userInfo',userObj);
		}
		// console.log(etCount)
		

	};
	var onEtAddBtnTap = function() {
		var etCount = $('.child_skwp .zc_cr_count').html();
		if(etCount<9) {
			$('.child_skwp .zc_cr_count').html(++etCount);
			renderFooterPrice();
			renderChildBtn();
			userObj.childcount = etCount;
			zc_store.set('userInfo',userObj);
		}
	};

	var onExperienceDayWpTap = function() {
		$('.start_day_wp').addClass('show_out');
		soveCalendarHeader();
		// solveIosHead();
	};

	var onAgreePicTap = function() {
		// $(this).toggleClass('agr_before');
		$('#agree_pic').toggleClass('agr_before');
	};

	var getPriceClendarData = function() {

		var ajaxUrl = http_url+'/api/guide/pricedate';
		$.ajax({
			url:ajaxUrl,
			data:{guideId:zcHigoId},
			success:function(res) {
				console.log(res);
				var data = res.data;
				var firstObj = data[0];
				if(ajaxRenderPage) { //未从本地取出用户信息
					$.extend(userObj,firstObj);
					renderPageByObj(userObj);
				};
				// console.log(zcRenderResData(res.data));
				make_calendar(data);
			}
		})
	};

	var make_calendar = function(res_data) {//初始化日历
		var date = new Date();
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var para = {
			'c': 'calendarcontainer',
			'y': year,
			'm': month,
			'a': {
				'd1': '2014-01-30', //最早时间
				'd2': '2014-05-05' //最晚时间
			},
			'f': 11, //显示双日历用1，单日历用0//前面不知道这是谁注释的，错误！！
			'clickfu': function(to) { 
				console.log(to);
				if(!$(to).attr('id')) {
					return;
				}else {
					// console.log(calendarCurrObj.stock);
					calendarCurrObj.stock = currStock = $(to).find('.curr_btg_info').attr('data-stock');
					// console.log(calendarCurrObj.stock);
					activityDate = $(to).attr('id');
					calendarCurrObj.date =  activityDateValueOf = $(to).find('.curr_btg_info').attr('data-day');
					isCheckedDate = true;//标识已选择日期
					calendarCurrObj.price = $(to).find('.curr_btg_info').attr('data-price');
					// renderStock(currStock);
					//console.log(activityDate);
					//console.log(activityDateValueOf);

				}

			},
			'showFu': function(d) { 
				// return '';
				// console.log(d.getTime());
				return zcRenderDayPrice(d.getTime(),zcRenderResData(res_data));
				
			}
		}
		CreateCalendar(para); 
	};

	var zcRenderResData = function(data_arr) {
		var zcObj = {};
		$.each(data_arr, function(i, obj) {
			zcObj[obj.date] = obj;
		});
		return zcObj;
	};

	var zcRenderDayPrice = function(day_str,zc_obj) { 
		var tmpObj = {};
		if(zc_obj[day_str]) {
			tmpObj = zc_obj[day_str];
			// return '<p>￥<span>'+tmpObj.price+'</span></p>';
			return '<b class="curr_btg_info" style="display:block" data-stock='+tmpObj.stock+' data-day='+tmpObj.date+' data-price='+tmpObj.price+' >￥<span class="curr_day_price">'+tmpObj.price+'</span></b>'
			// return '<p>￥<span>asdasd</span></p>';
		}else {
			return '';
		}
	};

	var renderStock = function(argu_stock) {
		$('#crn_sk').html(argu_stock);
		if(argu_stock<10) {
			$('.remain_stock').addClass('show_out');
		}else {
			$('.remain_stock').removeClass('show_out');
		}
	};

	var renderForever = function(obj) { 
		var tmpStr ='';
		var tmpArr = [];
		if(obj.isForever==true||obj.isForever=='true') {
			tmpStr = '永久有效';
		} else if(!obj.isForever||obj.isForever=='false'){
			tmpArr.push(
				'<span class="start_time">'+getLocalTimeByMs(obj.startTime,'/')+'</span>',
				'<span class="start_time">-</span>',
				'<span class="start_time">'+getLocalTimeByMs(obj.endTime,'/')+'</span>'
			);
			tmpStr = tmpArr.join('');
		}
		return tmpStr;
	};

	var renderPageByObj = function(obj) {
		console.log(obj);
		var allpersonsArr = obj.allpersons;
		$('#detail_day').html(getLocalTimeByMs(obj.date));
		$('.c_rn_skwp .zc_cr_count').html(obj.parcount);
		$('.child_skwp .zc_cr_count').html(obj.childcount);
		$('#contact_person').val(obj.uname);
		obj.utel && $('#cnt_tel').val(Number(obj.utel));
		$('#c_rn_pri').html(obj.price);
		$('#et_pri').html(obj.childPrice);

		renderStock(obj.stock);
		$.each(allpersonsArr, function(index, obj) { //所有出行人
			 
		});
		obj.coupon && $('#coupon').html(obj.coupon);
		renderParentBtn();     //
		renderChildBtn();      //接口返回处理后调用
		renderFooterPrice();   //

	};

	var renderTuleByRule = function(obj) {  //依据ruleType判断优惠券的类型
		var str = '';
		if(obj.ruleType==1) {
			str = '<div class="least_info">满<span class="manCOunt">'+obj.rule+'</span>元可用</div>';
		};
		if(obj.ruleType==0) { //暂写死全场，应依据platform拼接170620@zc
			if(obj.rule==0) {
				str = '<div class="least_info">全场<span class="itm_type">'+product[obj.type]+'</span>产品可用</div>';
			} else {
				str = '<div class="least_info">全场<span class="itm_type">'+product[obj.type]+'</span>产品满<span>'+obj.rule+'</span>元可用</div>';
			}
		};
		return str;
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

	function testPhone(val) {
		var r = /^1[34578]\d{9}$/.test(val);//表示以1开头，第二位可能是3/4/5/7/8等的任意一个，在加上后面的\d表示数字[0-9]的9位，总共加起来11位结束。
		return r;
	}

	function soveCalendarHeader() {
		var h = $('#calendar_top').height();
		var $next = $('#calendar_top').next();
		$next.css('marginTop',h+'px');
	}
	

	initList();
})
window.onload = function() {
	solveIosHead();
}