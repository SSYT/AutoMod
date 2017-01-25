/*
  @desc Suport pentru extensii
  @author SSYT
  @version 1.0b
*/

$(function() {
	if(!window.FA) window.FA = {};
	if(window.FA.SSMod)
	{
		if(window.console)
			console.warn("Auto mod has been detected running...");
		return true;
	}

	window.FA.SSMod = {
		autoMod: true,
		message: "",
		version: 0,
		TID: $('a[href^="/login?logout=1"]').attr('href').split('&tid=')[1].split('&key=')[0],
		
		panel: {
			showHTML: function()
			{
				var html = '<form name="install" method="post">'+
					'<span class="desc">Suport pentru extensii este modulul ce va permite sa instalati diverse module/extensii pe platforma ForumGratuit.ro</span>'+
					'<select id="faSelect"><option>Select an extension</option> <option value="1">T.F.M (Top Five Mod)</option> <option value="2">N.M.T (Newest Members Today)</option> <option value="3">T.P (Topic Preview)</option></select>'+
					'<input type="submit" name="post" value="Select" />'+
				'</form>';
				$('body').after('<div id="modal"></div><div id="faInstall"><span class="header">Suport pentru extensii</span>'+ html +'</div>');
			}
		},
		
		faPanel: {
			add: function()
			{
				FA.SSMod.panel.showHTML();
			},
			extension: {}
		},
		
		checkTemplate:
		{
			main: function()
			{
				$.get('/admin/index.forum?mode=main&part=themes&sub=templates&tid=' + FA.SSMod.TID, function(response, status, xhr) {
					if (xhr.status == 200) {
						$('table.forumline', response).each(function() {
							var tNumber = $('tr:has(".tpl-online")', this).length;
							var data = this;
							$('tr:has(".tpl-online") .tpl_name', data).each(function() {
								FA.SSMod.checkTemplate.result(1, $(this).text(), 1);
							});
						});
					}
				});
			},
			
			portal: function()
			{
				$.get('/admin/index.forum?mode=portal&part=themes&sub=templates&tid=' + FA.SSMod.TID, function(response, status, xhr) {
					if (xhr.status == 200) {
						$('table.forumline', response).each(function() {
							var tNumber = $('tr:has(".tpl-online")', this).length;
							var data = this;
							$('tr:has(".tpl-online") .tpl_name', data).each(function() {
								FA.SSMod.checkTemplate.result(1, $(this).text(), 2);
							});
						});
					}
				});
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
				added: 1,
				plugins: {},
				install: function()
				{
					$('#faSelect').replaceWith('<select id="faSelectVer"><option >Select version</option><option value="1">phpBB3</option> <option value="2">phpBB2</option></select>');
					$('form[name="install"] input[name="post"]').val('Install');
				}
			},
			
			autoMod: {
				continueInstall: function()
				{
					if(localStorage.getItem('version') == 2)
					{
						var r = confirm("Se pare ca ai omis un pas la instalare, doresti sa continui instalarea modului Top Five?");
						if (r == true) {
							$('body').after('<div id="modal"></div><div id="faInstall"><span class="header">Suport pentru extensii:</span><div>Se pare ca la instalare ati omis unul sau mai multi pasi.\n Apasati pe `Install` pentru a continua instalarea.</div><br /><input type="submit" class="install_faModule" value="Continue" /></div>');
							$('.install_faModule').click(function(e) {
								e.preventDefault();
								$btn = $(this);
								if(localStorage.getItem('next') == 1)
								{
									$btn.hide();
									$('#faInstall > div').html("Trebuie sa introduci in template <u>index_body</u> dupa { BOARD_INDEX } urmatorul cod:<br />");
									$.get('https://raw.githubusercontent.com/SSYT/SSMod/master/automod/topfive/template/phpBB2/manual/index_body.tpl', function(d) {
										$('#faInstall > div').append('<br /><textarea style="margin: 10px -3.40625px 0px 0px; width: 539px; height: 104px;" id="template_val"></textarea>');
									}).done(function(d) {
										$('#faInstall #template_val').val(d);
										$btn.val('Next');
										$btn.show();
										localStorage.setItem('next', 2);
									});
								}
								
								else if(localStorage.getItem('next') == 2)
								{
									$btn.hide();
									$('#faInstall > div').html("Trebuie sa inlocuiesti template <u>mod_recent_topics</u> cu acest cod:");
									$.get('https://github.com/SSYT/SSMod/raw/master/automod/topfive/template/phpBB2/manual/mod_recent_topics.tpl', function(d) {
										$('#faInstall > div').append('<br /><textarea style="margin: 10px -3.40625px 0px 0px; width: 539px; height: 104px;" id="template_val"></textarea>');
									}).done(function(d) {
										$('#faInstall #template_val').val(d);
										$btn.val('Next');
										$btn.show();
										localStorage.setItem('next', 3);
									});
								}
								
								else if(localStorage.getItem('next') == 3)
								{
									$btn.hide();
									$('#faInstall > div').html("Trebuie sa inlocuiesti template <u>mod_top_posters</u> cu acest cod:");
									$.get('https://github.com/SSYT/SSMod/blob/master/automod/topfive/template/phpBB2/manual/mod_top_posters.tpl', function(d) {
										$('#faInstall > div').append('<br /><textarea style="margin: 10px -3.40625px 0px 0px; width: 539px; height: 104px;" id="template_val"></textarea>');
									}).done(function(d) {
										$('#faInstall #template_val').val(d);
										$btn.val('Next');
										$btn.show();
										localStorage.setItem('next', 4);
									});
								} else  if(localStorage.getItem('next') == 4)
								{
									$btn.val('Finish');
									$('#faInstall > div').html("Felicitari ai instalat cu succes acel modul.<br />Va multumim pentru utilizarea serviciilor");
									localStorage.removeItem('next');
									localStorage.removeItem('notif');
									localStorage.removeItem('version');
									setTimeout(function() {
										window.location.reload(true);
									}, 2000);
								}
							});
						} else {
							localStorage.removeItem('next');
							localStorage.removeItem('notif');
							localStorage.removeItem('version');
						}
					}

					if(localStorage.getItem('version') == 1)
					{
						var r = confirm("Se pare ca ai omis un pas la instalare, doresti sa continui instalarea modului Top Five?");
						if (r == true) {
							$('body').after('<div id="modal"></div><div id="faInstall"><span class="header">Suport pentru extensii:</span><div>Se pare ca la instalare ati omis unul sau mai multi pasi.\n Apasati pe `Install` pentru a continua instalarea.</div><br /><input type="submit" class="install_faModule" value="Continue" /></div>');
							$('.install_faModule').click(function(e) {
								e.preventDefault();
								$btn = $(this);
								if(localStorage.getItem('next') == 1)
								{
									$btn.hide();
									$('#faInstall > div').html("Trebuie sa introduci in template <u>index_body</u> dupa { BOARD_INDEX } urmatorul cod:<br />");
									$.get('https://raw.githubusercontent.com/SSYT/SSMod/master/automod/topfive/template/phpBB3/manual/index_body.tpl', function(d) {
										$('#faInstall > div').append('<br /><textarea style="margin: 10px -3.40625px 0px 0px; width: 539px; height: 104px;" id="template_val"></textarea>');
									}).done(function(d) {
										$('#faInstall #template_val').val(d);
										$btn.val('Next');
										$btn.show();
										localStorage.setItem('next', 2);
									});
								}
								
								else if(localStorage.getItem('next') == 2)
								{
									$btn.hide();
									$('#faInstall > div').html("Trebuie sa inlocuiesti template <u>mod_recent_topics</u> cu acest cod:");
									$.get('https://raw.githubusercontent.com/SSYT/SSMod/master/automod/topfive/template/phpBB3/manual/mod_recent_topics.tpl', function(d) {
										$('#faInstall > div').append('<br /><textarea style="margin: 10px -3.40625px 0px 0px; width: 539px; height: 104px;" id="template_val"></textarea>');
									}).done(function(d) {
										$('#faInstall #template_val').val(d);
										$btn.val('Next');
										$btn.show();
										localStorage.setItem('next', 3);
									});
								}
								
								else if(localStorage.getItem('next') == 3)
								{
									$btn.hide();
									$('#faInstall > div').html("Trebuie sa inlocuiesti template <u>mod_top_posters</u> cu acest cod:");
									$.get('https://raw.githubusercontent.com/SSYT/SSMod/master/automod/topfive/template/phpBB3/manual/mod_top_posters.tpl', function(d) {
										$('#faInstall > div').append('<br /><textarea style="margin: 10px -3.40625px 0px 0px; width: 539px; height: 104px;" id="template_val"></textarea>');
									}).done(function(d) {
										$('#faInstall #template_val').val(d);
										$btn.val('Next');
										$btn.show();
										localStorage.setItem('next', 4);
									});
								} else  if(localStorage.getItem('next') == 4)
								{
									$btn.val('Finish');
									$('#faInstall > div').html("Felicitari ai instalat cu succes acel modul.<br />Va multumim pentru utilizarea serviciilor");
									localStorage.removeItem('next');
									localStorage.removeItem('notif');
									localStorage.removeItem('version');
									setTimeout(function() {
										window.location.reload(true);
									}, 2000);
								}
							});
						} else {
							localStorage.removeItem('next');
							localStorage.removeItem('notif');
							localStorage.removeItem('version');
						}
					}
				}
			},
			
			LMRW: {
				added: 1,
				install: function()
				{
					FA.SSMod.install.steep(1, 1, 1)
				},
				plugins: {}
			},
			
			TPM: {
				added: 1,
				install: function(ver)
				{
					FA.SSMod.install.steep(4, 1, ver)
				},
				plugins: {}
			}
		},
		
		install: {
			steep: function(moduleID, steepID, version) {
				// Add AutoMod Page
				if(version == 1 && moduleID == 99 && steepID == 1)
				{
					
				}
				
				// N.M.T (Newest Members Today phpBB3)
				if(version == 1 && moduleID == 1 && steepID == 1)
				{
					$('form[name="install"]').replaceWith('<div class="install_steep"><span>Start installing...<br /></span></div>');
					$('.install_steep').append('Steep 1: Expect to activate the panel modules...<br />');
					$.post('/admin/index.forum?part=modules&sub=portal&mode=index_modules&action=options&extended_admin=1&tid=' + FA.SSMod.TID, {
						"active": 1,
						"col1width": 180,
						"col3width": 0,
						"space_row": 0,
						"space_col": 1,
						"submit_manage": 1
					}).done(function(d) {
						FA.SSMod.install.steep(1, 2, 1);
					});
				}
				
				else if(version == 1 && moduleID == 1 && steepID == 2)
				{
					$('.install_steep').append('Steep 1: Widgets have been activated successfully<br /><br />');
					$('.install_steep').append('Steep 2: Create widget Newest Members Today ...<br />');
					$.post('/admin/index.forum?part=modules&sub=portal&mode=create_index_mod&dest=admin_index_modules&extended_admin=1&tid=' + FA.SSMod.TID, {
						"mod_name": 'Newest Members Today',
						"mod_table": 1,
						"mod_title": 'Newest Members Today',
						"mod_source": '<ul id="last_regMembers"></ul>',
						"modid": 0,
						"pid": -1,
						"modtype": 1,
						"mode": 'editsave_index_mod'
					}).done(function(d) {
						FA.SSMod.install.steep(1, 3, 1);
					});
				}

				else if(version == 1 && moduleID == 1 && steepID == 3)
				{
					$('.install_steep').append('Steep 2: Newest Members Today was successfully created<br />');
					$('.install_steep').append('Steep 2: Publish widget Newest Members Today ...<br />');
					var widgetID = 0;
					$.get('/admin/index.forum?part=modules&sub=portal&mode=index_modules&extended_admin=1&tid=' + FA.SSMod.TID, function(d) {
						$('form[name="FNEW2"] dd select#modid_perso', d).each(function() {
							widgetID = $('option:contains("Newest Members Today")', this).val();
						});
						
						if(widgetID != 0)
						{
							$.post('/admin/index.forum?part=modules&sub=portal&mode=index_modules&extended_admin=1&tid=' + FA.SSMod.TID, {
								"action": 'addnew',
								"modid": widgetID,
								"colid": 1,
								"admin": 'on',
								"mod": 'on',
								"member": 'on',
								"guest": 'on',
								"submit": 1
							}).done(function() {
								FA.SSMod.install.steep(1, 4, 1);
							});	
						}
					});
				}
				
				else if(version == 1 && moduleID == 1 && steepID == 4)
				{
					$('.install_steep').append('Steep 2: Newest Members Today was successfully activated<br /><br />');
					$('.install_steep').append('Steep 3: Script code generation module...<br />');
					$.get('https://raw.githubusercontent.com/SSYT/SSMod/master/automod/javascript/widget/nmt.ext.js', function(response, status, xhr)
					{
						if (xhr.status == 200) {
							$('.install_steep').append('Steep 3: Script code generation complete ...<br />');
							$('.install_steep').append('Steep 3: Script code installing ...<br />');
							
							$.post('/admin/index.forum?part=modules&sub=html&mode=js_edit&extended_admin=1&tid=' + FA.SSMod.TID, {
								"title": '[SSMod Modules] Newest Member Today',
								"js_placement[]": 'allpages',
								"content": response,
								"mode": 'save'
							}).done(function() {
								$('.install_steep').append('Steep 3: Script code install complete ...<br /><br />');
								$('.install_steep').append('<font color="green">Newest Member Today module has been installed.<br />Page auto reload after 5 secounds...</font><br />');
								setTimeout(function() {
									window.location.reload(true);
								}, 5000);
							});
						}
					});
				}
				
				// T.F (Top Five phpBB2)
				
				if(version == 2 && moduleID == 3 && steepID == 1)
				{
					$('form[name="install"]').replaceWith('<div class="install_steep"><span>Start installing...<br /></span></div>');
					$('.install_steep').append('Steep 1: Expect to activate the panel modules...<br />');
					$.post('/admin/index.forum?part=modules&sub=portal&mode=index_modules&action=options&extended_admin=1&tid=' + FA.SSMod.TID, {
						"active": 1,
						"col1width": 180,
						"col3width": 0,
						"space_row": 0,
						"space_col": 1,
						"submit_manage": 1
					}).done(function(d) {
						FA.SSMod.install.steep(3, 2, 2);
					});
				}
				
				else if(version == 2 && moduleID == 3 && steepID == 2)
				{
					$('.install_steep').append('Steep 1: Widgets have been activated successfully<br /><br />');
					$('.install_steep').append('Steep 2: Add widget Recent Topics ...<br />');
					$.post('/admin/index.forum?part=modules&sub=portal&mode=index_modules&extended_admin=1&tid=' + FA.SSMod.TID, {
						"action": "addnew",
						"modid": 2,
						"colid": 1,
						"admin": 'on',
						"mod": 'on',
						"member": 'on',
						"guest": 'on',
						"submit": 1
					}).done(function() {
						FA.SSMod.install.steep(3, 3, 2);
					});
				}
				
				else if(version == 2 && moduleID == 3 && steepID == 3)
				{
					$('.install_steep').append('Steep 2: Recently Widget topic was successfully activated<br /><br />');
					$('.install_steep').append('Steep 3: Add widget top posters ...<br />');
					$.post('/admin/index.forum?part=modules&sub=portal&mode=index_modules&extended_admin=1&tid=' + FA.SSMod.TID, {
						"action": "addnew",
						"modid": 15,
						"colid": 1,
						"admin": 'on',
						"mod": 'on',
						"member": 'on',
						"guest": 'on',
						"submit": 1
					}).done(function() {
						if(FA.SSMod.checkTemplate.result(1, 'index_body', 1) == false || localStorage.getItem('accept') == 1)
						{
							FA.SSMod.install.steep(3, 4, 2);
						} else {
							FA.SSMod.install.steep(3, 7, 2);
						}
					});
				}
				
				else if(version == 2 && moduleID == 3 && steepID == 4)
				{
					$('.install_steep').append('Steep 3: Widget top post was successfully activated ...<br /><br />');
					$('.install_steep').append('Steep 4: Index_body generation templates ...<br />');
					
					$.get('https://raw.githubusercontent.com/SSYT/SSMod/master/automod/topfive/template/phpBB2/index_body.tpl', function(response, status, xhr) {
						if (xhr.status == 200) {
							$('.install_steep').append('Steep 4: Index_body generation templates complete ...<br />');
							$.post('/admin/index.forum?part=themes&sub=templates&mode=edit_main&t=110&l=main&extended_admin=1&tid=' + FA.SSMod.TID, {
								"template": response,
								"t": 110,
								"l": 'main',
								"tpl_name": 'index_body',
								"submit": 1
							}).done(function() {
								$('.install_steep').append('Steep 4: Index_body generation templates complete ...<br />');
								$.post('/admin/index.forum?part=themes&sub=templates&mode=edit_main&main_mode=edit&extended_admin=1&t=110&l=main&pub=1&tid=' + FA.SSMod.TID, function(response, status, xhr) {
									if (xhr.status == 200) {
										FA.SSMod.install.steep(3, 5, 2);
									}
								});
							});
						}
					});
				}
				
				else if(version == 2 && moduleID == 3 && steepID == 5)
				{
					$('.install_steep').append('Steep 4: Index_body templates has been successfully installed<br /><br />');
					$('.install_steep').append('Steep 5: Recent topics generation templates ...<br />');
					
					var template = "";
					$.get('https://raw.githubusercontent.com/SSYT/SSMod/master/automod/topfive/template/phpBB2/mod_recent_topics.tpl', function(d) {
						template += d;
						$('.install_steep').append('Steep 5: Recent topics generation templates complete ...<br />');
						$.post('/admin/index.forum?part=themes&sub=templates&mode=edit_portal&t=904&l=portal&extended_admin=1&tid=' + FA.SSMod.TID, {
							"template": template,
							"t": 904,
							"l": 'portal',
							"tpl_name": 'mod_recent_topics',
							"submit": 1
						}).done(function() {
							$('.install_steep').append('Steep 5: Recent topics generation templates complete ...<br />');
							$.post('/admin/index.forum?part=themes&sub=templates&mode=edit_main&main_mode=edit&extended_admin=1&t=904&l=portal&pub=1&tid=' + FA.SSMod.TID, function(response, status, xhr) {
								if (xhr.status == 200) {
									FA.SSMod.install.steep(3, 6, 2);
								}
							});
						});
					});
				}
				
				else if(version == 2 && moduleID == 3 && steepID == 6)
				{
					$('.install_steep').append('Steep 5: Recent topics templates has been successfully installed<br /><br />');
					$('.install_steep').append('Steep 6: Top posters generation templates ...<br />');
					var template = "";
					$.get('https://raw.githubusercontent.com/SSYT/SSMod/master/automod/topfive/template/phpBB2/mod_top_posters.tpl', function(d) {
						template += d;
						$('.install_steep').append('Steep 6: Top posters generation templates complete ...<br />');
						$.post('/admin/index.forum?part=themes&sub=templates&mode=edit_portal&t=912&l=portal&extended_admin=1&tid=' + FA.SSMod.TID, {
							"template": template,
							"t": 912,
							"l": 'portal',
							"tpl_name": 'mod_top_posters',
							"submit": 1
						}).done(function() {
							$('.install_steep').append('Steep 6: Top posters generation templates complete ...<br />');
							$.post('/admin/index.forum?part=themes&sub=templates&mode=edit_main&main_mode=edit&extended_admin=1&t=912&l=main&pub=1&tid=' + FA.SSMod.TID, function(response, status, xhr) {
								if (xhr.status == 200) {
									FA.SSMod.install.steep(3, 7, 2);
									$('.install_steep').append('Steep 6: Top posters templates has been successfully installed<br /><br />');
								}
							});
						});
					});
				}
				
				else if(version == 2 && moduleID == 3 && steepID == 7)
				{
					$('.install_steep').append('Steep 7: Script code generation module...<br />');
					$.get('https://raw.githubusercontent.com/SSYT/SSMod/master/automod/topfive/version/BB2.js', function(response, status, xhr) {
						if (xhr.status == 200) {
							$('.install_steep').append('Steep 7: Script code generation complete ...<br />');
							$('.install_steep').append('Steep 7: Script code installing ...<br />');
							$.post('/admin/index.forum?part=modules&sub=html&mode=js_edit&extended_admin=1&tid=' + FA.SSMod.TID, {
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
					$.post('/admin/index.forum?part=modules&sub=portal&mode=index_modules&action=options&extended_admin=1&tid=' + FA.SSMod.TID, {
						"active": 1,
						"col1width": 180,
						"col3width": 0,
						"space_row": 0,
						"space_col": 1,
						"submit_manage": 1
					}).done(function(d) {
						FA.SSMod.install.steep(2, 2, 1);
					});
				}
				
				else if(version == 1 && moduleID == 2 && steepID == 2)
				{
					$('.install_steep').append('Steep 1: Widgets have been activated successfully<br /><br />');
					$('.install_steep').append('Steep 2: Add widget Recent Topics ...<br />');
					$.post('/admin/index.forum?part=modules&sub=portal&mode=index_modules&extended_admin=1&tid=' + FA.SSMod.TID, {
						"action": "addnew",
						"modid": 2,
						"colid": 1,
						"admin": 'on',
						"mod": 'on',
						"member": 'on',
						"guest": 'on',
						"submit": 1
					}).done(function() {
						FA.SSMod.install.steep(2, 3, 1);
					});
				}
				
				else if(version == 1 && moduleID == 2 && steepID == 3)
				{
					$('.install_steep').append('Steep 2: Recently Widget topic was successfully activated<br /><br />');
					$('.install_steep').append('Steep 3: Add widget top posters ...<br />');
					$.post('/admin/index.forum?part=modules&sub=portal&mode=index_modules&extended_admin=1&tid=' + FA.SSMod.TID, {
						"action": "addnew",
						"modid": 15,
						"colid": 1,
						"admin": 'on',
						"mod": 'on',
						"member": 'on',
						"guest": 'on',
						"submit": 1
					}).done(function() {
						if(FA.SSMod.checkTemplate.result(1, 'index_body', 1) == false || localStorage.getItem('accept') == 1)
						{
							FA.SSMod.install.steep(2, 4, 1);
							$('.install_steep').append('Steep 3: Widget top post was successfully activated ...<br /><br />');
						} else {
							FA.SSMod.install.steep(2, 7, 1);
						}
					});
				}
				
				else if(version == 1 && moduleID == 2 && steepID == 4)
				{
					$('.install_steep').append('Steep 4: Index_body generation templates ...<br />');
					
					$.get('https://raw.githubusercontent.com/SSYT/SSMod/master/automod/topfive/template/phpBB3/index_body.tpl', function(response, status, xhr) {
						if (xhr.status == 200) {
							$('.install_steep').append('Steep 4: Index_body generation templates complete ...<br />');
							$.post('/admin/index.forum?part=themes&sub=templates&mode=edit_main&t=110&l=main&extended_admin=1&tid=' + FA.SSMod.TID, {
								"template": response,
								"t": 110,
								"l": 'main',
								"tpl_name": 'index_body',
								"submit": 1
							}).done(function() {
								$('.install_steep').append('Steep 4: Index_body generation templates complete ...<br />');
								$.post('/admin/index.forum?part=themes&sub=templates&mode=edit_main&main_mode=edit&extended_admin=1&t=110&l=main&pub=1&tid=' + FA.SSMod.TID, function(response, status, xhr) {
									if (xhr.status == 200) {
										FA.SSMod.install.steep(2, 5, 1);
									}
								});
							});
						}
					});
				}
				
				else if(version == 1 && moduleID == 2 && steepID == 5)
				{
					$('.install_steep').append('Steep 4: Index_body templates has been successfully installed<br /><br />');
					$('.install_steep').append('Steep 5: Recent topics generation templates ...<br />');
					
					var template = "";
					$.get('https://raw.githubusercontent.com/SSYT/SSMod/master/automod/topfive/template/phpBB3/mod_recent_topics.tpl', function(d) {
						template += d;
						$('.install_steep').append('Steep 5: Recent topics generation templates complete ...<br />');
						$.post('/admin/index.forum?part=themes&sub=templates&mode=edit_portal&t=904&l=portal&extended_admin=1&tid=' + FA.SSMod.TID, {
							"template": template,
							"t": 904,
							"l": 'portal',
							"tpl_name": 'mod_recent_topics',
							"submit": 1
						}).done(function() {
							$('.install_steep').append('Steep 5: Recent topics publish ...<br />');
							$.post('/admin/index.forum?part=themes&sub=templates&mode=edit_main&main_mode=edit&extended_admin=1&t=904&l=portal&pub=1&tid=' + FA.SSMod.TID, function(response, status, xhr) {
								if (xhr.status == 200) {
									FA.SSMod.install.steep(2, 6, 1);
								}
							});
						});
					});
				}
				
				else if(version == 1 && moduleID == 2 && steepID == 6)
				{
					$('.install_steep').append('Steep 5: Recent topics templates has been successfully installed<br /><br />');
					$('.install_steep').append('Steep 6: Top posters generation templates ...<br />');
					var template = "";
					$.get('https://raw.githubusercontent.com/SSYT/SSMod/master/automod/topfive/template/phpBB3/mod_top_posters.tpl', function(d) {
						template += d;
						$('.install_steep').append('Steep 6: Top posters generation templates complete ...<br />');
						$.post('/admin/index.forum?part=themes&sub=templates&mode=edit_portal&t=912&l=portal&extended_admin=1&tid=' + FA.SSMod.TID, {
							"template": template,
							"t": 912,
							"l": 'portal',
							"tpl_name": 'mod_top_posters',
							"submit": 1
						}).done(function() {
							$('.install_steep').append('Steep 6: Top posters publish ...<br />');
							$.post('/admin/index.forum?part=themes&sub=templates&mode=edit_main&main_mode=edit&extended_admin=1&t=912&l=portal&pub=1&tid=' + FA.SSMod.TID, function(response, status, xhr) {
								if (xhr.status == 200) {
									FA.SSMod.install.steep(2, 7, 1);
									$('.install_steep').append('Steep 6: Top posters templates has been successfully installed<br /><br />');
								}
							});
						});
					});
				}
				
				else if(version == 1 && moduleID == 2 && steepID == 7)
				{
					$('.install_steep').append('Steep 7: Script code generation module...<br />');
					$.get('https://raw.githubusercontent.com/SSYT/SSMod/master/automod/topfive/version/BB3.js', function(response, status, xhr) {
						if (xhr.status == 200) {
							$('.install_steep').append('Steep 7: Script code generation complete ...<br />');
							$('.install_steep').append('Steep 7: Script code installing ...<br />');
							$.post('/admin/index.forum?part=modules&sub=html&mode=js_edit&extended_admin=1&tid=' + FA.SSMod.TID, {
								"title": '[SSMod Modules] Top Five',
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
				
				// Topic Preview
				if(version == 1 && moduleID == 4 && steepID == 1)
				{
					
				}
				
				else if(version == 1 && moduleID == 4 && steepID == 2)
				{
					
				}
				
				else if(version == 1 && moduleID == 4 && steepID == 3)
				{
					
				}
			}
		}
	};
	
	if(window.FA.SSMod)
	{
		if(_userdata.user_level == 1)
		{
			if(localStorage.getItem('notif') == 1)
			{
				FA.SSMod.module.autoMod.continueInstall();
			}
			
			if(!FA.TopFive || !FA.NMT)
			{
				FA.SSMod.panel.showHTML();
			}
			
			var str = "", ver = "";
			$('select#faSelect').on('change', function() {
				$("option:selected", this).each(function() {
					str = $(this).val();
				});
			});
			
			$('div#faInstall form[name="install"] input[name="post"]').on("click", function(e) {
				e.preventDefault();
				
				if(str == 99)
				{
					$('div#faInstall form[name="install"] .desc').after("<font class='font-desc' color='red'>* Pentru acest modul nu este disponibila instalarea</font>");
					setTimeout(function() {
						$('.font-desc').remove();
					}, 3000);
				}
				
				if(str == 2)
				{
					if(!FA.NMT)
						FA.SSMod.module.LMRW.install();
					else {
						$('div#faInstall form[name="install"] .desc').after("<font class='font-desc' color='red'>* Pentru acest modul nu este disponibila instalarea sau il aveti deja instalat !</font>");
						setTimeout(function() {
							$('.font-desc').remove();
						}, 3000);
						
						return false;
					}
				}

				if(str == 1)
				{
					if(!FA.TopFive)
						FA.SSMod.module.topFive.install();
					else {
						$('div#faInstall form[name="install"] .desc').after("<font class='font-desc' color='red'>* Pentru acest modul nu este disponibila instalarea sau il aveti deja instalat !</font>");
						setTimeout(function() {
							$('.font-desc').remove();
						}, 3000);
						
						return false;
					}
				}
				
				if(str == 3)
				{
					if(!FA.TPM)
						FA.SSMod.module.TPM.install(1);
					else {
						$('div#faInstall form[name="install"] .desc').after("<font class='font-desc' color='red'>* Pentru acest modul nu este disponibila instalarea sau il aveti deja instalat !</font>");
						setTimeout(function() {
							$('.font-desc').remove();
						}, 3000);
						
						return false;
					}
				}
				
				$('select#faSelectVer').on('change', function() {
					$("option:selected", this).each(function() {
						ver = $(this).val();
					});
				});
			
				if(ver == 1 && $('body#phpbb').length)
				{
					if(FA.SSMod.checkTemplate.result(1, 'index_body', 1) == false)
					{
						FA.SSMod.install.steep(2, 1, 1);
                        console.log(FA.SSMod.checkTemplate.result(1, 'index_body', 1));
					} else {
						var r = confirm("Se pare ca aveti deja acest template (index_body) modificat, doriti supra scrierea lui? \nDaca apasati pe anuleaza veti insera manual codurile necesare dupa finalizarea instalari !");
						if (r == true) {
							FA.SSMod.install.steep(2, 1, 1);
							localStorage.setItem('accept', 1);
						} else {
							FA.SSMod.install.steep(2, 1, 1);
							localStorage.setItem('next', 1);
							localStorage.setItem('notif', 1);
							localStorage.setItem('version', 1);
						}
					}
				} else if (ver == 1 && !$('body#phpbb').length) {
					$('div#faInstall form[name="install"] .desc').after("<font class='font-desc' color='red'>* Nu se poate efectua instalarea</font>");
					setTimeout(function() {
						$('.font-desc').remove();
					}, 3000);
				}
				
				if(ver == 2 && $('body[bgcolor]').length)
				{
					if(FA.SSMod.checkTemplate.result(1, 'index_body', 1) == false)
					{
						FA.SSMod.install.steep(3, 1, 2);
					} else {
						var r = confirm("Se pare ca aveti deja acest template (index_body) modificat, doriti supra scrierea lui? \nDaca apasati pe anuleaza veti insera manual codurile necesare dupa finalizarea instalari !");
						if (r == true) {
							FA.SSMod.install.steep(3, 1, 2);
							localStorage.setItem('accept', 1);
						} else {
							FA.SSMod.install.steep(3, 1, 2);
							localStorage.setItem('next', 1);
							localStorage.setItem('notif', 1);
							localStorage.setItem('version', 2);
						}
					}
				} else if(ver == 2 && !$('body[bgcolor]').length) {
					$('div#faInstall form[name="install"] .desc').after("<font class='font-desc' color='red'>* Nu se poate efectua instalarea</font>");
					setTimeout(function() {
						$('.font-desc').remove();
					}, 3000);
				}
			});
		}
	} else {
		alert("FA Modules: Automod nu poate fii initat...");
	}
});
