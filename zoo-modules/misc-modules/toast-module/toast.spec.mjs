describe('Zoo toast', function () {
	it('should create default toast', async () => {
		const toasttext = await page.evaluate(() => {
			document.body.innerHTML = `
			<zoo-toast>
				<span slot="text">some-text</span>
			</zoo-toast>
			`;
			const toast = document.querySelector('zoo-toast');
			const toastBox = toast.shadowRoot.querySelector('slot[name="text"]').assignedNodes()[0];
			return toastBox.innerHTML;
		});
		expect(toasttext).toEqual('some-text');
	});
});