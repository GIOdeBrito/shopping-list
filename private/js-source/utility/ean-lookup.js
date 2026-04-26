
class EanLookup
{
	#data;
	#corsProxyURL = "https://proxy.corsfix.com/";
	#apiUrl = "https://go-upc.com/search";

	async searchAsync (ean)
	{
		const url = this.#corsProxyURL + '?' + encodeURI(this.#apiUrl + '?q=' + ean);

		const response = await fetch(url);
		const textcontent = await response.text();

		return this.contentParse(textcontent);
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
}

export default new EanLookup();
