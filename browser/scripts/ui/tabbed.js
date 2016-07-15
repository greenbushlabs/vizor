if (typeof uiEvent === 'undefined')
	uiEvent = {}

uiEvent.changedActiveTab = 'changed:activetab'

if (typeof VizorUI === 'undefined')
	VizorUI = {}

VizorUI.makeTabbed = function(/* @var HTMLElement */ containerEl) {

	if (containerEl._tabbed)
		console.warn('container tabs already setup', containerEl)

	var nav 	= containerEl.querySelector('nav')
	var links 	= nav.querySelectorAll('a[href^="#"]')
	var contentSelector = Array.prototype.map.call(links, function(link){
	 	return 'section' + link.getAttribute('href')
	})
	var contents = containerEl.querySelectorAll(contentSelector.join(','))

	var clearActive = function(el){
		delete el.dataset['active']
	}

	var activetab = containerEl.dataset['activetab']
	delete containerEl.dataset['activetab']

	// by now we have links + contents(sections)
	containerEl._tabbed = {
		get active() {
			return containerEl.dataset['activetab']
		},
		set active(contentId) {	// e.g .active='mytab' (from <a href="#mytab">)
			if (contentId === this.active)
				return contentId

			var content = containerEl.querySelector('#'+contentId)
			if (content) {
				var link = nav.querySelector('a[href^="#'+contentId+'"]')
				Array.prototype.forEach.call(links, clearActive)
				link.dataset['active'] = true

				Array.prototype.forEach.call(contents, clearActive)
				content.dataset['active'] = true

				containerEl.dataset['activetab'] = contentId
				containerEl.dispatchEvent(new CustomEvent('changed:activetab', {
					detail:{
						id: contentId,
						trigger: link,
						tab: content
					}
				}))
			} else {
				console.warn('could not find contentId #'+contentId)
			}
			return this.active
		}
	}

	var attachLink = function(link) {
		if (link._tabbed)
			link.removeEventListener('click', link._tabbed._handler)

		var handler = function(e) {
			e.preventDefault()
			var href = this.getAttribute('href').split('#')[1]
			containerEl._tabbed.active = href
			return true
		}
		link._tabbed = {
			_handler : handler
		}
		link.addEventListener('click', handler)
	}

	Array.prototype.forEach.call(links, attachLink)

	// init
	containerEl.classList.add('tabbed')
	containerEl._tabbed.active = activetab
}