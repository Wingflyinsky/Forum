
layui.define('jquery', function(exports){

    var $ = layui.jquery;
    var currentUser = {
        alias: '游客'
        ,state: 0
    };

    var guestMenu = " <li class=\"layui-nav-item\">\n" +
        "        <a class=\"iconfont icon-touxiang layui-hide-xs\" href=\"/login\"></a>\n" +
        "      </li>\n" +
        "      <li class=\"layui-nav-item\">\n" +
        "        <a href=\"/login\">登录</a>\n" +
        "      </li>\n" +
        "      <li class=\"layui-nav-item\">\n" +
        "        <a href=\"/register\">注册</a>\n" +
        "      </li>\n";

    var userMenu =  "  <li class=\"layui-nav-item\">"+
        "<a href=\"javascript:;\">我的</a>"+
        "<dl class=\"layui-nav-child\">"+
        "  <dd><a href=\"/user/set.html\"><i class=\"layui-icon\">&#xe620;</i>基本设置</a></dd>"+
        "  <dd><a href=\"/user/message.html\"><i class=\"iconfont icon-tongzhi\" style=\"top: 4px;\"></i>我的消息</a></dd>"+
        "  <dd><a href=\"/user/home.html\"><i class=\"layui-icon\" style=\"margin-left: 2px; font-size: 22px;\">&#xe68e;</i>我的主页</a></dd>"+
        "  <hr style=\"margin: 5px 0;\">"+
        "  <dd><a href=\"javascript:logout()\"\><i class='layui-icon'>&#xe682;</i>退出</a></dd>"+
        "</dl>"+
        "</li>";

    var adminMenu = userMenu +
        "<li class=\"layui-nav-item\">"+
        "<a href=\"javascript:;\">后台</a>"+
        "<dl class=\"layui-nav-child\">"+
        "  <dd><a href=\"/backstage/basic.html\"><i class=\"layui-icon\">&#xe60b;</i>后台信息</a></dd>"+
        "  <dd><a href=\"/backstage/users.html\"><i class=\"layui-icon\">&#xe612;</i>用户管理</a></dd>"+
        "  <dd><a href=\"/backstage/topics.html\"><i class=\"layui-icon\">&#xe60a;</i>话题管理</a></dd>"+
        "</dl>"+
        "</li>";




    $.ajax({
        url: "/getUserType",
        type: "post",
        data: JSON.stringify({
            "alias":this.alias,
            "state":this.state,
        }),
        datatype:'json',
        async: false,
        success: function (data) {
                var temp = data.state;
           /*当目前用户为管理员时*/
            if(data.state == '2'){
                $('#current-account').empty();
                $("#current-account").html(adminMenu);/**/
            }
            /*当目前用户为普通用户时*/
            else if(data.state == '1'){
                $('#current-account').empty();
                $("#current-account").html(userMenu);/**/
            }
            /*当目前用户为未登录用户时*/
            else{
                $('#current-account').empty();
                $("#current-account").html(guestMenu);/**/
            }
            layui.cache.user = currentUser;
        },
        error: function (){
            $('#current-account').empty();
            $("#current-account").html(guestMenu);
            layui.cache.user = currentUser;
        }
    });



    exports('account', null);
});