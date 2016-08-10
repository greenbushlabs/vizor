if (typeof VizorUI === 'undefined')
	var VizorUI = {}

VizorUI.showHelpScreen = function(activeTab) {

	return new Promise(function(resolve, reject){

		var selectedGraph

		var data = {
			activeTab: activeTab || 'helpLinks',
			recent: [],
			examples: [],
			templates: []
		}

		/*
		var test1 = {
			prettyName: 'Basic sky with lights',
			path: '/data/graphs/create-360.json',
			previewUrlLarge: '/images/v2/welcome/welcome-facebook.jpg'
		}
		var test2 = {
			// owner:
			prettyName: 'Desert object',
			path: '/data/graphs/desert-object.json',
			previewUrlLarge: '/images/v2/welcome/welcome-vimeo.jpg',
			// updatedAt: '13/Nov/2016 2:14pm'
		}
		var test3 = {
			// owner:
			prettyName: 'Desert object',
			path: '/data/graphs/desert-object.json',
			previewUrlLarge: '/images/v2/welcome/welcome-vimeo.jpg',
			// updatedAt: '13/Nov/2016 2:14pm'
		}
		var test4 = {
			// owner:
			prettyName: 'Desert object',
			path: '/data/graphs/desert-object.json',
			previewUrlLarge: '/images/v2/welcome/welcome-vimeo.jpg',
			// updatedAt: '13/Nov/2016 2:14pm'
		}
		data.examples.push(test1, test2, test1, test1, test2, test2)
		*/
		
		var html = E2.views.patch_editor.helpscreen(data)
		var modal = VizorUI.modalOpen(html, null, /* className= */ 'welcome helpscreen')
		modal[0].id='helpscreen'
		VizorUI.replaceSVGButtons(modal)

		var helpContainer = modal[0].querySelector('#helpContainer')
		VizorUI.makeTabbed(helpContainer)

		$('.graph.card', modal)
			.each(function() {
				VizorUI.setupAssetCard($(this))
			})

		var chooseHandlerWReload = function(e) {
			window.location = e.detail.path + "/edit"
			return false
		}

		var chooseHandler = function(e){
			selectedGraph = "/data/graph" + e.detail.path + ".json"
			modal.modal('hide')
			return false
		}
		document.addEventListener('graph.choose', chooseHandler)

		modal.on('hide.bs.modal', function(){
			document.removeEventListener('graph.choose', chooseHandler)
			resolve(selectedGraph)
		})

		function loadExamples(domEl) {
			var url = '/examples'
			domEl.classList.add('loading')
			$.get(url)
				.success(function(response){
					domEl.classList.remove('loading')
					var renderFlags = {
						withActionEdit: false,
						withActionView: false,
						withActionChoose: true,
						withLinks: false,
						withJSON: false
					}
					var html=[]
					var partial = E2.views.partials.assets.graphCard
					response.data.graphs.forEach(function(entry){
						html.push(partial(_.assign(entry, renderFlags)))
					})
					domEl.innerHTML = html.join("\n")
					$('.graph.card', domEl)
						.each(function() {
							VizorUI.setupAssetCard($(this))
						})
				})
				.fail(function(){
					domEl.classList.remove('loading')
				})
		}

		helpContainer.addEventListener(uiEvent.tabbedChanged, function(e){
			var tabId = e.detail.id
			switch (tabId) {
				case 'helpExamples':
					loadExamples(e.detail.tab)
			}
		})
	})
	/*
	.then(function(resolve, reject) {
		if (resolve)
			console.log('resolved!', resolve)
		else if (reject)
			console.log('rejected :/', reject)
	})
	.catch(function(){
		console.log('catch')
	})
	*/
}