io.setPath('/js/socket/');

get = glow.dom.get;
glow.ready(function(){
});

function throttle(method,e, scope) {
  clearTimeout(method._tId);
  method._tId= setTimeout(function(){
    method(e)
    }, 40);
}

function move(mouse){
  if(disabled == false){                               
    if(get('#mouse_'+mouse['id']).length == 0) {
      var cssClass = 'color' + parseInt(Math.random()*4);
      get('body').append('<span class="mouse ' +  cssClass + '" id="mouse_'+mouse['id']+'"><span style="display:none;" class="chat"/></span>');
    }
    get('#mouse_'+mouse['id']).css({
      'left' : ((get(window).width() - mouse['w']) / 2 + mouse['x']) + 'px',
      'top' : mouse['y'] + 'px'
    })
    trail({pageX: mouse['x'],pageY: mouse['y'] });
  }
};

document.body.onmousemove =  function (e) {
  var send = function(e){
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
    data = glow.data.decodeJson(data); 
    if(data['action'] == 'close'){
      get('#mouse_'+data['id']).remove();
    } else if(data['action'] == 'move'){
      move(data);
    };
  });
};
