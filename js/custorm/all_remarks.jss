$(function($) {

	var absUrl = serveUrl(),
		listUrl = absUrl+'/api/comment/getCommentListByObjId',
		tid = zcGetLocationParm('tid'),
		item_type = zcGetLocationParm('item_type'),
		itemIndex=0,
		tab1LoadEnd = false,
		tab2LoadEnd = false,
		tab3LoadEnd = false,
		tab4LoadEnd = false,
		tab5LoadEnd = false,
		Gdata = {'objId': tid, 'objType': '3','pageNum': 1,'pageSize': 10,'objSubType':item_type,'tab':''},
	    tabNum = {'0':1,'1':1,'2':1,'3':1,'4',1},
	    scrollP = {'0':0,'1':0,'2':0,'3':0,'4',0},
	    tabType = {0:'',1:'推荐',2:'待改善',3:'最新',4:'有图'};
		


	var initList = function() {
		bindEvent();
		zcTab();
		getStarLevel();
		getRankList();
	};

	var bindEvent = function() {
		$('.tab_content_wp').on('tap','.fold_wp',onFoldWpTap);
		$('.goback').on('tap',onGobackTap);
	};

	var onGobackTap = function() {
		history.go(-1);
	};

	var onFoldWpTap = function() {
		var $this = $(this);
		$this.find('.fold_icon').toggleClass('up');
		$this.parents('.cnt_cnt').find('.may_hidden').toggleClass('hide');
	};

	var zcTab = function() {
		var $tabHeaders = $('.ul_hwp>li');
		var $tabBodys = $('.ul_bwp>li');
		$tabHeaders.on('click',function() {
			var $this=$(this),
				index=$this.index();
			scrollP[itemIndex]=window.scrollY;//记录当前正在显示的tab的滚动条的位置
			itemIndex=$(this).index();
			window.scrollTo(0,scrollP[itemIndex]);//此时tab索引已经更新到当前点击的选项卡，但还未添加样式和展示对应的内容
			$this.addClass('on').siblings('.on').removeClass('on');
			$tabBodys.eq(index).addClass('show_out').siblings().removeClass('show_out');
			if(itemIndex==0) {
				if(!tab1LoadEnd) {
					dpload.unlock();
           			dpload.noData(false);
				}else {
					dpload.lock('down');
            		dpload.noData();
				}
			}else if(itemIndex==1) {
				if(!tab2LoadEnd) {
					dpload.unlock();
           			dpload.noData(false);
				}else {
					dpload.lock('down');
            		dpload.noData();
				}
			}else if(itemIndex==2) {
				if(!tab3LoadEnd) {
					dpload.unlock();
           			dpload.noData(false);
				}else {
					dpload.lock('down');
            		dpload.noData();
				}
			}else if(itemIndex==3) {
				if(!tab4LoadEnd) {
					dpload.unlock();
           			dpload.noData(false);
				}else {
					dpload.lock('down');
            		dpload.noData();
				}
			}else if(itemIndex==4) {
				if(!tab5LoadEnd) {
					dpload.unlock();
           			dpload.noData(false);
				}else {
					dpload.lock('down');
            		dpload.noData();
				}
			}
    		dpload.resetload();
		}) 
	};

	var dpload=$('#tab_contenet').dropload({
		scrollArea : window,
		domUp : {
            domClass   : 'dropload-up',
			domRefresh : '<div class="dropload-refresh"><img src="../img/up_loading.gif"></div>',
			domUpdate  : '<div class="dropload-update"><img src="../img/up_loading.gif"></div>',
			domLoad    : '<div class="dropload-load"><img src="../img/up_loading.gif"></div>'
	    },
	    domDown: {
	    	domClass   : 'dropload-down',
	        domRefresh : '<div class="dropload-refresh" id="upLoadMayHide">↑上拉加载更多</div>',
	        domLoad    : '<div class="dropload-load"><span class="loading"></span>正在加载</div>',
	        domNoData  : '<div class="dropload-noData">暂无更多数据</div>'
	    },
		loadDownFn:function(me) {
			// console.log(tabNum[itemIndex]);
			Gdata.pageNum=tabNum[itemIndex];
			Gdata.tab=tabType[itemIndex];
			// renderList();
			ajaxFn(listUrl,Gdata,renderList);
		},
		loadUpFn:function(me) {
			Gdata.pageNum=tabNum[itemIndex]=1;
			Gdata.tab=tabType[itemIndex];
			dpload.resetload();
			dpload.noData(false);
			dpload.unlock();
			// renderList();
			ajaxFn(listUrl,Gdata,renderList);
		}
	});

	var renderList = function(res) {
		console.log(res);
		var data=res.pageInfo.list,
			currArr=[];
		tabNum[itemIndex]++;
		if(data.length<=0) { //没有数据
			dataEnd();
			dpload.noData(true);
			dpload.lock()
		}else {
			$.each(data,function(i,obj) {
				currArr.push(
					'<div class="evy_cnt_wrap">',
						'<div class="cnt_top clearfix">',
							'<div class="u_name">傻驴爱旅游</div>',
							'<div class="if_good">精品点评</div>',
							'<div class="cnt_star_wp">',
								'<ul class="ul_img_wp  clearfix">',
									forStar(obj.grade),
								'</ul>',
								'<span class="star_score">5.0分</span>'	,
							'</div>',
						'</div>',
						'<div class="cnt_cnt">',
							'<div class="may_hidden hide">',
								'<div class="cnt_content">',
									'这里是内容，如果超出两行还有内容则overflowhidden，并且展示张开按钮，点击展开按钮显示全部，如果内容不超过两行，则不展示展开按钮！这垃圾设计，真心垃圾没脑子！',
								'</div>',
							'</div>	',
							'<div class="fold_outer clearfix">',
								'<div class="fold_wp">',
									'<span>展开</span>',
									'<span class="fold_icon">',
										'<img src="../img/fold_icon.png">',
									'</span>',
								'</div>',
							'</div>',
							,
						'</div>',
						'<div class="cnt_img">',
							'<div class="cnt_pic_wp clearfix">',
								'<figure class="evy_pic">',
									'<div class="img-dv">',
										'<a href="http://tupian.enterdesk.com/2015/lcx/1/26/9/9.jpg" data-size="919x517">',
											'<img src="../img/one.png">',
										'</a>',
									'</div>',
								'</figure>',
								'<figure class="evy_pic">',
									'<div class="img-dv">',
										'<a href="http://tupian.enterdesk.com/2015/lcx/1/26/9/9.jpg" data-size="919x517">',
											'<img src="../img/one.png">',
										'</a>',
									'</div>',
								'</figure>',
								'<figure class="evy_pic">',
									'<div class="img-dv">',
										'<a href="http://tupian.enterdesk.com/2015/lcx/1/26/9/9.jpg" data-size="919x517">',
											'<img src="../img/one.png">',
										'</a>',
									'</div>',
								'</figure>',
								'<figure class="evy_pic">',
									'<div class="img-dv">',
										'<a href="http://tupian.enterdesk.com/2015/lcx/1/26/9/9.jpg" data-size="919x517">',
											'<img src="../img/one.png">',
										'</a>',
									'</div>',
									,
									'<div class="img_still show_out">',
										'<div class="masker position"></div>',
										'<div class="img_count position">+4</div>',
									'</div>',
								'</figure>',
							'</div>',
						'</div>',
						'<div class="cnt_time">2016-06-10</div>',
					'</div>'

				)
			});
		}

	};

	function dataEnd() { //锁住开关
		if(itemIndex==0) {
			tab1LoadEnd=true;
		}else if(itemIndex==1) {
			tab2LoadEnd=true;
		}else if(itemIndex==2) {
			tab3LoadEnd=true;
		}else if(itemIndex==3) {
			tab4LoadEnd=true;
		}else if(itemIndex==4) {
			tab5LoadEnd=true;
		}
	}
	function dataStart() { //解锁开关
		if(itemIndex==0) {
			tab1LoadEnd=false;
		}else if(itemIndex==1) {
			tab2LoadEnd=false;
		}else if(itemIndex==2) {
			tab3LoadEnd=false;
		}else if(itemIndex==3) {
			tab4LoadEnd=false;
		}else if(itemIndex==4) {
			tab5LoadEnd=false;
		}
	}

	function ifUpFresh(arr) { //填充内容时判断是否是第一页(下拉刷新)
		if(Gdata.pageNum==1) {
			$('#n_ol li').eq(itemIndex).html(arr.join(''));
			dataStart();
		}else {
			$('#n_ol li').eq(itemIndex).append(arr.join(''));
		}
		
	}

	var forStar = function(num) {
		var all = parseInt(num),
			remain = num-all,
			str = '',
			i=0;
		for(;i<5;i++) {
			if(i<all) {
				str+='<li class="star"><img src="../img/star.png"></li>'
			}else {
				if(remain>=0.5) {
					if(i!=all) {
						str+='<li class="star"><img src="../img/star_gray.png"></li>'
					}else {
						str+='<li class="star"><img src="../img/comment_halfstar.png"></li>'
					}
				}else {
					str+='<li class="star"><img src="../img/star_gray.png"></li>'
				}
			}
		};
		return str;
	};

	var getStarLevel = function() { //渲染该产品的星级分数
		var url=absUrl+'/api/starlevel/getStarLevelAvg',
			data= {
				objectId:tid,
				type:"3",//0民宿3旅行
				subType:item_type
			};
		ajaxFn(url,data,onGetStarLevelSuccess);
	};

	var onGetStarLevelSuccess = function(res) {
		console.log(res);
		var data = res.data;
		if(res.code!=0||!data) { //如果出现异常情况，中断程序运行
			console.log(res.code,data);
			return;
		}
		$('#curr_score').html(data.gradeAvg);
		$('.rec_words').html(recLevel(data.gradeAvg));
		renderStar(  $('#schedule-star img'),(data.gradeSchedulingAvg)  );
		renderStar(  $('#guide-star img'),(data.gradeGuideAvg)  );
		renderStar(  $('#leader-star img'),(data.gradeLeaderServiceAvg)  );
		renderStar(  $('#desc-star img'),(data.gradeDescribeAvg)  );
	};

	var getRankList = function() { //获取列表
		var url=absUrl+'/api/comment/getCommentListByObjId',
			data= {
				objId:tid,
				objType:"3",//0民宿3旅行
				objSubType:item_type,
				pageNum:1,
				pageSize:10
			};
		ajaxFn(url,data,ongetRankListSuccess);
	};


	var ongetRankListSuccess = function(res) {
		console.log(res);
	};

	var recLevel = function(num) { //依据分数导出对应的推荐性文字描述
		var str = '';
		if(num<2&&num>=1) {
			str = '非常差';
		}else if(num<3&&num>=2) {
			str='不推荐';
		}else if(num<4&&num>=3) {
			str='一般般';
		}else if(num<4.5&&num>=4) {
			str='值得体验';
		}else if(num<=5&&num>=4.5) {
			str='强烈推荐';
		}
		return str;
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

	function ajaxFn(url,data,fnName) {
		$.ajax({
			url:url,
			data:JSON.stringify(data),
			type:'POST',
			contentType:'application/json;charset=UTF-8',
			success:fnName,
			error:function(xhr) {
				console.log(xhr,'ajax error',);
			}
		})
	}
























































	initList();
})

window.onload = function() {
	initPhotoSwipeFromDOM('.cnt_pic_wp');//应该修改位置

}