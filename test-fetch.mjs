const url = 'https://wsenprneavjusqmmxobd.supabase.co/rest/v1/products?select=*';
const key = 'sb_publishable_v2YG0aXS_8AhAxZaHq7xGQ_jWnLA26J';

fetch(url, {
  headers: {
    'apikey': key,
    'Authorization': `Bearer ${key}`
  }
})
.then(res => res.text())
.then(text => console.log('RESPONSE:', text))
.catch(err => console.error(err));
