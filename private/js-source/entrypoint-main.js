
import ModalFactory from "./factories/modal-factory.js";
import EanLookup from "./utility/ean-lookup.js";
import { floatParser } from "./utility/numbers.js";

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

		this.#total.value = `R$${value}`;
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

			//this.addItem();
			this.addItemModal();
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

		const priceField = template.querySelector('[data-field-name="price"]');

		priceField.addEventListener('change', () => {

			Aside.update();
		});

		priceField.focus();

		template.querySelector('[data-field-name="qtd"]').addEventListener('change', () => {

			Aside.update();
		});

		this.addNewItemRequest()
	}

	static addItemModal ()
	{
		const modal = ModalFactory.new("add", "add-item-form");
		const root = modal.Root;

		const cover = root.querySelector('img[data-name="cover"]');
		const ean = root.querySelector('input[data-name="ean"]');
		const name = root.querySelector('input[data-name="name"]');
		const quantity = root.querySelector('input[data-name="qtd"]');

		const bscanner = root.querySelector('button[data-name="bscan"]');
		const submit = root.querySelector('button[data-name="bsubmit"]');

		bscanner.addEventListener('click', () => {

			const modal = ModalFactory.new('scan', 'item-ean-scanner-modal');

			modal.Root.querySelector('iframe').onload = () => {

				console.log(modal.Root.querySelector('iframe').contentWindow);
			};
		});

		ean.addEventListener('change', async () => {

			const data = ean.value.trim();

			const item = await EanLookup.searchAsync(data);

			name.value = item.name;
			cover.src = item.imgsrc;
		});

		submit.addEventListener('pointerdown', ev => {

			this.addItem();

			const row = this.getLastItem();
			row.querySelector('[data-field-name="name"]').value = name.value;
			row.querySelector('[data-field-name="qtd"]').value = quantity.value;

			modal.destroy();

			row.querySelector('[data-field-name="price"]').focus();
		});
	}

	static getLastItem ()
	{
		return this.#tbody.querySelector(':scope > :nth-last-child(2)');
	}

	static getItemsPrices ()
	{
		return [ ...this.#tbody.querySelectorAll('input[data-field-name="price"]') ].map(x => floatParser(x.value || 0.0));
	}

	static getItemsQuantities ()
	{
		return [ ...this.#tbody.querySelectorAll('input[data-field-name="qtd"]') ].map(x => parseInt(x.value));
	}
}
