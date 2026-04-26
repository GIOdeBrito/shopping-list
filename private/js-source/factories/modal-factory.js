
class Modal
{
    #name;
    #id;
    #dialog;
    #background;
    #onclosefunc = () => {};
    #escapeHandler = null;
	#isStarted = false;

    constructor(name, id = null) {
        this.#name = name;
        this.#id = id;
    }

	startModal ()
	{
		if(this.#isStarted)
		{
			return;
		}

		this.#createElements();
        this.#setEvents();
        this.#loadContent();
        this.#playStartAnimation();

		this.#isStarted = true;
	}

    get Root() {
        return this.#dialog;
    }

    set onclose(func) {
        this.#onclosefunc = func || (() => {});
    }

    #createElements() {
        this.#dialog = document.createElement('dialog');
        this.#dialog.setAttribute('open', '');
		this.#dialog.setAttribute('data-modal-name', this.#name);

        this.#background = document.createElement('div');
        this.#background.appendChild(this.#dialog);

        this.#background.style = `
            display: flex;
            align-items: center;
            background: #0000;
            height: 100vh;
            width: 100vw;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 8000;
            transition: background 200ms ease;
            padding: 1rem;
            box-sizing: border-box;
        `;

        this.#dialog.style = `
            border: 0;
            padding: 0;
            box-shadow: 0 0 1.4rem #00000059;
            transition: transform 200ms ease;
            transform: scale(0.92);
            max-width: 80%;
            max-height: 80%;
            overflow: auto;
            position: relative;
            margin: auto;
        `;

        document.body.appendChild(this.#background);
    }

    #setEvents() {
        this.#background.addEventListener('click', () => this.destroy());
        this.#dialog.addEventListener('click', ev => ev.stopPropagation());

        this.#escapeHandler = (e) => {
            if (e.key === 'Escape') {
                this.destroy();
            }
        };
        document.addEventListener('keydown', this.#escapeHandler);
    }

    #loadContent() {
        if (!this.#id) return;
		const template = document.querySelector(`template[data-modal="${this.#id}"]`);
        if (!template?.content) {
            console.error('Modal content template not found');
            return;
        }
        this.#dialog.append(...template.content.cloneNode(true).children);
    }

    #playStartAnimation() {
        requestAnimationFrame(() => {
            this.#dialog.style.transform = 'scale(1)';
            this.#background.style.background = '#00000082';
        });
    }

    hide() {
        this.#background.style.display = 'none';
    }

    show() {
        this.#background.style.display = 'flex';
    }

    setSize(x, y) {
        if (typeof x === 'number') x += 'px';
        if (typeof y === 'number') y += 'px';
        this.#dialog.style.width = x;
        this.#dialog.style.height = y;
    }

    addChild(element) {
        this.#dialog.appendChild(element);
    }

    destroy() {
        if (this.#escapeHandler) {
            document.removeEventListener('keydown', this.#escapeHandler);
        }
        this.#background.remove();
        this.#onclosefunc();
    }
}

export default new class {

	new (name, id)
	{
		const modal = new Modal(name, id);
		modal.startModal();
		return modal;
	}

}();
