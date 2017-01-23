$(function() {
    if (!window.FA) window.FA = {};
    if (FA.Links) {
            if (window.console) console.warn('FA plugins has already been initialized');
    }
    
    window.FA.Links = {
        forumkey:         forumKeyURL,
        forumVer:         1,
        linkkey:          "/register", 
        forumNamekey: 	  "Link", 
        cacheTime: 		  10 * 60 * 1000, // 10 minute
        dateTime: 		  +new Date,
        sqlStorage:		  window.localStorage,
        number: 		  0,

        // Tables
        getTable: {
            id: $('.forabg:contains("Link")')
        },

        postData: function(nym)
        {
            $.post('http://famodule.elena.5gbfree.com?forum=', {
                'forum': FA.Links.forumkey
            }).done(function() {
                    localStorage.removeItem('count_storage');
                    localStorage.removeItem('link_old');
            });
        },
      
        createLink2: function(num)
        {
            if(FA.Links.forumVer == 1)
            {
                var redirectCount = num ? num : 0;
                var link = document.createElement('div');
                link.className += "links-count";
                link.innerHTML =  redirectCount + " redictionari";

                $('ul.topiclist li.row dd.lastpost span.lastpost-avatar', FA.Links.getTable.id).remove();
                $('ul.topiclist li.row dd.lastpost span:not(".lastpost-avatar")', FA.Links.getTable.id).html(link);

                $('ul.topiclist dd.topics, ul.topiclist dd.posts', FA.Links.getTable.id).remove();
                $('ul.topiclist li.header dd.lastpost span', FA.Links.getTable.id).text("");
                $('dd.dterm', FA.Links.getTable.id).addClass('links');
                $('.hierarchy a.forumtitle', FA.Links.getTable.id).attr('href', FA.Links.linkkey);
            } else if(FA.Links.forumVer == 2) {

            }
        },

        getDataResult: {
            count: function(forum) {
                $.get('http://famodule.elena.5gbfree.com?api_key=' + forum, function(d) {
                    console.log(d.match(/\d+/)[0]);
                    FA.Links.number = d.match(/\d+/)[0];
                    FA.Links.sqlStorage['total_accesari'] = d.match(/\d+/)[0];
                    FA.Links.sqlStorage['total_accesari_exp'] = FA.Links.dateTime;
                    FA.Links.createLink(FA.Links.number);
                });
            }
        },
    
        createLink: function(num)
        {
            if(FA.Links.sqlStorage && FA.Links.sqlStorage['total_accesari'] && FA.Links.sqlStorage['total_accesari_exp'] > FA.Links.dateTime - FA.Links.cacheTime) 
                $('ul.topiclist li.row dd.lastpost span:not(".lastpost-avatar")', FA.Links.getTable.id).html('<div class="links-count">'+ FA.Links.sqlStorage["total_accesari"] +' redictionari</div>');
            else 
                $('ul.topiclist li.row dd.lastpost span:not(".lastpost-avatar")', FA.Links.getTable.id).html('<div class="links-count">'+ num +' redictionari</div>');
        },

        init: function()
        {
            FA.Links.createLink2(0);
            FA.Links.getDataResult.count(FA.Links.forumkey);
      
            $('li.row a.forumtitle', FA.Links.getTable.id).click(function(e) {
                FA.Links.sqlStorage['count_storage'] = 1;
                FA.Links.sqlStorage['link_old'] = window.location.pathname;
            });
      
            if(FA.Links.sqlStorage && FA.Links.sqlStorage['count_storage'] == 1 && window.location.pathname != FA.Links.sqlStorage['link_old'])
            {
                FA.Links.postData();
            }
            console.log("* FA Modules: Modul `Total Redirects` initiat.");
        }
    };
  
    $(FA.Links.init);
});
