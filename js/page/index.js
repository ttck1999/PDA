function loginBtn(){
	if (jvForm.useraccount.value==""){     
			$(".login_tips").eq(0).css("visibility","visible")
			return false;
	}else if (jvForm.password.value==""){	
			$(".login_tips").eq(1).css("visibility","visible")     
			return false;
	}
	jvForm.password.value=hex_md5(jvForm.password.value);

	$.ajax({
	   type: "post",
	   url: pathUrl()+"/spd-sys/admin/spd/pdaLogin",
	   data: {"useraccount":$("#useraccount").val(),"password":$("#password").val()},
	   dataType: 'json'
    }).success(function(res) {
		sessionStorage.setItem("PADSESSION", res.PADSESSION); 
	
		if(res.code == 200){
			$(".login_tips").eq(0).css("visibility","hidden")
			$(".login_tips").eq(1).css("visibility","hidden")
			window.location.href="page/memu.html"
		}else{
			$(".login_tips").eq(0).text(res.msg);
			$(".login_tips").eq(1).text(res.msg);
			$(".login_tips").eq(0).css("color","red")
			$(".login_tips").eq(0).css("visibility","visible")
			$(".login_tips").eq(1).css("color","red")
			$(".login_tips").eq(1).css("visibility","visible")
		}
    }).error(function(err){
			if($('#toast-container').html() == null || $('#toast-container').html() == ''){
				toastr.warning('失败!')
			}
    }) 
}
function remUser(){
	localStorage.setItem("useraccount", $("#useraccount").val());
}
function remPsw(){
	if(localStorage.getItem("checked") == "true"){
		localStorage.setItem("password", $("#password").val());
	}else{
		localStorage.setItem("password", "");
	}
}

// 勾选记住密码
function changeIcon(){
	if($(".unchecked").attr("src") == "./imgs/checked.png"){
	   $(".unchecked").attr("src","./imgs/unchecked.png");
	   
	   localStorage.setItem("checked", "false");
	   localStorage.setItem("password", "");
	 }else{
		localStorage.setItem("checked", "true");
		localStorage.setItem("password", $("#password").val());
		
		$(".unchecked").attr("src","./imgs/checked.png");
		$("#useraccount").val(localStorage.getItem("useraccount"))
		$("#password").val(localStorage.getItem("password"))
	 }
	
}
$(function() {
	// 记住密码
	if(localStorage.getItem("checked") == "true"){
		$(".unchecked").attr("src","./imgs/checked.png");
		$("#useraccount").val(localStorage.getItem("useraccount"))
		$("#password").val(localStorage.getItem("password"))
	}else{
		$(".unchecked").attr("src","./imgs/unchecked.png");
		 $("#useraccount").val(localStorage.getItem("useraccount"))
		$("#password").val("")
	}
	
	$("#useraccount").blur(function(){
		 if (jvForm.useraccount.value==""){
			 $(".login_tips").eq(0).css("visibility","visible")
		 }else{
			 $(".login_tips").eq(0).css("visibility","hidden")
		 }
		 
	});
	$("#password").blur(function(){
		if (jvForm.password.value==""){
	    $(".login_tips").eq(1).css("visibility","visible")
		}else{
			$(".login_tips").eq(1).css("visibility","hidden")
		}
	})
	
	
	toastr.options = {
		"closeButton": false, //是否显示关闭按钮
		"debug": false, //是否使用debug模式
		"positionClass": "toast-center-center",//弹出窗的位置
		"showDuration": "300",//显示的动画时间
		"hideDuration": "1000",//消失的动画时间
		"timeOut": "1000", //展现时间
		"extendedTimeOut": "1000",//加长展示时间
		"showEasing": "swing",//显示时的动画缓冲方式
		"hideEasing": "linear",//消失时的动画缓冲方式
		"showMethod": "fadeIn",//显示时的动画方式
		"hideMethod": "fadeOut" //消失时的动画方式
	};
});