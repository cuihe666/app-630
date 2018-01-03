Zepto(document).ready(function() {

	var http_url = serveUrl();
	// var coupon_url = http_url+'/api/couponnew/getmycouponlist';
	var coupon_url = http_url+'/api/couponnew/available';
	var zcHigoId = zcGetLocationParm('tid');
	var item_type = zcGetLocationParm('item_type');
	var uid =  zcGetAndSetUid();
	var activityDateValueOf = '';//时间戳,传至后台(！！！！！！！！！！！！！！！！！！！！！！！！！！！！！需处理)
	var activityDate = '';//前端显示
	var isCheckedDate = false;//标志是否选择了日期
	var currStock = 0;//库存
	var calendarCurrObj = { //选择日期时的动态信息，点击确定按钮时，添加进userObj
		date :'',
		price:'',
		stock:-1,
		childPrice:''
	};
	var userObj = zc_store.get('userInfo','json_obj') || {date :'', parcount:1, childcount:0, price:'', childPrice:'', uname:'', utel:'', all_persons:[/*{id:''name:'',idCard:'',id:''}*/], stock:-1, coupon:''}; //本地存储用户填写的信息，存储时key值为userInfo（待优化）
	var ajaxRenderPage = judgeArr(); //是否用价格日历的ajax的第一条渲染页面（如果本地有userInfo，则该值为false，不做渲染）
	var currCnpId = -1;//优惠券临时ID
	var useCnpId = -1; //调接口使用的优惠券ID
	var currCnpPrice = 0;//优惠券金额
	var cpnType = {'0':'代金券','1':'满减券'};
	var classObj = {'0':'daijin','1':'manjian'};
	var product = {'0':'','1':'民宿','2':'旅行','3':'酒店'};//0表示通用
	var cardType  ={'0':'身份证','1':'护照','2':'军官证','3':'港澳通行证'};
	//console.log(zc_store.get('userInfo','json_obj'));
	//console.log(ajaxRenderPage);
	var initList = function() {
		bindEvt();
		getPriceClendarData();
		// renderParentBtn();     //
		// renderChildBtn();      //接口返回处理后调用
		// renderFooterPrice();   //
		!ajaxRenderPage && renderPageByObj(userObj); //若取出了本地信息则直接渲染
	};

	var bindEvt = function() {

		$('.goback').on('tap',onGobackTap);
		$('.use_sure').on('tap',onUseSureTap);
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
		// $('.discount_wp').on('tap','.select_or_not',onSelectTap);
		$('.added_pl_wrap').on('tap','.min_btn',onMinBtnTap);
		$("#coupon").on('tap',onCouponTap);
		$(".use_intru").on('tap',onUseintruTap);
		$(".use_cancel").on('tap',onUsecancelTap);
		$(".add_person").on('tap',onAddPersonTap);
		$(".child_goback").on('tap',onChildGobackTap);
		$('.cld_cancel_btn').on('tap',onCldCancelBtnTap);
		$('.masker').on('touchmove',cancelDefault);
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

	var cancelDefault = function() {
		return false;
	};

	var onCldCancelBtnTap = function() {
		$('.start_day_wp').removeClass('show_out');
	};

	var onChildGobackTap = function() {
		$('.yh_use_intru').removeClass('show_out');
	};

	var onMinBtnTap = function() { //删除本地对应的数据
		var id = $(this).parents('.evy_person_wp').attr('data-id');
		delArrItem(userObj.all_persons,id);
		$(this).parents('.evy_person_wp').remove();
		zc_store.set('userInfo',userObj);
	};

	var onAddPersonTap = function() {
		var gobackUrl = window.location.href;
		window.location.href = 'personnel_list.html?tid='+zcHigoId+'&item_type='+item_type+'';
	};

	var onUseintruTap = function() {
		// alert(34);
		$('.yh_use_intru').addClass('show_out');
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

	var onUseSureTap = function() {
		var $selected  = $('.counp_list_wp .select_or_not.done_selt');
		var len = $selected.size();

		if(len>0) {
			useCnpId = currCnpId = $selected.attr('data-id');
			currCnpPrice = $selected.parents('.evy_privilege').attr('data-price');
			$('.cpn_ed').addClass('show_out').find('#curr_cpn_pri').html(currCnpPrice);
			$('.can_use_count').removeClass('show_out');

		}else {
			useCnpId=-1;
			currCnpPrice = 0;
			$('.cpn_ed').removeClass('show_out').find('#curr_cpn_pri').html(currCnpPrice);
			if($('#can_num').html()>0) {
				$('.can_use_count').addClass('show_out');
			}
			
		}
		$('#zc_price').html(renderFooterPrice('return_price')-currCnpPrice);
		//console.log(useCnpId);
		// $selected.removeClass('done_selt').find('img').attr('src','../img/list_youhuiquan_nor@3x.png');
		$('.discount_wp').removeClass('show_out');
		$('body').removeClass('hide');
		$('.masker').removeClass('show_out');
	};

	var renderCoupon = function(arr) {
		var tmpStr = '';
		var tmpArr = [];
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

	var onCouponTap = function() {
		// $('.discount_wp').css('display','block');
		// var currPrice = $("#zc_price").html();
		// getCanuseCoupon(currPrice);
		$('.discount_wp').addClass('show_out');
		$('.masker').addClass('show_out');
		$('body').addClass('hide');
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
						$('#can_num').html('0');
					}
				}
				 
			},
			error:function() {
				console.log('获取优惠券列表 ajax error');
			}
		})
	};

	var getNouseCoupon = function() {

	};

	// var onSelectTap = function() {
	// 	var $this = $(this);

	// 	// currCnpId = $this.attr('data-id');
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
		var $contacts = $('.added_pl_wrap').find('.evy_person_wp');
		var firstTotal = Number( $('.c_rn_skwp .zc_cr_count').html() )+Number( $('.child_skwp .zc_cr_count').html() );
		var secondTotal = Number($('.added_pl_wrap .evy_person_wp').size());
		// console.log(firstTotal);
		// console.log(secondTotal);
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
		if(firstTotal!=secondTotal) {
			$('#zc_remind_cnt').html('出行人数不一致').addClass('show_out');
			setTimeout(function(){
				$('#zc_remind_cnt').removeClass('show_out').html('');
			},2000);
			return;
		}
		// uid =  zcGetAndSetUid();
		ajax_data.orderUid = uid;// TODO
		ajax_data.travelId = zcHigoId;
		ajax_data.activityDate = activityDateValueOf||userObj.date||$('#detail_day').attr('data-day-date');
		ajax_data.contacts = uname;
		ajax_data.mobilePhone = utel;
		ajax_data.anum = crCount;
		ajax_data.childnum = etCount;
		// ajax_data.contactlists = [44,45];//暂时给默认值
		ajax_data.contactlists = renderContactArr($contacts);//已解决
		console.log(currCnpId);
		if(currCnpId>0) {
			ajax_data.couponId = currCnpId;//暂时缺省=>已解决（0620）
		}

		
		console.log(ajax_data);
		// return;
		zc_ajax_data_str = JSON.stringify(ajax_data);

		creatOrder(zc_ajax_data_str);
	};

	var renderContactArr = function($objs) {
		var tmpArr = [];
		$.each($objs, function(i, obj) {
			tmpArr.push($(obj).attr('data-id'));
		});
		return tmpArr;
	};

	var creatOrder = function(ajax_str) {
		// console.log(ajax_str);
		var ajax_url = http_url+'/api/higo/actorder';
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
					console.log(orderNo);
					zc_store.remove('userInfo');
					window.location.href = 'order_detail.html?orderId='+oId+'&item_type='+item_type+'';
				}
			},
			error:function() {
				console.log('ajax error');
			}
		})
	}

	var onContactPersonBlur = function() {
		var val = $.trim($(this).val());
		userObj.uname = val;
		// console.log(userObj);
		zc_store.set('userInfo',userObj);
		// console.log(zc_store.get('userInfo','sdf'));
		// alert(214)
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
		window.location.href = 'theme_detail.html?tid='+zcHigoId+'&item_type='+item_type+'';
	};

	var onPfbtnTap = function() { //TODO (须在本地更新userInfo)
		if (isCheckedDate) {
			$('.start_day_wp').removeClass('show_out');
			$.extend(userObj,calendarCurrObj); //如果点击了确认，就把选择的日期对应的数据渲染
			console.log(userObj);
			renderPageByObj(userObj);
			zc_store.set('userInfo',userObj);			
			// isCheckedDate=false;
		}else {

		}
	};

	var renderFooterPrice = function(return_price) { //底部价格
		var crPer = Number($("#c_rn_pri").html());
		var etPer = Number($("#et_pri").html());
		var crCount = Number($('.c_rn_skwp .zc_cr_count').html());
		var etCount = Number($('.child_skwp .zc_cr_count').html());
		var totalPrice = crPer*crCount+etPer*etCount;
		totalPrice && $('#zc_price').html(totalPrice);
		if(totalPrice && return_price){return totalPrice;} 
		getCanuseCoupon(totalPrice);//调取优惠券信息，真特么恶心这这产品

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
		// console.log(crCount);
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
		console.log(etCount)
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
	};

	var onAgreePicTap = function() {
		// $(this).toggleClass('agr_before');
		$('#agree_pic').toggleClass('agr_before');
	};

	var getPriceClendarData = function() {

		var ajaxUrl = http_url+'/api/higo/pricedate';
		$.ajax({
			url:ajaxUrl,
			data:{higoId:zcHigoId},
			success:function(res) {
				console.log(res);
				var data = res.data;
				var firstObj = data[0];
				if(ajaxRenderPage) { //未从本地取出用户信息
					// console.log(111111111111111111111)
					$.extend(userObj,firstObj);
					renderPageByObj(userObj);
					zc_store.set('userInfo',userObj);
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
			'f': 11, //显示双日历用1，单日历用0
			'clickfu': function(to) { 
				// console.log(to);
				if(!$(to).attr('id')) {
					return;
				}else {
					calendarCurrObj.stock = currStock = $(to).find('.curr_btg_info').attr('data-stock');
					activityDate = $(to).attr('id');
					calendarCurrObj.date =  activityDateValueOf = $(to).find('.curr_btg_info').attr('data-day');
					isCheckedDate = true;//标识已选择日期
					calendarCurrObj.childPrice = $(to).find('.curr_btg_info').attr('data-childprice');
					calendarCurrObj.price = $(to).find('.curr_btg_info').attr('data-price');
					// renderStock(currStock);
					console.log(activityDate);
					console.log(activityDateValueOf);

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
			return '<b class="curr_btg_info" style="display:block" data-stock='+tmpObj.stock+' data-price='+tmpObj.price+' data-day='+tmpObj.date+' data-childPrice='+tmpObj.childPrice+' >￥<span class="curr_day_price">'+tmpObj.price+'</span></b>'
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

	var renderLocalUserData = function() {
		

	};

	var delArrItem = function(arr,id) {
		$.each(arr, function(i, obj) {
			if(obj.id == id) {
				arr.splice(i,1);
			}
		});
	};

	var renderPageByObj = function(obj) {
		console.log(obj);
		var allpersonsArr = obj.all_persons;
		$('#detail_day').html(getLocalTimeByMs(obj.date)).attr('data-day-date',obj.date);
		console.log(getLocalTimeByMs(obj.date));
		$('.c_rn_skwp .zc_cr_count').html(obj.parcount);
		$('.child_skwp .zc_cr_count').html(obj.childcount);
		$('#contact_person').val(obj.uname);
		obj.utel && $('#cnt_tel').val(Number(obj.utel));
		$('#c_rn_pri').html(obj.price);
		$('#et_pri').html(obj.childPrice);

		renderStock(obj.stock);
		renderContact(allpersonsArr,$('.added_pl_wrap'));
		obj.coupon && $('#coupon').html(obj.coupon);
		renderParentBtn();     //
		renderChildBtn();      //接口返回处理后调用
		renderFooterPrice();   //

	};

	var renderContact = function(arr,$obj) {
		var tmpArr = [];
		if(arr.length==0){
			return;
		}
		$.each(arr, function(i, obj) {
			var card = obj.idCard;
			tmpArr.push(
				'<div class="evy_person_wp clearfix" data-id='+obj.id+' data-type='+cardType[card[0]]+'>',
					'<div class="min_btn"><img src="../img/list_jian_dis@3x.png" ></div>',
					'<div class="pname_id ml12">',
						'<div class="pname">'+obj.name+'</div>',
						'<div class="s_id">'+card[1]+'</div>',
					'</div>',
				'</div>'
			);
		});
		$obj.html( tmpArr.join('') );
		// return tmpArr.join('');
	};

	window.onunload = function() {
		// var $currCnpId = $('select_or_not.done_selt');
		// if($currCnpId.size()>0) { //如果用户选择了一个优惠券
		// 	userObj.currCnpPrice = renderFooterPrice('return_price');
		// 	userObj.selectedCnpIdObj = $currCnpId;
		// }
		
	};



	function getLocalTimeByMs(timestamp,argu) {     //将时间戳（毫秒）转换成日期@zc170609
		var zc_new_date_obj = new Date( parseInt(timestamp) );
		var zc_year = zc_new_date_obj.getFullYear();
		var zc_month = ( zc_new_date_obj.getMonth() )+1;
		var zc_day = zc_new_date_obj.getDate();
		var resultStr = zc_year +'-'+zcAddZero(zc_month)+'-'+zcAddZero(zc_day);
		if(!timestamp) {return '时间参数传递错误'};
		if(argu) {
			resultStr = zc_year +argu+zcAddZero(zc_month)+argu+zcAddZero(zc_day);
		}
		// console.log(resultStr);
		// console.log(timestamp);
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

	function judgeArr() {
		var asd = false;
		var res = zc_store.get('userInfo','json_obj');
		var i;
		var tmpArr = [];
		if(res) {
			for( i in res) {
				tmpArr.push(i);
			}
			if(tmpArr.length>0) {
				asd = false;
			}else {
				asd = true;
			}
		} else {
			asd = true  		}
		// console.log(tmpArr);
		// console.log(asd);
		return asd;

	};
	

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