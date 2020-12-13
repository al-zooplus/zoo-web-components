/**
 * @injectHTML
 */
export default class CollapsableList extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		const slot = this.shadowRoot.querySelector('slot');
		slot.addEventListener('slotchange', () => {
			let items = slot.assignedElements();
			items = items.filter(i => i.tagName == 'ZOO-COLLAPSABLE-LIST-ITEM');
			if (items[0]) {
				items[0].setAttribute('active', '');
				this.prevActiveItem = items[0];
			}

			for (const item of items) {
				item.addEventListener('click', () => {
					if (item.hasAttribute('active')) return;
					this.prevActiveItem.removeAttribute('active');
					this.prevActiveItem = item;
					item.setAttribute('active', '');
				});
			}
		});
	}
}
window.customElements.define('zoo-collapsable-list', CollapsableList);