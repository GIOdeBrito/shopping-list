
window.addEventListener('load', () => {

	Aside.start();
	TableList.start();
});

class Aside
{
	static #budget;
	static #total;

	static start ()
	{
		this.#budget = document.querySelector('input[data-name="budget-field"]');
		this.#total = document.querySelector('input[data-name="total-field"]');

		this.setControls();
	}

	static setControls ()
	{
		this.#budget.addEventListener('change', () => {

			this.update();
		});
	}

	static setTotalAmount (value)
	{
		this.#total.classList.remove('red');

		if(floatParser(value) > floatParser(this.#budget.value))
		{
			this.#total.classList.add('red');
		}

		this.#total.value = value;
	}

	static update ()
	{
		if(this.#budget.value === "")
		{
			return;
		}

		const quantities = TableList.getItemsQuantities();

		//console.log(quantities, TableList.getItemsPrices());

		const value = TableList.getItemsPrices().reduce((total, current, i) => total + (current * quantities[i]), 0);

		console.log(value);

		this.setTotalAmount(value.toFixed(2));
	}
}

class TableList
{
	static #tbody;
	static #itemTemplate;
	static #itemNewRequestTemplate;

	static start ()
	{
		this.#tbody = document.querySelector('table > tbody');
		this.#itemTemplate = document.querySelector('[data-template-name="table-item"]').content.firstElementChild.cloneNode(true);
		this.#itemNewRequestTemplate = document.querySelector('[data-template-name="table-item-new-request"]').content.firstElementChild.cloneNode(true);
		this.addNewItemRequest()
	}

	static addNewItemRequest ()
	{
		// Remove previous first
		this.#tbody.querySelector('tr[data-name="add-item-row"]')?.remove();

		const template = this.#itemNewRequestTemplate.cloneNode(true);

		template.querySelector('button').addEventListener('pointerdown', () => {

			this.addItem();
		});

		this.#tbody.appendChild(template);
	}

	static addItem ()
	{
		const template = this.#itemTemplate.cloneNode(true);

		this.#tbody.appendChild(template);

		template.querySelector('button[data-name="bremove"]').addEventListener('pointerdown', () => {

			template.remove();
			Aside.update();
		});

		template.querySelector('[data-field-name="price"]').addEventListener('change', () => {

			Aside.update();
		});

		template.querySelector('[data-field-name="qtd"]').addEventListener('change', () => {

			Aside.update();
		});

		this.addNewItemRequest()
	}

	static getItemsPrices ()
	{
		return [ ...this.#tbody.querySelectorAll('input[data-field-name="price"]') ].map(x => floatParser(x.value));
	}

	static getItemsQuantities ()
	{
		return [ ...this.#tbody.querySelectorAll('input[data-field-name="qtd"]') ].map(x => parseInt(x.value));
	}
}

function floatParser (value)
{
	return parseFloat(String(value).replace(',', '.'));
}

