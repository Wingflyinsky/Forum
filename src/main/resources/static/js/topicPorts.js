
layui.define(['jquery','layer'], function(exports){
    var $ = layui.jquery
        ,layer=layui.layer;

    var portUser ;
    var curthumbT={
        topic_id:null
    };
    var path = window.location.pathname;
    var index = path.lastIndexOf('\/');
    var topicId=path.substring(index+1,path.length);

   console.log(topicId);
    var Htmldetails = "     <li data-id=\"{dataId}\" class=\"jieda-daan\">\n" +
        "            <div class=\"detail-body jieda-body \">\n" +
        " <div class=\"content\">\n"+
        " {detailsText}\n" +
            "</div>"+
        "            </div>\n" +
        "            <div class=\"detail-about detail-about-reply\">\n" +
        "              <div class=\"fly-detail-user\">\n" +
        "                  <cite>{alias}</cite>\n" +
        "                \n" +
        "                <span id='{is_owner}'>(楼主)</span>\n" +
        "                <span id='{is_admin}' style=\"color:#5FB878\">(管理员)</span>\n" +
        "\n"+
        "              </div>\n" +
        "\n" +
        "              <div class=\"detail-hits\">\n" +
        "            <span>创建时间:{createTime}</span>\n" +
        "           <span>编辑于：{modifyTime}</span>\n"+
        "              </div>\n" +
        "\n" +
        "            <div class=\"detail-body jieda-body photos\">\n" +
        "            </div>\n" +
        "         <div class=\"jieda-thumb\">\n"+
         "              <span  id=\"{is_thumb}\" class=\"jieda-zan\" type=\"zan\">\n" +
        "                <i class=\"iconfont icon-zan\"></i>\n" +
        "                <em>{likeNumber}</em>\n" +
          "              </span>\n" +
        "               </div>\n"+
        "            <div class=\"jieda-reply\">\n" +


        "              <div class=\"jieda-admin\">\n" +
        //参考的有个编辑，这个先不搞了，后面再看
        "                <span id='{is_delete}' type=\"del\">删除</span>\n" +//这个是用户自己删除
        "                <span id='{is_admin_delete}' type=\"del\">删除不当评论</span>\n" +//这个是管理员删除
        "              </div>\n" +
        "            </div>\n" +
        "          </li>";


    function cancelTopicLike(){
        layui.$.ajax({
            url: "/handleTopicLikes",//这个函数还没写
            type: "post",
            data: {
                "userId":layui.cache.id,
                "topicId": curthumbT.topic_id,
                "flag":0//这里我想的是传过去的flag是0就是取消赞，传过去的flag是1就是增加赞
            },
            async: false,
            success: function(data){//如果是取消赞就返回要取消的data，如果是要增加赞即返回要增加的data
                if(data && data.id){
                    document.getElementById("topic-like").style.color="";
                    curthumbT=null;
                }else{
                    //不进行操作
                }
            }
        });
    };
    function addTopicLike(){
        layui.$.ajax({
            url: "/handleTopicLikes",//这个函数还没写
            type: "post",
            data: {

                "userId":layui.cache.id,
                "topicId": UrlParm.parm('topicId'),
                "flag":1//这里我想的是传过去的flag是0就是取消赞，传过去的flag是1就是增加赞
            },
            async: false,
            success: function(data){//如果是取消赞就返回要取消的data，如果是要增加赞即返回要增加的data
                if(data && data.id){
                    document.getElementById("topic-like").style.color="#c00";
                    curthumbT=data;
                }else{
                }
            }
        });
    };
    function getTopicLikesInfo() {//获取话题的点赞信息
        layui.$.ajax({
            url: "/isMyThumbT",//这个函数我写出来好像有问题就一直获取不到数据，思想就是传递topicId和userId
            type: "post",
            data: {
                "topicId": UrlParm.parm('topicId'),
                "userId":layui.cache.user.id
            },
            async: false,
            success: function (data) {
                console.log(data);
                if (data && data.topicId) {//如果将该话题的topicId和目前使用用户的id传给isMyThumbT,如果能返回数据，数据中topicId
                    //有值，就说明该用户已经赞过这个话题了
                    curthumbT = data;
                    //赞过的话题图标就显示为红色，没赞过就还是原来的颜色
                    document.getElementById("topic-like").style.color = "#c00";
                }
            }
        });
        layui.$("#topic-like").on("click",function(){
            if(layui.cache.user.state >= 1){//这里我是设置的数字表示用户级别 0是游客，1是普通用户，2是
                if(data && data.topicId){
                    layui.layer.confirm('是否取消赞', function(index){
                        layui.layer.close(index);
                        cancelTopicLike();
                    });
                }else{
                    addTopicLike();
                }
            }else{
                layui.layer.msg("请先登入", {icon: 5});
            }
        });
    }
    // 查主贴
    $.ajax({
        url: "/topic/selectTopicById",
        type: "post",
        dataType: "json",
        async: false,
        data: {
            "topicId": topicId
        },
        success: function (data) {
            console.log(data);
            if(data.topicId){
                portUser = data;
                $("#htmlTitle").text(data.title);
                $("#detailTopicContent").text(contentMy(data.content));
                var str = "";

                if(data.pinLevel){
                    str = str +"    <span class=\"layui-badge layui-bg-black\">置顶</span>\n";
                };

                str = str +   "    <span class=\"fly-list-nums\"> \n" +
                    "            <a href=\"#L_content\"><i class=\"iconfont\" title=\"回复\">&#xe60c;</i>{replyNumber}</a>\n" +
                    "              <span class=\"topic-zan\" id=\"topic-like\">\n" +
                    "                <i class=\"iconfont icon-zan\"></i>\n" +
                    "                <em>{likeNumber}</em>\n" +
                    "              </span>\n" +
                    "          </span>";
                var rt = str.replace(/{replyNumber}/g,data.pinLevel)
                            .replace(/{likeNumber}/g,data.pinLevel);//这里replyNum应该是替换成data.replyNum，但是因为没有，就先替换成pinlevel
                $("#portHead").html(rt);
                str =
                    "          <div class=\"fly-detail-user\">\n" +
                    "              <cite>{alias}</cite>\n" +
                    "            <span>创建时间:{createTime}</span>\n" +
                    "           <span>编辑于：{modifyTime}</span>\n"+
                    "          </div>\n" +
                    "          <div class=\"detail-hits\" id=\"LAY_jieAdmin\" data-id=\"{portId}\">\n" +
                    "            <span id='editPort' class=\"layui-btn layui-btn-xs jie-admin\"><a href=\"/jie/edit.html?classId={classId}&id={portId}\">编辑此贴</a></span>\n" +
                    "          </div>";
                rt = //str.replace(/{userImg}/g,data.userImg)
                   str.replace(/{alias}/g,data.topicOwner.username)//后面这里最好改成用户的名字，这里为了方便测试，我就直接写的user_id
                       .replace(/{topicContent}/g,data.content)
                       .replace(/{createTime}/g,data.firstSent)
                       .replace(/{modifyTime}/g,data.lastModified)
                    .replace(/{portId}/g,data.id)

                $("#aboutUser").html(rt);
                if(layui.cache.user.id != data.userId){
                    $("#editPort").remove();
                };
                getTopicLikesInfo();
            }else{
                console.log("hhhhh");
            }

            //查回帖
            if(data.comments.length > 0){
                for(var x=0;x <data.comments.length;x++) {
                    var resData = data.comments[x];

                    var dataId = resData.floor / 6 + 1;//我想的是一页取6层楼 不过我没搞懂翻页，感觉这里要传参
                    var rt = Htmldetails.replace(/{dataId}/g, dataId)
                        .replace(/{alias}/g, resData.commentOwner.username)//这里应该显示用户名，为了方便，我又取的userId
                        .replace(/{createTime}/g, resData.firstSent)
                        .replace(/{modifyTime}/g, resData.lastModified)
                        .replace(/{detailsText}/g, contentMy(resData.content))//这里还是要调用它这个函数，不然内容
                        //长了就会很奇怪，上面标题那个我也换掉了
                        .replace(/{likeNumber}/g, resData.topicId)//这里应该替换成获赞数，还是为了方便我就用topicId代替了
                        .replace(/{is_owner}/g, "is_owner" + x)
                        .replace(/{is_admin}/g, "is_admin" + x)
                        .replace(/{is_admin_delete}/g, "is_admin_delete" + x)
                        .replace(/{is_delete}/g, "is_delete" + x)
                        .replace(/{is_thumb}/g,"is_thumb"+x)
                    $("#jieda").append(rt);
                    if (portUser.userId != resData.userId) {
                        $("#is_owner" + x).remove();
                    }
                    //  if (!resData.is_admin) {  这里应该这样写，但是因为我没有封装数据结构，我就随便写一个
                    if (!resData.userId) {
                        $("#is_manager" + x).remove();
                    }
                    if (layui.cache.user.state < 2) {//不是管理员的话就把删除不当评论移除
                        $("#is_admin_delete" + x).remove();
                    }
                    if (layui.cache.user.id != resData.userId) {//不是自己的评论就不能自己删除
                        $("#is_delete" + x).remove();
                    }
                    //这里应该这样写，为了方便，我又用的userId代替 这里是判断当前用户有没有赞过这条评论
                    //if(resData.isThumb)
                    if(resData.userId)
                    {
                        document.getElementById("is_thumb"+x).style.color="#c00";
                    }

                }
            }else{
                $("#jieda").html("<li class=\"fly-none\">消灭零回复</li>");
            }
            document.getElementById("lastPaging").setAttribute("data-id",data.page.lastPage);
            document.getElementById("nextPaging").setAttribute("data-id",data.page.nextPage);
            document.getElementById("endPaging").setAttribute("data-id",data.page.endPage);
            document.getElementById("curPaging").setAttribute("data-id",data.page.currentPage);
            document.getElementById("curPaging").innerText=data.page.currentPage+'/'+data.page.endPage;
        },
        error: function (data) {
            console.log("error");

        }
    });


    function escapeMY(html){
        return String(html||'').replace(/&(?!#?[a-zA-Z0-9]+;)/g, '&amp;')
            .replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#39;').replace(/"/g, '&quot;');
    };
    function contentMy(content){
        var html = function(end){
            return new RegExp('\\n*\\['+ (end||'') +'(pre|hr|div|span|p|table|thead|th|tbody|tr|td|ul|li|ol|li|dl|dt|dd|h2|h3|h4|h5)([\\s\\S]*?)\\]\\n*', 'g');
        };
        content = escapeMY(content||'') //XSS
            .replace(/img\[([^\s]+?)\]/g, function(img){  //转义图片
                return '<img src="' + img.replace(/(^img\[)|(\]$)/g, '') + '">';
            }).replace(/@(\S+)(\s+?|$)/g, '@<a href="javascript:;" class="fly-aite">$1</a>$2') //转义@
            .replace(/face\[([^\s\[\]]+?)\]/g, function(face){  //转义表情
                var alt = face.replace(/^face/g, '');
                return '<img alt="'+ alt +'" title="'+ alt +'" src="' + faces[alt] + '">';
            }).replace(/a\([\s\S]+?\)\[[\s\S]*?\]/g, function(str){ //转义链接
                var href = (str.match(/a\(([\s\S]+?)\)\[/)||[])[1];
                var text = (str.match(/\)\[([\s\S]*?)\]/)||[])[1];
                if(!href) return str;
                var rel =  /^(http(s)*:\/\/)\b(?!(\w+\.)*(sentsin.com|layui.com))\b/.test(href.replace(/\s/g, ''));
                return '<a href="'+ href +'" target="_blank"'+ (rel ? ' rel="nofollow"' : '') +'>'+ (text||href) +'</a>';
            }).replace(html(), '\<$1 $2\>').replace(html('/'), '\</$1\>') //转移HTML代码
            .replace(/\n/g, '<br>') //转义换行
        return content;
    };

    exports('topicDetails', null);
});