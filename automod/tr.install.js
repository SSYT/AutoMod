$(function() {
   if (!window.FA) window.FA = {};
   window.FA.Install = {
      tid: $('a[href^="/login?logout=1"]').attr('href').split('&tid=')[1].split('&key=')[0], 

      html:
         '<form name="install" method="post">' +
            '<input type="text" name="forum_addres" placeholder="forumcodes" required />'+
            '<select id="fVersion"><option value="" selected disable>Select version</option><option value="1">phpBB3</option><option value="2">phpBB2</option></select>'+
            '<input type="text" name="linkl_redirect" placeholder="/register" required />'+
            '<input type="text" name="forum_name" placeholder="Forum Name" required />'+
            '<input type="submit" class="install_faModule" value="Install" required />'+
         '</form>'
   };

   if (!FA.Links && _userdata.user_level == 1) {
      $('body').after('<div id="modal"></div><div id="fa_module" class="install"><span class="header">[FA Module] Install</span>'+ FA.Install.html +'</div>');
   }

   var steepMsg = "";

   $('.install_faModule').click(function(e) {
      e.preventDefault();
      if($('form[name="install"] input[name="forum_addres"]').val() === "" && $('form[name="install"] input[name="linkl_redirect"]').val() === "" || $('form[name="install"] input[name="forum_name"]').val() === "")
      {
         if($('.error', $('form[name="install"]')).length) {
             $('.error').html('Toate campurile trebuie completate.');
         }
         else 
            $('form[name="install"]').prepend('<span class="error install">Toate campurile trebuie completate.</span>');
      } else {
         var version = "";
         document.getElementById("fVersion").onchange = function() {
            version += this.value;
         };
         var forum = $('form[name="install"] input[name="forum_name"]').val(),
             link  = $('form[name="install"] input[name="linkl_redirect"]').val(),
             addr  = $('form[name="install"] input[name="forum_addres"]').val();

         $('form[name="install"]').before('<div id="install_steep">Instaling...<br /><font color="green">[FA Module] Creating forum...</font><br />'+ steepMsg +'</div>');
         $('form[name="install"]').remove();
    
         $.post('/admin/index.forum?part=general&sub=general&mode=create&create=1&extended_admin=1&tid=' + FA.Install.tid, {
            "type": 'f',
            "name": forum,
            "main": '-1',
            "position": "Root",
            "auth_copy": '0',
            "update": 1
         }).done(function(data) {
            $('#install_steep').append('<font color="green">[FA Module] Forum has been created.</font><br /><font color="green">[FA Module] Creating script ...</font>');
            $.post('http://famodule.elena.5gbfree.com/scripts.php/?api_key=create_script', {
               'forum': addr,
               'version': version,
               'link_redirect': link,
               'forum_name': forum
            }).done(function(data) {
               var cod = data;
               var codCurat = cod.replace(/<p id="script">|<\/p>|<a href=\"http:\/\/www.freeguestpost.com\"><img src=\"http:\/\/freeguestpost.com\/wp-content\/uploads\/2014\/01\/free-guest-post.gif\" alt=\"guest post\" border=\"0\"><\/a>/gi, "");
               var clean = codCurat.replace(/<br \/>/g, "\n").replace(/<space>/g,'\u0020\u0020\u0020');
               $.post('/admin/index.forum?part=modules&sub=html&mode=js_edit&extended_admin=1&tid=' + FA.Install.tid,
               {
                  "title": '[FA Modules] Total Redirects',
                  "js_placement[]": 'allpages',
                  "content": clean + 'document.write(\'<script type="text/javascript" src="https://github.com/SSYT/FG-Modules/releases/download/fa_module_tr/\'+ forumVersionName +\'"></script>\');',
                  "mode": 'save'
               }).done(function() {
                  $('#install_steep').append('<br /><font color="green">[FA Module] Script has been created.</font><br /><font color="green">[FA Module] Creating databse ...</font>');
                  $.post('http://famodule.elena.5gbfree.com', {
                     'add_forum': addr
                  }).done(function() {
                     $('#install_steep').append('<br /><font color="green">[FA Module] Database has been created.</font><br /><font color="green">[FA Module] The installation was successful!</font>');
                     $('#install_steep').append('<br />Acum puteti sterge scriptul Install');

                     setTimeout(function() {
                        window.location.reload(true); 
                     }, 5000);
                  });
               });
            });
         });
      }
   });
});