export default function NoData({ message = 'No data yet' }) {
  return (
    <div className="flex h-full items-center justify-center rounded border border-dashed border-border text-sm text-muted-fg">
      {message}
    </div>
  );
}
