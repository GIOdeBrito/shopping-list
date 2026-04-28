
export default new class {

	#data;
	#corsProxyURL = "https://api.allorigins.win/get?url=";
	#apiUrl = "https://go-upc.com/search";

	async searchAsync (ean)
	{
		const url = this.#corsProxyURL + encodeURIComponent(this.#apiUrl + '?q=' + ean);

		const response = await fetch(url);
		const textcontent = await response.json();

		return this.contentParse(textcontent.contents);
	}

	contentParse (content)
	{
		const root = document.createElement('div');

		root.innerHTML = content;

		const title = root.querySelector('title').innerText.trim();
		const name = title.split('—')[0].trim();
		const img = root.querySelector(`img[alt="Photo of ${name}"]`).src;

		root.innerHTML = "";
		root?.remove();

		return {
			name: name,
			imgsrc: img
		};
	}
};

