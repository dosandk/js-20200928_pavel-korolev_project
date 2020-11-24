const header = [
  {
    id: 'id',
    title: 'ID',
    sortable: true,
    sortType: 'number'
  },
  {
    id: 'user',
    title: 'Client',
    sortable: true,
    sortType: 'string'
  },
  {
    id: 'createdAt',
    title: 'Created',
    sortable: true,
    sortType: 'number',
    template: (data) => {
      const date = new Date(data);
      return `
        <div class="sortable-table__cell">
          ${date.toDateString().slice(3)}
        </div>
      `;
    },
  },
  {
    id: 'totalCost',
    title: 'Cost',
    sortable: true,
    sortType: 'number',
    template: (data) => {
      return `
        <div class="sortable-table__cell">
          $${data}
        </div>
      `;
    },
  },
  {
    id: 'delivery',
    title: 'Status',
    sortable: true,
    sortType: 'string',
  },
];

export default header;
