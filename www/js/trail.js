 trail = {
  moveIt: function(e){
    console.log(e);
    var seed = parseInt(Math.random()*100); 
    setTimeout(("trail.removeit(" + seed + ")"),400);
    get('body').append('<div class="trail" id="unique'+ seed+ '" style="background:'+this.randomColour()+';left:' + e.pageX + 'px;top:' + e.pageY + 'px;">&nbsp;</div>');   
  },
  removeit : function(seed){get('#unique' + seed).remove();},
  randomColour: function(){
    var rint = Math.round(0xffffff * Math.random());
    return ('#0' + rint.toString(16)).replace(/^#0([0-9a-f]{6})$/i, '#$1');
   }
}  
