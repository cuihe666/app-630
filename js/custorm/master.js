Zepto(document).ready(function() {
	var http_url = serveUrl();
	var dauid = zcGetLocationParm('dauid');
	var tid = zcGetLocationParm('tid');
	var item_type = zcGetLocationParm('item_type');
	var urluid = zcGetLocationParm('uid');

	var uid =  zcGetAndSetUid();
	var from_app = zcGetLocationParm('from_app'); //在url判断是否有from_app

	var fansuid ="" ;
	var list_json = { //列表接口所需的json,需转换
		'dauid':dauid,
		'uid':uid
		//'fansuid':fansuid
	};

	var daMobile='',daNickName='';

	var initList = function() { //初始化列表
		bindEvt(); // 绑定事件
		getLineList(list_json);//获取列表
		clearUserInfo(); // 清除用户信息
		checkIos();
		rmPageFrom();
		if(urluid==dauid){// 自己的个人主页不需要显示关注//与私信0926
			$(".master_follow").hide();
			$('.secret').hide();
		}
		setLoclFrom();
	};
	var checkIos = function () {
		var u = navigator.userAgent;
		var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
		if(isIOS){
			$(".h_top").css("padding-top","20px");
		}
	}
	var setLoclFrom = function() {
		var masterFromApp = zc_store.get('masterFromApp');
		if(!masterFromApp) {
			zc_store.set('masterFromApp',from_app);
		}
	};

	var clearUserInfo = function() {
		zc_store.remove('userInfo');
	};

	var bindEvt = function() {
		$('.goback').on('tap',onGobackTap); // goback
		$(document).on('scroll',onWinScroll); //顶部固定
		$(".mas_impression .more").on("tap",onGoImpMore); // 达人印象更多
		$(".mas_note .more").on("tap",onGoNoteMore); // 达人游记更多
		$(".mas_theme .more").on("tap",onGoThemeMore); // 达人主题更多
		$(".mas_act .more").on("tap",onGoActMore); // 达人活动更多
		$(".mas_impression ").on("tap",".mas_im_item",onGoimDetail); //印象详情
		$(".mas_note").on("tap",".mas_im_item",onGonoteDetail); // 游记详情
		$(".mas_theme").on("tap",".evy_thm_wp ",onGothemeDetail); // 主题线路
		$(".mas_act").on("tap",".evy_thm_wp ",onGoactDetail); // 当地活动
		$(".swiper-wrapper").on("click",".swiper-slide ",onGonewStatus); // 最新动态
		$('.master_follow').one('tap',onDrFlowTap); // 关注
		$('.secret').on('tap',onSecretTap);
	};

	var onSecretTap = function() {
		if(!uid) {
			applyAppLogin(window.location.href);
			return;
		}
		applyAppContactFan(daMobile,daNickName);
	};

	var onDrFlowTap = function(){ // 关注
		$(this).off('tap');
		var ajaxYurl = http_url+'/api/follow/addfollow'; //添加关注
		var ajaxNurl = http_url+'/api/follow/cancelfollow'; // 取消关注
		var ajaxData = {dauid:dauid,fansuid:uid,roles:2};
		//console.log(ajaxData,"ajaxData")
		var isFollowed = $('.master_follow').hasClass('followed');	 
		//console.log(isFollowed,"2713326")
		isFollowed && renderFllow(ajaxNurl,ajaxData,1);
		!isFollowed && renderFllow(ajaxYurl,ajaxData,2);

	};
	var renderFllow = function(ajax_url,ajax_data,if_follow) {//渲染关注
		ajax_data_str = JSON.stringify(ajax_data);

		$.ajax({
			url: ajax_url,
			type: 'POST',
			 contentType:"application/json;charset=UTF-8",
			// dataType: 'jsonp',
			data: ajax_data_str,
			error:function() {console.log('关注 ajax error');},
			success:function(res){
				//console.log(res,111);
				if(res.code==0) {
					if(if_follow==1) {//取消关注
						$('.master_follow').removeClass('followed').html('+关注');
						getLineList(list_json);
						$('.master_follow').off().one('tap',onDrFlowTap);
					} else if(if_follow==2) { //添加关注
						$('.master_follow').addClass('followed').html('已关注');
						getLineList(list_json);
						$('.master_follow').off().one('tap',onDrFlowTap);
					}
				}else { //TODO未登录处理
					console.log('看下接口返回：'+res.code);
				}
			},
		})
	};

	var onGonewStatus = function(){
		var tid =$(this).attr("tid");
		var type=$(this).attr("type"); //2活动,3线路 7印象 8游记
		if(type==2){
		window.location.href = 'local_activity_detail.html?tid='+tid+'&item_type='+type+'&uid='+uid+'&from_app=master.html&dauid='+dauid+'&tid='+tid+'&item_type='+item_type+'&uid='+urluid+'';
			
		}else if(type==3){
		window.location.href = 'theme_detail.html?tid='+tid+'&item_type='+type+'&uid='+uid+'&from_app=master.html&dauid='+dauid+'&tid='+tid+'&item_type='+item_type+'&uid='+urluid+'';
			
		}else if(type==7){
		window.location.href = 'impression_detail.html?tid='+tid+'&item_type='+type+'&uid='+uid+'&from_app=master.html&dauid='+dauid+'&tid='+tid+'&item_type='+item_type+'uid='+urluid+'';
			
		}else if(type==8){
		window.location.href = 'note_detail.html?tid='+tid+'&item_type='+type+'&uid='+uid+'&from_app=master.html&dauid='+dauid+'&tid='+tid+'&item_type='+item_type+'uid='+urluid+'';
			
		}

	}
	var onGoimDetail = function(){//印象详情
		var tid = $(this).attr("impid");
		window.location.href = 'impression_detail.html?tid='+tid+'&item_type=7&uid='+uid+'&from_app=master.html&dauid='+dauid+'&tid='+tid+'&item_type='+item_type+'&uid='+urluid+'';

	}
	var onGonoteDetail = function(){// 游记详情
		var tid = $(this).attr("noteid");
		window.location.href = 'note_detail.html?tid='+tid+'&item_type=8&uid='+uid+'&from_app=master.html&dauid='+dauid+'&tid='+tid+'&item_type='+item_type+'&uid='+urluid+'';

	}
	var onGothemeDetail = function(){// 主题线路
		var tid = $(this).attr("higoid");
		window.location.href = 'theme_detail.html?tid='+tid+'&item_type=3&uid='+uid+'&from_app=master.html&dauid='+dauid+'&tid='+tid+'&item_type='+item_type+'&uid='+urluid+'';

	}
	var onGoactDetail = function(){// 当地活动
		var tid = $(this).attr("actid");
		window.location.href = 'local_activity_detail.html?tid='+tid+'&item_type=2&uid='+uid+'&from_app=master.html&dauid='+dauid+'&tid='+tid+'&item_type='+item_type+'&uid='+urluid+'';
	}
	var onGobackTap = function(){
		var masterFromApp = zc_store.get('masterFromApp');
		//app达人主页过来的
		if(masterFromApp=='true'){
			zc_store.remove('masterFromApp');//TODO callback
			applyAppDetailGoback();
		}
		//主题详情过来的
		if(item_type==3){
			window.location.href = "theme_detail.html?tid="+tid+"&item_type=3";
		}
		//活动详情过来的
		if(item_type==2){
			window.location.href = "local_activity_detail.html?tid="+tid+"&item_type=2";
		}
		//印象详情过来的
		if(item_type==7){
			window.location.href = "impression_detail.html?tid="+tid+"&item_type=7";
		}
		//游记详情过来的
		if(item_type==8){
			window.location.href = "note_detail.html?tid="+tid+"&item_type=8";
		}
		if(item_type==5){ //向导详情过来的
			window.location.href = "local_guide_detail.html?tid="+tid+"&item_type=5";
		}

	}
	var onWinScroll = function(){
		if($("body").scrollTop()>40){
			$(".header,.h_top").addClass("bgwhite");
			$(".h_head_nick").css("color","#000");
		}else{
			$(".header,.h_top").removeClass("bgwhite");
			$(".h_head_nick").css("color","#fff");
		}
	}
	var onGoImpMore = function(){//达人印象更多
		var dauid = $(".mas_im_box").attr("dauid");
		window.location.href = 'master_impression.html?dauid='+dauid;
		
	}
	var onGoNoteMore = function(){//达人游记更多
		var dauid = $(".mas_note_box").attr("dauid");
		window.location.href = 'master_note.html?dauid='+dauid;
		
	}
	var onGoThemeMore = function(){//达人主题更多
		var dauid = $(".mas_theme_box").attr("dauid");
		window.location.href = 'master_theme.html?dauid='+dauid;
		
	}
	var onGoActMore = function(){//达人活动更多
		var dauid = $(".mas_act_box").attr("dauid");
		window.location.href = 'master_activity.html?dauid='+dauid;
	}
	
	var getLineList = function(json_data,zc_dropload) { // 达人列表数据
		//console.log(json_data,1111,zc_dropload)
		var ajax_url = http_url+'/api/theme/daren';
//		var ajax_data_str = json_data;
//		console.log(ajax_data_str)
		if(json_data.uid==""||json_data.uid=="null"|| json_data==null){
			delete json_data.uid;
		}
		//console.log(json_data)
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
		
		
		function onGetLineListSuccess(res) { //遍历达人列表
			//console.log(res);
			var pic3 = []; //轮播图
			var implist = []; // 印象
			var notelist = []; // 游记
			var themelist = []; // 主题线路
			var actlist = []; // 活动
			var dauid = res.data.dauid;

			if(res.code=='0') {

				
				data = res.data;
//				console.log(data)
				if(data.length==0) {  //TODO
					console.log('请求成功但是没有数据');
					return;
				}
				if(data.useFollow) {$('.master_follow').addClass('followed').html('已关注')};
				
				$(".master_nick").html(data.nickname);// 达人昵称
				/*20170926添加私信按钮*/
				daNickName=data.nickname;
				daMobile=data.mobile;
				/*20170926添加私信按钮*/
				if(data.avatar==""){// 达人头像
					$(".head_img>img").attr("src","../img/daren_bghead.png"); // 达人头像 为空 有默认图
				}else{
					$(".head_img>img").attr("src",data.avatar); // 达人头像 
					
				}
				if(data.constell==""){// 星座
					// $(".fans").html("粉丝 "+data.countFans)	; // 只显示粉丝
					$('.fans').html(data.countFans);
					
				}else{
					$(".constellation").html(data.constell)	; // 星座  
					
				}
				$(".fans").html(data.countFans); // 粉丝  
				if(parseInt(data.gender)==0){// 性别 
					$(".hebox>span").addClass("man");
				}else if(parseInt(data.gender)==1){// 性别
					$(".hebox>span").addClass("women");
				}else {
					$(".hebox>span").hide();
				}
				if(data.guideAuth==true){//导游认证
					$(".auth_guide").show();
				}else{
					$(".auth_guide").hide();
				}
				if(data.idenAuth==true){// 身份认证
					$(".auth_id").show();
				}else {
					$(".auth_id").hide();
				}
				$(".mas_detail").html(data.recommend) //达人描述
//				最新动态
					$.each(data.showlist, function(i,obj) {
						pic3.push('<div class="swiper-slide" tid='+obj.tid+' type='+obj.type+'><img src='+obj.pic+' alt="" /><p>'+obj.name+'</p></div>');
					});
				   $(".swiper-wrapper").html(pic3.join(""));
				   var swiper = new Swiper('.swiper-container', {
//				        pagination: '.swiper-pagination',
				        effect: 'coverflow',
				        grabCursor: true,
				        centeredSlides: true,
				        slidesPerView: 'auto',
				        preventClicks : true,//默认true
				        preventClicksPropagation:true,
				        initialSlide :1, // 初始停在第二个
				        coverflow: {
				            rotate: 50,
				            stretch: 0,
				            depth: 100,
				            modifier: 1,
				            slideShadows : true
				        }
				    });
				    $(".mas_im_box").attr("dauid",data.dauid);
				    $(".mas_note_box").attr("dauid",data.dauid);
				    $(".mas_theme_box").attr("dauid",data.dauid);
				    $(".mas_act_box").attr("dauid",data.dauid);
//				印象	
//			   	console.log(data.implist,"yinxiang");
			    if(data.implist.length==0){ //没有印象
			   		$(".mas_impression").hide();
			   	}else if(data.implist.length<=2){ // 只有两个印象，只显示两个印象
				   	$.each(data.implist, function(i,obj) {
						implist.push(
						'<div class="mas_im_item" impId='+obj.impId+'>',
							'<div class="mas_im_pic">',
								'<img src='+obj.pic+' alt="" />',
							'</div>',
							'<p class="mas_im_title">'+obj.name+'</p>',
							'<p class="mas_im_des">'+obj.des+'</p>',
							'<div class="mas_im_status">',
								'<span class="see">'+obj.readCount+'</span><span class="zan">'+obj.goodCount+'</span>',
							'</div>',
						'</div>'
						);
					});
				   	$(".mas_impression .mas_im_box").html(implist.join(""));
			   	}else if(data.implist.length>2){ // 多个印象只显示两个
			   		$(".mas_impression .more").show();
			   		$.each(data.implist, function(i,obj) {
			   			if(i>1){
			   				return false;
			   			}
						implist.push(
						'<div class="mas_im_item" impId='+obj.impId+'>',
							'<div class="mas_im_pic">',
								'<img src='+obj.pic+' alt="" />',
							'</div>',
							'<p class="mas_im_title">'+obj.name+'</p>',
							'<p class="mas_im_des">'+obj.des+'</p>',
							'<div class="mas_im_status">',
								'<span class="see">'+obj.readCount+'</span><span class="zan">'+obj.goodCount+'</span>',
							'</div>',
						'</div>'
						);
					});
				   $(".mas_impression .mas_im_box").html(implist.join(""));
			   	}
			   //				游记	
			   	if(data.notelist.length==0){
			   		$(".mas_note").hide();
			   	}else if(data.notelist.length<=2){
				   	$.each(data.notelist, function(i,obj) {
						notelist.push(
						'<div class="mas_im_item mas_im_item2" noteId='+obj.noteId+'>',
							'<div class="mas_im_pic">',
								'<img src='+obj.pic+' alt="" />',
							'</div>',
							'<p class="mas_im_title">'+obj.name+'</p>',
							'<div class="mas_im_status">',
								'<span class="see">'+obj.readCount+'</span><span class="zan">'+obj.praiseCount+'</span>',
							'</div>',
						'</div>'
						);
					});
				   	$(".mas_note .mas_note_box").html(notelist.join(""));
			   	}else if(data.notelist.length>2){
			   		$(".mas_note .more").show();
			   		
					$.each(data.notelist, function(i,obj) {
						if(i>1){return false;}
						notelist.push(
						'<div class="mas_im_item" noteId='+obj.noteId+'>',
							'<div class="mas_im_pic">',
								'<img src='+obj.pic+' alt="" />',
							'</div>',
							'<p class="mas_im_title">'+obj.name+'</p>',
							'<div class="mas_im_status">',
								'<span class="see">'+obj.readCount+'</span><span class="zan">'+obj.praiseCount+'</span>',
							'</div>',
						'</div>'
						);
					});
				   	$(".mas_note .mas_note_box").html(notelist.join(""));
			   }
			   	  //				主题线路	
			   	//console.log(data.higolist,"theme");
			   	if(data.higolist.length==0){
			   		$(".mas_theme").hide();
			   	}else if(data.higolist.length<=2){
				   	$.each(data.higolist, function(i,obj) {
						var tags_arr = obj.tag;

						themelist.push(
							
							'<div class="evy_thm_wp clearfix" higoId='+obj.higoId+'>',
							'<div class="pic_wp">',
								'<img src='+obj.titlePic+'>',
							'</div>',
							'<div class="itm_scan_wp">',
								'<div class="itm_title">'+obj.name+'</div>',
								'<div class="itm_thms clearfix">'
						);
						$.each(tags_arr, function(itag,objtab) {
							//console.log(objtab,111111)

							themelist.push(
								'<span class="evy_thm">'+objtab+'</span>'
							);
						});
						themelist.push(
								'</div>',
								'<div class="price_go clearfix">',
									'<div class="start_place fl">'+obj.startCity+'<span>出发</span></div>',
								'<div class="itm_price fr"><span>￥</span><span class="ml_pric">'+obj.price+'</span><span class="price_word">起</span></div>',
								'</div>',
							'</div>',
						'</div>'
						);	
					});
				   	$(".mas_theme .mas_theme_box").html(themelist.join(""));
			   	}else if(data.higolist.length>2){
			   		$(".mas_theme .more").show();
			   		
				   	$.each(data.higolist, function(i,obj) {
				   		var tags_arr = obj.tag;
						//console.log(tags_arr)
				   		if(i>1){
				   			return false;
				   		}
						themelist.push(
							'<div class="evy_thm_wp clearfix" higoId='+obj.higoId+'>',
							'<div class="pic_wp">',
								'<img src='+obj.titlePic+'>',
							'</div>',
							'<div class="itm_scan_wp">',
								'<div class="itm_title">'+obj.name+'</div>',
								'<div class="itm_thms clearfix">'
						);
						$.each(tags_arr, function(itag,objtab) {
							//console.log(objtab,222222)
							themelist.push(
								'<span class="evy_thm">'+objtab+'</span>'
							);
						});
						themelist.push(
								'</div>',
								'<div class="price_go clearfix">',
									'<div class="start_place fl">'+obj.startCity+'<span>出发</span></div>',
								'<div class="itm_price fr"><span>￥</span><span class="ml_pric">'+obj.price+'</span><span class="price_word">起</span></div>',
								'</div>',
							'</div>',
						'</div>'
						);	
					});
				   	$(".mas_theme .mas_theme_box").html(themelist.join(""));
			   }
  //				活动	
//			   	console.log(data.actlist,"huodong");
			   	if(data.actlist.length==0){
			   		$(".mas_act").hide();
			   	}else if(data.actlist.length<=2){
			   		//console.log(111111)
				   	$.each(data.actlist, function(i,obj) {
						var tags_arr = obj.tag;

						actlist.push(
							'<div class="evy_thm_wp clearfix" actId='+obj.actId+'>',
							'<div class="pic_wp">',
								'<img src='+obj.titlePic+'>',
							'</div>',
							'<div class="itm_scan_wp">',
								'<div class="itm_title">'+obj.name+'</div>',
								'<div class="itm_thms clearfix">'
						);
						$.each(tags_arr, function(itag,objtab) {
							actlist.push(
								'<span class="evy_thm">'+objtab+'</span>'
							);
						});
						actlist.push(
								'</div>',
								'<div class="price_go clearfix">',
									//'<div class="start_place fl">'+obj.startCity+'<span>出发</span></div>',
								'<div class="itm_price fr"><span>￥</span><span class="ml_pric">'+obj.price+'</span><span class="price_word">起</span></div>',
								'</div>',
							'</div>',
						'</div>'
						);	
					});
				   	$(".mas_act .mas_act_box").html(actlist.join(""));
			   	}else if(data.actlist.length>2){
//			   		console.log(222222222)
			   		$(".mas_act .more").show();
			   		
				   	$.each(data.actlist, function(i,obj) {
//				   		console.log(obj)
				   		var tags_arr = obj.tag;
				   		if(i>1){
				   			return false;
				   		}
						actlist.push(
							'<div class="evy_thm_wp clearfix" actId='+obj.actId+'>',
							'<div class="pic_wp">',
								'<img src='+obj.titlePic+'>',
							'</div>',
							'<div class="itm_scan_wp">',
								'<div class="itm_title">'+obj.name+'</div>',
								'<div class="itm_thms clearfix">'
						);
						$.each(tags_arr, function(itag,objtab) {
							actlist.push(
								'<span class="evy_thm">'+objtab+'</span>'
							);
						});
						actlist.push(
								'</div>',
								'<div class="price_go clearfix">',
//									'<div class="start_place fl">'+obj.startCity+'<span>出发</span></div>',
								'<div class="itm_price fr"><span>￥</span><span class="ml_pric">'+obj.price+'</span><span class="price_word">起</span></div>',
								'</div>',
							'</div>',
						'</div>'
						);	
					});
				   	$(".mas_act .mas_act_box").html(actlist.join(""));
			   }
			} else {
				console.log('what ??')
			}
		}
	};

	initList();
})