import ProductForm from "../../../components/product-form";

export default class Page {
  element;
  subElements = {};
  components = {};

  async render() {
    const element = document.createElement('div');

    element.innerHTML = `
      <div class="products-edit">
        <div class="content__top-panel">
          <h1 class="page-title">
            ${this.getTitleLink()}
          </h1>
        </div>
        <div class="content-box"></div>
      </div>
    `;

    this.element = element.firstElementChild;

    if (this.productId) {
      this.components.productForm = new ProductForm(this.productId);
    } else {
      this.components.productForm = new ProductForm();
    }

    await this.components.productForm.render();

    const el = this.element.querySelector('.content-box');

    el.append(this.components.productForm.element);

    return this.element;
  }

  getTitleLink() {
    const path = window.location.pathname.split('/');
    const productId = path[2];

    if (productId === 'add') {
      return '<a href="/products" class="link">Товары</a> / Добавить';
    }

    this.productId = productId;
    return '<a href="/products" class="link">Товары</a> / Редактировать';
  }
}
