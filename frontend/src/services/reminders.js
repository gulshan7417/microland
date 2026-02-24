// Simple reminder system using setTimeout.
// This stays on the frontend so the backend can remain stateless and
// horizontally scalable. In a more advanced system, we could move this
// to a background worker with Redis-based delayed jobs or a cron scheduler.

function parseTimeToMsToday(time) {
  if (!time) return null;
  const [h, m] = time.split(":").map((v) => parseInt(v, 10));
  if (Number.isNaN(h) || Number.isNaN(m)) return null;

  const now = new Date();
  const target = new Date();
  target.setHours(h, m, 0, 0);
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return null;
  return diff;
}

export function scheduleReminders(medicines) {
  medicines.forEach((m) => {
    const ms = parseTimeToMsToday(m.time);
    if (ms == null) return;

    setTimeout(() => {
      // For a production-ready system we'd use the Notifications API.
      // For hackathon simplicity, alerts are enough.
      alert(`Reminder: time to take "${m.name}" (${m.dosage})`);
    }, ms);
  });
}

