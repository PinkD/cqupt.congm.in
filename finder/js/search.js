var students = [],
    htmls;
$(".search-input").keydown(function(e){
    if (e.keyCode == 13) {
        $("#search").trigger('click');
    }
});
$("#search").click(function(){
    search($(".search-input").val());
});
$(".panel-close").click(function(){
    $(".info-box").slideUp("fast");
});
$(".logo").click(function(){
    $(".info-box").slideUp("fast");
    $(".header").removeClass("top");
    $(".list").hide("fast");
});
// 用户信息
(function(){
    window._cqupt_inner_finder = localStorage.getItem('cqupt_inner_finder');
    if(!window._cqupt_inner_finder){
        _cqupt_inner_finder = 0;
    }
    var res = localStorage.getItem('cqupt_inner');
    var cqupt_inner = {};
    if(!res){
        localStorage.setItem('cqupt_inner', JSON.stringify({}));
    }
    try{
        cqupt_inner = JSON.parse(res);
    }catch(error){
        localStorage.setItem('cqupt_inner', JSON.stringify({}));
        cqupt_inner = {};
    }
    // 获取用户信息
    var user_xh = 0,
        user_xh_count = 3;
    if(cqupt_inner.xh_list){
        var xh_list = cqupt_inner.xh_list;
        for(var i in xh_list){
            if(xh_list.hasOwnProperty(i)){
                if(xh_list[i] >= user_xh_count){
                    user_xh = i;
                    user_xh_count = xh_list[i];
                }
            }
        }
    }
    // 查询用户信息
    if(parseInt(user_xh)){
        var request = new XMLHttpRequest();
        request.open('GET', 'https://blues.congm.in/stu.php?searchKey=' + parseInt(user_xh), true);
        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                var data = JSON.parse(request.responseText);
                if(data.total === 1){
                    window._cqupt_inner_user = data.rows[0];
                    _cqupt_inner_user_show();
                }
            }else{
                window._cqupt_inner_user = {};
            }
        };
        request.onerror = function() {
            window._cqupt_inner_user = {};
        };
        request.send();
    }
})();
function _cqupt_inner_user_show(){
    //顶部悬浮提醒框
    var warn = $("#warn"), warn_text = $("#warn-text");
    var s = warn.get(0), si = warn_text.get(0);
    var s_scrollLeft, s_add = 1, tmar;
    //文字滑动
    function mar() {
        if (s.offsetWidth <= si.offsetWidth) {
            s_scrollLeft = s.scrollLeft;
            s.scrollLeft += s_add;
            if (s_scrollLeft == s.scrollLeft) {
                s_add = -s_add;
            }
            tmar = setTimeout(mar, 20);
        }
    }
    //框体升降
    var warnBox = {
        up: function () {
            warn.animate({"top": "-48px"}, "slow");
            clearTimeout(tmar);
        },
        down: function (text) {
            var t = {
                showTime: 500,
                moveTime: 4000,
                totalTime: 15000
            };
            $.each(text, function (i, e) {
                setTimeout(function () {
                    s.scrollLeft = 0;
                    warn_text.html(e);
                    warn.animate({"top": "18px"}, "slow");
                }, t.totalTime * i + t.showTime);
                setTimeout(function () {
                    mar();
                }, t.totalTime * i + t.moveTime);
                setTimeout(function () {
                    warnBox.up();
                }, t.totalTime * i + t.totalTime);
            });
        }
    };
    var warn_text_d = '同学，您好。你已累计进行过' + _cqupt_inner_finder + '次搜索，请谨慎使用Finder！';
    if(_cqupt_inner_user.xm){
        warn_text_d = _cqupt_inner_user.xm + warn_text_d
    }
    var warn_text_array = [warn_text_d];
    warnBox.down(warn_text_array);
}

function search(key){
    if(!key.trim()){
        $(".logo").trigger('click');
        return;
    }
    $(".search-input").val(key);
    htmls = '<tr class="info"><th>#</th><th>学号</th><th>姓名</th><th>性别</th><th>专业</th><th>学院</th><th>年级</th><th>班级</th></tr>';
    $(".header").addClass("top");
    $(".info-box").slideUp("fast");
    $(".list-table tbody").html('<div class="alert alert-warning my-alert">正在查询...</div>');
    $(".list").show("fast");
    $.ajax({
        type: "GET",
        url: "https://blues.congm.in/stu.php?searchKey=" + key,
        success: function(res){
            var count = res.total;
            if(count){
                students = res.rows;
                for(var i = 0; i < count; i++){
                    htmls += '<tr data-id="' + i + '"><td>' + (i + 1) + '</td><td>' + students[i].xh + '</td><td>' + students[i].xm + '</td><td>' + students[i].xb + '</td><td>' + students[i].zym + '</td><td>' + students[i].yxm + '</td><td>' + students[i].nj + '</td><td>' + students[i].bj + '</td></tr>';
                }
                $(".list-table tbody").html(htmls);
            }
        }
    });
    $(".list-table").on("click", "tr", function(){
        if(!$(this).hasClass("info")){
            var $id = $(".student-id"),
                $img = $(".student-img"),
                $img_cet = $(".student-img-cet"),
                $tbody = $(".student-table tbody");
            $id.html("【 学号 - 姓名 】");
            $img.attr("src", "");
            $tbody.html("");
            var student = students[$(this).data("id")],
                html = '<tr><td>姓名：' + student.xm + '</td><td>性别：' + student.xb + '</td></tr><tr><td>班级：' + student.bj + '</td><td>专业：' + student.zym + '</td></tr><tr><td>年级：' + student.nj + '</td><td>学院：' + student.yxm + '</td></tr><tr><td><button class="btn btn-sm btn-success" href="#" onclick="search(\'' + student.bj + '\')">该班学生名单</button></td><td><a class="btn btn-sm btn-danger" href="https://jwzx.cqupt.congm.in/jwzxtmp/showKebiao.php?type=student&id=' + student.xh + '" target="_blank">个人课表</a></td></tr>';
            $id.html("【" + student.xh + " - " + student.xm + "】");
            $img.attr("src", "https://jwzx.cqupt.congm.in/showstuPic.php?xh=" + student.xh);
            $img_cet.attr("src", "http://172.22.80.212.cqupt.congm.in/PHOTO0906CET/" + student.xh + ".JPG");
            $tbody.html(html);
            $(".list-table tr").removeClass("active");
            $(this).addClass("active");
            $(".info-box").slideDown("fast");
        }
    });
    // 收集用户点击次数
    _cqupt_inner_finder++;
    localStorage.setItem('cqupt_inner_finder', _cqupt_inner_finder);
}