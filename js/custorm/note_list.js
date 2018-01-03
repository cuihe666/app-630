Zepto(document).ready(function() {
	var http_url = serveUrl();
	var pageNum = 1;	//页数		
	// var pageSize =10; //每页条数
	var pageSize = 4; //每页条数TODO需改成10
	var orderBy ='1'; //排序依据
	// var cityCode = zcGetLocationParm('city_code');//城市码
	var cityCode = zcGetAndSetcityCode();//城市码
	var peopletypes =[]; // 人物
	var playDates =[]; // 出行天数
	var startmonths=[]; // 开始月份
	var types =[]; //出游形式
	var list_json = { //列表接口所需的json,需转换
		'cityCode':cityCode,
		'orderBy':orderBy,
		'pageNum':pageNum,
		'pageSize':pageSize,
		'peopletypes':peopletypes,
		'playDates':playDates,
		'startmonths':startmonths,
		'types':types
	};
	/*本地存储数据*/
	var currCityNameHtml = ''; //右上角城市名
	var currTapCityCode = zc_store.get('currTapCityCode');
	var lastScrollTop = zc_store.get('currScrollTop');
	var pageDataJson = zc_store.get('pageDataJson','json') || [];
	var currTapListJson = zc_store.get('currTapListJson','json') || {};

	var initList = function() {
		bindEvt(); // 绑定事件
		// getLineList(list_json);//获取列表
		renderPage();
		checkIos(); // 检查ios top 20px
		renderAhref($('.main_unfold'),zcGetLocationParm('city_code'));//@zc170623-1743
	};
	var checkIos = function () {
		var u = navigator.userAgent;
		var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
		if(isIOS){
			$(".list_wp").css("padding-top","5.4rem");
			$(".h_top").css("padding-top","20px");
			$(".nav_bar_css").css("top","0");
			$(".main_unfold ").css("top","3.2rem");
			//$(".note_type").css("top","5.27rem");
		}
	}

	var bindEvt = function() {
		$('.head_title').on('tap',onHeadTitleTap);//标题点击
		$('.goback').on('tap',goBackIndex); // 回到旅行首页
		$('.nav_bar .cnt_item ').on('click',onNavbarChildTap);//类型，排序点击
		$('.sort_cnt_wp ').on('click','li',onSortLiTap);//点击排序列表中的某一项
		$('.note_type').on('click','li',onMainThmLiTap);//点击筛选中的某一项
		$('.select_btn .sure').on('click',onNoteSureBtnTap);//点击确定按钮确认筛选
		$('.select_btn .cancel').on('click',onNoteCancelBtnTap);//点击取消按钮确认筛选
		$('.select_btn .reset').on('click',onNoteResetBtnTap);//点击重置按钮确认筛选
		$('.dropload_list_wp').on('click','.evy_note_wp',onEvyThmTap);//点击进入详情页
		$('.city_name_wp').on('tap',goCityListPage); // 点击切换城市
		$(".masker").on("touchstart",onCancelEvt);
		$(".masker").on("touchend",onCancelEvt);
		$(".masker").on("touchmove",onCancelEvt);
		$('.main_unfold').on('tap','li',onMainUnfoldLiTap);
		// $('.nav_type_ul').on('tap','li',onNavTypeUlTap);

	};
	var onMainUnfoldLiTap = function() {
		$(this).addClass('on').siblings('.on').removeClass('on');
		if(this.id!='tg_note') {
			removeListData();
		}
	}
	var goBackIndex = function () {
		// window.location.href = "travel_index.html";
		window.location.href = 'travel_index.html?currCityCode='+cityCode+'';
	}
	var onCancelEvt = function(){
		return false;
	}
	var onLoadUpfn = function(zc_me) {
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

	var zcThmLimeDropload = $('.note_list_wp').dropload({
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
	
	var onEvyThmTap = function() { //TODO跳转至详情页
		var tid = $(this).attr('data-id');
		var currScrollTop  = $(window).scrollTop();
		var currTapCityCode = cityCode;
		zc_store.set('currScrollTop',currScrollTop);
		zc_store.set('currTapCityCode',currTapCityCode);
		zc_store.set('currTapListJson',list_json);
		// console.log(list_json);
		// debugger;
		window.location.href = 'note_detail.html?tid='+tid+'&item_type=8';
	};

	var onMainThmLiTap = function() { //  点击筛选中的内容
		$(this).toggleClass('active');	
	};

	var onNoteSureBtnTap = function(){ // 列表筛选确定按钮
		// $("body").css("overflow","auto");
		$("body").removeClass("hide");

		var $startmonths= $(".nav_date_ul").find("li.active"); // 开始月份
		var $types = $(".nav_type_ul").find("li.active"); //出游形式
		var $peopletypes = $(".nav_people_ul").find("li.active"); // 人物
		var $playDates = $(".nav_day_ul").find("li.active"); // 出行天数
		startmonths.length =0;
		types.length =0;
		peopletypes.length =0;
		playDates.length =0;
		pageNum = list_json.pageNum = 0; // 加载第一页的内容
		
		$.each($startmonths,function(index, el) {
			startmonths.push($(el).attr('dateid'));
		});
		$.each($types,function(index, el) {
			types.push($(el).attr('typeid'));
		});
		$.each($peopletypes,function(index, el) {
			peopletypes.push($(el).attr('peopleid'));
		});
		$.each($playDates,function(index, el) {
			playDates.push($(el).attr('dayid'));
		});
		$(".dropload_list_wp").html("");
		console.log(startmonths);
		list_json.startmonths = startmonths;
		list_json.types = types;
		list_json.peopletypes = peopletypes;
		list_json.playDates = playDates;
		// console.log(list_json);
		getLineList(list_json);
		$(".note_type,.masker").removeClass("show_out");
		$(".nav_bar_type_zjl").removeClass("active");
		
	}
	var onNoteCancelBtnTap = function(){ // 列表筛选取消按钮
		$('.masker').removeClass('show_out');
		$(".note_type").removeClass("show_out").find("li").removeClass("active");
		$(".nav_bar").find(".cnt_item").eq(0).removeClass("active");
		$("body").css("overflow","auto");
		$("body").removeClass("hide");
	}
	var onNoteResetBtnTap = function(){ // 列表筛选重置按钮
		$(".note_type").find("li").removeClass("active");
	}
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

	var onSortLiTap = function() {
		$("body").css("overflow","auto");
		$("body").removeClass("hide");

		orderBy = $(this).attr('data-sort'); //点击时即给排序参数赋值
		pageNum = 0;
		$(this).addClass('on').siblings('.on').removeClass('on');
		$('.recm_sort').removeClass('active');
		$('.masker').removeClass('show_out');
		$('.nav_child').removeClass('show_out');
		list_json.orderBy = orderBy;
		pageNum = list_json.pageNum = 0; // 加载第一页的内容
		$(".dropload_list_wp").html("");
		getLineList(list_json);
	};

	var onNavbarChildTap = function() {//类型，排序点击
		var $this = $(this);
		var index = $this.index();
		var $ctn = $('.nav_ul_wp .nav_child');
		$this.toggleClass('active').siblings('.active').removeClass('active');
		if($this.hasClass('active')) {
			currScroll = $('body').scrollTop();
			$('.masker').addClass('show_out');
			$("body").addClass("hide");
		}else {
			console.log(currScroll);
			$('.masker').removeClass('show_out');
			$("body").removeClass("hide");
		}
		$ctn.eq(index).toggleClass('show_out').siblings('.show_out').removeClass('show_out');
	};

	var getLineList = function(json_data,zc_dropload) {
		var ajax_url = http_url+'/api/travelnote/getListhtml';

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

	function onGetLineListSuccess(res,zc_dropload) {
		console.log(res);
		var data = [];
		var list_arr = [];
		var targetHeight = $('.h_top').height();

		$('#city_name').html(res.data);
		zc_store.set('currCityNameHtml',res.data);
		if(res.code=='0') {
			data = res.pageInfo.list;
			if(data.length==0) {  //TODO
				zcThmLimeDropload.noData();
				zcThmLimeDropload.lock('down');
				zcThmLimeDropload.resetload();
				if(pageNum<=1) {
					$('.note_list_wp  ').hide();
					$('.no_data').show().css('margin-top', targetHeight);
					$('body').css("background", "#f4f6f8");
				}
				return;
			}else{
				$('body').css("background","#fff");
				$('.note_list_wp ').show();
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
	

	var renderPageByLocal = function(arr,return_data) {
		var tmpArr = [];
		$.each(arr,function(index, obj) {
			tmpArr.push(
					'<div class="evy_note_wp" data-id='+obj.noteId+'>',
					'<div class="pic_wp"><img src='+obj.pic+'></div>',
					'<div class="itm_scan_wp">',
						'<h2>'+obj.name+'</h2>',
						//'<p>'+obj.des+'</p>',
					'</div>',
					'<div class="see_box">',
						'<span class="see">'+obj.readCount+'</span><span class="zan">'+obj.praiseCount+'</span>',
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
	var renderPage = function() { //如果从本地取出了数据，就用本地数据渲染页面并定位到离开时的位置

		if((lastScrollTop||lastScrollTop==0) && pageDataJson.length>0) {
			// console.log(pageDataJson.length);
			if(currTapCityCode==cityCode) { //如果城市码没变则直接就用本地数据渲染
				console.log('question');
				console.log(zc_store.get('currCityNameHtml'))
				$('#city_name').html( zc_store.get('currCityNameHtml') );  

				list_json = currTapListJson;  
				console.log(list_json);
				pageNum = list_json.pageNum;
				orderBy = list_json.orderBy;
				types = list_json.types;
				playDates = list_json.playDates;
				console.log(pageDataJson);
				renderPageByLocal(pageDataJson);
				console.log(currTapListJson)
				console.log('currTapListJson')
				reverseSelect(currTapListJson);
			}else {
				//console.log(currTapListJson);
				currTapListJson.cityCode = cityCode;
				currTapListJson.pageNum = pageNum = 0;
				currTapListJson.orderBy = orderBy = '1';
				currTapListJson.types = types = [];
				currTapListJson.playDates = playDates = [];
				currTapListJson.startmonths = startmonths = [];
				currTapListJson.peopletypes = peopletypes = [];
				currTapListJson.pageSize = currTapListJson.pageSize||pageSize;
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

	var reverseSelect = function(obj) {
		renderNavDateUl(obj.startmonths);
		renderNavTypeUl(obj.types);
		renderNavPeopleUl(obj.peopletypes);
		renderNavDayUl(obj.playDates);
		renderSortCntWp(obj.orderBy);
	};
	var renderNavDateUl = function(arr) {
		var $lis = $('.nav_date_ul  li');
		$.each(arr,function(i,t) {
			$lis.eq(t).addClass('active');
		})
	};
	var renderNavTypeUl = function(arr) {
		var $lis = $('.nav_type_ul li');
		$.each(arr,function(i,t) {
			$lis.eq(t).addClass('active');
		})
	};
	var renderNavPeopleUl = function(arr) {
		var $lis = $('.nav_people_ul li');
		$.each(arr,function(i,t) {
			$lis.eq(t).addClass('active');
		})
	};
	var renderNavDayUl = function(arr) {
		var $lis = $('.nav_day_ul li');
		$.each(arr,function(i,t) {
			$lis.eq(t).addClass('active');
		})
	};
	var renderSortCntWp=function(str) {
		$('.sort_cnt_wp li').eq(str-1).addClass('on').siblings().removeClass('on');
	};

	var removeListData = function() {
		zc_store.remove('pageDataJson');
		zc_store.remove('currScrollTop');
		zc_store.remove('currTapCityCode');
		zc_store.remove('currTapListJson');
	};

	initList();
})