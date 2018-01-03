Zepto(document).ready(function() {
	var http_url = serveUrl();
	var uid = zcGetAndSetUid();
	var dauid = zcGetLocationParm('dauid');


	var list_json = { //列表接口所需的json,需转换
		'uid':dauid
	};

	var initList = function() {
		bindEvt();
		getLineList(list_json);//获取列表
		checkIos(); // 检查ios top 20px
		rmPageFrom();
	};
	var checkIos = function () {
		var u = navigator.userAgent;
		var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
		if(isIOS){
			$(".h_top").css("padding-top","20px");
			$(".act_list_wp").css("margin-top","3.1rem");
		}
	}

	var bindEvt = function() {
		$('.dropload_list_wp').on('tap','.evy_act_wp',onEvyThmTap);//点击进入详情页
		$('.header').on('click','.goback',onGoDaren);//点击回到达人页
		
	};

	var onEvyThmTap = function() { //TODO跳转至详情页
		var tid = $(this).attr('data-id');
		//console.log(tid);
		window.location.href = 'local_activity_detail.html?tid='+tid+'&item_type=2&from_app=master_activity.html&dauid='+dauid+'';
	};

	var onGoDaren = function(){
		//window.location.href = 'master.html?druid='+druid+'';
		window.history.go(-1)
	}
	var getLineList = function(json_data,zc_dropload) { //TODO
		var ajax_url = http_url+'/api/theme/actlist';
		$.ajax({
			url:ajax_url,
			data:json_data,
			type:'get',
			contentType:"application/json;charset=UTF-8",
			success:onGetLineListSuccess,
			error:function(xhr) {
				console.log('ajax error');
			}
		});

		function onGetLineListSuccess(res) {
			//console.log(res);
			var data = [];
			var list_arr = [];
			if(res.code=='0') {
				data = res.data;
				if(data.length==0) {  //TODO
					console.log('请求成功但是没有数据');
					return;
				}
				$.each(data,function(index, obj) {
					var tags_arr = obj.tag;
					list_arr.push(
						'<div class="evy_act_wp" data-id='+obj.actId+'>',
							'<div class="pic_wp"><img src='+obj.titlePic+'></div>',
							'<div class="itm_scan_wp">',
								'<div class="itm_title">'+obj.name+'</div>',
								'<div class="itm_acts clearfix">'
					);
					$.each(tags_arr,function(ix,it) {
						list_arr.push('<span class="evy_act">'+it+'</span>')
					});	
					list_arr.push(
						'</div>',
						'<div class="price_go clearfix">',
//						'<div class="start_place fl">'+obj.startCity+'<span>出发</span></div>',
						'<div class="itm_price fr"><span>￥</span><span class="ml_pric">'+obj.price+'</span><span class="price_word">起</span></div>',
						'</div></div></div>'
					);	
				});
					$('.dropload_list_wp').html(list_arr.join(''));//填充列表数据
				
			} else {
				console.log('what ??')
			}

		}

	};
	initList();
})