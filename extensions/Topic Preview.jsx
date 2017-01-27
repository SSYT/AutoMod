function loadContent(x) {
	$('#popupfa', x).show();
	if(window.localStorage && localStorage.getItem('x'))
	{
		$('#popupfa').html(localStorage.getItem('x'));
	} else {
          $.ajax({
                  url: x.href,
                  method: 'get',
                  success: function(d)
                  {
                          var firstPost = $('.post:has(".postbody"):eq(0) .postbody > .content > div', d).html();
                          var avatar    = $('.post:has(".postbody"):eq(0) .postprofile dl dt:eq(0) > a[href] > img', d).attr('src');
                          $('#popupfa').html('<div class="post_row"><img src="'+ avatar +'" class="av_row" /><div class="content">'+ firstPost +'</div></div>');
                          localStorage.setItem('x', '<div class="post_row"><img src="'+ avatar +'" class="av_row" /><div class="content">'+ firstPost +'</div></div>');
                  }
          });
        }
}

function normalShow(x) {
	$('#popupfa', x).hide();
}

$(function() {
  $('.topictitle').attr({
          'onmouseover' : 'loadContent(this);',
          'onmouseout' : 'normalShow(this);'
  });
  
  $('.topictitle').append('<div id="popupfa" style="display: none">Loading...</div>');
  localStorage.removeItem('x');
});