import DoubleSilder from "../../../components/double-slider";
import SortableTable from "../../../components/sortable-table";
import header from './products-header';

export default class Page {
  get template() {
    return `
      <div class="products-list">
        <div class="content__top-panel">
          <h1 class="page-title">Товары</h1>
          <a href="/products/add" class="button-primary">Добавить товар</a>
        </div>
        <div class="content-box content-box_small">
          <form class="form-inline">
            <div class="form-group">
              <label class="form-label">Сортировать по:</label>
              <input type="text" data-elem="filterName" class="form-control" placeholder="Название товара">
            </div>
            <div class="form-group" data-elem="sliderContainer">
              <label class="form-label">Цена:</label>
            </div>
            <div class="form-group">
              <label class="form-label">Статус:</label>
              <select class="form-control" data-elem="filterStatus">
                <option value="" selected="">Любой</option>
                <option value="1">Активный</option>
                <option value="0">Неактивный</option>
              </select>
            </div>
          </form>
        </div>
        <div data-elem="productsContainer" class="products-list__container"></div>
      </div>
    `;
  }

  bindEvents() {
    this.refs.filterStatus.addEventListener('change', async (e) => {
      await this.components.productsTable.sortOnServer('quantity', 'asc', {
        status: e.target.value,
      });
    });

    this.refs.sliderContainer.addEventListener('range-select', async (e) => {
      await this.components.productsTable.sortOnServer('quantity', 'asc', {
        price_gte: e.detail.from,
        price_lte: e.detail.to,
      });
    });

    this.refs.filterName.addEventListener('input', async (e) => {
      await this.components.productsTable.sortOnServer('quantity', 'asc', {
        title_like: e.target.value,
      });
    });

    this.refs.productsContainer.addEventListener('click', e => {
      const el = e.target.closest('.sortable-table__row');

      if (el && el.dataset.id) {
        const link = document.createElement('a');
        link.href = `/products/${el.dataset.id}`;
        link.click();
      }
    });
  }

  async render() {
    const el = document.createElement('div');
    el.innerHTML = this.template;
    this.element = el.firstElementChild;

    this.createRefs(this.element);
    this.initComponents();
    await this.renderComponents();
    this.bindEvents();

    console.log(this);

    return this.element;
  }

  createRefs(html) {
    this.refs = {};

    [...html.querySelectorAll('[data-elem]')].forEach(el => {
      this.refs[el.dataset.elem] = el;
    });
  }

  initComponents() {
    this.components = {
      priceSlider: new DoubleSilder({
        min: 0,
        max: 4000,
        formatValue: (val) => `$${val}`,
      }),
      productsTable: new SortableTable(header, {
        url: 'https://course-js.javascript.ru/api/rest/products',
      }),
    };
  }

  async renderComponents() {
    this.refs.sliderContainer.append(
      this.components.priceSlider.element
    );

    this.refs.productsContainer.append(
      this.components.productsTable.element
    );
  }

  destroy() {
    for (const component of Object.values(this.components)) {
      component.destroy();
    }
  }
}
