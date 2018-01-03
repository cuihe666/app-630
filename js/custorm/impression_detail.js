Zepto(document).ready(function() {
	var http_url = serveUrl();
	var tid = zcGetLocationParm('tid'); //在url判断是否有tid文章的标志
	var from_app = zcGetLocationParm('from_app'); //在url判断是否有from_app 原生页面过来的
	var from_share = zcGetLocationParm('tgshare'); //在url判断是否有from=singlemessage 分享h5
	var uid = zcGetAndSetUid(); // 用户id
	var dauid = ''; // 达人id
	var creattime =new Date(); //创建时间
	var shareObj ={};
	var list_json = { //列表接口所需的json,需转换
		'tid':tid,
		'uid':uid
	};
	var goToUrl = goToComeFrom('from_app');
	
	var initList = function() { //初始化列表
		bindEvt(); // 绑定事件
		getLineList(list_json);//获取列表
		clearUserInfo(); // 清除用户信息
		checkIos(); // 检查ios top 20px
		checkShare();
		setPageFrom();
		_czc.push(["_trackEvent",tid,whatBrow(),'印象详情数据']);
	};
	var checkShare = function () {
		if(from_share){
			$(".h_top,.footer,.follow ").hide();
			$(".user_pic,.head_nick").off();

		}
	}
	var checkIos = function () {
		var u = navigator.userAgent;
		var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
		if(isIOS){
			$(".h_top").css("padding-top","20px");
		}
	}
	var clearUserInfo = function() {  // 清除用户信息
		zc_store.remove('userInfo');
	};
	var setPageFrom = function() {
		var come_from = zc_store.get('come_from');
		var fromApp = zc_store.get('from_app');
		!come_from && zc_store.set('come_from',goToUrl);
		!fromApp  && zc_store.set('from_app',from_app);
	};
	var bindEvt = function() {
		$('.goback').on('tap',onGobackTap); // goback
		$(document).on('scroll',onWinScroll); // 滚动事件
		$(".gotop").on("tap",goTop); // 回到顶部
		$(".user_pic,.head_nick").on("tap",goMaster); //达人主页
		$('.follow,.h_follow').on('click',onFlowTap); // 关注
		$('.collection ').on('click',onCollectTap); // 收藏
		$('.thumbs_up').on('click',onZanTap); // 点赞
		$('.footer .share').on('click',onShareTap); // 分享
		$('.music_play').on('tap',onMusicPlayTap);
		
	};

	var onMusicPlayTap = function() {
		if(!$(this).hasClass('playing')) {
			$('#music_audio').get(0).play();
			$(this).addClass('playing').attr('src','../img/music_start.png');
		}else {
			$('#music_audio').get(0).pause();
			$(this).removeClass('playing').attr('src','../img/music_end.png');
		}
	}
	var onShareTap = function(){ //分享
		var obj = JSON.stringify(shareObj);
		applyAppShare(obj);
	}
	var onZanTap = function() { // 点赞
		var ajaxClUrl = http_url+'/api/support/add';
		var ajaxNclUrl = http_url+'/api/support/cancel';
		var ajaxData = {
			objId:tid,
			type:7, // 8 是游记
			uid:uid //用户id
		};
		var ajax_data = JSON.stringify(ajaxData);	
		//console.log(ajax_data)
		var isZaned = $('.thumbs_up').hasClass('zan');
		//console.log(isZaned);
		var curr_url = window.location.href;

		if(!uid) {
			applyAppLogin(curr_url);
			return;
		}
		isZaned && renderZan(ajaxNclUrl,ajax_data,1);
		!isZaned && renderZan(ajaxClUrl,ajax_data,2);
	};
	var renderZan = function(ajax_url,ajax_data,if_cancle) { //点赞
		$.ajax({
			url: ajax_url,
			type: 'POST',
			contentType:"application/json;charset=UTF-8",
			// dataType: 'json',
			data: ajax_data,
			error:function() {console.log('点赞 ajax error');},
			success:function(res){
				//console.log(res);
				if(res.code==0) {
					if(if_cancle==1) {//取消点赞
						$('.thumbs_up').removeClass('zan');
					} else if(if_cancle==2) { //添加点赞
						$('.thumbs_up').addClass('zan');
					}
				}else if(res.code==100402) {
					console.log('未登录');
					//TODO
				} else {
					console.log('看下接口返回：'+res.code);
				}
			},
		})
	};
	var onCollectTap = function() {
		var ajaxClUrl = http_url+'/api/collection/collection';
		var ajaxNclUrl = http_url+'/api/collection/uncollection';
		var ajaxData = {
			objId:tid,
			type:7,
			uid:uid
		};
		var ajax_data = JSON.stringify(ajaxData);	
		//console.log(ajax_data)
		var isCollected = $('.collection').hasClass('collected');
		var curr_url = window.location.href;
		if(!uid) {
			applyAppLogin(curr_url);
			return;
		}
		isCollected && renderCollect(ajaxNclUrl,ajax_data,1);
		!isCollected && renderCollect(ajaxClUrl,ajax_data,2);
	};

	var renderCollect = function(ajax_url,ajax_data,if_cancle) { //收藏
		$.ajax({
			url: ajax_url,
			type: 'POST',
			contentType:"application/json;charset=UTF-8",
			// dataType: 'json',
			data: ajax_data,
			error:function() {console.log('收藏 ajax error');},
			success:function(res){
				//console.log(res);
				if(res.code==0) {
					if(if_cancle==1) {//取消收藏
						//console.log(if_cancle)
						$('.collection').removeClass('collected');
					} else if(if_cancle==2) { //添加收藏
						//console.log(if_cancle)
						
						$('.collection').addClass('collected');
					}
				}else if(res.code==100402) {
					console.log('未登录');
					//TODO
				} else {
					console.log('看下接口返回：'+res.code);
				}
			},
		})
	};

	var onFlowTap = function(){ // 关注
		var ajaxYurl = http_url+'/api/follow/addfollow'; //添加关注
		var ajaxNurl = http_url+'/api/follow/cancelfollow'; // 取消关注
		var ajaxData = {dauid:dauid,fansuid:uid,roles:2};
		var isFollowed = $('.follow,.h_follow').hasClass('followed');
		var curr_url = window.location.href;
		if(!uid) {
			applyAppLogin(curr_url);
			return;
		}
		isFollowed && renderFllow(ajaxNurl,ajaxData,1);
		!isFollowed && renderFllow(ajaxYurl,ajaxData,2);

	};
	var renderFllow = function(ajax_url,ajax_data,if_follow) {//渲染关注
		ajax_data_str = JSON.stringify(ajax_data);

		$.ajax({
			url: ajax_url,
			type: 'POST',
			 contentType:"application/json;charset=UTF-8",
			 //dataType: 'jsonp',
			data: ajax_data_str,
			error:function() {console.log('关注 ajax error');},
			success:function(res){
				//alert(res.code)
				//console.log(res,111);
				if(res.code==0) {
					if(if_follow==1) {//取消关注
						$('.follow,.h_follow').removeClass('followed').html('<span>+</span>关注');
					} else if(if_follow==2) { //添加关注
						$('.follow,.h_follow').addClass('followed').html('已关注');
					}
				}else { //TODO未登录处理
					console.log('看下接口返回：'+res.code);
				}
			},
		})
	};
	var onGobackTap = function(){
		var goToPage = zc_store.get('come_from');
		var from_app =  zc_store.get('from_app');
		if(from_app=='true') {
			applyAppDetailGoback();
		}else if(!from_app) {
			window.location.href = 'impression.html';
		}else {
			window.location.href = goToPage;
		}
		rmPageFrom();
	};
	var onWinScroll = function(){
		var top = $(".user_box").offset().top;

		if($("body").scrollTop()>=top){
			$(".header,.h_top").addClass("bgwhite");
			$(".h_user,.h_follow").show();
		}else{
			$(".header,.h_top").removeClass("bgwhite");
			$(".h_user,.h_follow").hide();
		}
		if($("body").scrollTop()>=100){
			$(".gotop").addClass("show");
		
		}else{
			$(".gotop").removeClass("show");
			
		}

	}
	var goTop = function(){
		$("body").scrollTop(0);
	}
	
	var goMaster = function(){ // 个人主页
		dauid = $(".user_pic").attr("data-id");
		window.location.href = 'master.html?dauid='+dauid+'&tid='+tid+'&item_type=7';
	}
	var getLineList = function(json_data,zc_dropload) { // 印象列表数据
		//console.log(json_data,1111);
		if(json_data.uid==""||json_data.uid=="null"|| json_data==null){
			delete json_data.uid;
		}
		var ajax_url = http_url+'/api/travelimpress/detailshtml';
		$.ajax({
			url:ajax_url,
			data:json_data,
			type:'GET',
			contentType:"application/json;charset=UTF-8",
			success:onGetLineListSuccess,
			timeout:5000,//超过5秒数
			error:function(xhr) {
				console.log('ajax error');
			},
			complete:function(xhr,status) {
					if(status=='timeout') { //超过5秒数据不返回
						if(pgNum==1) {
							showNoWlan();
						}else if(pgNum>1) {
							myDropload.resetload();
							$('.dropload-refresh').html('木有了，快放手'); //内容待定
							myDropload.lock('down');
						}
					}
				}
		});
		
		
		function onGetLineListSuccess(res) { //遍历印象列表
			console.log(res);
			var pic = [];
			var list_arr = [];
			dauid = res.data.uid;
			
			if(res.code=='0') {
				data = res.data;			
				if(data.length==0) {  //TODO
					console.log('请求成功但是没有数据');
					return;
				}
				shareObj["shareImgUrl"] = data.pics[0];
				shareObj["shareContent"] = data.des;
				shareObj["shareTitle"] = data.name;
				shareObj["shareUrl"] = window.location.href+"&tgshare=true" ;
				_czc.push(["_trackEvent",tid,whatBrow(),'印象：'+data.name+'']);

				if(data.useGood) {$('.thumbs_up ').addClass('zan')}; // 点赞
				if(data.useCollect) {$('.collection').addClass('collected')}; // 收藏
				if(data.useFollow) {$('.follow,.h_follow').addClass('followed').html('已关注')};
				$(".user_pic").attr("data-id",data.uid);
				var pics = data.pics;
				if(pics.length==1){
					$(".banner").html("<img src="+pics[0]+" />");
				}else{
					$.each(pics, function(i,obj) {
						pic.push('<div class="swiper-slide"><img src='+obj+' alt="" /></div>');
					});
				   $(".swiper-wrapper").html(pic.join(""));
					var mySwiper = new Swiper('.swiper-container', {
						autoplay: 5000,//可选选项，自动滑动
						loop: true,
						observer: true,
						observeParents: true
					})
				}
				if(data.music) {
					$('#music_audio').attr('src',data.music);
					$('.music_wp').addClass('show_out');
				}

				
				// $(".banner").html(data.pics);
				$(".head_nick,.h_head_nick").html(data.nickname);
				$(".user_pic>img,.h_user>img").attr("src",data.avatar);

				$(".title").html(data.name); // 标题
				var creattime = new Date(data.createTime);
				var year = creattime.getFullYear();
				var mounth = creattime.getMonth()+1;
				if(mounth<10){
					mounth = "0"+mounth;
				}else{
					mounth=mounth;
				}
				if(day<10){
					day = "0"+day;
				}else{
					day = day;
				}
				var day = creattime.getDate();
				var time = year+'-'+mounth+'-'+day;
				var gotime = new Date(data.startTime);
				var year = creattime.getFullYear();
				var mounth = creattime.getMonth()+1;
				if(mounth<10){
					mounth = "0"+mounth;
				}else{
					mounth=mounth;
				}
				if(day<10){
					day = "0"+day;
				}else{
					day = day;
				}
				var day = creattime.getDate();
				var time = year+'-'+mounth+'-'+day;
				$('.release_time>span').html(time);
				// console.log(data.content)
				$(".scan_con").html(data.content);
				$('embed').attr('pluginspage','http://get.adobe.com/cn/flashplayer/');

			} else {
				console.log('what ??')
			}
		}
	};

	initList();
})