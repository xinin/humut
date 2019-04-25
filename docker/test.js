const strs = [
  'EUR 19,95 - EUR 29,90',
  'EUR 19,95',
  '$19,95 - $29,90',
  '$19,95',
  '£19,95 - £29,90',
  '£19,95',
];

strs.forEach((str) => {
  let aux = str.replace(/EUR|\$|£|\s/g, '').replace(/,/g, '.');
  aux = aux.split('-');
  const pricelower = aux[0];
  const pricehigher = (aux.length > 1) ? aux[1] : aux[0];
  console.log(aux, pricelower, pricehigher);
});
