io.setPath('/js/socket/');

get = glow.dom.get;
function ratelimit(fn, ms) {
  var last = (new Date()).getTime();
  return (function() {
    var now = (new Date()).getTime();
    if (now - last > ms) {
      last = now;
      fn.apply(null, arguments);
    }

  });
}

function move(mouse){
  if(disabled == false){                               
    if(get('#mouse_'+mouse['id']).length == 0) {
      get('body').append('<span class="mouse" id="mouse_'+mouse['id']+'"><span style="display:none;" class="chat"/></span>');
    }
    get('#mouse_'+mouse['id']).css({
      'left' : (($(window).width() - mouse['w']) / 2 + mouse['x']) + 'px',
      'top' : mouse['y'] + 'px'
    })
  }
};

function speak(data){
  clearTimeout(timeouts[data['id']]);
  get('#mouse_'+data['id']+' img').remove();
  get('#mouse_'+data['id']).append('<img src="http://www.gravatar.com/avatar/' + data['email'] + '?s=20" />');

  if(data['text'] == '') {
    return $('#mouse_'+data['id']+' .chat').hide();
  }

  $('#mouse_'+data['id']+' .chat').show().html(data['text']);
  timeouts[data['id']] = setTimeout("$('#mouse_"+data['id']+" .chat').hide()", 5000)
};

function preview(data){
  clearTimeout(timeouts[data['preview']]);
  get('#preview img').remove();
  get('#preview').append('<img src="http://www.gravatar.com/avatar/' + data['email'] + '?s=20" />');

  if(data['text'] == '') {
    return get('#preview .chat').hide();
  }

  get('#preview').show();
  get('#preview .chat').show().html(data['text']);
  timeouts['preview'] = setTimeout("$('#preview').hide()", 5000)
};


 glow.ready(function(){
   // enables and disables

//   $('#mouse_toggle a').toggle(function(){
//     $('.mouse').hide();
//     disabled = true;
//     $(this).html('enable');
//   }, function(){
//     $('.mouse').show();
//     disabled = false;
//     $(this).html('disable');
//   });



});

document.body.onmousemove =  function (e) {
  trail.moveIt(e);
  
  ratelimit(function(e){
    socket.send(JSON.stringify({
      action: 'move',
      x: e.pageX,
      y: e.pageY,
      w: get(window).width(),
      h: get(window).height()
    }))

    $('#preview').css({
      'left' : e.pageX + 'px',
      'top' : e.pageY + 'px'
    })
  }, 40)
}




var disabled = false,
    socket = new io.Socket('178.79.140.174', {port: 443}),
    timeouts = {};

if(socket.connect()){
  socket.on('message', function(data){
    data = glow.data.decodeJson(data); 
    if(data['action'] == 'close'){
      $('#mouse_'+data['id']).remove();
    } else if(data['action'] == 'speak') {
      if(data['id']) {
        speak(data);
      } else {
        preview(data);
      }
    } else if(data['action'] == 'move'){
      move(data);
    };
  });
};
