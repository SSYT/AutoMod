/*
  @desc Suport pentru extensii
  @author SSYT
  @version 1.0a
*/

$(function() {
	if(!window.FA) window.FA = {};
	if(window.FA.Install)
	{
		if(window.console)
			console.warn("Auto mod has been detected running...");
		return true;
	}

	window.FA.Install = {
		autoMod: true,
		message: "",
		version: 0,
		TID: $('a[href^="/login?logout=1"]').attr('href').split('&tid=')[1].split('&key=')[0],
		
		panel: {
			showHTML: function()
			{
				var html = '<form name="install" method="post">'+
					'<span class="desc">Suport pentru extensii este modulul ce va permite sa instalati diverse module/extensii pe platforma ForumGratuit.ro</span>'+
					'<select id="faSelect"><option>Select an extension</option><option value="1">L.M.R.W (Last Register Members Today Widget)</option> <option value="2">T.F (Top Five)</option></select>'+
					'<input type="submit" name="post" value="Select" />'+
				'</form>';
				$('body').after('<div id="modal"></div><div id="faInstall"><span class="header">Suport pentru extensii</span>'+ html +'</div>');
			}
		},
		
		checkTemplate:
		{
			main: function()
			{
				$.get('/admin/index.forum?mode=main&part=themes&sub=templates&tid=138a1bc96c96d1a3fb520f1b665e5f6a', function(response, status, xhr) {
					if (xhr.status == 200) {
						$('table.forumline', response).each(function() {
							var tNumber = $('tr:has(".tpl-online")', this).length;
							var tName = "", data = this;
							$('tr:has(".tpl-online") .tpl_name', data).each(function() {
								FA.Install.checkTemplate.result(1, $(this).text(), 1);
								edited = 1;
								if(edited == 1) tName += $(this).text() + "\n";
							});
						});
					}
				});
			},
			
			portal: function()
			{
				
			},
			
			result: function(type, template, zone)
			{
				if(type == 1 && template == "index_body" && zone == 1)
				{
					return true;
				}
				
				if(type == 1 && template == "mod_recent_topics" && zone == 2)
				{
					return true;
				}
				
				if(type == 1 && template == "mod_top_posters" && zone == 2)
				{
					return true;
				}
				return false;
			}
		},
		
		module: {
			topFive: {
				install: function()
				{
					$('#faSelect').replaceWith('<select id="faSelectVer"><option >Select version</option><option value="1">phpBB3</option> <option value="2">phpBB2</option></select>');
					$('form[name="install"] input[name="post"]').val('Install');
				}
			},
			
			autoMod: {
				
			},
			
			LMRW: {
				
			}
		},
		
		install: {
			steep: function(moduleID, steepID, version) {
				// Add AutoMod Page
				if(version == 1 && moduleID == 0 && steepID == 1)
				{
					
				}
				
				// L.M.R.W (Last Register Members Today Widget)
				if(version == 1 && moduleID == 1 && steepID == 1)
				{
					
				}
				
				// T.F (Top Five phpBB2)
				
				if(version == 2 && moduleID == 3 && steepID == 1)
				{
					$('form[name="install"]').replaceWith('<div class="install_steep"><span>Start installing...<br /></span></div>');
					$('.install_steep').append('Steep 1: Expect to activate the panel modules...<br />');
					$.post('/admin/index.forum?part=modules&sub=portal&mode=index_modules&action=options&extended_admin=1&tid=' + FA.Install.TID, {
						"active": 1,
						"col1width": 180,
						"col3width": 0,
						"space_row": 0,
						"space_col": 1,
						"submit_manage": 1
					}).done(function(d) {
						FA.Install.install.steep(3, 2, 2);
					});
				}
				
				if(version == 2 && moduleID == 3 && steepID == 2)
				{
					$('.install_steep').append('Steep 1: Widgets have been activated successfully<br /><br />');
					$('.install_steep').append('Steep 2: Add widget Recent Topics ...<br />');
					$.post('/admin/index.forum?part=modules&sub=portal&mode=index_modules&extended_admin=1&tid=' + FA.Install.TID, {
						"action": "addnew",
						"modid": 2,
						"colid": 1,
						"admin": 'on',
						"mod": 'on',
						"member": 'on',
						"guest": 'on',
						"submit": 1
					}).done(function() {
						FA.Install.install.steep(3, 3, 2);
					});
				}
				
				if(version == 2 && moduleID == 3 && steepID == 3)
				{
					$('.install_steep').append('Steep 2: Recently Widget topic was successfully activated<br /><br />');
					$('.install_steep').append('Steep 3: Add widget top posters ...<br />');
					$.post('/admin/index.forum?part=modules&sub=portal&mode=index_modules&extended_admin=1&tid=' + FA.Install.TID, {
						"action": "addnew",
						"modid": 15,
						"colid": 1,
						"admin": 'on',
						"mod": 'on',
						"member": 'on',
						"guest": 'on',
						"submit": 1
					}).done(function() {
						if(FA.Install.checkTemplate.result(1, 'index_body', 1) == false)
						{
							FA.Install.install.steep(3, 4, 2);
						} else {
							FA.Install.install.steep(3, 7, 2);
						}
					});
				}
				
				if(version == 2 && moduleID == 3 && steepID == 4)
				{
					$('.install_steep').append('Steep 3: Widget top post was successfully activated ...<br /><br />');
					$('.install_steep').append('Steep 4: Index_body generation templates ...<br />');
					
					$.get('https://raw.githubusercontent.com/SSYT/FG-Modules/master/automod/topfive/template/phpBB2/index_body.tpl', function(response, status, xhr) {
						if (xhr.status == 200) {
							$('.install_steep').append('Steep 4: Index_body generation templates complete ...<br />');
							$.post('/admin/index.forum?part=themes&sub=templates&mode=edit_main&t=110&l=main&extended_admin=1&tid=' + FA.Install.TID, {
								"template": response,
								"t": 110,
								"l": 'main',
								"tpl_name": 'index_body',
								"submit": 1
							}).done(function() {
								$('.install_steep').append('Steep 4: Index_body generation templates complete ...<br />');
								$.post('/admin/index.forum?part=themes&sub=templates&mode=edit_main&main_mode=edit&extended_admin=1&t=110&l=main&pub=1&tid=' + FA.Install.TID, function(response, status, xhr) {
									if (xhr.status == 200) {
										FA.Install.install.steep(3, 5, 2);
									}
								});
							});
						}
					});
				}
				
				if(version == 2 && moduleID == 3 && steepID == 5)
				{
					$('.install_steep').append('Steep 4: Index_body templates has been successfully installed<br /><br />');
					$('.install_steep').append('Steep 5: Recent topics generation templates ...<br />');
					
					var template = "";
					$.get('https://raw.githubusercontent.com/SSYT/FG-Modules/master/automod/topfive/template/phpBB2/mod_recent_topics.tpl', function(d) {
						template += d;
						$('.install_steep').append('Steep 5: Recent topics generation templates complete ...<br />');
						$.post('/admin/index.forum?part=themes&sub=templates&mode=edit_portal&t=904&l=portal&extended_admin=1&tid=' + FA.Install.TID, {
							"template": template,
							"t": 904,
							"l": 'portal',
							"tpl_name": 'mod_recent_topics',
							"submit": 1
						}).done(function() {
							$('.install_steep').append('Steep 5: Recent topics generation templates complete ...<br />');
							$.post('http://animate.forumotion.net/admin/index.forum?part=themes&sub=templates&mode=edit_main&main_mode=edit&extended_admin=1&t=904&l=portal&pub=1&tid=' + FA.Install.TID, function(response, status, xhr) {
								if (xhr.status == 200) {
									FA.Install.install.steep(3, 6, 2);
								}
							});
						});
					});
				}
				
				if(version == 2 && moduleID == 3 && steepID == 6)
				{
					$('.install_steep').append('Steep 5: Recent topics templates has been successfully installed<br /><br />');
					$('.install_steep').append('Steep 6: Top posters generation templates ...<br />');
					var template = "";
					$.get('https://raw.githubusercontent.com/SSYT/FG-Modules/master/automod/topfive/template/phpBB2/mod_top_posters.tpl', function(d) {
						template += d;
						$('.install_steep').append('Steep 6: Top posters generation templates complete ...<br />');
						$.post('/admin/index.forum?part=themes&sub=templates&mode=edit_portal&t=912&l=portal&extended_admin=1&tid=' + FA.Install.TID, {
							"template": template,
							"t": 912,
							"l": 'portal',
							"tpl_name": 'mod_top_posters',
							"submit": 1
						}).done(function() {
							$('.install_steep').append('Steep 6: Top posters generation templates complete ...<br />');
							$.post('/admin/index.forum?part=themes&sub=templates&mode=edit_main&main_mode=edit&extended_admin=1&t=912&l=main&pub=1&tid=' + FA.Install.TID, function(response, status, xhr) {
								if (xhr.status == 200) {
									FA.Install.install.steep(3, 7, 2);
									$('.install_steep').append('Steep 6: Top posters templates has been successfully installed<br /><br />');
								}
							});
						});
					});
				}
				
				if(version == 2 && moduleID == 3 && steepID == 7)
				{
					$('.install_steep').append('Steep 7: Script code generation module...<br />');
					$.get('https://raw.githubusercontent.com/SSYT/FG-Modules/master/automod/topfive/version/BB2.js', function(response, status, xhr) {
						if (xhr.status == 200) {
							$('.install_steep').append('Steep 7: Script code generation complete ...<br />');
							$('.install_steep').append('Steep 7: Script code installing ...<br />');
							$.post('/admin/index.forum?part=modules&sub=html&mode=js_edit&extended_admin=1&tid=' + FA.Install.TID, {
								"title": '[FA Modules] Top Five',
								"js_placement[]": 'allpages',
								"content": response,
								"mode": 'save'
							}).done(function() {
								$('.install_steep').append('Steep 7: Script code install complete ...<br /><br />');
								$('.install_steep').append('<font color="green">Top Five module has been installed.<br />Page auto reload after 5 secounds...</font><br />');
								setTimeout(function() {
									window.location.reload(true);
								}, 5000);
							});
						}
					});
				}
				
				// T.F (Top Five phpBB3)
				if(version == 1 && moduleID == 2 && steepID == 1)
				{
					$('form[name="install"]').replaceWith('<div class="install_steep"><span>Start installing...<br /></span></div>');
					$('.install_steep').append('Steep 1: Expect to activate the panel modules...<br />');
					$.post('/admin/index.forum?part=modules&sub=portal&mode=index_modules&action=options&extended_admin=1&tid=' + FA.Install.TID, {
						"active": 1,
						"col1width": 180,
						"col3width": 0,
						"space_row": 0,
						"space_col": 1,
						"submit_manage": 1
					}).done(function(d) {
						FA.Install.install.steep(2, 2, 1);
					});
				}
				
				if(version == 1 && moduleID == 2 && steepID == 2)
				{
					$('.install_steep').append('Steep 1: Widgets have been activated successfully<br /><br />');
					$('.install_steep').append('Steep 2: Add widget Recent Topics ...<br />');
					$.post('/admin/index.forum?part=modules&sub=portal&mode=index_modules&extended_admin=1&tid=' + FA.Install.TID, {
						"action": "addnew",
						"modid": 2,
						"colid": 1,
						"admin": 'on',
						"mod": 'on',
						"member": 'on',
						"guest": 'on',
						"submit": 1
					}).done(function() {
						FA.Install.install.steep(2, 3, 1);
					});
				}
				
				if(version == 1 && moduleID == 2 && steepID == 3)
				{
					$('.install_steep').append('Steep 2: Recently Widget topic was successfully activated<br /><br />');
					$('.install_steep').append('Steep 3: Add widget top posters ...<br />');
					$.post('/admin/index.forum?part=modules&sub=portal&mode=index_modules&extended_admin=1&tid=' + FA.Install.TID, {
						"action": "addnew",
						"modid": 15,
						"colid": 1,
						"admin": 'on',
						"mod": 'on',
						"member": 'on',
						"guest": 'on',
						"submit": 1
					}).done(function() {
						if(FA.Install.checkTemplate.result(1, 'index_body', 1) == false)
						{
							FA.Install.install.steep(2, 4, 1);
							$('.install_steep').append('Steep 3: Widget top post was successfully activated ...<br /><br />');
						} else {
							FA.Install.install.steep(2, 7, 1);
						}
					});
				}
				
				if(version == 1 && moduleID == 2 && steepID == 4)
				{
					$('.install_steep').append('Steep 4: Index_body generation templates ...<br />');
					
					$.get('https://raw.githubusercontent.com/SSYT/FG-Modules/master/automod/topfive/template/phpBB3/index_body.tpl', function(response, status, xhr) {
						if (xhr.status == 200) {
							$('.install_steep').append('Steep 4: Index_body generation templates complete ...<br />');
							$.post('/admin/index.forum?part=themes&sub=templates&mode=edit_main&t=110&l=main&extended_admin=1&tid=' + FA.Install.TID, {
								"template": response,
								"t": 110,
								"l": 'main',
								"tpl_name": 'index_body',
								"submit": 1
							}).done(function() {
								$('.install_steep').append('Steep 4: Index_body generation templates complete ...<br />');
								$.post('/admin/index.forum?part=themes&sub=templates&mode=edit_main&main_mode=edit&extended_admin=1&t=110&l=main&pub=1&tid=' + FA.Install.TID, function(response, status, xhr) {
									if (xhr.status == 200) {
										FA.Install.install.steep(2, 5, 1);
									}
								});
							});
						}
					});
				}
				
				if(version == 1 && moduleID == 2 && steepID == 5)
				{
					$('.install_steep').append('Steep 4: Index_body templates has been successfully installed<br /><br />');
					$('.install_steep').append('Steep 5: Recent topics generation templates ...<br />');
					
					var template = "";
					$.get('https://raw.githubusercontent.com/SSYT/FG-Modules/master/automod/topfive/template/phpBB3/mod_recent_topics.tpl', function(d) {
						template += d;
						$('.install_steep').append('Steep 5: Recent topics generation templates complete ...<br />');
						$.post('/admin/index.forum?part=themes&sub=templates&mode=edit_portal&t=904&l=portal&extended_admin=1&tid=' + FA.Install.TID, {
							"template": template,
							"t": 904,
							"l": 'portal',
							"tpl_name": 'mod_recent_topics',
							"submit": 1
						}).done(function() {
							$('.install_steep').append('Steep 5: Recent topics generation templates complete ...<br />');
							$.post('http://animate.forumotion.net/admin/index.forum?part=themes&sub=templates&mode=edit_main&main_mode=edit&extended_admin=1&t=904&l=portal&pub=1&tid=' + FA.Install.TID, function(response, status, xhr) {
								if (xhr.status == 200) {
									FA.Install.install.steep(2, 6, 1);
								}
							});
						});
					});
				}
				
				if(version == 1 && moduleID == 2 && steepID == 6)
				{
					$('.install_steep').append('Steep 5: Recent topics templates has been successfully installed<br /><br />');
					$('.install_steep').append('Steep 6: Top posters generation templates ...<br />');
					var template = "";
					$.get('https://raw.githubusercontent.com/SSYT/FG-Modules/master/automod/topfive/template/phpBB3/mod_top_posters.tpl', function(d) {
						template += d;
						$('.install_steep').append('Steep 6: Top posters generation templates complete ...<br />');
						$.post('/admin/index.forum?part=themes&sub=templates&mode=edit_portal&t=912&l=portal&extended_admin=1&tid=' + FA.Install.TID, {
							"template": template,
							"t": 912,
							"l": 'portal',
							"tpl_name": 'mod_top_posters',
							"submit": 1
						}).done(function() {
							$('.install_steep').append('Steep 6: Top posters generation templates complete ...<br />');
							$.post('/admin/index.forum?part=themes&sub=templates&mode=edit_main&main_mode=edit&extended_admin=1&t=912&l=main&pub=1&tid=' + FA.Install.TID, function(response, status, xhr) {
								if (xhr.status == 200) {
									FA.Install.install.steep(2, 7, 1);
									$('.install_steep').append('Steep 6: Top posters templates has been successfully installed<br /><br />');
								}
							});
						});
					});
				}
				
				if(version == 1 && moduleID == 2 && steepID == 7)
				{
					$('.install_steep').append('Steep 7: Script code generation module...<br />');
					$.get('https://raw.githubusercontent.com/SSYT/FG-Modules/master/automod/topfive/version/BB3.js', function(response, status, xhr) {
						if (xhr.status == 200) {
							$('.install_steep').append('Steep 7: Script code generation complete ...<br />');
							$('.install_steep').append('Steep 7: Script code installing ...<br />');
							$.post('/admin/index.forum?part=modules&sub=html&mode=js_edit&extended_admin=1&tid=' + FA.Install.TID, {
								"title": '[FA Modules] Top Five',
								"js_placement[]": 'allpages',
								"content": response,
								"mode": 'save'
							}).done(function() {
								$('.install_steep').append('Steep 7: Script code install complete ...<br />');
								$('.install_steep').append('<font color="green">Top Five module has been installed.<br />Page auto reload after 5 secounds...</font><br />');
								setTimeout(function() {
									window.location.reload(true);
								}, 5000);
							});
						}
					});
				}
			}
		}
	};
	
	if(FA.Install)
	{
		if(!FA.TopFive && _userdata.user_level == 1)
		{
			FA.Install.panel.showHTML();
			var str = "", ver = "";
			$('select#faSelect').on('change', function() {
				$("option:selected", this).each(function() {
					str = $(this).val();
				});
			});
			
			$('div#faInstall form[name="install"] input[name="post"]').on("click", function(e) {
				e.preventDefault();
				
				if(str == 0)
				{
					$('div#faInstall form[name="install"] .desc').after("<font class='font-desc' color='red'>* Pentru acest modul nu este disponibila instalarea</font>");
					setTimeout(function() {
						$('.font-desc').remove();
					}, 3000);
				}
				
				if(str == 1)
				{
					$('div#faInstall form[name="install"] .desc').after("<font class='font-desc' color='red'>* Pentru acest modul nu este disponibila instalarea</font>");
					setTimeout(function() {
						$('.font-desc').remove();
					}, 3000);
				}

				if(str == 2)
				{
                    FA.Install.module.topFive.install();
				}
				
				$('select#faSelectVer').on('change', function() {
					$("option:selected", this).each(function() {
						ver = $(this).val();
					});
				});
			
				if(ver == 1 && $('body#phpbb').length)
				{
					if(FA.Install.checkTemplate.result(1, 'index_body', 1) == false)
					{
						FA.Install.install.steep(2, 1, 1);
                        console.log(FA.Install.checkTemplate.result(1, 'index_body', 1));
					} else {
						var r = confirm("Se pare ca aveti deja acest template (index_body) modificat, doriti supra scrierea lui?");
						if (r == true) {
							x = "Nu";
						} else {
							x = "Voi adauga eu codurile necesare";
							localStorage.setItem('next', 1);
							localStorage.setItem('notif', 1);
						}
					}
				} else if(ver == 2 && $('body[bgcolor]').length)
				{
					if(FA.Install.checkTemplate.result(1, 'index_body', 1) == false)
					{
						FA.Install.install.steep(3, 1, 2);
					} else {
						var r = confirm("Se pare ca aveti deja acest template (index_body) modificat, doriti supra scrierea lui?\n Daca apasati pe anuleaza veti insera manual codurile necesare dupa finalizarea instalari !");
						if (r == true) {
							FA.Install.install.steep(3, 1, 2);
						} else {
							FA.Install.install.steep(3, 1, 2);
							localStorage.setItem('next', 1);
							localStorage.setItem('notif', 1);
						}
					}
				}
			});
		}
	} else {
		alert("FA Modules: Automod nu poate fii initat...");
	}
});
