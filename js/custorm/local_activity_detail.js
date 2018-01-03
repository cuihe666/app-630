Zepto(document).ready(function() {
	var absUrl = serveUrl();
	var tid = zcGetLocationParm('tid');
	var from_app = zcGetLocationParm('from_app');
	var item_type = zcGetLocationParm('item_type');
	var from_share = zcGetLocationParm('tgshare'); //在url判断是否有from=singlemessage 分享h5
	var uid = zcGetAndSetUid(); //TODO
	var shareObj = {};
	var zc_ajax_data = {tid:tid,uid:uid};
	var da_uid = '';
	var goToUrl = goToComeFrom('from_app');
	var daMobile='',daNickName='',travelName='',titlePic='',price='',orderType=''     ;

	var initList = function() {
		bindEvt();
		getActivityDetail(zc_ajax_data);
		clearUserInfo();
		checkShare();
		setPageFrom();
		rankFirst();//rank第一的评论
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
		$('.concat_fan').on('tap',onConcatFanTap);
		$('.look_allmasrks').on('tap',onLookAllmasrksTap);//查看列表171110添加
	};

	var onLookAllmasrksTap = function() {
		window.location.href='all_remarks.html?tid='+tid+'&item_type=2';
	};

	var renderStar = function($imgs,num) { //依据分数渲染星星亮起的个数（半星）
		var all = parseInt(num);
		var remain = num-all;
		$.each($imgs, function(i, t) {
			if(i<all) {
				t.src='../img/star.png';
			}else {
				if(remain>=0.5) {
					$imgs[all].src='../img/comment_halfstar.png';
					if(i!=all) {
						t.src='../img/star_gray.png'
					}
				}else {
					t.src='../img/star_gray.png';
				}
			}
		});
	};

	var rankFirst = function() {//20171108添加评论入口
		var url = absUrl+'/api/comment/getRankComment';
		var data = {
			"objId":tid,
			"objType":"3",
			"objSubType":"2"
		};
		$.ajax({
			url:url,
			data:JSON.stringify(data),
			type:'POST',
			contentType:'application/json;charset=UTF-8',
			success:onGetRankFirstSuccess,
			error:function(xhr) {
				console.log('ajax error',xhr);
			}
		})
	};

	var onGetRankFirstSuccess = function(res) {
		console.log(res);
		var data = res.data, $imgs = $('.ul_img_wp .star img'),currNum = data.gradeAvg;
		if(res.data&&res.data!='null') { //TODO,应去掉取反
			$('.comment_wp').addClass('show_out');//内容修改完毕再显示出来，用户将看不到闪变
			$('#curr_score').html((data.gradeAvg).toFixed(1)+'分');
			$('#grade').html((data.gradeAvg).toFixed(1));
			$('#total_people').html(data.count);
			$('.remark_top .u_name').html(data.nickname);
			$('.remark_top .u_date').html(data.createTime);
			$('.remark_content').html(data.content);
			renderStar( $imgs,currNum );             //点亮星星（半星）
			if(data.quintessence==1) {               //1标识精华点评，0为不是精华点评
				$('.if_good').css('display','block');
			}
		}
	};

	var onConcatFanTap = function() {
		if(!uid) {
			applyAppLogin(window.location.href);
			return;
		}
		applyAppContactFan(daMobile,daNickName,tid,travelName,titlePic,price,item_type);
	};
	
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

	var onGobackTap = function() {
		var goToPage = zc_store.get('come_from');
		var from_app =  zc_store.get('from_app');
		if(from_app=='true') {
			applyAppDetailGoback();
		}else if(!from_app) {
			window.location.href = 'local_activity_list.html';
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
		window.location.href = 'actyWriteOrder.html?tid='+tid+'&item_type='+item_type+'';
	};

	var onThmCollectTap = function() {
		var curr_url = window.location.href;
		var ajaxClUrl = absUrl+'/api/collection/collection';
		var ajaxNclUrl = absUrl+'/api/collection/uncollection';
		var ajaxData = {
			objId:tid,
			type:2,
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
		// alert(ajax_data.tid);
		var ajax_url = absUrl+'/api/activity/detailshtml';
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
		//console.log(res);
		//console.log(res.data);
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
			$('.sm_tl').html(data.name);
			$('.action_light_wp .content').html(data.hotSpot);
			$('.leader_wp .content').html(data.profiles);
			$('.book_intru_wp .book_cnt').html(renderProcess(data.note));
			$('.inner_fee_cnt').html(renderProcess(data.priceIn));
			$('.outer_fee_cnt').html(renderProcess(data.priceOut));
			$('.head_pic').attr('data-dauid',data.uid);
			$('.td_intru_cnt').html(data.refundNote);
			$.each(tag_arr, function(index, val) {

				$('.tag_wp').append('<span class="detail_tag">'+val+'</span>');
			});
			shareObj.shareImgUrl  = data.titlePic[0];
			shareObj.shareContent = data.hotSpot;
			shareObj.shareTitle   = data.name;
			shareObj.shareUrl     = window.location.href+"&tgshare=true";

			$('.route_cnt_wp').append(renderProcess(data.des));
			$('.route_cnt_wp').append(renderActivityImg(day_cnts));
			$('.process_detail').html(renderProcess(data.process));
			$('#aty_time').html(data.timeLength);
			$('#activeTime').html(data.activeTime);
			$('#setAddress').html(data.setAddress);
			$('#activeAddress').html(data.activeAddress);
			//console.log(data.useOrder)
			if(!data.useOrder) {
				$('.right_sign_up').off('tap').css('backgroundColor','#ccc');
			}
		}else {
			console.log('code值：'+res.code);
		};
	};

	var renderProcess = function(str) {
		var tmpArr = [];
		var switchArr = str.split("\r\n");
		$.each(switchArr, function(index, val) {
			if(val!='') {tmpArr.push('<p class=mt6>'+val+'</p>')}
		});
		return tmpArr.join('');
	};

	var renderActivityImg = function(imgArr) {
		var tmpArr = [];

		$.each(imgArr, function(i, obj) {
			tmpArr.push(
				'<div class="pic_wp">',
					'<div class="evy_pic">',
						'<div class="pic"><img src='+obj.pic+'></div>',
						'<div class="pic_intru">'+obj.picDes+'</div>',
					'</div>',
				'</div>'
			)
		});
		return tmpArr.join('');
	};

	// var zc_render_pic = function(pic_arr) { 
	// 	var tmpArr = ['<div class="pic_wp">'];
	// 	$.each(pic_arr, function(i, obj) {
	// 		 tmpArr.push(
	// 		 	'<div class="evy_pic">',
	// 				'<div class="pic"><img src='+obj.picurl+'></div>',
	// 				'<div class="pic_intru">'+obj.name+'</div>',
	// 			'</div>'
	// 		 );
	// 	});
	// 	tmpArr.push('</div>');
	// 	return tmpArr.join('');
	// };
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