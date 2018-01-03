Zepto(document).ready(function() {
	var http_url = serveUrl();
	var pageNum = 1;	//页数
	var pageSize = 10; //每页条数
	var orderBy ='1'; //排序依据
	var type =''; //出游形式 
	// var cityCode = zcGetLocationParm('city_code');//城市码
	var cityCode = zcGetAndSetcityCode();//城市码
	var list_json = { //列表接口所需的json,需转换
		'cityCode':cityCode,
		'orderBy':orderBy,
		'pageNum':pageNum,  // 每页显示6个
		'pageSize':pageSize,
		'type':type
	};
	// var uid = zcGetAndSetUid();
	var currCityNameHtml = ''; //右上角城市名
	var currTapCityCode = zc_store.get('currTapCityCode');
	var lastScrollTop = zc_store.get('currScrollTop');
	var pageDataJson = zc_store.get('pageDataJson','json') || [];
	var currTapListJson = zc_store.get('currTapListJson','json') || {};
	var initList = function() { //初始化列表
		bindEvt(); // 绑定事件
		// getLineList(list_json);//获取列表
		renderPage();
		getImpTags();//获取印象下类型的所有标签
		// $('#city_name').html(getCityName()); // 获取城市
		checkIos();
		//new Date().getDate()
		renderAhref($('.main_unfold'),zcGetLocationParm('city_code'));//@zc170623-1743
	};
	var checkIos = function () {
		var u = navigator.userAgent;
		var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
		if(isIOS){
			$(".list_wp").css("padding-top","5.4rem")
			$(".h_top").css("padding-top","20px");
			$(".nav_bar_css").css("top","0");
			$(".main_unfold ").css("top","3.2rem");
		}
	}
	var bindEvt = function() {
		$('.head_title').on('tap',onHeadTitleTap);//标题点击
		$('.nav_bar .cnt_item ').on('click',onNavbarChildTap);//类型，排序点击
		$('.nav_type_ul').on('click','li',onMainThmLiTap);//点击类型中的某一项
		$('.sort_cnt_wp ').on('click','li',onSortLiTap);//点击排序列表中的某一项
		$('.dropload_list_wp').on('click','.evy_impression_wp',onEvyThmTap);//点击进入详情页
		$('.city_name_wp').on('tap',goCityListPage); // 点击切换城市
		$('.goback').on('tap',goBackIndex); // 回到旅行首页
		$('.main_unfold').on('tap','li',onMainTap);
		$(".masker").on("touchstart",onCancelEvt);
		$(".masker").on("touchend",onCancelEvt);
		$(".masker").on("touchmove",onCancelEvt);

	};
	var onMainTap = function() {
		$(this).addClass('on').siblings('.on').removeClass('on');
		if(this.id!='tg_impression') {
			removeListData();
		}
	};
	var onCancelEvt = function(){
		return false;
	}
	var goBackIndex = function () {
		// window.location.href = "travel_index.html";
		window.location.href = 'travel_index.html?currCityCode='+cityCode+'';
	}
	// 上拉加载
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
		pageNum = ++list_json.pageNum;
		getLineList(list_json,zc_me);

	};
	var zcThmLimeDropload = $('.imp_list_wp ').dropload({
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
	var goCityListPage = function() { // 城市列表
		var goBackUrl = window.location.href.split('?')[0];
		window.location.href = 'city_list.html?goBackUrl='+goBackUrl+'';
	};
	

	var onEvyThmTap = function() { //跳转至详情页
		var tid = $(this).attr('data-id');
		var currScrollTop  = $(window).scrollTop();
		var currTapCityCode = cityCode;
		zc_store.set('currScrollTop',currScrollTop);
		zc_store.set('currTapCityCode',currTapCityCode);
		zc_store.set('currTapListJson',list_json);
		window.location.href = 'impression_detail.html?tid='+tid+'&item_type=7';
		
		//console.log(tid);
	};

	var onMainThmLiTap = function() { // 选择类型
		$("body").css("overflow","auto");
		$("body").removeClass("hide");
		$(this).addClass('active').siblings('.active').removeClass('active');
		// 浮层消失
		$(this).parents(".nav_child").removeClass("show_out");
		$(".masker").removeClass("show_out");
		$(".nav_bar_type_zjl").removeClass("active");
		list_json.pageNum = 0; // 加载第一页的内容
		
		// 遍历列表数据
		var iid = $(this).attr("iid");
		list_json.type = iid;
		$(".dropload_list_wp").html("");
		getLineList(list_json);
		
	};

	var onHeadTitleTap = function() {//标题点击
		$('.main_unfold').toggleClass('show_out');
		if($('.main_unfold').hasClass('show_out')) {
			$('.masker').addClass('show_out'); // 遮罩层
		}else {
			$('.masker').removeClass('show_out');
		}
		
		$('.nav_bar .cnt_item.active').removeClass('active');
		$('.nav_ul_wp .nav_child.show_out').removeClass('show_out');
	};

	var onSortLiTap = function() { // 点击排序
		orderBy = $(this).attr('data-sort'); //点击时即给排序参数赋值
		$("body").css("overflow","auto");
		$("body").removeClass("hide");
		$(this).addClass('on').siblings('.on').removeClass('on');
		$('.recm_sort').removeClass('active');
		$('.masker').removeClass('show_out');
		$('.nav_child').removeClass('show_out');
		list_json.orderBy = orderBy;
		list_json.pageNum = 0;
		$(".dropload_list_wp").html("");
		getLineList(list_json);
		
	};

	var onNavbarChildTap = function() {//类型，排序点击效果
		var $this = $(this);
		var index = $this.index();
		var $ctn = $('.nav_ul_wp .nav_child');
		$this.toggleClass('active').siblings('.active').removeClass('active');
		$("body").addClass("hide");
		// console.log(index)
		if($this.hasClass('active')) {
			$('.masker').addClass('show_out');
		}else {
			$('.masker').removeClass('show_out');
		}
		$ctn.eq(index).toggleClass('show_out').siblings('.show_out').removeClass('show_out');
	};

	var getLineList = function(json_data,zc_dropload) { // 印象列表数据
		var ajax_url = http_url+'/api/travelimpress/getList';
		//console.log(json_data);
		var ajax_data_str =  '';

		if(json_data.pageNum==0) { // 未使用dropload加载时
			pageNum = json_data.pageNum=1;
		}
		ajax_data_str = JSON.stringify(json_data);
		// console.log(ajax_data_str)
		$.ajax({
			url:ajax_url,
			data:ajax_data_str,
			type:'POST',
			contentType:"application/json;charset=UTF-8",
			success:function(res){
				onGetLineListSuccess(res,zc_dropload);
			},
			error:function(xhr) {
				console.log('ajax error');
			}

		});

		
	};
	function onGetLineListSuccess(res,zc_dropload) { //遍历印象列表
		console.log(res);
		//console.log(pageNum);
		var data = [];
		var list_arr = [];
		var targetHeight = $('.h_top').height();

		$('#city_name').html(res.data);
		zc_store.set('currCityNameHtml',res.data);
		if(res.code=='0') {
			data = res.pageInfo.list;
			//console.log(data)
			if(data.length==0) {  //TODO
				zcThmLimeDropload.noData();
				zcThmLimeDropload.lock('down');
				zcThmLimeDropload.resetload();
				if(pageNum<=1){
					$('.imp_list_wp ').hide();
					$('.no_data').show().css('margin-top',targetHeight);
					$('body').css("background","#f4f6f8");
				}
				return;
			}else {
				$('body').css("background","#fff");
				$('.imp_list_wp').show();
				$('.no_data').hide();
				zcThmLimeDropload.noData(false);
				zcThmLimeDropload.unlock();
				zcThmLimeDropload.unlock('down');
				zcThmLimeDropload.resetload();

			}
			list_arr = renderPageByLocal(data,'return_data');
			
			if(pageNum==0||pageNum==1) {
				$('.dropload_list_wp').html(list_arr.join(''));//填充列表数据
				zcThmLimeDropload.resetload();
				zcThmLimeDropload._scrollContentHeight=$(document).height();
				pageDataJson=[];
				pageDataJson = pageDataJson.concat(data);
			}else {
				$('.dropload_list_wp').append(list_arr.join(''));//填充列表数据
				zcThmLimeDropload.resetload();
				$('.dropload-refresh').removeAttr('id');
				pageDataJson = pageDataJson.concat(data);
			}
			zc_store.set('pageDataJson',pageDataJson);
			if(data.length<pageSize) {
				zcThmLimeDropload.noData();
				zcThmLimeDropload.lock('down');
				zcThmLimeDropload.resetload();
				return;
			}
		} else {
			console.log('what ??');
			zcThmLimeDropload.resetload();
			
		}
	}

	var renderPage = function() { //如果从本地取出了数据，就用本地数据渲染页面并定位到离开时的位置

		if((lastScrollTop||lastScrollTop==0) && pageDataJson.length>0) {
			// console.log(pageDataJson.length);
			if(currTapCityCode==cityCode) { //如果城市码没变则直接就用本地数据渲染
				console.log('question');
				$('#city_name').html( zc_store.get('currCityNameHtml') );  
				console.log(zc_store.get('currCityNameHtml'))
				list_json = currTapListJson;  
				console.log(list_json);
				pageNum = list_json.pageNum;
				orderBy = list_json.orderBy;
				type = list_json.type;
				console.log(pageDataJson);
				renderPageByLocal(pageDataJson);
				console.log(currTapListJson);
				console.log('currTapListJson');
			}else {
				//console.log(currTapListJson);
				currTapListJson.cityCode = cityCode;
				currTapListJson.pageNum = pageNum = 0;
				currTapListJson.pageSize = currTapListJson.pageSize||pageSize;
				currTapListJson.type = '';
				currTapListJson.orderBy = orderBy = '1';
				list_json = currTapListJson;
				console.log(list_json);
				getLineList(list_json);
			}
			
		}else {
			console.log(lastScrollTop);
			console.log(pageDataJson);
			console.log('renderPage else');
			getLineList(list_json);
		}
	};

	var renderPageByLocal = function(arr,return_data) {
		var tmpArr = [];
		$.each(arr,function(index, obj) {
			var tags_arr = obj.tag;
			tmpArr.push(
				'<div class="evy_impression_wp" data-id='+obj.impId+'>',
					'<div class="pic_wp"><img src='+obj.pic+'></div>',
					'<div class="itm_scan_wp">',
						'<h2>'+obj.name+'</h2>',
						'<p>'+obj.des+'</p>',
					'</div>',
					'<div class="see_box">',
						'<span class="see">'+obj.readCount+'</span><span class="zan">'+obj.goodCount+'</span>',
					'</div>',
				'</div>'
			);
		});
		if(return_data) {
			return tmpArr;
		}
		zcThmLimeDropload.lock('down');
		zcThmLimeDropload.lock('up');
		$('.dropload_list_wp').html(tmpArr.join(''));//填充列表数据
		setTimeout(function() {
			$(window).scrollTop(zc_store.get('currScrollTop'));
			zcThmLimeDropload.unlock('down');
			zcThmLimeDropload.unlock('up');
			zcThmLimeDropload.resetload();
		},100);
	};


	var getImpTags = function() {   // 印象类型
		var url = http_url+'/api/impresstag/get';
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
						li_str+= '<li class="imp_item" iid="'+obj.tid+'">'+obj.title+'</li>'
					});
					$(li_str).appendTo('.nav_type_ul');
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

	var reverseSelect = function(obj) {
		if(obj.orderBy>0) {
			$('.sort_cnt_wp li').eq(obj.orderBy-1).addClass('on').siblings().removeClass('on');
		}
		if(obj.type>0) {
			$('.nav_type_ul li').eq(obj.type-1).addClass('active').siblings().removeClass('active');
		}
	};
	var removeListData = function() {
		zc_store.remove('pageDataJson');
		zc_store.remove('currScrollTop');
		zc_store.remove('currTapCityCode');
		zc_store.remove('currTapListJson');
	};

	initList();
})

