import { mockEvents } from '../lib/mockData';

console.log(JSON.stringify(mockEvents.map(e => ({
  id: e.id,
  title: e.title,
  category: e.category,
  price: e.price,
  date: e.date,
})), null, 2));
