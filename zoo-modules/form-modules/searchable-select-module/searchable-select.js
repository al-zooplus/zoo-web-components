/**
 * @injectHTML
 */
export default class SearchableSelect extends HTMLElement {
	constructor() {
		super();
	}
	// TODO in v9 drop nested default input and force user to define label for both select and input, while showing only legend
	static get observedAttributes() {
		return ['invalid', 'placeholder'];
	}
	handlePlaceholder(newVal) {
		const input = this.shadowRoot.querySelector('input');
		if (input && newVal) input.placeholder = newVal;
		this.inputPlaceholderFallback = newVal;
	}

	mutationCallback(mutationsList) {
		for(let mutation of mutationsList) {
			if (mutation.type === 'attributes' && mutation.attributeName == 'disabled') {
				this.input.disabled = mutation.target.disabled;
			}
		}
	}

	connectedCallback() {
		this.input = this.shadowRoot.querySelector('input');
		this.input.addEventListener('input', () => this.handleSearchChange());
		this.shadowRoot.querySelector('.close').addEventListener('click', () => this.handleCrossClick());
		this.observer = new MutationObserver(this.mutationCallback.bind(this));
		const selectSlot = this.shadowRoot.querySelector('slot[name="select"]');
		selectSlot.addEventListener('slotchange', () => {
			this.select = selectSlot.assignedElements()[0];
			this.select.addEventListener('change', () => this.handleOptionChange());
			this.select.addEventListener('change', e => e.target.value ? this.setAttribute('valueselected', '') : this.removeAttribute('valueselected'));
			this.select.addEventListener('keydown', e => {
				if (e.keyCode && e.keyCode === 13) this.handleOptionChange();
			});
			if (this.select.disabled && this.input) {
				this.input.disabled = true;
			}
			this.select.size = 4;
			this.observer.disconnect();
			this.observer.observe(this.select, { attributes: true, childList: false, subtree: false });
		});

		const inputSlot = this.shadowRoot.querySelector('slot[name="input"]');
		inputSlot.addEventListener('slotchange', () => {
			this.input = inputSlot.assignedElements()[0];
			this.inputPlaceholderFallback = this.input.placeholder;
			this.input.addEventListener('input', () => this.handleSearchChange());
		});
	}

	attributeChangedCallback(attrName, oldVal, newVal) {
		if (oldVal == newVal) return;
		if (SearchableSelect.observedAttributes.includes(attrName)) {
			if (attrName == 'placeholder') {
				this.handlePlaceholder(newVal);
			} else if (attrName === 'invalid') {
				if (this.hasAttribute('invalid')) {
					this.shadowRoot.querySelector('zoo-input').setAttribute('invalid', '');
				} else {
					this.shadowRoot.querySelector('zoo-input').removeAttribute('invalid');
				}
			}
		}
	}

	handleSearchChange() {
		const inputVal = this.input.value.toLowerCase();
		const options = this.select.querySelectorAll('option');
		for (const option of options) {
			if (option.text.toLowerCase().indexOf(inputVal) > -1) option.style.display = 'block';
			else option.style.display = 'none';
		}
	}

	handleOptionChange() {
		if (!this.select) {
			return;
		}
		let inputValString = '';
		for (const selectedOpts of this.select.selectedOptions) {
			inputValString += selectedOpts.text + ', \n';
		}
		inputValString = inputValString.substr(0, inputValString.length - 3);
		const showTooltip = inputValString && inputValString.length > 0;
		if (this.input) {
			this.input.placeholder = showTooltip ? inputValString : this.inputPlaceholderFallback;
		}
		if (showTooltip) {
			this.tooltip = this.tooltip || document.createElement('zoo-tooltip');
			this.tooltip.slot = 'input';
			this.tooltip.setAttribute('position', 'right');
			this.tooltip.setAttribute('text', inputValString);
			this.shadowRoot.querySelector('zoo-input').appendChild(this.tooltip);
		} else if (this.tooltip) {
			this.tooltip.remove();
		}
	}

	handleCrossClick() {
		this.select.value = null;
		this.select.dispatchEvent(new Event('change'));
	}
}
window.customElements.define('zoo-searchable-select', SearchableSelect);