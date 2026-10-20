// The studio-line pieces — the robe and garment highlights that hang from the
// homepage rope. Shared so the collection page can pin them to the top of
// the grid in the same editorial order.
export const FEATURED_PIECES = [
  {
    t: 0.17,
    drop: 0,
    handle: "mzrd-bubble-cap",
    name: "mzrd Bubble Cap",
    img: "https://mazrood.com/cdn/shop/files/DSC06373Large_700x.jpg?v=1787983760",
    url: "https://mazrood.com/products/mzrd-bubble-cap",
  },
  {
    t: 0.4,
    drop: 40,
    handle: "mazrood-diner-hoodie",
    name: "Diner Hoodie",
    img: "https://mazrood.com/cdn/shop/files/MZ-27_1_900x.jpg?v=1780383212",
    url: "https://mazrood.com/products/mazrood-diner-hoodie",
  },
  {
    t: 0.62,
    drop: 18,
    handle: "peacemaker-cap",
    name: "Peacemaker Cap",
    img: "https://mazrood.com/cdn/shop/files/DSC06361Large_700x.jpg?v=1787983290",
    url: "https://mazrood.com/products/peacemaker-cap",
  },
  {
    t: 0.85,
    drop: 0,
    handle: "warning-closet-envy-cap",
    name: "Warning: Closet Envy Cap",
    img: "https://mazrood.com/cdn/shop/files/DSC06338Large_700x.jpg?v=1787982586",
    url: "https://mazrood.com/products/warning-closet-envy-cap",
  },
];

export const FEATURED_HANDLES = FEATURED_PIECES.map((p) => p.handle);