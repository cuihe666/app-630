Zepto(document).ready(function() {
	// console.log('页面准备就绪的时间'+' ： '+new Date().getTime());
	//2017-05-31@zc
	var absUrl = serveUrl();
	var goBackUrl = zcGetLocationParm('goBackUrl');
	// var letter_top = $('.hot_city_wp').offset().top; //字母置顶时距离的offsetTop;
	var chinaScrollTop = 0;//记录切换时当前窗体所在的位置
	var abordScrollTop = 0;
	var cityCode = zcGetAndSetcityCode();//城市码
	var initList = function() {
		bindEvt();
		getCityList();//渲染接口数据
	};

	var bindEvt = function() {
		$('.right_wp').on('touchmove',onLetterWpMove);//字母touchmove
		$('.kind>div').on('tap',onChinaSwitchTap);//切换国内海外
		$('.left_wp').on('tap','.evy_letter',onCityTap);//某一个城市被点击选中跳转至对应页面
		$('.lter_wp>li').on('touchstart',onLetterLiTouchStart);//右侧字母滑动
		$('.lter_wp>li').on('touchend',onLetterLiTouchEnd);//右侧字母滑动end
		$(window).on('scroll',onWinScroll);//窗体滚动
		$('.goback').on('tap',onGobackTap);//返回键事件
		$('.china_word').on('tap',onChinaWordTap);
	};

	var onChinaWordTap = function() {
		$('body').scrollTop(0);
	};

	var onGobackTap = function() { //TODO返回键事件
		window.history.go(-1);
		// return false;
		// window.location.href = goBackUrl+'?currCityCode='+cityCode;
	};

	var onWinScroll = function() { //记录每个tab的scrollTop@zc
		var $currLetterWpDom = $('.left_wp .show_out');
		var currWpIndex = $currLetterWpDom.index();
		var currScrollTop = $('body').scrollTop();
		currWpIndex == 0 && (chinaScrollTop = currScrollTop);
		currWpIndex == 1 && (abordScrollTop = currScrollTop);
	};

	var onCityTap = function() {
		var city_code = $(this).attr('data-citycode');
		var city_name = $(this).html();
		zc_store.set('city_name', city_name);
		window.location.href = goBackUrl+'?city_code='+city_code+'&city_name=true';
		//console.log(city_code);
		//console.log(city_name);
	};

	var onChinaSwitchTap  =function() { //切换国内海外
		var $this =  $(this);
		var index = $this.index();
		var $chinaOrNotDivs = $('.left_wp>div');
		$this.addClass('on').siblings().removeClass('on');
		$chinaOrNotDivs.eq(index).addClass('show_out').siblings().removeClass('show_out');
		index==0 && $('body').scrollTop(chinaScrollTop);
		index==1 && $('body').scrollTop(abordScrollTop);
	};

	var onLetterWpMove = function(ev) {
		// console.log(ev.touches.clientY);
		
		var lterWpY = $('.lter_wp').offset().top;//.lter_wp的Y坐标
		var currY = ev.touches[0].pageY;//当前手指的Y坐标
		var every_li_h = $('.lter_wp>li').height();
		var currLetterCount =Math.ceil((currY-lterWpY)/every_li_h).toString();
		var currLetter = cityCount[currLetterCount];
		
		// console.log(currY)
		// console.log(lterWpY)
		// console.log(every_li_h)
		// console.log(currLetter);
		// console.log(currListWpId);
		if(currLetter) { //如果超出显示A或者Z
			$('.letter_html').html(currLetter);
			renderDomScrollTop(currLetter);
		}
		return false;//阻止滑屏
	};

	var onLetterLiTouchStart = function() {
		// console.log(this);
		var currLtr = $(this).html();
		$('.letter_html').html(currLtr).addClass('show_out');
		renderDomScrollTop(currLtr);
	};

	var onLetterLiTouchEnd = function() {
		setTimeout(function() {
			$('.letter_html').removeClass('show_out').html('');
		},1000);
		
	};

	var getCityList = function() {
		var url = absUrl+'/api/travelhomepage/hotcity';
		$.ajax({
			url:url,
			// data:'',
			type:'GET',
			// contentType:"application/json;charset=UTF-8",
			success:onGeCityListSuccess,
			error:function(xhr) {
				console.log('ajax error');
			}
		});

	};
	var onGeCityListSuccess = function(res) {
		// console.log('获取到城市数据的时间'+' ： '+new Date().getTime());
		//console.log(res);
		var chinaHotCity = res.data.china;//中国热门城市
		var overseaHotCity = res.data.abroad;//海外热门城市
		var $chinaHotCityWp = $('#great_china .hot_list_wp');//中国热门城市wp
		var $overseaHotCitywp = $('#slim_overseas .hot_list_wp');//海外热门城市wp
		var chinaLtrCitys = res.data.chinaCitys;//中国城市list
		var abroadLtrCitys = res.data.abroadCitys;//海外城市list
		var $chinaLtrWp = $('#cn_ltr_list_wp');//中国的字母列表WP
		var $abroadLtrWp = $('#os_ltr_list_wp');//海外的的字母列表WP
		renderHotCity(chinaHotCity,$chinaHotCityWp);//渲染一下中国的热门城市
		renderHotCity(overseaHotCity,$overseaHotCitywp);//渲染一下海外的热门城市
		renderLetterCity(chinaLtrCitys,$chinaLtrWp);//渲染一下中国的字母排序城市
		renderLetterCity(abroadLtrCitys,$abroadLtrWp);//渲染一下海外的字母排序城市
	};

	var renderHotCity = function(city_arr,$obj) { //城市数组，待渲染的包裹容器jq对象;渲染热门城市列表@zc
		var tmpArr = [];
		$.each(city_arr,function(i, obj) {
			tmpArr.push('<li class="evy_hot evy_letter" data-cityCode='+obj.cityCode+'>'+obj.cityName+'</li>');
		});
		$obj.html(tmpArr.join(''));
		// console.log('热门城市列表数据渲染完成后的时间（以最后一次输出为准：）'+'  '+new Date().getTime());
	};

	var renderLetterCity = function(city_obj,$obj) { //城市对象，待渲染的包裹容器jq对象,需调用renderLiCity;渲染字母城市列表@zc
		var zcTmpArr = [];
		$.each(city_obj, function(i, obj) {
			var liStr  = renderLiCity(obj);
			zcTmpArr.push(
				'<div class="letter_city_wp '+i+'">',
					'<div class="letter_header hot_header">'+i+'</div>',
					'<ul class="letter_list_wp">'
			);
			zcTmpArr.push(liStr);
			zcTmpArr.push(
					'</ul>',
				'</div>'
			);
		});
		$obj.html(zcTmpArr.join(''));
		// console.log('字母列表数据渲染完成后的时间（以最后一次输出为准：）'+'  '+new Date().getTime());
	};

	var renderLiCity = function(city_arr) { //得到一个li字符串,用于添加到ul中
		var tmpStr = '';
		$.each(city_arr, function(i, obj) {
			tmpStr += '<li class="evy_letter " data-cityCode='+obj.cityCode+'>'+obj.cityName+'</li>'
		});
		return tmpStr;
	};

	var renderDomScrollTop = function(dom_cls) { //接收当前需要置顶元素的className，将其置顶
		var $currLetterDom = $('.left_wp .show_out').find('.'+dom_cls);
		var currLetterDomTop = 0;
		var letter_header_height = $('.letter_header').height() || $('#slim_overseas .letter_header').height();
		if($currLetterDom.size()>0) {
			currLetterDomTop  = $currLetterDom.offset().top;
			$('body').scrollTop(currLetterDomTop-letter_top-letter_header_height);
		}
	};

	var cityCount = {"1"  : "A", "2" : "B", "3"  : "C", "4" : "D", "5"  : "E", "6"  : "F", "7"  : "G", "8" : "H", "9" : "I", "10" : "J", "11" : "K", "12" : "L", "13" : "M", "14" : "N", "15" : "O", "16" : "P", "17" : "Q", "18" : "R", "19" : "S", "20" : "T", "21" : "U", "22" : "V", "23" : "W", "24" : "X", "25" : "Y", "26" : "Z"};


	initList();
});
window.onload = function() {
	solveIosHead();
	window.letter_top = $('.hot_city_wp').offset().top; //字母置顶时距离的offsetTop;
}