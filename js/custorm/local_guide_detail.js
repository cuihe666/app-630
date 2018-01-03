Zepto(document).ready(function() {
	var absUrl = serveUrl();
	var tid = zcGetLocationParm('tid');
	var from_app = zcGetLocationParm('from_app');
	var item_type = zcGetLocationParm('item_type');
	var from_share = zcGetLocationParm('tgshare'); //在url判断是否有from=singlemessage 分享h5
	var uid = zcGetAndSetUid(); //TODO
	var shareObj = {};
	var zc_ajax_data = {guideId:tid,uid:uid};
	var da_uid = '';
	var language = {'0':'普通话','1':'英语','2':'日语','3':'韩语','4':'其他'};
	var goToUrl = goToComeFrom('from_app');
	/*0927添加联系达人聊天zc*/
	var daMobile='',daNickName='',travelName='',titlePic='',price='',orderType=''     ;

	var initList = function() {
		bindEvt();
		getActivityDetail(zc_ajax_data);
		clearUserInfo();
		checkShare();
		setPageFrom();
	};
	var checkShare = function () {
		if(from_share){
			$(".h_top,.detail_footer,.zc_flow").hide();
			$(".head_pic").off();
		}
	};

	var bindEvt = function() {
		$('.theme_collect').on('tap',onThmCollectTap);
		$('.theme_share').on('tap',onThmShareTap);
		$('.zc_flow').on('tap',onThmFlowTap);
		$('.right_sign_up').on('tap',onThmSignUpTap);
		$('.goback').on('tap',onGobackTap);
		$(document).on('scroll',onWinScroll);
		$('.head_pic').on('tap',onHeadPicTap);
		$('.p_rnd_wp .fold_btn').on('tap',onFoldBtnTap);
		$('.discount_wp').on('tap','.evy_privilege',onEvyPrivilegeTap);
		$('.concat_fan').on('tap',onConcatFanTap);
	};

	var onConcatFanTap = function() {
		if(!uid) {
			applyAppLogin(window.location.href);
			return;
		}
		applyAppContactFan(daMobile,daNickName,tid,travelName,titlePic,price,item_type);
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

	var onFoldBtnTap = function(ev) {
		console.log(ev);
		var isTrue = $('.fold_btn').hasClass('isfold');
		if(isTrue) {
			$('.fix_height').css('max-height','999rem');
			$('#fd_word').html('收起');
			$('.fold_btn').removeClass('isfold');
			$('#fd_arrow').css('transform','rotate(180deg)')
		}else {
			$('.fix_height').css('max-height','4.1rem');
			$('#fd_word').html('展开');
			$('.fold_btn').addClass('isfold');
			$('#fd_arrow').css('transform','rotate(0deg)')
		}
	}
	var setPageFrom = function() {
		var come_from = zc_store.get('come_from');
		var fromApp = zc_store.get('from_app');
		!come_from && zc_store.set('come_from',goToUrl);
		!fromApp  && zc_store.set('from_app',from_app);
	};

	var onHeadPicTap = function() {
		var dauid = $(this).attr('data-dauid');
		window.location.href = 'master.html?dauid='+dauid+'&uid='+uid+'&tid='+tid+'&item_type='+item_type+'';
	};

	var onWinScroll = function() {
		var isClted = $('.theme_collect').hasClass('collected');
		if($('body').scrollTop()>2) {
			$('.h_top').addClass('show_bg');
			$('.goback').css('backgroundImage','url(../img/go_back.png)');
			$('.theme_share').css('backgroundImage','url(../img/share.png)');
			if(!isClted) {
				$('.theme_collect').addClass('black');
			}
		}else {
			$('.h_top').removeClass('show_bg');
			$('.goback').css('backgroundImage','url(../img/go_back_white.png)');
			$('.theme_share').css('backgroundImage','url(../img/share_white.png)');
			if(!isClted) {
				$('.theme_collect').removeClass('black');
			}
		}
	};

	var onGobackTap = function(){
		var goToPage = zc_store.get('come_from');
		var from_app =  zc_store.get('from_app');
		if(from_app=='true') {
			applyAppDetailGoback();
		}else if(!from_app) {
			window.location.href = 'local_guide_list.html';
		}else {
			window.location.href = goToPage;
		}
		rmPageFrom();
	};

	var onThmSignUpTap = function() { //TODO 页面跳转
		var curr_url = window.location.href;
		if(!uid) {
			applyAppLogin(curr_url);
			return;
		}
		window.location.href = 'guideWriteOrder.html?tid='+tid+'&item_type='+item_type+'';
	};

	var onThmCollectTap = function() {
		var curr_url = window.location.href;
		var ajaxClUrl = absUrl+'/api/collection/collection';
		var ajaxNclUrl = absUrl+'/api/collection/uncollection';
		var ajaxData = {
			objId:tid,
			type:item_type||5,
			uid:uid
		};
		var ajax_data = JSON.stringify(ajaxData);   
		var isCollected = $('.theme_collect').hasClass('collected');
		if(!uid) {
			applyAppLogin(curr_url);
			return;
		}
		isCollected && renderCollect(ajaxNclUrl,ajax_data,1);
		!isCollected && renderCollect(ajaxClUrl,ajax_data,2);
	};

	var renderCollect = function(ajax_url,ajax_data,if_cancle) { //渲染收藏
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
						$('.theme_collect').removeClass('collected');
					} else if(if_cancle==2) { //添加收藏
						$('.theme_collect').addClass('collected');
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

	var renderFllow = function(ajax_url,ajax_data,if_fllow) {//渲染关注
		$.ajax({
			url: ajax_url,
			// type: 'GET',
			type: 'POST',
			contentType:"application/json;charset=UTF-8",
			// dataType: 'jsonp',
			// data: ajax_data,
			data: JSON.stringify(ajax_data),
			error:function() {console.log('关注 ajax error');},
			success:function(res){
				//console.log(res);
				if(res.code==0) {
					if(if_fllow==1) {//取消关注
						$('.zc_flow').removeClass('fllowed').html('+关注');
					} else if(if_fllow==2) { //添加关注
						$('.zc_flow').addClass('fllowed').html('已关注');
					}
				}else { //TODO未登录处理
					console.log('看下接口返回：'+res.code);
				}
			},
		})
	};

	var onThmShareTap = function() { //TODO 联调APP
		var obj = JSON.stringify(shareObj);
		applyAppShare(obj);
	};

	var onThmFlowTap = function() {
		var curr_url = window.location.href;
		var ajaxYurl = absUrl+'/api/follow/addfollow';
		var ajaxNurl = absUrl+'/api/follow/cancelfollow';
		var ajaxData = {dauid:da_uid,fansuid:uid,roles:2};
		var isFllowed = $('.zc_flow').hasClass('fllowed');	
		if(!uid) {
			applyAppLogin(curr_url);
			return;
		}
		isFllowed && renderFllow(ajaxNurl,ajaxData,1);
		!isFllowed && renderFllow(ajaxYurl,ajaxData,2);

	};

	var getActivityDetail = function(ajax_data) {
		// console.log(ajax_data);
		var ajax_url = absUrl+'/api/guide/detailHtml';
		$.ajax({
			type:'GET',
			url:ajax_url,
			data:ajax_data,
			success:onGetDetailSuccess,
			error:function(xhr) {
				console.log('ajax error');
			}
		});
	};

	var onGetDetailSuccess = function(res) {
		// console.log(res);
		console.log(res.data);
		var data = res.data;
		var tag_arr=data.tag;
		var day_cnts = data.imgs;
		var dayCntTmpArr = [];
		var zc_gender = {"0":"../img/male.png",	"1":"../img/famale.png"};
		
		if(res.code==0) { //数据回掉成功才做处理
			// console.log(zc_gender[data.gender]);
			zc_render_title_pic(data.titlePic,$('#wraapper'));
			da_uid = data.uid;
			if(data.useCollect) {$('.theme_collect').addClass('collected')};
			if(data.useFollow) {$('.zc_flow').addClass('fllowed').html('已关注')};
			/*20170926添加联系达人zc*/
			daMobile=data.mobile;
			daNickName=data.nickname;
			travelName=data.name;
			titlePic=data.titlePic[0];
			price=data.price;
			/*20170926添加联系达人zc*/
			$('#lowest_price').html(data.price);
			$('.head_img').css({'backgroundImage':'url('+data.avatar+')','background-size': '100% 100%'});
			$('.gender').css('backgroundImage','url('+zc_gender[data.gender]+')');
			$('.head_nick').html(data.nickname);
			$('.sm_tl').html(data.title);
			// $('.action_light_wp .content').html(data.hotSpot);
			// $('.leader_wp .content').html(data.profiles);
			$('.book_intru_wp .book_cnt').html(renderProcess(data.note));
			$('.inner_fee_cnt').html(renderProcess(data.priceIn));
			$('.outer_fee_cnt').html(renderProcess(data.priceOut));
			$('.head_pic').attr('data-dauid',data.uid);
			$('.td_intru_cnt').html(renderProcess(data.refundNote));
			$('#aty_time').html(renderLanguage(data.language,data.languageOther));
			$('#activeTime').html(data.timeIntervalStart+'-'+data.timeIntervalEnd);
			$('#setAddress').html(data.serviceTime+'小时/天');
			$('#activeAddress').html(data.num+'人');
			$('.rnd_cnt').html(data.recommend);
			$.each(tag_arr, function(index, val) {

				$('.tag_wp').append('<span class="detail_tag">'+val+'</span>');
			});
			shareObj.shareImgUrl  = data.titlePic[0];
			shareObj.shareContent = data.serviceContent;
			shareObj.shareTitle   = data.title;
			shareObj.shareUrl     = window.location.href+"&tgshare=true";
			$('.route_cnt_wp').append(renderProcess(data.serviceContent));
			$('.route_cnt_wp').append(renderActivityImg(day_cnts));
			$('.process_detail').html(renderProcess(data.process));
			$()
			if(!data.useOrder) {
				$('.right_sign_up').off('tap').css('backgroundColor','#ccc');
			}
			renderDescription();

		}else {
			console.log('code值：'+res.code);
		};
	};

	var renderDescription = function() {
		var fixH = $('.fix_height').height();
		var cntH = $('.rnd_cnt').height();
		if(cntH>fixH) {
			$('.fold_btn').addClass('show_out');
		}else {
			$('.fold_btn').removeClass('show_out');
		}
	};

	var renderLanguage = function(lg_str,other) {
		var arr = lg_str.split(',');
		var str = '';
		$.each(arr, function(index, val) {
			if(val!=4) {
			 str+='<span class="zclg">'+language[val]+'</span>';
			}else {
			  str+='<span class="zclg">'+other+'</span>';		
			}
		});
		return str;
	};

	var renderProcess = function(str) {
		// if(!str) {return;}
		// var tmpArr = [];
		// var switchArr = str.split("\r\n");
		// $.each(switchArr, function(index, val) {
		// 	if(val!='') {tmpArr.push('<p class=mt6>'+val+'</p>')}
		// });
		// return tmpArr.join('');
		return '<pre class=mt6>'+str+'</pre>';
	};

	var renderActivityImg = function(imgArr) {
		var tmpArr = [];

		$.each(imgArr, function(i, obj) {
			tmpArr.push(
				'<div class="pic_wp">',
					'<div class="evy_pic">',
						'<div class="pic"><img src='+obj.pic+'></div>',
						'<div class="pic_intru">'+obj.picDesc+'</div>',
					'</div>',
				'</div>'
			)
		});
		return tmpArr.join('');
	};

	var zc_render_title_pic = function(pic_arr,$obj) {
		var tmpArr = [];
		
		$.each(pic_arr, function(index, val) {
			tmpArr.push(
				'<div class="swiper-slide">',
					'<img src='+val+'>',
				'</div>'
			);
		});
		$obj.html(tmpArr.join(''));
		creatSwiper();
	};

	var creatSwiper = function() {
		var swiper = new Swiper('.containar01', {
			loop: true,
			autoplay: 1500
		});
	};

	
	var clearUserInfo = function() {
		zc_store.remove('userInfo');
	};



	initList();
});

window.onload = function() {
	solveIosHead('$');
}