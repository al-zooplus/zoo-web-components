/**
 * @injectHTML
 */
export default class Select extends HTMLElement {
	constructor() {
		super();
	}

	mutationCallback(mutationsList) {
		for(let mutation of mutationsList) {
			if (mutation.type === 'attributes') {
				const attr = mutation.attributeName;
				if (attr == 'disabled' || attr == 'multiple') {
					if (mutation.target[attr]) {
						this.setAttribute(attr, '');
					} else {
						this.removeAttribute(attr);
					}
				}
			}
		}
	}

	connectedCallback() {
		const selectSlot = this.shadowRoot.querySelector('slot[name="select"]');
		selectSlot.addEventListener('slotchange', () => {
			this.observer = this.observer || new MutationObserver(this.mutationCallback.bind(this));
			let select = selectSlot.assignedElements()[0];
			if (select.hasAttribute('multiple')) this.setAttribute('multiple', '');
			if (select.hasAttribute('disabled')) this.setAttribute('disabled', '');
			select.addEventListener('invalid', () => this.setAttribute('invalid', ''));
			select.addEventListener('input', () => {
				select.checkValidity() ? this.removeAttribute('invalid') : this.setAttribute('invalid', '');
			});
			this.observer.disconnect();
			this.observer.observe(select, { attributes: true, childList: false, subtree: false });
		});
	}

	disconnectedCallback() {
		if (this.observer) {
			this.observer.disconnect();
			this.observer = null;
		}
	}
}
window.customElements.define('zoo-select', Select);