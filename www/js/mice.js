io.setPath('/js/socket/');

get = glow.dom.get;
function throttle(method,e, scope) {
    clearTimeout(method._tId);
    method._tId= setTimeout(function(){
        method(e)
    }, 40);
}
function move(mouse){
  if(disabled == false){                               
    if(get('#mouse_'+mouse['id']).length == 0) {
      get('body').append('<span class="mouse" id="mouse_'+mouse['id']+'"><span style="display:none;" class="chat"/></span>');
    }
    get('#mouse_'+mouse['id']).css({
      'left' : ((get(window).width() - mouse['w']) / 2 + mouse['x']) + 'px',
      'top' : mouse['y'] + 'px'
    })
  }
};

function speak(data){
  clearTimeout(timeouts[data['id']]);
  get('#mouse_'+data['id']+' img').remove();
  get('#mouse_'+data['id']).append('<img src="http://www.gravatar.com/avatar/' + data['email'] + '?s=20" />');

  if(data['text'] == '') {
    return get('#mouse_'+data['id']+' .chat').hide();
  }

  get('#mouse_'+data['id']+' .chat').show().html(data['text']);
  timeouts[data['id']] = setTimeout("get('#mouse_"+data['id']+" .chat').hide()", 5000)
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
  timeouts['preview'] = setTimeout("get('#preview').hide()", 5000)
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
  
  var send = function(e){
    console.log('BOO');
    socket.send(glow.data.encodeJson({
      action: 'move',
      x: e.pageX,
      y: e.pageY,
      w: get(window).width(),
      h: get(window).height()
    }))};
throttle(send,e,window);


}




var disabled = false,
    socket = new io.Socket('178.79.140.174', {port: 443}),
    timeouts = {};

if(socket.connect()){
  socket.on('message', function(data){
    console.log(data);
    data = glow.data.decodeJson(data); 
    if(data['action'] == 'close'){
      get('#mouse_'+data['id']).remove();
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
