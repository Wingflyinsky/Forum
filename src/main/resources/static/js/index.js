﻿/**

 @Name: Fly社区主入口

 */
 

layui.define(['layer', 'laytpl', 'form', 'element', 'upload', 'util', 'carousel', 'table'], function(exports){
  
  var $ = layui.jquery
  ,layer = layui.layer
  ,laytpl = layui.laytpl
  ,form = layui.form
  ,element = layui.element
  ,upload = layui.upload
  ,util = layui.util
  ,device = layui.device()
  ,carousel = layui.carousel
  ,table = layui.table
  ,DISABLED = 'layui-btn-disabled';

  carousel.render({
    elem: '#indexCarousel'
    ,width: '100%' //设置容器宽度
    ,arrow: 'hover' //悬停显示
  });
//执行一个 table 实例
  table.render({
    elem: '#demo'
    ,height: 540
    ,url: '/common/tableTest.json'
    ,title: '用户表'
    ,page: true
    ,toolbar: 'default'
    ,totalRow: false
    ,cols: [[
       {type: 'checkbox', fixed: 'left'}
      ,{field: 'id', title: 'ID', width:80, sort: true, fixed: 'left', totalRowText: '合计：'}
      ,{field: 'username', title: '用户名', width:80}
      ,{field: 'experience', title: '积分', width: 90, sort: true, totalRow: true}
      ,{field: 'sex', title: '性别', width:80, sort: true}
      ,{field: 'score', title: '评分', width: 80, sort: true, totalRow: true}
      ,{field: 'city', title: '城市', width:150}
      ,{field: 'sign', title: '签名', width: 200}
      ,{field: 'classify', title: '职业', width: 100}
      ,{field: 'wealth', title: '财富', width: 135, sort: true, totalRow: true}
      ,{fixed: 'right', title: '操作',width: 180, align:'center', toolbar: '#barDemo'}
    ]]
  });
  //监听行工具事件
  table.on('tool(test)', function(obj){ //注：tool 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
    var data = obj.data //获得当前行数据
        ,layEvent = obj.event; //获得 lay-event 对应的值
    if(layEvent === 'detail'){
      layer.msg('查看操作');
    } else if(layEvent === 'del'){
      layer.confirm('真的删除行么', function(index){
        obj.del(); //删除对应行（tr）的DOM结构
        layer.close(index);
        //向服务端发送删除指令
      });
    } else if(layEvent === 'edit'){
      layer.msg('编辑操作');
    }
  });
  //阻止IE7以下访问
  if(device.ie && device.ie < 8){
    layer.alert('如果您非得使用 IE 浏览器访问Fly社区，那么请使用 IE8+');
  };
  
  layui.focusInsert = function(obj, str){
    var result, val = obj.value;
    obj.focus();
    if(document.selection){ //ie
      result = document.selection.createRange(); 
      document.selection.empty(); 
      result.text = str; 
    } else {
      result = [val.substring(0, obj.selectionStart), str, val.substr(obj.selectionEnd)];
      obj.focus();
      obj.value = result.join('');
    }
  };


  //数字前置补零
  layui.laytpl.digit = function(num, length, end){
    var str = '';
    num = String(num);
    length = length || 2;
    for(var i = num.length; i < length; i++){
      str += '0';
    }
    return num < Math.pow(10, length) ? str + (num|0) : num;
  };
  
  var fly = {

    //Ajax
    json: function(url, data, success, options){
      var that = this, type = typeof data === 'function';
      
      if(type){
        options = success
        success = data;
        data = {};
      }

      options = options || {};

      return $.ajax({
        type: options.type || 'post',
        dataType: options.dataType || 'json',
        data: data,
        url: url,
        async: false,
        success: function(res){
          if(res.status === 0) {
            success && success(res);
          } else {
            layer.msg(res.msg || res.code, {shift: 6});
            options.error && options.error();
          }
        }, error: function(e){
          layer.msg('请求异常,请重试', {shift: 6});
          options.error && options.error(e);
        }
      });
    }

    //计算字符长度
    ,charLen: function(val){
      var arr = val.split(''), len = 0;
      for(var i = 0; i <  val.length ; i++){
        arr[i].charCodeAt(0) < 299 ? len++ : len += 2;
      }
      return len;
    }
    
    ,form: {}

    //简易编辑器
    ,layEditor: function(options){
      var html = ['<div class="layui-unselect fly-edit">'
        ,'<span type="face" title="插入表情"><i class="iconfont icon-yxj-expression" style="top: 1px;"></i></span>'
        ,'<span type="picture" title="插入图片：img[src]"><i class="iconfont icon-tupian"></i></span>'
        ,'<span type="href" title="超链接格式：a(href)[text]"><i class="iconfont icon-lianjie"></i></span>'
        ,'<span type="code" title="插入代码或引用"><i class="iconfont icon-emwdaima" style="top: 1px;"></i></span>'
        ,'<span type="hr" title="插入水平线">hr</span>'
        ,'<span type="yulan" title="预览"><i class="iconfont icon-yulan1"></i></span>'
      ,'</div>'].join('');

      var log = {}, mod = {
        face: function(editor, self){ //插入表情
          var str = '', ul, face = fly.faces;
          for(var key in face){
            str += '<li title="'+ key +'"><img src="'+ face[key] +'"></li>';
          }
          str = '<ul id="LAY-editface" class="layui-clear">'+ str +'</ul>';
          layer.tips(str, self, {
            tips: 3
            ,time: 0
            ,skin: 'layui-edit-face'
          });
          $(document).on('click', function(){
            layer.closeAll('tips');
          });
          $('#LAY-editface li').on('click', function(){
            var title = $(this).attr('title') + ' ';
            layui.focusInsert(editor[0], 'face' + title);
          });
        }
        ,picture: function(editor){ //插入图片
          layer.open({
            type: 1
            ,id: 'fly-jie-upload'
            ,title: '插入图片'
            ,area: 'auto'
            ,shade: false
            ,area: '465px'
            ,fixed: false
            ,offset: [
              editor.offset().top - $(window).scrollTop() + 'px'
              ,editor.offset().left + 'px'
            ]
            ,skin: 'layui-layer-border'
            ,content: ['<ul class="layui-form layui-form-pane" style="margin: 20px;">'
              ,'<li class="layui-form-item">'
                ,'<label class="layui-form-label">URL</label>'
                ,'<div class="layui-input-inline">'
                    ,'<input required name="image" placeholder="支持直接粘贴远程图片地址" value="" class="layui-input">'
                  ,'</div>'
                  ,'<button type="button" class="layui-btn layui-btn-primary" id="uploadImg"><i class="layui-icon">&#xe67c;</i>上传图片</button>'
              ,'</li>'
              ,'<li class="layui-form-item" style="text-align: center;">'
                ,'<button type="button" lay-submit lay-filter="uploadImages" class="layui-btn">确认</button>'
              ,'</li>'
            ,'</ul>'].join('')
            ,success: function(layero, index){
              var image =  layero.find('input[name="image"]');

              //执行上传实例
              upload.render({
                elem: '#uploadImg'
                ,url: '/api/uploadImg'
                ,size: 300
                ,done: function(res){
                  if(res.status == 0){
                    image.val(res.action);
                  } else {
                    layer.msg(res.msg, {icon: 5});
                  }
                }
              });
              
              form.on('submit(uploadImages)', function(data){
                var field = data.field;
                if(!field.image) return image.focus();
                layui.focusInsert(editor[0], 'img['+ field.image + '] ');
                layer.close(index);
              });
            }
          });
        }
        ,href: function(editor){ //超链接
          layer.prompt({
            title: '请输入合法链接'
            ,shade: false
            ,fixed: false
            ,id: 'LAY_flyedit_href'
            ,offset: [
              editor.offset().top - $(window).scrollTop() + 'px'
              ,editor.offset().left + 'px'
            ]
          }, function(val, index, elem){
            if(!/^http(s*):\/\/[\S]/.test(val)){
              layer.tips('这根本不是个链接，不要骗我。', elem, {tips:1})
              return;
            }
            layui.focusInsert(editor[0], ' a('+ val +')['+ val + '] ');
            layer.close(index);
          });
        }
        ,code: function(editor){ //插入代码
          layer.prompt({
            title: '请贴入代码或任意文本'
            ,formType: 2
            ,maxlength: 10000
            ,shade: false
            ,id: 'LAY_flyedit_code'
            ,area: ['800px', '360px']
          }, function(val, index, elem){
            layui.focusInsert(editor[0], '[pre]\n'+ val + '\n[/pre]');
            layer.close(index);
          });
        }
        ,hr: function(editor){ //插入水平分割线
          layui.focusInsert(editor[0], '[hr]');
        }
        ,yulan: function(editor){ //预览
          var content = editor.val();
          
          content = /^\{html\}/.test(content) 
            ? content.replace(/^\{html\}/, '')
          : fly.content(content);

          layer.open({
            type: 1
            ,title: '预览'
            ,shade: false
            ,area: ['100%', '100%']
            ,scrollbar: false
            ,content: '<div class="detail-body" style="margin:20px;">'+ content +'</div>'
          });
        }
      };

      
    }

    ,escape: function(html){
      return String(html||'').replace(/&(?!#?[a-zA-Z0-9]+;)/g, '&amp;')
      .replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#39;').replace(/"/g, '&quot;');
    }

    //内容转义
    ,content: function(content){
      //支持的html标签
      var html = function(end){
        return new RegExp('\\n*\\['+ (end||'') +'(pre|hr|div|span|p|table|thead|th|tbody|tr|td|ul|li|ol|li|dl|dt|dd|h2|h3|h4|h5)([\\s\\S]*?)\\]\\n*', 'g');
      };
      content = fly.escape(content||'') //XSS
      .replace(/img\[([^\s]+?)\]/g, function(img){  //转义图片
        return '<img src="' + img.replace(/(^img\[)|(\]$)/g, '') + '">';
      }).replace(/@(\S+)(\s+?|$)/g, '@<a href="javascript:;" class="fly-aite">$1</a>$2') //转义@
      .replace(/face\[([^\s\[\]]+?)\]/g, function(face){  //转义表情
        var alt = face.replace(/^face/g, '');
        return '<img alt="'+ alt +'" title="'+ alt +'" src="' + fly.faces[alt] + '">';
      }).replace(/a\([\s\S]+?\)\[[\s\S]*?\]/g, function(str){ //转义链接
        var href = (str.match(/a\(([\s\S]+?)\)\[/)||[])[1];
        var text = (str.match(/\)\[([\s\S]*?)\]/)||[])[1];
        if(!href) return str;
        var rel =  /^(http(s)*:\/\/)\b(?!(\w+\.)*(sentsin.com|layui.com))\b/.test(href.replace(/\s/g, ''));
        return '<a href="'+ href +'" target="_blank"'+ (rel ? ' rel="nofollow"' : '') +'>'+ (text||href) +'</a>';
      }).replace(html(), '\<$1 $2\>').replace(html('/'), '\</$1\>') //转移HTML代码
      .replace(/\n/g, '<br>') //转义换行   
      return content;
    }
    
    //新消息通知
    ,newmsg: function(){
      var elemUser = $('.fly-nav-user');
      if(layui.cache.user.state == 1 && elemUser[0]){
        console.log(layui.cache.user.alias);

      }
      return arguments.callee;
    }
    
  };

  //签到
  var elemSigninHelp = $('#LAY_signinHelp');

  $('body').on('click', '#LAY_signin', function(){
    var othis = $(this);
    if(othis.hasClass(DISABLED)) return;
    if(layui.cache.user.state != 1){
      layer.msg('请先登入',{shift: 2});
      return;
    }
    $.ajax({
      url: "/api/userSign/signOn",
      type: "post",
      async: false,
      success: function (data) {
        layer.msg(data.msg,{shift: 2});
      },
      error: function () {
        layer.msg('请求异常,请重试',{shift: 2});
      }
    });
    othis.addClass(DISABLED);
  });

  //签到说明
  elemSigninHelp.on('click', function(){
    layer.open({
      type: 1
      ,title: '签到说明'
      ,area: '300px'
      ,shade: 0.8
      ,shadeClose: true
      ,content: ['<div class="layui-text" style="padding: 20px;">'
        ,'<blockquote class="layui-elem-quote">“签到”可获得社区飞吻，规则如下</blockquote>'
        ,'<table class="layui-table">'
          ,'<thead>'
            ,'<tr><th>连续签到天数</th><th>每天可获飞吻</th></tr>'
          ,'</thead>'
          ,'<tbody>'
            ,'<tr><td>＜5</td><td>5</td></tr>'
            ,'<tr><td>≥5</td><td>10</td></tr>'
            ,'<tr><td>≥15</td><td>15</td></tr>'
            ,'<tr><td>≥30</td><td>30</td></tr>'
          ,'</tbody>'
        ,'</table>'
        ,'<ul>'
          ,'<li>中间若有间隔,则连续天数重新计算</li>'
        ,'</ul>'
      ,'</div>'].join('')
    });
  });

  //回帖榜
  var tplReply = ['{{# layui.each(d.data, function(index, item){ }}'
    ,'<dd>'
      ,'<a href="/u/{{item.uid}}">'
        ,'<img src="{{item.user.avatar}}">'
        ,'<cite>{{item.user.username}}</cite>'
        ,'<i>{{item["count(*)"]}}次回答</i>'
      ,'</a>'
    ,'</dd>'
  ,'{{# }); }}'].join('')
  ,elemReply = $('#LAY_replyRank');

  if(elemReply[0]){

  };

  //相册
  if($(window).width() > 750){
    layer.photos({
      photos: '.photos'
      ,zIndex: 9999999999
      ,anim: -1
    });
  } else {
    $('body').on('click', '.photos img', function(){
      window.open(this.src);
    });
  }

  //新消息通知
  fly.newmsg();

  //发送激活邮件
  fly.activate = function(email){
    fly.json('/api/activate/', {}, function(res){
      if(res.status === 0){
        layer.alert('已成功将激活链接发送到了您的邮箱，接受可能会稍有延迟，请注意查收。', {
          icon: 1
        });
      };
    });
  };
  $('#LAY-activate').on('click', function(){
    fly.activate($(this).attr('email'));
  });

  //点击@
  $('body').on('click', '.fly-aite', function(){
    var othis = $(this), text = othis.text();
    if(othis.attr('href') !== 'javascript:;'){
      return;
    }
    text = text.replace(/^@|（[\s\S]+?）/g, '');
    othis.attr({
      href: '/user/home.html?alias='+ text
      ,target: '_blank'
    });
  });

  //表单提交
  form.on('submit(*)', function(data){
    var action = $(data.form).attr('action');
    if(action =='/api/report/insert'){
      var inx = data.field.classId;
      data.field.datatype = data.field['cusType'+inx];
      data.field.dataversion = data.field['cusVersion'+inx];
      data.field.useides = data.field['useides'+inx];
      data.field.name = data.field['title'];
      data.field.id = data.field['dataid'];
      if(data.field.experience > layui.cache.user.accumulatePoints){
        layer.msg('飞吻数据不足', {shift: 6});
        return false;
      };
      $.ajax({
        type: 'post',
        dataType: "json",
        data: data.field,
        url: action,
        async: false,
        success: function(res){
          if(res.status == 0) {
            if(res.action){
              location.href = res.action;
            }
          } else {
            layer.msg(res.msg ,{shift: 6});
            getImageBase(res.id);
          }
        },error: function(e){
          layer.msg('请求异常,请重试', {shift: 6});
        }
      });
      return false;
    };

    if(action =='/api/report/update'){
      data.field.name = data.field['title'];
      data.field.id = data.field['dataid'];
      $.ajax({
        type: 'post',
        dataType: "json",
        data: data.field,
        url: action,
        async: false,
        success: function(res){
          if(res.status == 0) {
            if(res.action){
              location.href = res.action;
            }
          } else {
            layer.msg(res.msg ,{shift: 6});
            getImageBase(res.id);
          }
        },error: function(e){
          layer.msg('请求异常,请重试', {shift: 6});
        }
      });
      return false;
    };

    if(action =='/api/detailsText/sendReply'){
      $.ajax({
        type: 'post',
        dataType: "json",
        data: data.field,
        url: action,
        async: false,
        success: function(res){
          layer.msg(res.msg, {shift: 6});
          getImageBase(res.id);
        },error: function(res){
          layer.msg(res.msg, {shift: 6});
          getImageBase(res.id);
        }
      });
      return false;
    }
    if(data.field.repassword){
      if(data.field.password != data.field.repassword){
        layer.msg("二次密码不一致" ,{shift: 6});
        return false;
      }
    };
    $.ajax({
      type: 'post',
      dataType: "json",
      data: data.field,
      url: action,
      async: false,
      success: function(res){
        if(res.status == 0) {
          if(res.action){
            location.href = res.action;
          }
        } else {
          layer.msg(res.msg ,{shift: 6});
          getImageBase(res.id);
        }
      },error: function(e){
        layer.msg('请求异常,请重试', {shift: 6});
      }
    });
    return false;
  });

  //加载特定模块
  if(layui.cache.page && layui.cache.page !== 'index'){
    var extend = {};
    extend[layui.cache.page] = layui.cache.page;
    layui.extend(extend);
    layui.use(layui.cache.page);
  }
  
  //加载IM
  if(!device.android && !device.ios){
    //layui.use('im');
  }

  //加载编辑器
  fly.layEditor({
    elem: '.fly-editor'
  });

  //手机设备的简单适配
  var treeMobile = $('.site-tree-mobile')
  ,shadeMobile = $('.site-mobile-shade')

  treeMobile.on('click', function(){
    $('body').addClass('site-mobile');
  });

  shadeMobile.on('click', function(){
    $('body').removeClass('site-mobile');
  });

  //获取统计数据
  $('.fly-handles').each(function(){
    var othis = $(this);
    $.get('/api/handle?alias='+ othis.data('alias'), function(res){
      othis.html('(下载量：'+ res.number +')');
    })
  });
  
  //固定Bar
  util.fixbar({
    bar1: '&#xe642;'
    ,bgcolor: '#009688'
    ,click: function(type){
      if(type === 'bar1'){
        // layer.msg('打开 index.js，开启发表新帖的路径');
        location.href = '/jie/add.html';
      }
    }
  });

  function getImageBase(id){
    layui.$.ajax({
      url: "/api/image",
      type: "get",
      async: false,
      success: function (data) {
        layui.$("#"+id).text(data);
      },
      error: function () {
        layui.$("#"+id).text("验证异常");
      }
    });
  };

  exports('fly', fly);

});

