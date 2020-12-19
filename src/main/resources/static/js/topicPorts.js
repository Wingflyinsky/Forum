
layui.define(['jquery','layer'], function(exports){
    var $ = layui.jquery
        ,layer=layui.layer;

    var topicData;
    var numOfComments;
    var path = window.location.pathname;
    var index = path.lastIndexOf('\/');
    var topicId=path.substring(index+1,path.length);


    var Htmldetails = "     <li data-id=\"{dataId}\" class=\"jieda-daan\" id='{commentX}'>\n" +
        "            <div class=\"detail-body jieda-body \">\n" +
        " <div class=\"content\">\n"+
        " {detailsText}\n" +
           // "</div>"+
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
        "</div>"+
        "          </li>";



    layui.use('laypage', function(){
        var laypage = layui.laypage;
        $.ajax({
            url: "/topic/getNumOfComments",
            type: "post",
            dataType: "json",
            async: false,
            data: {
                "topicId": topicId,
            },
            success: function (data) {
                numOfComments = data;
            },
            error:function (data) {
                console.log(data);
            }
        });

        //执行一个laypage实例
        laypage.render({
            elem: 'topicPage' //注意，这里的 test1 是 ID，不用加 # 号
            ,count: numOfComments //数据总数，从服务端得到
            ,jump: function(obj, first){

                // 查主贴
                $.ajax({
                    url: "/topic/selectTopicById",
                    type: "post",
                    dataType: "json",
                    async: false,
                    data: {
                        "topicId": topicId,
                        "page":obj.curr
                    },
                    success: function (data) {
                        console.log(data);
                        if(data.topicId){
                            topicData = data;
                            var numOfComments = data.numOfComments;
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
                                .replace(/{likeNumber}/g,data.thumbTs);//这里replyNum应该是替换成data.replyNum，但是因为没有，就先替换成pinlevel
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
                                str.replace(/{alias}/g,data.topicOwner.username)
                                    .replace(/{topicContent}/g,data.content)
                                    .replace(/{createTime}/g,data.firstSent)
                                    .replace(/{modifyTime}/g,data.lastModified)
                                    .replace(/{portId}/g,data.id)


                            $("#aboutUser").html(rt);
                            if(layui.cache.user.id != data.userId){
                                $("#editPort").remove();
                            };
                            getTopicLikesInfo();
                        }

                    },
                    error: function (data) {
                        console.log("error");
                    }
                });
                        //查回帖
                        if(topicData.comments.length > 0){
                            if(!first){
                                $("#jieda").empty();
                            }
                            for(var x=0;x <topicData.comments.length;x++) {
                                var resData = topicData.comments[x];

                                var dataId = resData.floor / 6 + 1;//我想的是一页取6层楼 不过我没搞懂翻页，感觉这里要传参
                                var rt = Htmldetails.replace(/{dataId}/g, dataId)
                                    .replace(/{commentX}/g, "comment"+x+"")
                                    .replace(/{alias}/g, resData.commentOwner.username)
                                    .replace(/{createTime}/g, resData.firstSent)
                                    .replace(/{modifyTime}/g, resData.lastModified)
                                    .replace(/{detailsText}/g, contentMy(resData.content))//这里还是要调用它这个函数，不然内容
                                    //长了就会很奇怪，上面标题那个我也换掉了
                                    .replace(/{likeNumber}/g, resData.thumbCs)
                                    .replace(/{is_owner}/g, "is_owner" + x)
                                    .replace(/{is_admin}/g, "is_admin" + x)
                                    .replace(/{is_admin_delete}/g, "is_admin_delete" + x)
                                    .replace(/{is_delete}/g, "is_delete" + x)
                                    .replace(/{is_thumb}/g,"is_thumb"+x)

                                $("#jieda").append(rt);
                                if (topicData.userId != resData.userId) {
                                    $("#is_owner" + x).remove();
                                }
                                if (layui.cache.user.state < 2) {//不是管理员的话就把删除不当评论移除
                                    $("#is_admin_delete" + x).remove();
                                }
                                if (layui.cache.user.id != resData.userId) {//不是自己的评论就不能自己删除
                                    $("#is_delete" + x).remove();
                                }
                                if(resData.thumbed)
                                {
                                    document.getElementById("is_thumb"+x).style.color="#c00";
                                }
                                ( function (x) {//这里要对x进行封闭 否则所有的点击触发事件都会相同
                                    var thumb_x = "#is_thumb" + x + "";
                                    var delete_x="#is_delete"+x+"";
                                    var commentx="#comment"+x+"";
                                    var admin_delete_x="#is_admin_delete"+x+"";
                                    var subThumbx = thumb_x.substring(1, thumb_x.length);//得到"is_thumb"+x
                                    var subDeletex=delete_x.substring(1,delete_x.length);

                                    layui.$(thumb_x).on("click", function () {
                                        if (layui.cache.user.state >= 1) {//数字表示用户级别 0是游客，1是普通用户
                                            layui.layer.close(index);
                                            changeCommentLike(topicData.comments[x].commentId,subThumbx);
                                        } else {
                                            layui.layer.msg("请先登录", {icon: 5});
                                        }
                                    });
                                    layui.$(delete_x).on("click", function () {
                                        if (layui.cache.user.state >= 1) {//数字表示用户级别 0是游客，1是普通用户
                                            deleteComment(topicData.comments[x].commentId,commentx,true);
                                        } else {
                                            layui.layer.msg("请先登录", {icon: 5});
                                        }
                                    });
                                    layui.$(admin_delete_x).on("click", function () {
                                        if (layui.cache.user.state > 1) {//数字表示用户级别 0是游客，1是普通用户
                                            deleteComment(topicData.comments[x].commentId,commentx,false);
                                        } else {
                                            layui.layer.msg("请先登录", {icon: 5});
                                        }
                                    });
                                })(x);
                            }
                        }else{
                            $("#jieda").html("<li class=\"fly-none\">消灭零回复</li>");
                        }
            },

        });

    });




    /*获取话题的点赞信息*/
    function getTopicLikesInfo() {
        if (topicData.thumbed) {//如果将该话题的topicId和目前使用用户的id传给isMyThumbT,如果能返回数据，数据中topicId
            //为真，就说明该用户已经赞过这个话题了
            //赞过的话题图标就显示为红色，没赞过就还是原来的颜色
            document.getElementById("topic-like").style.color = "#c00";
        }
        (function(topicData) {
            layui.$("#topic-like").on("click", function () {
                if (layui.cache.user.state >= 1) {//这里我是设置的数字表示用户级别 0是游客，1是普通用户，2是
                    changeTopicLike();
                } else {
                    layui.layer.msg("请先登录", {icon: 5});
                }
            });
        })(topicData);
    }

    function changeTopicLike(){
        layui.$.ajax({
            url: "/topic/handleTopicLikes",
            type: "post",
            data: {
                "topicId": topicData.topicId
            },
            async: false,
            success: function(data){//如果是取消赞就返回要取消的data，如果是要增加赞即返回要增加的data
                console.log(data);
                var childs=document.getElementById("topic-like").childNodes;//获取该id下的孩子节点
                var tempNum=parseInt($(childs[3]).text());//后端要对likeNum进行修改，但是前端不能实时刷新，所以前端也要手动
                if(data){
                    document.getElementById("topic-like").style.color="#c00";
                    console.log(childs);
                    tempNum=tempNum+1;
                    $(childs[3]).html(""+tempNum);
                }else{
                    document.getElementById("topic-like").style.color="";
                    tempNum=tempNum-1;
                    $(childs[3]).html(""+tempNum);
                }
            }
        });
    };

    function changeCommentLike(commentId,subThumbx){
        layui.$.ajax({
            url: "/topic/handleCommentLikes",
            type: "post",
            data: {
                "commentId": commentId
            },
            async: false,
            success: function(data){//如果是取消赞就返回要取消的data，如果是要增加赞即返回要增加的data
                console.log(data);
                var childs=document.getElementById(subThumbx).childNodes;//获取该id下的孩子节点
                var tempNum=parseInt($(childs[3]).text());//后端要对likeNum进行修改，但是前端不能实时刷新，所以前端也要手动
                if(data){
                    document.getElementById(subThumbx).style.color="#c00";
                    console.log(childs);
                    tempNum=tempNum+1;
                    $(childs[3]).html(""+tempNum);
                }else{
                    document.getElementById(subThumbx).style.color="";
                    tempNum=tempNum-1;
                    $(childs[3]).html(""+tempNum);
                }
            }
        });
    };

    function deleteComment(commentId,commentX,delete_by_user)//如果delete_by_user为true是用户删除，flag为false是管理员删除
    {
        layui.layer.confirm('是否删除', function (index) {
            layui.$.ajax({
                url: "/topic/deleteComment",
                type: "post",
                data: {
                    "commentId": commentId,
                    "delete_by_user": delete_by_user
                },
                async: false,
                success: function(data){//返回刚刚删除的评论
                    if(data == "success"){
                        console.log(commentX);
                        $(commentX).remove();
                        layui.layer.msg("删除成功!");
                    }else{
                        layui.layer.msg("删除失败",{icon:5});
                    }
                },
                error:function() {
                    layui.layer.msg("删除失败", {icon: 5});
                }
            });
            layui.layer.close(index);
        });

    }
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