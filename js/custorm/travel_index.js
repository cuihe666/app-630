/**
 * Created by Administrator on 2017/6/17 0017.
 */
//旅行首页
Zepto(document).ready(function() {
window.onload=function(){
    var http_url = serveUrl();
    var uid = zcGetAndSetUid();
    // var citycode = zcGetLocationParm('currCityCode');//城市码
    var citycode = zcGetAndSetcityCode();//城市码
    //console.log(citycode)
	//var citycode2 = zc_store.get("citycode2");
    //var theme_top = 500;
    //var activity_top = 800;
    //var note_top = 1000;
    //var imp_top = 1200;
    // var citycode = zcGetLocationParm('city_code');//城市码
    // var citycode = 110100;

    var len=0; // 主题线路城市个数
    var f=0; // 主题线路城市下内容宽度
    var list_json = { //列表接口所需的json,需转换
        'citycode':citycode // 城市码

    };
    var initList = function() {
        bindEvt();
        banners(); //轮播图
        citylist();
        getActList(list_json);//  活动
        notelist(); //游记
		implist(); //印象
		checkIos();
		removeListData();
		rmPageFrom();
    }
	var checkIos = function () {
		var u = navigator.userAgent;
		var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
		if(isIOS){
			$(".h_top").css("padding-top","20px");
			$(".glass_fixed_wp").css("padding-top","20px");
		}
	};

    var bindEvt = function () {

        $(document).on('scroll',onWinScroll); // 滚动事件
        $(".glass_fixed_ul").on("tap","li",glassFixedClick); // 固定位置项目点击
        $('.tab_theme_title').on("tap","li",themeCityChange) // 主题城市点击切换
        $(".goback").on("tap",goBackIndex); //goback
        $(".glass_index").on("tap","li.theme",lineItemClick);// 主题线路
        $(".glass_index").on("tap","li.activity",actItemClick); //当地活动
        $(".glass_index").on("tap","li.guide",guideItemClick); //当地活动
        $(".glass_index").on("tap","li.note",noteItemClick);//游记
        $(".glass_index").on("tap","li.impression",impItemClick); //印象

		$(".theme_more ").on("tap",lineItemClick);// 主题线路
		$(".act_more").on("tap",actItemClick); //当地活动
		$(".note_more ").on("tap",noteItemClick);//游记
		$(".imp_more ").on("tap",impItemClick); //印象

		$(".tab_theme_box_wrap ").on("click",".swiper-slide",themeDetail);
		$(".swiper-container_act ").on("click",".swiper-slide",actDetail);
		$(".swiper-container_note ").on("click",".swiper-slide",noteDetail);
		$(".imp_list  ").on("click",".evy_imp_wp ",impDetail);
		$(".imp_item_box_f").on("click",impDetail);
		$(".note_item_first ").on("click",noteDetail);
		$(".swiper-container").on("click",".swiper-slide",bannerClick);
		$(".tab_theme_box_wrap").on("click",".morethan",moreThan);


    }

    var removeListData = function() {
		zc_store.remove('pageDataJson');
		zc_store.remove('currScrollTop');
		zc_store.remove('currTapCityCode');
		zc_store.remove('currTapListJson');
	};
	var moreThan = function () {
		var citycode = $(this).parents(".swiper-container_theme").attr("citycode");
		city_name = $(".tab_theme_title li.current").html();
		zc_store.set('city_name', city_name);
		window.location.href="theme_line.html?city_code="+citycode+"&city_name=true";

	}
	var bannerClick = function () { // banner连接
		var imgurl = $(this).attr("imgurl");
		window.location.href=imgurl;
	}
	var themeDetail = function(){
		var tid = $(this).attr("themeid");
		window.location.href = "theme_detail.html?tid="+tid+"&item_type=3&from_app=travel_index.html";
	}
	var actDetail = function(){
		var tid = $(this).attr("actid");
		window.location.href = "local_activity_detail.html?tid="+tid+"&item_type=2&from_app=travel_index.html";
	}
	var noteDetail = function(){
		var tid = $(this).attr("noteid");
		window.location.href = "note_detail.html?tid="+tid+"&item_type=8&from_app=travel_index.html";
	}
	var impDetail = function(){
		var tid = $(this).attr("impid");
		window.location.href = "impression_detail.html?tid="+tid+"&item_type=7&from_app=travel_index.html";
	};
	var goToUrl = function(url) {
    	if(!citycode||citycode=='null') {
    		window.location.href = 'city_list.html?goBackUrl='+url+'';
    	} else {
    		window.location.href = ""+url+"?city_code="+citycode+"";
    	}
    };
    var lineItemClick = function(){
    	goToUrl('theme_line.html');
    	// if(!citycode||citycode=='null') {
    	// 	window.location.href = 'city_list.html?goBackUrl=theme_line.html';
    	// } else {
    	// 	window.location.href = "theme_line.html?city_code="+citycode+"";
    	// }
    }
    var actItemClick = function(){
    	goToUrl('local_activity_list.html');
    		// window.location.href = "local_activity_list.html";
    }
    var guideItemClick = function() {
    	goToUrl('local_guide_list.html');
    }
    var noteItemClick = function(){
    	goToUrl('note.html');
    		// window.location.href = "note.html";
    }
    var impItemClick = function(){
    	goToUrl('impression.html');
    		// window.location.href = "impression.html";
    }
    var goBackIndex = function () {
			applyAppDetailGoback();
    }

	var banners = function() { // banner
		var url = http_url+'/api/travelhomepage/title';
		$.ajax({
			url:url,
			type:"GET",
			// dataType:'jsonp',
			success:function(res) {
				var data;
				var imgstr='';
				// console.log(res);
				if(res.code=='0') {
					data = res.data;
					//console.log(data)
					$.each(data,function(index, obj) {
						//console.log(obj)
						imgstr+= '<div class="swiper-slide" imgurl='+obj.imgurl+'><img src='+obj.imgs+' alt="" /></div>'
						//console.log(imgstr)

					});
					$(imgstr).appendTo('.swiper-container .swiper-wrapper');
					var banner_index = new Swiper('.swiper-container', {
						autoplay: 5000,//可选选项，自动滑动
						loop: true,
						observer: true,//修改swiper自己或子元素时，自动初始化swiper
						observeParents: true,//修改swiper的父元素时，自动初始化swiper
						pagination: '.swiper-pagination'
					});
				}else {
					console.log('error');
				}
			},
			error:function(xhr) {
				console.log('ajax error');
			}
		})
	};
//获取城市列表
	var citylist = function() { // citylist
		var url = http_url+'/api/travelhomepage/higocity';
		$.ajax({
			url:url,
			type:"GET",
			// dataType:'jsonp',
			success:function(res) {
				//console.log(res)
				var data;
				var citystr='';
				var themestr='';
//				console.log(res);
				if(res.code=='0') {
					data = res.data;
					list_json.citycode = data[0].citycode;  // 默认第一个城市
					//alert(list_json.citycode)
					//console.log(data)
					$.each(data,function(index, obj) {
//						console.log(obj)
						citystr+= '<li citycode='+obj.citycode+'>'+obj.cityname+'</li>';
						themestr+='<div class="swiper-container_theme swiper-container_theme'+index+'" citycode='+obj.citycode+' ><div class="swiper-wrapper clearfix"></div></div>';
					});
					$(themestr).appendTo('.tab_theme_box_wrap');
					$(citystr).appendTo('.tab_theme_title');
					$(".tab_theme_title li:first").addClass("current");
					var sonlen =  $('.tab_theme_title li').length; //主题线路城市个数
					//alert(sonlen)
					$(".tab_theme_box_wrap").width(sonlen*100+"%");
					$(".swiper-container_theme").width(100/sonlen+"%");
					getLineList(list_json);//获取线路列表

				}else {
					console.log('error');
				}
			},
			error:function(xhr) {
				console.log('ajax error');
			}
		})
	};
    var getLineList = function(json_data) { // 主题线路列表数据
        var ajax_url = http_url+'/api/travelhomepage/higolist';
      //console.log(json_data);
//      ajax_data_str = JSON.stringify(json_data);
//		console.log(ajax_data_str)
        $.ajax({
            url:ajax_url,
            data:json_data,
            type:'GET',
//          contentType:"application/json;charset=UTF-8",
            success:function(res){
                onGetLineListSuccess(res);
            },
            error:function(xhr) {
                console.log('ajax error');
            }
        });

        function onGetLineListSuccess(res) { //线路
          //console.log(res);
            var data = [];
            var list_arr = [];
            if(res.code=='0') {
                data = res.data;
				//console.log(data)
                if(data.length==0) {  //TODO
                    return;
                }
                $.each(data,function(index, obj) {
                    var tags_arr = obj.tag;
					var oname = obj.name;
					if(oname.length>18){
						oname = oname.substr(0,19)+" ...";
					}
                     list_arr.push(
                     	'<div class="swiper-slide" themeid = '+obj.higoId+'>',
						'<img src='+obj.titlePic+' alt="" />',
						'<p class="title">'+oname+'</p>',
					 	'<div class="mpt clearfix">',
						'<ul class="slogan fl">'
					);
					$.each(tags_arr,function(ix,it) {
						list_arr.push('<li>'+it+'</li>');
					});
					list_arr.push(
						'</ul>',
						'<p class="price fr">¥'+obj.price+'</p>',
						'</div>',
					'</div>'

                    );
                });
				var li_len = $(".tab_theme_title  li").length;
				//alert(li_len)
				for(var i=0;i<li_len;i++){
					$('.swiper-container_theme'+i+' .swiper-wrapper').html(list_arr.join('')).append('<div class="morethan">更多&gt;&gt;</div>');//填充列表数据
					// 主题线路
					var theme_activity= new Swiper('.swiper-container_theme'+i, {
						loop: false,
						observer: true,//修改swiper自己或子元素时，自动初始化swiper
						observeParents: true,//修改swiper的父元素时，自动初始化swiper
						freeMode: true,
						slidesPerView : 2.3,
						slidesOffsetAfter :48,
						slidesOffsetBefore : 15,
						spaceBetween : 10
					});
				}
            } else {
                console.log('what ??');
                // zcThmLimeDropload.resetload();

            }
        }
    };


    var getActList = function(json_data) { // 活动列表数据
        var ajax_url = http_url+'/api/travelhomepage/actlist';
//      console.log(json_data);
//      ajax_data_str = JSON.stringify(json_data);
//		console.log(ajax_data_str)
        $.ajax({
            url:ajax_url,
            data:json_data,
            type:'GET',
//          contentType:"application/json;charset=UTF-8",
            success:function(res){
                onGetActListSuccess(res);
            },
            error:function(xhr) {
                console.log('ajax error');
            }
        });

        function onGetActListSuccess(res) { //活动
          //console.log(res,2222);
            var data = [];
            var list_arr = [];
            if(res.code=='0') {
                data = res.data;
				console.log(data)

				if(data.length==0) {  //TODO
                    return;
                }else{

					//console.log(data)
					$.each(data,function(index, obj) {
						if(index>2){
							return;
						}
						var tags_arr = obj.tag;
						list_arr.push(
							'<div class="swiper-slide" actId = '+obj.actId+'>',
							'<img src='+obj.titlePic+' alt="" />',
							'<p class="title">'+obj.name+'</p>',
							'<div class="act_slogan_box clearfix">',
							'<ul class="slogan fl">'
						);
						$.each(tags_arr,function(ix,it) {
							list_arr.push('<li>'+it+'</li>');
						});
						list_arr.push(
							'</ul>',
							'<p class="price">¥'+obj.price+'</p>',
							'</div>',
							'</div>'
						);
					});
					$('.swiper-container_act .swiper-wrapper').append(list_arr.join(''));//填充列表数据
					var activity_swiper = new Swiper('.swiper-container_act', {
						loop: false,
						observer: true,//修改swiper自己或子元素时，自动初始化swiper
						observeParents: true,//修改swiper的父元素时，自动初始化swiper
						freeMode: true,
						slidesPerView : 1.515,
						//				slidesOffsetAfter :48,
						slidesOffsetBefore : 15,
						spaceBetween : 10

					})
				}

            } else {
                console.log('what ??');
                // zcThmLimeDropload.resetload();

            }
        }
    };
//获取游记列表
	var notelist = function() { // notelist
		var url = http_url+'/api/travelhomepage/notelist';
		$.ajax({
			url:url,
			type:"GET",
			// dataType:'jsonp',
			success:function(res) {
				var data;
				var notestr=[];
				// console.log(res);
				if(res.code=='0') {
					data = res.data;
					//console.log(data);
					$(".note_item_first").css("background-image","url("+data[0].pic+")").attr("noteId",data[0].noteId);
					$(".note_item_box_f p").html(data[0].name);
					$(".note_item_box_f .see").html(data[0].readCount);
					$(".note_item_box_f .zan").html(data[0].praiseCount);
					data.splice(0,1);
//					console.log(data)
					$.each(data,function(index, obj) {
						notestr.push(
							'<div class="swiper-slide" noteId = '+obj.noteId+'>',
								'<img src='+obj.pic+' alt="" />',
								'<p class="title">'+obj.name+'</p>',
								'<div class="see_box clearfix"><span class="zan fr">'+obj.praiseCount+'</span><span class="see fr">'+obj.readCount+'</span></div>',
							'</div>'
						);
					});
					$('.swiper-container_note .swiper-wrapper').html(notestr.join(''));
//		游记攻略
			var note_swiper = new Swiper('.swiper-container_note', {
				loop: false,
				observer: true,//修改swiper自己或子元素时，自动初始化swiper
				observeParents: true,//修改swiper的父元素时，自动初始化swiper
				freeMode: true,
				slidesPerView : 2.675,
//				slidesOffsetAfter :48,
				slidesOffsetBefore : 15,
				spaceBetween : 10
			})
				}else {
					console.log('error');
				}
			},
			error:function(xhr) {
				console.log('ajax error');
			}
		})
	};

//印象列表
	var implist = function() { // implist
		var url = http_url+'/api/travelhomepage/implist';
		$.ajax({
			url:url,
			type:"GET",
			// dataType:'jsonp',
			success:function(res) {
				var data;
				var impstr=[];
//				console.log(res);
				if(res.code=='0') {
					data = res.data;
					//console.log(data);
					$(".imp_item_box_f img").attr("src",data[0].pic);
					$(".imp_item_box_f").attr("impId",data[0].impId);
					$(".imp_item_box_f .title").html(data[0].name);
					$(".imp_item_box_f .description").html(data[0].des);
					$(".imp_item_box_f .see").html(data[0].readCount);
					$(".imp_item_box_f .zan").html(data[0].goodCount);
					data.splice(0,1);
					//console.log(data)
					$.each(data,function(index, obj) {
						if(index>1){ // 只显示两条
							return;
						}
						impstr.push(
							'<div class="evy_imp_wp clearfix" impId = '+obj.impId+'>',
							'<div class="pic_wp fl"><img src='+obj.pic+'></div>',
							'<div class="itm_scan_wp fl">',
								'<p class="itm_title">'+obj.name+'</p>',
								'<p class="detail">'+obj.des+'</p>',
								'<div class="see_box"><span class="see">'+obj.readCount+'</span><span class="zan">'+obj.goodCount+'</span></div>',
							'</div>',
						'</div>'
						);
					});
					$('.imp_list').html(impstr.join(''));
				}else {
					console.log('error');
				}
			},
			error:function(xhr) {
				console.log('ajax error');
			}
		})
	};


    var onWinScroll = function() { // 滚动页面切换主题
        var theme_top = $(".theme_i").offset().top;
		var activity_top = $(".activity_i").offset().top;
		var note_top = $(".note_i").offset().top;
		var imp_top = $(".imp_i").offset().top;
		if ($("body").scrollTop() >= theme_top-100) {
			$(".glass_fixed_wp").show();
			$(".glass_fixed_ul>li").eq(0).addClass("active").siblings("li").removeClass("active");
		}else{
			$(".glass_fixed_wp").hide();
		}
		if ($("body").scrollTop()>=activity_top-100){
			$(".glass_fixed_ul>li").eq(1).addClass("active").siblings("li").removeClass("active");
		}
		if ($("body").scrollTop()>=note_top-100){
			$(".glass_fixed_ul>li").eq(2).addClass("active").siblings("li").removeClass("active");
		}
		if ($("body").scrollTop()>=imp_top-100){
			$(".glass_fixed_ul>li").eq(3).addClass("active").siblings("li").removeClass("active");
		}
        if ($("body").scrollTop() >= 88) { // goback 按钮隐藏
            $(".goback").hide();
        }else{
            $(".goback").show();
        }

    }
    var glassFixedClick = function () { // 定位导航点击切换项目
        var theme_top = $(".theme_i").offset().top;
        var activity_top = $(".activity_i").offset().top;
        var note_top = $(".note_i").offset().top;
        var imp_top = $(".imp_i").offset().top;
        var index = $(this).index();
        //$(this).addClass("active").siblings("li").removeClass("active");
        var toparr = [theme_top-50,activity_top-50,note_top-50,imp_top-50];
        $("body").scrollTo({toT:toparr[index]});
    }

    var themeCityChange = function(){
		var citycode = $(this).attr("citycode");
        var t=$(this).index();
        var wh=$('.line').width();
		var len = $(".tab_theme_title li").length;
        f=-(100/len)*t+"%";
		//console.log(t,123,f,12313131233,len)
		var ajax_url = http_url+'/api/travelhomepage/higolist';
		$.ajax({
			url:ajax_url,
			data:{citycode:citycode},
			type:'get',
//          contentType:"application/json;charset=UTF-8",
			success:function(res){
				//alert(res)
				onGetLineSuccess(res);
			},
			error:function(xhr) {
				console.log('ajax error');
			}
		});

		$('.tab_theme_box_wrap').css({'-webkit-transform':'translate('+f+')','-webkit-transition':'500ms linear'} );
        $(this).siblings().removeClass('current');
        $(this).addClass('current');
		function onGetLineSuccess(res) { //线路
			//console.log(res);
			var data = [];
			var list_arr = [];
			if(res.code=='0') {
				data = res.data;
				if(data.length==0) {  //TODO
					return;
				}
				$.each(data,function(index, obj) {
					//console.log(index)
					var tags_arr = obj.tag;
					list_arr.push(
						'<div class="swiper-slide" themeid = '+obj.higoId+'>',
						'<img src='+obj.titlePic+' alt="" />',
						'<p class="title">'+obj.name+'</p>',
						'<div class="mpt clearfix">',
						'<ul class="slogan fl">'
					);
					$.each(tags_arr,function(ix,it) {
						if(ix>1){return;}
						list_arr.push('<li>'+it+'</li>');
					});
					list_arr.push(
						'</ul>',
						'<p class="price fr">¥'+obj.price+'</p>',
						'</div>',
					'</div>'
					);
				});
				//alert(t)
				$('.swiper-container_theme'+t).find(".swiper-wrapper").html("");
				$('.swiper-container_theme'+t).find(".swiper-wrapper").append(list_arr.join('')).append('<div class="morethan">更多&gt;&gt;</div>');//填充列表数据
				$('.swiper-container_theme'+t).find(".swiper-wrapper").find(".swiper-slide:last-child").css({"width":"100px !important","border":"2px solid red"})
			} else {
				console.log('what ??');
				// zcThmLimeDropload.resetload();

			}
		}
    }

    initList();


}
})
