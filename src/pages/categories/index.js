import SortableList from "../../components/sortable-list";
import styles from '../../components/categories/style.css';
import fetchJson from '../../utils/fetch-json.js';

const CATEGORIES_API_URL = 'https://course-js.javascript.ru/api/rest/categories?_sort=weight&_refs=subcategory';

export default class Page {
  async render() {
    const el = document.createElement('div');

    el.innerHTML = `
      <div class="categories">
        <div class="content__top-panel">
          <h1 class="page-title">Категории товаров</h1>
        </div>
        <div data-elem="categoriesContainer"></div>
      </div>
    `;

    this.element = el.firstElementChild;
    this.createRefs(this.element);

    this.categories = await fetchJson(CATEGORIES_API_URL);

    this.renderCategories();
    this.bindEvents();

    return this.element;
  }

  bindEvents() {
    this.refs.categoriesContainer.addEventListener('sortable-list-reorder', e => {
      const el = e.target.closest('.category');
      const sortChange = e.detail;

      this.reorderSubcategories(el.dataset.id, sortChange);
    });

    this.refs.categoriesContainer.addEventListener('click', e => {
      const header = e.target.closest('.category__header');
      const category = e.target.closest('.category');

      if (header) {
        category.classList.toggle('category_open');
      }
    });
  }

  async reorderSubcategories(id, { from, to }) {
    const { subcategories } = this.categories.find(item => item.id === id);
    const [moved] = subcategories.splice(from, 1);
    subcategories.splice(to, 0, moved);
    const payload = subcategories.map(({ id }, i) => ({ id, weight: (i + 1) }));

    await fetchJson('https://course-js.javascript.ru/api/rest/subcategories', {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  }

  createRefs(html) {
    this.refs = {};

    [...html.querySelectorAll('[data-elem]')].forEach(el => {
      this.refs[el.dataset.elem] = el;
    });
  }

  renderCategories() {
    this.categories.forEach(category => {
      this.refs.categoriesContainer.append(
        this.renderCategory(category)
      );
    });
  }

  renderCategory(cat) {
    const el = document.createElement('div');

    const sortableList = new SortableList({
      items: cat.subcategories.map(item => {
        const el = document.createElement('div');
        el.innerHTML = `
          <li class="categories__sortable-list-item sortable-list__item" data-grab-handle="" data-id="${item.id}">
            <strong>${item.title}</strong>
            <span><b>${item.count}</b> products</span>
          </li>
        `;
        return el.firstElementChild;
      }),
    });

    el.innerHTML = `
      <div class="category category_open" data-id="${cat.id}">
        <header class="category__header">${cat.title}</header>
        <div class="category__body">
          <div class="subcategory-list"></div>
        </div>
      </div>
    `;

    const subcategoryList = el.querySelector('.subcategory-list');
    subcategoryList.append(sortableList.element);

    return el.firstElementChild;
  }
}
