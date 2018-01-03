Zepto(document).ready(function() {
	//@张超170526 qq:158425724
	var item_type = 2;// 活动标识
	var http_url = serveUrl();
	var pageNum = 0;	//页数		
	var pageSize = 10; //每页条数
	var orderBy =1; //排序依据
	var labels = [];//存放标签
	var actDate='';//出发日期
	// var cityCode = zcGetLocationParm('city_code');//城市码
	var cityCode = zcGetAndSetcityCode();//城市码
	var uid =  zcGetAndSetUid();
	var list_json = { //列表接口所需的json,需转换
		'actDate':actDate,
		'cityCode':cityCode,
		'labels':labels,
		'orderBy':orderBy,
		'pageNum':pageNum,
		'pageSize':pageSize
	};

	var currCityNameHtml = ''; //右上角城市名

	/*本地存储数据*/
	var currTapCityCode = zc_store.get('currTapCityCode');
	var lastScrollTop = zc_store.get('currScrollTop');
	var pageDataJson = zc_store.get('pageDataJson','json') || [];
	// var local_list_json = zc_store.get('local_list_json','json') || {};
	var currTapListJson = zc_store.get('currTapListJson','json') || {};

	var initList = function() {
		bindEvt();
		make_calendar();//初始化日历
		// getLineList(list_json);//获取列表
		renderPage();
		getThemeTags();//获取主题下的所有标签
		// zc_store.remove('uid');
		// alert(214);
	};
	//console.log('lastScrollTop:'+lastScrollTop);

	var bindEvt = function() {
		$('.nav_bar .cnt_item ').on('tap',onNavbarChildTap);//导航点击
		$('.pf_btn ').on('tap',onClendarBtnTap);//日历确认按钮点击
		$('.head_title').on('tap',onHeadTitleTap);//主题线路点击
		$('.theme_cnt_wp').on('tap','.thm_item',onthm_itemTap);//点击主题列表中的某一项
		$('.sort_cnt_wp ').on('tap','li',onSortLiTap);//点击推荐排序列表中的某一项
		$('.main_unfold').on('tap','li',onMainThmLiTap);//点击主题线路中的某一项
		$('#thm_sure_btn').on('tap',onThmSureBtnTap);//点击确定按钮确认选择的主题
		$('.dropload_list_wp').on('tap','.evy_thm_wp',onEvyThmTap);//点击进入详情页
		$('.city_name_wp').on('tap',goCityListPage);
		$('.masker').on('touchstart',onCancleEvt);
		$('.masker').on('touchend',onCancleEvt);
		$('.masker').on('touchmove',onCancleEvt);
		$('#two_orderby').on('touchmove',onCancleEvt);
		$('#four_item').on('touchmove',onCancleEvt);
		$('.theme_cnt_wp ').on('touchmove',onCancleEvt);
		$('.goback').on('tap',onGobackTap);
		$('.cancel_btn').on('tap',onCancelBtnTap);//日历取消

	};
	var onCancelBtnTap = function() {
		list_json.actDate = '';
		pageNum = list_json.pageNum = 1;
		$('.start_day_wp').removeClass('show_out');
		$('.start_day ').removeClass('active');
		$('.masker').removeClass('active');
		$('#cal .enableDate.hover').removeClass('hover');
		$('.masker').removeClass('show_out');
		// console.log('onCancelBtnTap');
		getLineList(list_json);//获取列表
	};

	var onCancleEvt = function() {
		return false;
	};

	var onGobackTap = function() {
		// window.location.href = 'travel_index.html';
		window.location.href = 'travel_index.html?currCityCode='+cityCode+'';
	};

	var onLoadUpfn = function(zc_me) {
		// console.log(zc_me);
		pageNum = list_json.pageNum = 1;
		zc_me.resetload();
		zc_me.noData(false);
		zc_me.unlock();
		getLineList(list_json,zc_me);
	};
	
	var onLoadDownFn = function(zc_me) {
		// console.log(zc_me);
		// console.log('onLoadDownFn');
		pageNum = ++list_json.pageNum;
		getLineList(list_json,zc_me);

	};
	var zcThmLimeDropload = $('.thm_list_wp').dropload({
		scrollArea : window,
		autoLoad:false,
		domUp : {
	            domClass   : 'dropload-up',
				domRefresh : '<div class="dropload-refresh"><img src="../img/up_loading.gif" alt=""><!--在这里发现旅行的意义--></div>',
				domUpdate  : '<div class="dropload-update"><img src="../img/up_loading.gif" alt=""><!--在这里发现旅行的意义--></div>',
				domLoad    : '<div class="dropload-load"><img src="../img/up_loading.gif" alt=""><!--<span   class="loading"></span>正在加载--></div>'
	    },
	    domDown: {
	    	domClass   : 'dropload-down',
	        domRefresh : '<div class="dropload-refresh" id="upLoadMayHide">↑上拉加载更多</div>',
	        domLoad    : '<div class="dropload-load"><span class="loading"></span>正在加载</div>',
	        domNoData  : '<div class="dropload-noData">暂无更多数据</div>'
	    },
	    loadUpFn:onLoadUpfn,
	    loadDownFn:onLoadDownFn
	});

	var getLineList = function(json_data,zc_dropload) { //TODO
		var ajax_url = http_url+'/api/activity/getlisthtml';
		var ajax_data_str =  '';
		if(json_data.pageNum==0) { // 未使用dropload加载时
			pageNum = json_data.pageNum=1;
		}
		// console.log(json_data);
		// zc_store.set('local_list_json',json_data);
		ajax_data_str = JSON.stringify(json_data);
		$.ajax({
			url:ajax_url,
			data:ajax_data_str,
			type:'POST',
			contentType:"application/json;charset=UTF-8",
			success:function(res){
				zcRenderDroploadMethod(res,zc_dropload);
			},
			error:function(xhr) {
				console.log('ajax error');
			}
		});
	};

	var zcRenderDroploadMethod = function(ajax_res,zc_dropload) {
		//console.log(ajax_res);
		// console.log(pageNum);
		var data = [];
		var list_arr = [];
		var len;
		var targetHeight = $('.nav_bar').height()+$('.nav_bar').position().top+'px';
		$('#city_name').html(ajax_res.data);
		currCityNameHtml = ajax_res.data;
		zc_store.set('currCityNameHtml',currCityNameHtml);
		if(ajax_res.code=='0') {
			data = ajax_res.pageInfo.list;
			len = data.length;
			if(data.length==0) {  //TODO
				//console.log('data.length==0');
				// alert('请求成功但是没有数据');
				zcThmLimeDropload.noData();
				zcThmLimeDropload.lock('down');
				zcThmLimeDropload.resetload();
				if(pageNum<=1) {
					zcThmLimeDropload.lock('up');
					$('body').addClass('hide');
					$('#thm_list_wp').addClass('hide_in');
					$('.no_data').addClass('show_out').css('marginTop',targetHeight);
				}
				return;
			} else {
				$('body').removeClass('hide');
				$('#thm_list_wp').removeClass('hide_in');
				$('.no_data').removeClass('show_out');
				zcThmLimeDropload.noData(false);
				zcThmLimeDropload.unlock();
				zcThmLimeDropload.unlock('up');
				zcThmLimeDropload.resetload();
			}
			list_arr = renderPageByLocal(data,'return_data');
			
			if(pageNum==0||pageNum==1) {
				$('.dropload_list_wp').html('');  //同下
				zcThmLimeDropload.resetload();
				$('.dropload_list_wp').html(list_arr.join(''));//填充列表数据
				zcThmLimeDropload.resetload();
				// zcThmLimeDropload._scrollContentHeight=$(document).height();
				pageDataJson=[];
				pageDataJson = pageDataJson.concat(data);
			}else {
				$('.dropload_list_wp').append(list_arr.join(''));//填充列表数据
				zcThmLimeDropload.resetload();
				$('.dropload-refresh').removeAttr('id');
				pageDataJson = pageDataJson.concat(data);
			}
			zc_store.set('pageDataJson',pageDataJson);
			if(len<pageSize) {
				zcThmLimeDropload.noData();
				zcThmLimeDropload.lock('down');
				zcThmLimeDropload.resetload();
				return;
			}
			
		} else {
			console.log('what ??');
			
			zcThmLimeDropload.resetload();
			

		}
	};

	var renderPage = function() { //如果从本地取出了数据，就用本地数据渲染页面并定位到离开时的位置

		if((lastScrollTop||lastScrollTop==0) && pageDataJson.length>0) {
			// console.log(pageDataJson.length);
			if(currTapCityCode==cityCode) { //如果城市码没变则直接就用本地数据渲染
				// console.log('question');
				$('#city_name').html( zc_store.get('currCityNameHtml') );

				list_json = currTapListJson;  
				// console.log(list_json);
				pageNum = list_json.pageNum;
				orderBy = list_json.orderBy;
				labels = list_json.labels;
				actDate = list_json.actDate;
				// console.log(pageDataJson);
				renderPageByLocal(pageDataJson);
				// reverseSelect(currTapListJson);
			}else {
				//console.log(currTapListJson);
				currTapListJson.cityCode = cityCode;
				currTapListJson.pageNum = pageNum = 0;
				currTapListJson.pageSize = currTapListJson.pageSize||pageSize;
				list_json = currTapListJson;
				console.log(list_json);
				getLineList(list_json);
			}
			
		}else {
			// console.log('renderPage else');
			getLineList(list_json);
		}
	};

	var renderPageByLocal = function(arr,return_data) {
		var list_arr = [];
		
		$.each(arr,function(index, obj) {
			var tags_arr = obj.tag;
			list_arr.push(
					'<div class="evy_thm_wp" data-id='+obj.actId+'>',
						'<div class="pic_wp"><img src='+obj.titlePic+'></div>',
						'<div class="itm_scan_wp">',
							'<div class="itm_title">'+obj.name+'</div>',
							'<div class="itm_thms clearfix">'
							// '<span class="evy_thm">文华探索</span><span class="evy_thm">自驾摄影</span>',
							// '</div>',
							// '<div class="start_place">北京出发</div>',
						// '</div>',
						// '<div class="itm_price">￥988<span class="price_word">起</span></div>',
					// '</div>'
			);
			$.each(tags_arr,function(ix,it) {
				list_arr.push('<span class="evy_thm">'+it+'</span>');
			});	
			list_arr.push(
							'</div>',
							// '<div class="start_place">'+obj.startCity+'<span>出发</span></div>',
						'</div>',
						'<div class="itm_price"><span>￥</span><span class="ml_pric">'+obj.price+'</span><span class="price_word">起</span></div>',
					'</div>'
			);	

		});
		if(return_data) {
			return list_arr;
		}
		// console.log($('.dropload_list_wp').height())
		// console.log(zcThmLimeDropload);
		// zcThmLimeDropload.resetload();
		zcThmLimeDropload.lock('down');
		$('.dropload_list_wp').html(list_arr.join(''));//填充列表数据
		$('.dropload-refresh').removeAttr('id');
		// setTimeout(function() {
			// zcThmLimeDropload.unlock('up');
			// zcThmLimeDropload.unlock('down');
			// zcThmLimeDropload.noData(false);
			// zcThmLimeDropload.resetload();
			// console.log(zcThmLimeDropload)
		// },100);
		
		setTimeout(function() {
			$(window).scrollTop(zc_store.get('currScrollTop'));
			zcThmLimeDropload.unlock('down');
			zcThmLimeDropload.resetload();
		},5);
		
	};

	var reverseSelect = function(obj) {
		var zcDate = obj.actDate;
		var zcDateStr = '';
		var tmpArr = obj.labels;
		if(zcDate) {
			zcDateStr = getDateByMs(zcDate);
			$('#'+zcDate+'').addClass('hover');
		}
		$.each(tmpArr, function(index, val) {
			$('#zc'+val+'').addClass('on').siblings('#all_item').removeClass('on');
			console.log($('#zc'+val+''))
		});
		$('.sort_cnt_wp li').eq(obj.orderBy-1).addClass('on').siblings('.on').removeClass('on');

	};

	var goCityListPage = function() {
		var currTapCityCode = cityCode;
		var goBackUrl = window.location.href.split('?')[0];
		var currScrollTop  = $(window).scrollTop();
		zc_store.set('currScrollTop',currScrollTop);
		zc_store.set('currTapCityCode',currTapCityCode);
		zc_store.set('currTapListJson',list_json);
		window.location.href = 'city_list.html?goBackUrl='+goBackUrl+'';
	};

	var onEvyThmTap = function() { //TODO跳转至详情页
		var tid = $(this).attr('data-id');
		var currScrollTop  = $(window).scrollTop();
		var currTapCityCode = cityCode;
		zc_store.set('currScrollTop',currScrollTop);
		zc_store.set('currTapCityCode',currTapCityCode);
		zc_store.set('currTapListJson',list_json);
		window.location.href = 'local_activity_detail.html?tid='+tid+'&item_type='+item_type+'';
	};

	var onThmSureBtnTap = function() {
		var $li_on = $('.theme_cnt_wp').find('li.on');
		labels.length=0;//先清空原有的内容再赋值
		pageNum = list_json.pageNum = 0; // 加载第一页的内容
		$.each($li_on,function(index, el) {
			var tag_tid = $(el).attr('tid');
			tag_tid && labels.push(tag_tid);
			
		});
		getLineList(list_json);//获取列表
		$('.nav_bar_theme').removeClass('active');
		$('.theme_cnt_wp').removeClass('show_out');
		$('.masker').removeClass('show_out');
		//console.log(labels);
	};

	var onMainThmLiTap = function() {
		$(this).addClass('on').siblings('.on').removeClass('on');
		if(this.id!='tg_activity') {
			removeListData();
		}
	};

	var onHeadTitleTap = function() {//主题线路点击
		$('.main_unfold').toggleClass('show_out');

		if($('.main_unfold').hasClass('show_out')) {
			$('.masker').addClass('show_out');
		}else {
			$('.masker').removeClass('show_out');
		}
		
		$('.nav_bar .cnt_item.active').removeClass('active');
		$('.nav_ul_wp .nav_child.show_out').removeClass('show_out');
	};

	var onSortLiTap = function() {
		list_json.orderBy = $(this).attr('data-sort'); //点击时即给排序参数赋值
		pageNum = list_json.pageNum = 0;
		$(this).addClass('on').siblings('.on').removeClass('on');
		$('.recm_sort').removeClass('active');
		$('.masker').removeClass('show_out');
		$('.nav_child').removeClass('show_out');
		getLineList(list_json);		
	};

	var onthm_itemTap = function() {  //线路标签点击
		var $this = $(this);
		var $index = $this.index();
		var thm_item_len = $this.parents('.theme_cnt_wp').find('li.thm_item').size();
		var thm_item_on_len=-1;
		var $thm_item_first;
		$this.toggleClass('on');
		$thm_item_first = $this.parents('.theme_cnt_wp').find('li.thm_item').eq(0); //第一个标签，即‘全部主题’标签
		if($thm_item_first.hasClass('on') && $index==0 ) { //如果点击的是‘全部主题’标签并且是选中状态，则去掉其它所有标签选中状态
			$thm_item_first.siblings().removeClass('on');
			return;
		} else if($thm_item_first.hasClass('on') && $index>0) { //如果点击的不是‘全部主题’标签并且‘全部主题’标签当前是选中状态，则去掉选中状态
			$thm_item_first.removeClass('on');
		}
		thm_item_on_len = $this.parents('.theme_cnt_wp').find('li.thm_item.on').size();
		if(thm_item_on_len==thm_item_len-1) { //‘全部主题’之外的所有标签均被选中
			$thm_item_first.addClass('on').siblings('.on').removeClass('on');
		}else if(thm_item_on_len<thm_item_len-1 && thm_item_on_len>0) {  //‘全部主题’之外的标签没有全部选中(至少有一个是选中状态)
			$thm_item_first.removeClass('on');
		}else if(thm_item_on_len==0) { //‘全部主题’之外的所有标签均未被选中
			$thm_item_first.addClass('on');
		}
		// console.log(thm_item_on_len);
	};

	var onNavbarChildTap = function() {//导航点击
		var $this = $(this);
		var index = $this.index();
		var $ctn = $('.nav_ul_wp .nav_child');
		$this.toggleClass('active').siblings('.active').removeClass('active');
		if(index!=0) {
			if($this.hasClass('active')) {
				$('.masker').addClass('show_out');
			}else {
				$('.masker').removeClass('show_out');
			}
			
		}
		$ctn.eq(index).toggleClass('show_out').siblings('.show_out').removeClass('show_out');
		if(index==0) {
			soveCalendarHeader();
		}
	};

	var make_calendar = function() {//初始化日历
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
				//console.log(to)
			},
			'showFu': function(d) { 
				if(d.getFullYear() == "2016" && d.getMonth() == "10" && d.getDate() == "15") {
					return "";
				} else {
					return "";
				};
			}
		}
		CreateCalendar(para); 
	};

	var onClendarBtnTap = function() {//日历确认按钮点击
		var val;
		if(!$(".enableDate").hasClass("hover")){
			layer.open({
			    content: '请选择日期'
			    ,skin: 'msg'
			    ,time: 2 //2秒后自动关闭
			  });
			return false;
		}else{
			val = $('.hover').attr("id");
			// console.log('选择的日期是'+val);
			list_json.actDate = val;
			getLineList(list_json);//获取列表
			$('.start_day_wp').removeClass('show_out');
			$('.start_day').removeClass('active');
			
		}
	};

	var getThemeTags = function() {
		var url = http_url+'/api/activity/tags';
		$.ajax({
			url:url,
			type:"GET",
			// dataType:'jsonp',
			success:function(res) {
				var data;
				var li_str='';
				// console.log(res);
				if(res.code=='0') {
					data = res.data;
					$.each(data,function(index, obj) {
						li_str+= '<li id=zc'+obj.tid+' class="thm_item" tid="'+obj.tid+'">'+obj.title+'</li>'
					});
					$(li_str).appendTo('.theme_cnt_wp');
					if((lastScrollTop||lastScrollTop==0) && pageDataJson.length>0 &&currTapCityCode==cityCode) {
						reverseSelect(currTapListJson);
					}
				}else {
					console.log('error');
				}
			},
			error:function(xhr) {
				console.log('ajax error');
			}
		})
	};

	var removeListData = function() {
		zc_store.remove('pageDataJson');
		zc_store.remove('currScrollTop');
		zc_store.remove('currTapCityCode');
		zc_store.remove('currTapListJson');
	};

	function soveCalendarHeader() {
		var h = $('#calendar_top').height();
		var $next = $('#calendar_top').next();
		$next.css('marginTop',h+'px');
	}

	function getDateByMs(timestamp,argu) {     //将时间戳（毫秒）转换成日期@zc170609
		var zc_new_date_obj = new Date( parseInt(timestamp) );
		var zc_year = zc_new_date_obj.getFullYear();
		var zc_month = ( zc_new_date_obj.getMonth() )+1;
		var zc_day = zc_new_date_obj.getDate();
		var resultStr = zc_year +'-'+zc_month+'-'+zc_day;
		if(argu) {
			resultStr = zc_year +argu+zc_month+argu+zc_day;
		}
		return resultStr;
	}


	initList();
})


window.onload = function() {
	solveIosHead();
	setTargetTop('ul.nav_child','.nav_bar');
	setTargetTop('.main_unfold','.header');
	renderAhref($('.main_unfold'),zcGetLocationParm('city_code'));
}