export default function download(path, queryOrigin = {}, { base, method = 'POST' }) {
  const query = Object.assign({}, queryOrigin);
  // query.format = 'csv';
  query.format = 'excel';
  const form = document.createElement('form');
  form.style.position = 'absolute';
  form.style.width = 0;
  form.style.height = 0;
  form.style.opacity = 0;
  form.style.zIndex = -9999;
  form.style.top = '-9999px';
  form.style.left = '-9999px';
  form.style.overflow = 'hidden';
  form.target = '_blank';
  document.body.appendChild(form);

  const action = `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
  for (const [k, v] of Object.entries(query)) {
    if (0 > [undefined, null].indexOf(v)) {
      const input = document.createElement('input');
      input.name = k;
      input.value = v;
      form.appendChild(input);
    }
  }
  // form.method = 'GET';
  form.method = method;
  form.action = action;
  form.submit();
}
