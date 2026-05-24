const { getPublishedEvents } = require('../app/actions/event');

async function main() {
  console.log("Calling getPublishedEvents()...");
  const events = await getPublishedEvents();
  console.log(JSON.stringify(events.map(e => ({id: e.id, title: e.title, category: e.category, eventSource: e.eventSource, status: e.status})), null, 2));
}

main().catch(console.error);
