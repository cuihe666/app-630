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
		picHead = 'http://img.tgljweb.com/',//七牛前缀路径
		allTopH = 0,//选项卡头部吸顶时的临界条件
		mtH=0,//tab体需要顶上去的高度
		headerTop,//选项卡吸顶时的top值
		PsArr = [],
		foldArr = [],
		Gdata = {'objId': tid, 'objType': '3','pageNum': 1,'pageSize': 10,'objSubType':item_type,'tab':''},
	    tabNum = {'0':1,'1':1,'2':1,'3':1,'4':1},
	    scrollP = {'0':0,'1':0,'2':0,'3':0,'4':0},
	    tabType = {0:'',1:'1',2:'2',3:'4',4:'3'};
		


	var initList = function() {
		solveIosHead();
		initTopH();
		bindEvent();
		zcTab();
		getStarLevel();
		// getRankList();
	};

	var bindEvent = function() {
		$('.tab_content_wp').on('tap','.fold_wp',onFoldWpTap);
		$('.goback').on('tap',onGobackTap);
		//$(window).on('scroll',onWinScroll);
	};

	var onGobackTap = function() {
		history.go(-1);
	};

	var onWinScroll = function(ev) {
		var winY = window.scrollY;
		if(winY>=allTopH) {
			$('.tab_header_wp').addClass('fixed').css('top',headerTop);
			$('.tab_content_wp').css('marginTop',mtH);
		}else {
			$('.tab_header_wp').removeClass('fixed');
			$('.tab_content_wp').css('marginTop',0);
		}
	};

	var initTopH = function() {
		allTopH =$('.star_info_wp ').height() + $('.background_div').height();
		mtH = $('.tab_header_wp').height();
		headerTop = $('#pt_wp').height();
	};

	var onFoldWpTap = function() {
		var $this = $(this);
		$this.find('.fold_icon').toggleClass('up');
		$this.parents('.cnt_cnt').find('.may_hidden').toggleClass('hide');
		if($this.parents('.cnt_cnt').find('.may_hidden').hasClass('hide')) {
			$this.find('.fold_words').html('展开');
		}else {
			$this.find('.fold_words').html('收起');
		}
		
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

	function renderList(res) {
		console.log(res);
		var data=res.pageInfo.list,
			currArr=[];
		tabNum[itemIndex]++;
		if(data.length<=0) { //没有数据
			dataEnd();
			dpload.noData(true);
			dpload.lock();
		}else {
			$.each(data,function(i,obj) {
				foldArr.push('zhch'+obj.commentId);
				currArr.push(
					'<div class="evy_cnt_wrap  zhch'+obj.commentId+'" >',//id=zc'+obj.commentId+' 
						'<div class="cnt_top clearfix">',
							'<div class="u_name">'+(obj.nickname||obj.nickName)+'</div>',
							ifJH(obj.quintessence),
							'<div class="cnt_star_wp">',
								'<ul class="ul_img_wp  clearfix">',
									forStar(obj.grade),
								'</ul>',
								'<span class="star_score">'+gradeScore(obj.grade)+'</span>'	,
							'</div>',
						'</div>',
						'<div class="cnt_cnt">',
							'<div class="may_hidden hide">',
								'<div class="cnt_content">',
									obj.content,
								'</div>',
							'</div>	',
							'<div class="fold_outer clearfix">',
								'<div class="fold_wp">',
									'<span class="fold_words">展开</span>',
									'<span class="fold_icon">',
										'<img src="../img/fold_icon.png">',
									'</span>',
								'</div>',
							'</div>',
						'</div>',
						renderPic(obj.picList,obj.commentId),
						'<div class="cnt_time">'+getLocalTimeByMs(obj.createTime)+'</div>',
					'</div>'
				)
			});
			ifUpFresh(currArr);
		};
		dpload.resetload();

	};

	function ifJH(num) {
		if(num==1) {
			return '<div class="if_good">精品点评</div>';
		}else if(num==0) {
			return '';
		}
	}

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
			$('#tab_contenet .tbody').eq(itemIndex).html(arr.join(''));
			dataStart();

		}else {
			$('#tab_contenet .tbody').eq(itemIndex).append(arr.join(''));
		}
		initFold(foldArr);
		initPS(PsArr);
		PsArr = [];
		foldArr = [];
	}

	var renderPic = function(arr,id) {
		var tmpArr = [];
		var len = arr.length;
		if(len===0) {
			return '';
		}else {
			PsArr.push('zc'+id);//存放当前项的id
			tmpArr.push(
				'<div class="cnt_img ">',
					'<div class="cnt_pic_wp zc'+id+' clearfix" id=zc'+id+'>'
			)
			$.each(arr, function(i, val) {
				if(len<5) {
					tmpArr.push( currStr(val) );
				}else if(len>=5) {
					if(i<3||i>3) {
						tmpArr.push( currStr(val) );
					}else if(i==3) {
						tmpArr.push( 
							'<figure class="evy_pic">',
								'<div class="img-dv">',
									'<a href='+(picHead+val)+'>',
										'<img src='+(picHead+val)+'>',
									'</a>',
								'</div>',
								'<div class="img_still show_out">',
									'<div class="masker position"></div>',
									'<div class="img_count position">+'+(len-4)+'</div>',
								'</div>',
							'</figure>'
						);
					}
				}
			});
			tmpArr.push(
				'</div>',
			'</div>'
			)
			return tmpArr.join('');
		};

		function currStr(src) {
			var arr = [];
			arr.push(
				'<figure class="evy_pic">',
					'<div class="img-dv">',
						'<a href='+(picHead+src)+'>',
							'<img src='+(picHead+src)+'>',
						'</a>',
					'</div>',
				'</figure>'
			)
			return arr.join('');
		}
	};

	var gradeScore = function(num) {
		if(num==1||num==2||num==3||num==4||num==5) {
			return num+'.0分';
		}else {
			return num+'分';
		}
	};

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
		$('#curr_score').html((data.gradeAvg).toFixed(1));
		$('.rec_words').html(recLevel(data.gradeAvg));
		$('#total_marks').html(data.total);
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

	var initPhotoSwipeFromDOM = function(gallerySelector) {
        // 解析来自DOM元素幻灯片数据（URL，标题，大小...）
        var parseThumbnailElements = function(el) {
            var thumbElements = el.childNodes,
                numNodes = thumbElements.length,
                items = [],
                figureEl,
                linkEl,
                size,
                item,
                divEl;
            for(var i = 0; i < numNodes; i++) {
                figureEl = thumbElements[i]; // <figure> element
                // 仅包括元素节点
                if(figureEl.nodeType !== 1) {
                    continue;
                }
                divEl = figureEl.children[0];
                linkEl = divEl.children[0]; // <a> element
                size = linkEl.getAttribute('data-size').split('x');
                // 创建幻灯片对象
                item = {
                    src: linkEl.getAttribute('href'),
                    w: parseInt(size[0], 10),
                    h: parseInt(size[1], 10)
                };
                if(figureEl.children.length > 1) {
                    item.title = figureEl.children[1].innerHTML;
                }
                if(linkEl.children.length > 0) {
                    // <img> 缩略图节点, 检索缩略图网址
                    item.msrc = linkEl.children[0].getAttribute('src');
                }
                item.el = figureEl; // 保存链接元素 for getThumbBoundsFn
                items.push(item);
            }
            return items;
        };

        // 查找最近的父节点
        var closest = function closest(el, fn) {
            return el && ( fn(el) ? el : closest(el.parentNode, fn) );
        };

        // 当用户点击缩略图触发
        var onThumbnailsClick = function(e) {
            e = e || window.event;
            e.preventDefault ? e.preventDefault() : e.returnValue = false;
            var eTarget = e.target || e.srcElement;
            var clickedListItem = closest(eTarget, function(el) {
                return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
            });
            if(!clickedListItem) {
                return;
            }
            var clickedGallery = clickedListItem.parentNode,
                childNodes = clickedListItem.parentNode.childNodes,
                numChildNodes = childNodes.length,
                nodeIndex = 0,
                index;
            for (var i = 0; i < numChildNodes; i++) {
                if(childNodes[i].nodeType !== 1) {
                    continue;
                }
                if(childNodes[i] === clickedListItem) {
                    index = nodeIndex;
                    break;
                }
                nodeIndex++;
            }
            if(index >= 0) {
                openPhotoSwipe( index, clickedGallery );
            }
            return false;
        };

        var photoswipeParseHash = function() {
            var hash = window.location.hash.substring(1),
                params = {};
            if(hash.length < 5) {
                return params;
            }
            var vars = hash.split('&');
            for (var i = 0; i < vars.length; i++) {
                if(!vars[i]) {
                    continue;
                }
                var pair = vars[i].split('=');
                if(pair.length < 2) {
                    continue;
                }
                params[pair[0]] = pair[1];
            }
            if(params.gid) {
                params.gid = parseInt(params.gid, 10);
            }
            return params;
        };

        var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
            var pswpElement = document.querySelectorAll('.pswp')[0],
                gallery,
                options,
                items;
            items = parseThumbnailElements(galleryElement);
            // 这里可以定义参数
            options = {
                barsSize: {
                    top: 100,
                    bottom: 100
                },
                fullscreenEl : false,
                shareButtons: [
                    {id:'wechat', label:'分享微信', url:'#'},
                    {id:'weibo', label:'新浪微博', url:'#'},
                    {id:'download', label:'保存图片', url:'{{raw_image_url}}', download:true}
                ],
                galleryUID: galleryElement.getAttribute('data-pswp-uid'),
                getThumbBoundsFn: function(index) {
                    var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                        pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                        rect = thumbnail.getBoundingClientRect();
                    return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
                }
            };
            if(fromURL) {
                if(options.galleryPIDs) {
                    for(var j = 0; j < items.length; j++) {
                        if(items[j].pid == index) {
                            options.index = j;
                            break;
                        }
                    }
                } else {
                    options.index = parseInt(index, 10) - 1;
                }
            } else {
                options.index = parseInt(index, 10);
            }
            if( isNaN(options.index) ) {
                return;
            }
            if(disableAnimation) {
                options.showAnimationDuration = 0;
            }
            gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
            gallery.init();
        };

        var galleryElements = document.querySelectorAll( gallerySelector );
        for(var i = 0, l = galleryElements.length; i < l; i++) {
            galleryElements[i].setAttribute('data-pswp-uid', i+1);
            galleryElements[i].onclick = onThumbnailsClick;
        }
        var hashData = photoswipeParseHash();
        if(hashData.pid && hashData.gid) {
            openPhotoSwipe( hashData.pid ,  galleryElements[ hashData.gid - 1 ], true, true );
        }
    };

	function ajaxFn(url,data,fnName) {
		$.ajax({
			url:url,
			data:JSON.stringify(data),
			type:'POST',
			contentType:'application/json;charset=UTF-8',
			success:fnName,
			error:function(xhr) {
				console.log(xhr,'ajax error');
			}
		})
	}

	function initPS(arr) {//1、在实例化之前给每个a添加自定义属性data-size,2、实例化
		$.each(arr, function(index, val) {
			var $as = $('.'+val).find('a');
			$.each($as, function(index, val) {
				var img = new Image();
				img.src=val.href;
				img.onload = function() {
					var dataSize = this.width+'x'+this.height;
					$(val).attr('data-size',dataSize);
				}
			});
			initPhotoSwipeFromDOM('.'+val);
		});
	}

	function initFold(arr) { //如果评论内容的高度大于外层容器的高度（两行），则将展开按钮显示出来
		$.each(arr, function(index, val) {
			// var $wp=$('.'+val);
			// $.each($wp, function(index, val) {
			// 	var cntHeight = $(val).find('.cnt_content').height();
			// 	var mayHideHeight =  $(val).find('.may_hidden').height();
			// 	if(cntHeight>mayHideHeight) {
			// 		$(val).find('.fold_outer').addClass('show_out');
			// 	}
			// });
			var cntHeight = $('.ul_bwp>li').eq(itemIndex).find('.'+val).find('.cnt_content').height();
			var mayHideHeight = $('.ul_bwp>li').eq(itemIndex).find('.'+val).find('.may_hidden').height();
			if(cntHeight>mayHideHeight) {
				 $('.ul_bwp>li').eq(itemIndex).find('.'+val).find('.fold_outer').addClass('show_out');
			}
		
		});
	}




	initList();
})
window.onload = function() {
	
	
}
// window.onload = function() {
// 	initPhotoSwipeFromDOM('.cnt_pic_wp');//应该修改位置

// }