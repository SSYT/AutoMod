/*
	@ Module of Automod Installer
	@ https://ssyt.github.io/AutoMod/
	@ Script created and develop by SSYT 2.0
	@name Top Five Mod
*/

!function() {
  if(!window.FA) window.FA = {};
  window.FA.TopFive = {
	config: {
          translate: {
            en: {
              'L_NEWEST_TOPICS'   : 'Newest Posts',
              'L_TOP_FIVE_ACTIVE' : 'Top Active Users',
              'L_TOP_FIVE_NEWEST' : 'Newest Users'
            },
		  
            ro: {
              'L_NEWEST_TOPICS'   : 'Cele mai noi mesaje',
              'L_TOP_FIVE_ACTIVE' : 'Top utilizatori activi',
              'L_TOP_FIVE_NEWEST' : 'Cele mai noi utilizatori'
            }
          },
		
	  options: {
            module: 3,
            autoMod: true,
            moduleName: 'Top Five',
            version: 2,
            language: 'en'
	  },

	  extension: {}
	}
  };
  document.write('');
}();
